'use client'

import { useState, useEffect, useRef } from 'react'
import { useFamily } from '@/contexts/FamilyContext'
import { User, Plus, Heart, UserPlus, Trash2, Edit } from 'lucide-react'

interface FamilyTreeCanvasProps {
  onAddMember: (parentId?: string, relationship?: string) => void
  onEditMember?: (memberId: string) => void
}

interface TreeNode {
  id: string
  member: any
  x: number
  y: number
  level: number
  children: TreeNode[]
  spouse?: TreeNode
  parent?: TreeNode
  spouseConnectorX?: number
}

export default function FamilyTreeCanvas({ onAddMember, onEditMember }: FamilyTreeCanvasProps) {
  const { family, removeMember } = useFamily()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    if (family && family.members.length > 0) {
      buildTreeStructure()
    }
  }, [family])

  const buildTreeStructure = () => {
    if (!family) return

    const activeMembers = family.members.filter(m => m.isActive)
    const nodeMap = new Map<string, TreeNode>()

    // Create nodes for all members
    activeMembers.forEach(member => {
      nodeMap.set(member.id, {
        id: member.id,
        member,
        x: 0,
        y: 0,
        level: 0,
        children: [],
        spouse: undefined,
        parent: undefined
      })
    })

    // Build parent-child relationships
    activeMembers.forEach(member => {
      const node = nodeMap.get(member.id)
      if (!node) return

      // Add children
      if (member.relationships?.childrenIds) {
        member.relationships.childrenIds.forEach(childId => {
          const childNode = nodeMap.get(childId)
          if (childNode) {
            node.children.push(childNode)
            childNode.parent = node
          }
        })
      }
    })

    // Build spouse relationships
    activeMembers.forEach(member => {
      const node = nodeMap.get(member.id)
      if (!node || node.spouse) return // Skip if already has spouse assigned

      if (member.relationships?.spouseId) {
        const spouseNode = nodeMap.get(member.relationships.spouseId)
        if (spouseNode && !spouseNode.spouse) {
          node.spouse = spouseNode
          spouseNode.spouse = node
        }
      }
    })

    // Find root nodes (members with no parents)
    const rootNodes = Array.from(nodeMap.values()).filter(node => !node.parent)

    // Calculate positions with improved layout
    const positionedNodes = calculatePositions(rootNodes)
    setTreeNodes(positionedNodes)
  }

  const calculatePositions = (rootNodes: TreeNode[]): TreeNode[] => {
    const nodeWidth = 220
    const nodeHeight = 140
    const levelHeight = 200
    const siblingSpacing = 60
    const spouseSpacing = 40

    const calculateSubtreeWidth = (node: TreeNode): number => {
      if (node.children.length === 0) {
        return nodeWidth + (node.spouse ? nodeWidth + spouseSpacing : 0)
      }

      const childrenWidth = node.children.reduce((total, child, index) => {
        const childWidth = calculateSubtreeWidth(child)
        return total + childWidth + (index > 0 ? siblingSpacing : 0)
      }, 0)

      const nodeAndSpouseWidth = nodeWidth + (node.spouse ? nodeWidth + spouseSpacing : 0)
      return Math.max(nodeAndSpouseWidth, childrenWidth)
    }

    const positionNode = (node: TreeNode, x: number, y: number, level: number) => {
      node.level = level

      if (node.spouse) {
        // Position couple side by side
        const coupleWidth = nodeWidth * 2 + spouseSpacing
        node.x = x - coupleWidth / 2 + nodeWidth / 2
        node.spouse.x = node.x + nodeWidth + spouseSpacing
        node.y = y
        node.spouse.y = y
        node.spouse.level = level

        // Store connector position for the horizontal line
        node.spouseConnectorX = node.x + nodeWidth / 2 + (spouseSpacing + nodeWidth) / 2
      } else {
        node.x = x - nodeWidth / 2
        node.y = y
      }

      // Position children
      if (node.children.length > 0) {
        const totalChildrenWidth = node.children.reduce((total, child, index) => {
          const childWidth = calculateSubtreeWidth(child)
          return total + childWidth + (index > 0 ? siblingSpacing : 0)
        }, 0)

        let childX = x - totalChildrenWidth / 2
        
        node.children.forEach((child, index) => {
          const childWidth = calculateSubtreeWidth(child)
          const childCenterX = childX + childWidth / 2
          
          positionNode(child, childCenterX, y + levelHeight, level + 1)
          childX += childWidth + siblingSpacing
        })
      }
    }

    // Position each root tree
    let currentX = 0
    rootNodes.forEach((rootNode, index) => {
      const treeWidth = calculateSubtreeWidth(rootNode)
      positionNode(rootNode, currentX + treeWidth / 2, 50, 0)
      currentX += treeWidth + 100 // Space between different family trees
    })

    // Flatten all nodes
    const allNodes: TreeNode[] = []
    const collectNodes = (node: TreeNode) => {
      allNodes.push(node)
      if (node.spouse && !allNodes.find(n => n.id === node.spouse!.id)) {
        allNodes.push(node.spouse)
      }
      node.children.forEach(collectNodes)
    }

    rootNodes.forEach(collectNodes)
    return allNodes
  }

  const getGenderColor = (gender?: string) => {
    switch (gender) {
      case 'MALE':
        return 'from-blue-400 to-blue-600'
      case 'FEMALE':
        return 'from-pink-400 to-pink-600'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  const renderConnections = () => {
    const connections: JSX.Element[] = []

    treeNodes.forEach(node => {
      // Spouse connections (horizontal line with heart)
      if (node.spouse && node.spouseConnectorX) {
        const lineY = node.y + 70 // Middle of the node
        const startX = node.x + nodeWidth
        const endX = node.spouse.x
        const heartX = node.spouseConnectorX

        // Horizontal line between spouses
        connections.push(
          <svg
            key={`spouse-line-${node.id}`}
            className="absolute pointer-events-none"
            style={{
              left: startX,
              top: lineY - 1,
              width: endX - startX,
              height: 2,
            }}
          >
            <line
              x1={0}
              y1={1}
              x2={endX - startX}
              y2={1}
              stroke="#6b7280"
              strokeWidth="2"
            />
          </svg>
        )

        // Heart symbol
        connections.push(
          <div
            key={`heart-${node.id}`}
            className="absolute flex items-center justify-center"
            style={{
              left: heartX - 10,
              top: lineY - 10,
              width: 20,
              height: 20,
            }}
          >
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          </div>
        )

        // Vertical line down from couple to children
        if (node.children.length > 0) {
          const verticalStartY = lineY + 1
          const verticalEndY = node.children[0].y - 20

          connections.push(
            <svg
              key={`couple-to-children-${node.id}`}
              className="absolute pointer-events-none"
              style={{
                left: heartX - 1,
                top: verticalStartY,
                width: 2,
                height: verticalEndY - verticalStartY,
              }}
            >
              <line
                x1={1}
                y1={0}
                x2={1}
                y2={verticalEndY - verticalStartY}
                stroke="#6b7280"
                strokeWidth="2"
              />
            </svg>
          )

          // Horizontal line connecting all children
          if (node.children.length > 1) {
            const firstChild = node.children[0]
            const lastChild = node.children[node.children.length - 1]
            const childrenLineY = verticalEndY
            const childrenLineStartX = firstChild.x + nodeWidth / 2
            const childrenLineEndX = lastChild.x + nodeWidth / 2

            connections.push(
              <svg
                key={`children-line-${node.id}`}
                className="absolute pointer-events-none"
                style={{
                  left: childrenLineStartX,
                  top: childrenLineY - 1,
                  width: childrenLineEndX - childrenLineStartX,
                  height: 2,
                }}
              >
                <line
                  x1={0}
                  y1={1}
                  x2={childrenLineEndX - childrenLineStartX}
                  y2={1}
                  stroke="#6b7280"
                  strokeWidth="2"
                />
              </svg>
            )
          }

          // Vertical lines from horizontal line to each child
          node.children.forEach(child => {
            const childLineX = child.x + nodeWidth / 2
            const childLineStartY = verticalEndY
            const childLineEndY = child.y

            connections.push(
              <svg
                key={`to-child-${child.id}`}
                className="absolute pointer-events-none"
                style={{
                  left: childLineX - 1,
                  top: childLineStartY,
                  width: 2,
                  height: childLineEndY - childLineStartY,
                }}
              >
                <line
                  x1={1}
                  y1={0}
                  x2={1}
                  y2={childLineEndY - childLineStartY}
                  stroke="#6b7280"
                  strokeWidth="2"
                />
              </svg>
            )
          })
        }
      } else if (!node.spouse && node.children.length > 0) {
        // Single parent connections
        const parentCenterX = node.x + nodeWidth / 2
        const parentBottomY = node.y + nodeHeight

        // Vertical line down from parent
        const verticalEndY = node.children[0].y - 20

        connections.push(
          <svg
            key={`single-parent-${node.id}`}
            className="absolute pointer-events-none"
            style={{
              left: parentCenterX - 1,
              top: parentBottomY,
              width: 2,
              height: verticalEndY - parentBottomY,
            }}
          >
            <line
              x1={1}
              y1={0}
              x2={1}
              y2={verticalEndY - parentBottomY}
              stroke="#6b7280"
              strokeWidth="2"
            />
          </svg>
        )

        // Horizontal line connecting all children
        if (node.children.length > 1) {
          const firstChild = node.children[0]
          const lastChild = node.children[node.children.length - 1]
          const childrenLineY = verticalEndY
          const childrenLineStartX = firstChild.x + nodeWidth / 2
          const childrenLineEndX = lastChild.x + nodeWidth / 2

          connections.push(
            <svg
              key={`single-children-line-${node.id}`}
              className="absolute pointer-events-none"
              style={{
                left: childrenLineStartX,
                top: childrenLineY - 1,
                width: childrenLineEndX - childrenLineStartX,
                height: 2,
              }}
            >
              <line
                x1={0}
                y1={1}
                x2={childrenLineEndX - childrenLineStartX}
                y2={1}
                stroke="#6b7280"
                strokeWidth="2"
              />
            </svg>
          )
        }

        // Vertical lines to each child
        node.children.forEach(child => {
          const childLineX = child.x + nodeWidth / 2
          const childLineStartY = verticalEndY
          const childLineEndY = child.y

          connections.push(
            <svg
              key={`single-to-child-${child.id}`}
              className="absolute pointer-events-none"
              style={{
                left: childLineX - 1,
                top: childLineStartY,
                width: 2,
                height: childLineEndY - childLineStartY,
              }}
            >
              <line
                x1={1}
                y1={0}
                x2={1}
                y2={childLineEndY - childLineStartY}
                stroke="#6b7280"
                strokeWidth="2"
              />
            </svg>
          )
        })
      }
    })

    return connections
  }

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId)
  }

  const handleDeleteMember = async (memberId: string) => {
    try {
      await removeMember(memberId)
      setShowDeleteConfirm(null)
      setSelectedNode(null)
    } catch (error) {
      console.error('Failed to delete member:', error)
    }
  }

  if (!family || family.members.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-gray-50 to-white rounded-xl">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-200">
            <User className="w-10 h-10 text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Family Tree</h3>
          <p className="text-gray-500 mb-6">Add your first family member to begin building your tree</p>
          <button
            onClick={() => onAddMember()}
            className="btn-primary"
          >
            Add First Member
          </button>
        </div>
      </div>
    )
  }

  const canvasWidth = Math.max(1400, Math.max(...treeNodes.map(n => n.x)) + 300)
  const canvasHeight = Math.max(700, Math.max(...treeNodes.map(n => n.y)) + 200)

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 min-h-[600px] overflow-auto">
      <div
        ref={canvasRef}
        className="relative"
        style={{
          width: canvasWidth,
          height: canvasHeight,
        }}
      >
        {/* Render connections */}
        {renderConnections()}

        {/* Render nodes */}
        {treeNodes.map(node => (
          <div
            key={node.id}
            className={`absolute cursor-pointer transition-all duration-200 ${
              selectedNode === node.id ? 'scale-105 z-10' : 'hover:scale-102'
            }`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleNodeClick(node.id)
              }
            }}
            style={{
              left: node.x,
              top: node.y,
              width: 220,
              height: 140,
            }}
            onClick={() => handleNodeClick(node.id)}
          >
            <div className={`w-full h-full bg-gradient-to-br ${getGenderColor(node.member.gender)} rounded-xl shadow-lg border-2 ${
              selectedNode === node.id ? 'border-emerald-400' : 'border-white'
            } p-4 text-white relative`}>
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
                <div className="absolute -bottom-16 left-0 right-0 flex justify-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onAddMember(node.id, 'child')
                    }}
                    className="bg-emerald-500 text-white p-2 rounded-full shadow-lg hover:bg-emerald-600 transition-colors"
                    title="Add Child"
                    aria-label="Add Child"
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
                      aria-label="Add Spouse"
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
                    aria-label="Add Parent"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  {onEditMember && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEditMember(node.id)
                      }}
                      className="bg-yellow-500 text-white p-2 rounded-full shadow-lg hover:bg-yellow-600 transition-colors"
                      title="Edit Member"
                      aria-label="Edit Member"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDeleteConfirm(node.id)
                    }}
                    className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    title="Delete Member"
                    aria-label="Delete Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Family Member</h3>
                <p className="text-gray-600">This action cannot be undone.</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this family member? All relationships will be updated accordingly.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMember(showDeleteConfirm)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 text-sm text-gray-600 max-w-xs">
        <p className="font-medium mb-1">How to use:</p>
        <ul className="space-y-1 text-xs">
          <li>• Click on a member to see options</li>
          <li>• Add children, spouse, or parents</li>
          <li>• Heart symbols show marriages</li>
          <li>• Straight lines show family relationships</li>
          <li>• Delete members to clean up the tree</li>
        </ul>
      </div>
    </div>
  )
}