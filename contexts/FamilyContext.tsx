@@ .. @@
   removeMember: (userId: string) => Promise<void>
   updateFamilyName: (name: string) => Promise<void>
   findRootMember: () => User | null
+  connectChildToExistingParents: (childId: string) => Promise<void>
 }
 
 const FamilyContext = createContext<FamilyContextType | undefined>(undefined)
@@ .. @@
   const addMember = async (
     userData: any,
     parentId?: string,
     relationshipType?: string
   ) => {
     if (!user?.familyKey) throw new Error('No family key available')
     
     try {
       console.log('Adding member:', { userData, parentId, relationshipType, familyKey: user.familyKey })
       const response = await familyAPI.addMember(
         user.familyKey,
         userData,
         parentId,
         relationshipType
       )
       
       console.log('Member added successfully:', response.data)
+      
+      // If adding a child and there's a spouse, connect to both parents
+      if (relationshipType === 'child' && parentId) {
+        await connectChildToExistingParents(response.data.id)
+      }
+      
       // Reload family data
       await loadFamily()
     } catch (error: any) {
       console.error('Add member error:', error)
       throw new Error(error.response?.data?.message || error.message || 'Failed to add member')
     }
   }

+  const connectChildToExistingParents = async (childId: string) => {
+    if (!family) return
+    
+    const child = family.members.find(m => m.id === childId)
+    if (!child || !child.relationships) return
+    
+    // Find the parent we just connected to
+    const parentIds = child.relationships.parentIds || []
+    if (parentIds.length === 0) return
+    
+    const connectedParent = family.members.find(m => parentIds.includes(m.id))
+    if (!connectedParent || !connectedParent.relationships?.spouseId) return
+    
+    const spouse = family.members.find(m => m.id === connectedParent.relationships?.spouseId)
+    if (!spouse) return
+    
+    // Connect child to spouse as well
+    try {
+      await familyAPI.addMember(
+        user!.familyKey,
+        child,
+        spouse.id,
+        'child'
+      )
+    } catch (error) {
+      console.error('Failed to connect child to spouse:', error)
+    }
+  }

   const removeMember = async (userId: string) => {
     if (!user?.familyKey) throw new Error('No family key available')
     
     try {
       await familyAPI.removeMember(user.familyKey, userId)
       
       // Reload family data
       await loadFamily()
     } catch (error: any) {
       throw new Error(error.response?.data?.message || 'Failed to remove member')
     }
   }
@@ .. @@
     updateFamilyName,
     findRootMember,
+    connectChildToExistingParents,
   }

   return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>