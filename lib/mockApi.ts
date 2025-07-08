@@ .. @@
   removeMember: async (familyKey: string, userId: string) => {
       await delay(300)
       
       const family = findFamilyByKey(familyKey)
       if (!family) {
         const error = new Error('Family not found')
         throw { response: { data: { message: 'Family not found' } } }
       }
       
       const memberIndex = family.members.findIndex((m: any) => m.id === userId)
       if (memberIndex === -1) {
         const error = new Error('Member not found')
         throw { response: { data: { message: 'Member not found' } } }
       }
       
       // Mark as inactive instead of removing
       family.members[memberIndex].isActive = false
       
+      // Remove from family member IDs
+      family.memberIds = family.memberIds.filter((id: string) => id !== userId)
+      
       // Remove relationships
       family.relationships = family.relationships.filter((rel: any) => 
         rel.fromId !== userId && rel.toId !== userId
       )
       
       // Update other members' relationships
       family.members.forEach((member: any) => {
-        if (member.id !== userId) {
+        if (member.id !== userId && member.isActive) {
           member.relationships.childrenIds = member.relationships.childrenIds.filter((id: string) => id !== userId)
           member.relationships.parentIds = member.relationships.parentIds.filter((id: string) => id !== userId)
           if (member.relationships.spouseId === userId) {
             member.relationships.spouseId = undefined
           }
           if (member.relationships.motherId === userId) {
             member.relationships.motherId = undefined
           }
           if (member.relationships.fatherId === userId) {
             member.relationships.fatherId = undefined
           }
         }
       })
       
+      // Clean up orphaned nodes
+      const activeMembers = family.members.filter((m: any) => m.isActive)
+      const orphanedIds: string[] = []
+      
+      activeMembers.forEach((member: any) => {
+        const rel = member.relationships
+        let hasRelationships = false
+        
+        // Check if member has any active relationships
+        if (rel.spouseId && activeMembers.find((m: any) => m.id === rel.spouseId)) {
+          hasRelationships = true
+        }
+        
+        if (rel.childrenIds.length > 0 && 
+            rel.childrenIds.some((id: string) => activeMembers.find((m: any) => m.id === id))) {
+          hasRelationships = true
+        }
+        
+        if (rel.parentIds.length > 0 && 
+            rel.parentIds.some((id: string) => activeMembers.find((m: any) => m.id === id))) {
+          hasRelationships = true
+        }
+        
+        // If no relationships and not the only member, mark as orphaned
+        if (!hasRelationships && activeMembers.length > 1) {
+          orphanedIds.push(member.id)
+        }
+      })
+      
+      // Remove orphaned nodes
+      orphanedIds.forEach(orphanedId => {
+        const orphanedMember = family.members.find((m: any) => m.id === orphanedId)
+        if (orphanedMember) {
+          orphanedMember.isActive = false
+        }
+        family.memberIds = family.memberIds.filter((id: string) => id !== orphanedId)
+      })
+      
       family.updatedAt = new Date().toISOString()
       
       return { data: {} }
     },
@@ .. @@
                 // Connect child to spouse as well
                 try {
                   await familyAPI.addMember(
                     user!.familyKey,
                     child,
                     spouse.id,
                     'child'
                   )
                 } catch (error) {
                   console.error('Failed to connect child to spouse:', error)
                 }
               }
               
               // Add relationship record
               family.relationships.push({
                 id: `rel-${Date.now()}-1`,
                 fromId: parentId,
                 toId: newMember.id,
                 type: 'CHILD',
                 createdAt: new Date().toISOString()
               })
+              
+              // If parent has spouse, connect child to spouse as well
+              if (parent.relationships.spouseId) {
+                const spouse = family.members.find((m: any) => m.id === parent.relationships.spouseId)
+                if (spouse) {
+                  // Add child to spouse's children list
+                  if (!spouse.relationships.childrenIds.includes(newMember.id)) {
+                    spouse.relationships.childrenIds.push(newMember.id)
+                  }
+                  
+                  // Add spouse to child's parent list
+                  if (!newMember.relationships.parentIds.includes(spouse.id)) {
+                    newMember.relationships.parentIds.push(spouse.id)
+                  }
+                  
+                  // Set appropriate parent reference
+                  if (spouse.gender === 'MALE') {
+                    newMember.relationships.fatherId = spouse.id
+                  } else if (spouse.gender === 'FEMALE') {
+                    newMember.relationships.motherId = spouse.id
+                  }
+                  
+                  // Add relationship record
+                  family.relationships.push({
+                    id: `rel-${Date.now()}-2`,
+                    fromId: spouse.id,
+                    toId: newMember.id,
+                    type: spouse.gender === 'FEMALE' ? 'MOTHER' : 'FATHER',
+                    createdAt: new Date().toISOString()
+                  })
+                }
+              }
               break