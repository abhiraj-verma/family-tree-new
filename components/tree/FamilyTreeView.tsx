interface FamilyTreeViewProps {
   onAddMember: (parentId?: string, relationship?: string) => void
+  onEditMember?: (memberId: string) => void
}

+export default function FamilyTreeView({ onAddMember, onEditMember }: FamilyTreeViewProps) {
   const { family } = useFamily()
   const [viewMode, setViewMode] = useState<'canvas' | 'grid'>('canvas')

        {/* Tree Visualization */}
        <div className="p-6">
          {viewMode === 'canvas' ? (
-            <FamilyTreeCanvas onAddMember={onAddMember} onEditMember={onEditMember} />
          ) : (
            <div className="bg-gradient-to-b from-gray-50 to-white p-6 rounded-xl">
              <GridView />
            </div>
          )}
        </div>
}