@@ .. @@
           className={`absolute cursor-pointer transition-all duration-200 ${
             selectedNode === node.id ? 'scale-105 z-10' : 'hover:scale-102'
           }`}
+          role="button"
+          tabIndex={0}
+          onKeyDown={(e) => {
+            if (e.key === 'Enter' || e.key === ' ') {
+              e.preventDefault()
+              handleNodeClick(node.id)
+            }
+          }}
           style={{
             left: node.x,
             top: node.y,
             width: 200,
             height: 120,
           }}
           onClick={() => handleNodeClick(node.id)}
         >
           <div className={`w-full h-full bg-gradient-to-br ${getGenderColor(node.member.gender)} rounded-xl shadow-lg border-2 ${
             selectedNode === node.id ? 'border-emerald-400' : 'border-white'
           } p-4 text-white`}>
             {/* Member Info */}
             <div className="flex items-center space-x-2 mb-2">
               <User className="w-5 h-5" />
               <h3 className="font-semibold text-sm truncate">{node.member.fullName}</h3>
             </div>
             
             {node.member.nickName && (
               <p className="text-xs opacity-90 mb-1">"{node.member.nickName}"</p>
             )}
             
             {node.member.birthDay && (
               <p className="text-xs opacity-80">
                 Born: {new Date(node.member.birthDay).toLocaleDateString()}
               </p>
             )}
             
             {node.member.job && (
               <p className="text-xs opacity-80 truncate">{node.member.job}</p>
             )}
 
             {/* Action buttons when selected */}
             {selectedNode === node.id && (
               <div className="absolute -bottom-12 left-0 right-0 flex justify-center space-x-2">
                 <button
                   onClick={(e) => {
                     e.stopPropagation()
                     onAddMember(node.id, 'child')
                   }}
                   className="bg-emerald-500 text-white p-2 rounded-full shadow-lg hover:bg-emerald-600 transition-colors"
                   title="Add Child"
+                  aria-label="Add Child"
                 >
                   <UserPlus className="w-4 h-4" />
                 </button>
                 
                 {!node.spouse && (
                   <button
                     onClick={(e) => {
                       e.stopPropagation()
                       onAddMember(node.id, 'spouse')
                     }}
                     className="bg-pink-500 text-white p-2 rounded-full shadow-lg hover:bg-pink-600 transition-colors"
                     title="Add Spouse"
+                    aria-label="Add Spouse"
                   >
                     <Heart className="w-4 h-4" />
                   </button>
                 )}
                 
                 <button
                   onClick={(e) => {
                     e.stopPropagation()
                     onAddMember(node.id, 'parent')
                   }}
                   className="bg-blue-500 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                   title="Add Parent"
+                  aria-label="Add Parent"
                 >
                   <Plus className="w-4 h-4" />
                 </button>
               </div>
             )}
           </div>
         </div>
       ))}
     </div>
 
     {/* Instructions */}
     <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 text-sm text-gray-600 max-w-xs">
       <p className="font-medium mb-1">How to use:</p>
       <ul className="space-y-1 text-xs">
         <li>• Click on a member to see options</li>
         <li>• Add children, spouse, or parents</li>
         <li>• Heart symbols show marriages</li>
         <li>• Dotted lines show family relationships</li>
       </ul>
     </div>
   </div>
 )