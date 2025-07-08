@@ .. @@
   const [showCreateFamily, setShowCreateFamily] = useState(false)
   const [showAddMember, setShowAddMember] = useState(false)
   const [showShareModal, setShowShareModal] = useState(false)
   const [showEditName, setShowEditName] = useState(false)
+  const [showEditMember, setShowEditMember] = useState<string | null>(null)
   const [selectedParent, setSelectedParent] = useState<string | null>(null)
   const [selectedRelationship, setSelectedRelationship] = useState<string>('child')

@@ .. @@
   const handleAddMember = (parentId?: string, relationship?: string) => {
     setSelectedParent(parentId || null)
     setSelectedRelationship(relationship || 'child')
     setShowAddMember(true)
   }

+  const handleEditMember = (memberId: string) => {
+    setShowEditMember(memberId)
+  }

   const handleSaveFamily = () => {
@@ .. @@
       {/* Main Content */}
       <div className="flex-1 p-4">
-        <FamilyTreeView onAddMember={handleAddMember} />
+        <FamilyTreeView onAddMember={handleAddMember} onEditMember={handleEditMember} />
       </div>

       {/* Modals */}
@@ .. @@
           onClose={() => setShowEditName(false)}
         />
       )}
+
+      {showEditMember && (
+        <AddMemberModal
+          parentId={null}
+          relationship="edit"
+          memberId={showEditMember}
+          onClose={() => setShowEditMember(null)}
+        />
+      )}
     </div>
   )