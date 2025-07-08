'use client'

import { useState, useEffect, useRef } from 'react'
import { useFamily } from '@/contexts/FamilyContext'
import { User, Plus, Heart, UserPlus } from 'lucide-react'

interface FamilyTreeCanvasProps {
  onAddMember: (parentId?: string, relationship?: string) => void
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
}

export default function FamilyTreeCanvas({ onAddMember }: FamilyTreeCanvasProps) {
  const { family } = useFamily()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

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

    // Build relationships
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

      // Add spouse
      if (member.relationships?.spouseId) {
        const spouseNode = nodeMap.get(member.relationships.spouseId)
        if (spouseNode) {
          node.spouse = spouseNode
        }
      }
    })

    // Find root nodes (members with no parents)
    const rootNodes = Array.from(nodeMap.values()).filter(node => !node.parent)

    // Calculate positions
    const positionedNodes = calculatePositions(rootNodes)
    setTreeNodes(positionedNodes)
  }

  const calculatePositions = (rootNodes: TreeNode[]): TreeNode[] => {
    const nodeWidth = 200
    const nodeHeight = 120
    const levelHeight = 180
    const siblingSpacing = 50

    const positionNode = (node: TreeNode, x: number, y: number, level: number) => {
      node.x = x
      node.y = y
      node.level = level

      // Position children
      if (node.children.length > 0) {
        const totalChildrenWidth = (node.children.length - 1) * (nodeWidth + siblingSpacing)
        let childX = x - totalChildrenWidth / 2

        node.children.forEach((child, index) => {
          positionNode(child, childX, y + levelHeight, level + 1)
          childX += nodeWidth + siblingSpacing
        })
      }

      // Position spouse next to the node
      if (node.spouse) {
        node.spouse.x = x + nodeWidth + 30
        node.spouse.y = y
        node.spouse.level = level
      }
    }

    // Position each root tree
    let currentX = 0
    rootNodes.forEach((rootNode, index) => {
      positionNode(rootNode, currentX, 50, 0)
      currentX += 400 // Space between different family trees
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
      // Parent-child connections
      node.children.forEach(child => {
        const startX = node.x + 100 // Center of parent node
        const startY = node.y + 120 // Bottom of parent node
        const endX = child.x + 100 // Center of child node
        const endY = child.y // Top of child node

        connections.push(
          <svg
            key={`line-${node.id}-${child.id}`}
            className="absolute pointer-events-none"
            style={{
              left: Math.min(startX, endX),
              top: Math.min(startY, endY),
              width: Math.abs(endX - startX) + 2,
              height: Math.abs(endY - startY) + 2,
            }}
          >
            <line
              x1={startX - Math.min(startX, endX)}
              y1={startY - Math.min(startY, endY)}
              x2={endX - Math.min(startX, endX)}
              y2={endY - Math.min(startY, endY)}
              stroke="#6b7280"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>
        )
      })

      // Spouse connections (heart symbol)
      if (node.spouse) {
        const heartX = node.x + 215
        const heartY = node.y + 50

        connections.push(
          <div
            key={`heart-${node.id}-${node.spouse.id}`}
            className="absolute flex items-center justify-center"
            style={{
              left: heartX,
              top: heartY,
              width: 20,
              height: 20,
            }}
          >
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
          </div>
        )
      }
    })

    return connections
  }

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId)
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

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 min-h-[600px] overflow-auto">
      <div
        ref={canvasRef}
        className="relative"
        style={{
          width: Math.max(1200, Math.max(...treeNodes.map(n => n.x)) + 250),
          height: Math.max(600, Math.max(...treeNodes.map(n => n.y)) + 150),
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
}