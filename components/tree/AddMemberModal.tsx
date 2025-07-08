@@ .. @@
 interface AddMemberModalProps {
   parentId?: string | null
   relationship?: string
+  memberId?: string | null
   onClose: () => void
 }

-export default function AddMemberModal({ parentId, relationship, onClose }: AddMemberModalProps) {
-  const { addMember } = useFamily()
+export default function AddMemberModal({ parentId, relationship, memberId, onClose }: AddMemberModalProps) {
+  const { addMember, family } = useFamily()
+  
+  // Find existing member data if editing
+  const existingMember = memberId ? family?.members.find(m => m.id === memberId) : null
+  const isEditing = !!existingMember
+  
   const [formData, setFormData] = useState({
-    fullName: '',
-    nickName: '',
-    mobile: '',
-    email: '',
-    bio: '',
-    gender: 'MALE',
-    bloodGroup: '',
-    birthDay: '',
-    marriageAnniversary: '',
-    job: '',
-    education: '',
-    familyDoctor: '',
-    deathAnniversary: '',
-    rewards: '',
+    fullName: existingMember?.fullName || '',
+    nickName: existingMember?.nickName || '',
+    mobile: existingMember?.mobile || '',
+    email: existingMember?.email || '',
+    bio: existingMember?.bio || '',
+    gender: existingMember?.gender || 'MALE',
+    bloodGroup: existingMember?.bloodGroup || '',
+    birthDay: existingMember?.birthDay || '',
+    marriageAnniversary: existingMember?.marriageAnniversary || '',
+    job: existingMember?.job || '',
+    education: existingMember?.education || '',
+    familyDoctor: existingMember?.familyDoctor || '',
+    deathAnniversary: existingMember?.deathAnniversary || '',
+    rewards: existingMember?.rewards || '',
     relationship: relationship || 'child',
   })
@@ .. @@
   const getRelationshipInfo = () => {
+    if (isEditing) {
+      return {
+        title: 'Edit Family Member',
+        icon: <User className="w-6 h-6 text-blue-500" />,
+        emoji: '✏️',
+        description: 'Update family member information'
+      }
+    }
+    
     switch (formData.relationship) {
@@ .. @@
           {/* Relationship */}
-          {parentId && (
+          {parentId && !isEditing && (
             <div className="space-y-4">
@@ .. @@
               <span>
-                {loading ? 'Adding...' : `Add ${formData.relationship === 'child' ? 'Child' : formData.relationship === 'spouse' ? 'Spouse' : 'Member'}`}
+                {loading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update Member' : `Add ${formData.relationship === 'child' ? 'Child' : formData.relationship === 'spouse' ? 'Spouse' : 'Member'}`)}
               </span>
             </button>