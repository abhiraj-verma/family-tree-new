'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
  width: number
  height: number
}

export default function FamilyTreeCanvas({ onAddMember }: FamilyTreeCanvasProps) {
  const { family } = useFamily()
  const canvasRef = useRef<HTMLDivElement>(null)
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const buildTreeStructure = useCallback(() => {
    if (!family) return

    const activeMembers = family.members.filter(m => m.isActive)
    const nodeMap = new Map<string, TreeNode>()

    activeMembers.forEach(member => {
      nodeMap.set(member.id, {
        id: member.id,
        member,
        x: 0,
        y: 0,
        level: 0,
        children: [],
        spouse: undefined,
        parent: undefined,
        width: 200,
        height: 120,
      })
    })

    activeMembers.forEach(member => {
      const node = nodeMap.get(member.id)
      if (!node) return

      if (member.relationships?.childrenIds) {
        member.relationships.childrenIds.forEach(childId => {
          const childNode = nodeMap.get(childId)
          if (childNode) {
            node.children.push(childNode)
            childNode.parent = node
          }
        })
      }

      if (member.relationships?.spouseId) {
        const spouseNode = nodeMap.get(member.relationships.spouseId)
        if (spouseNode) {
          node.spouse = spouseNode
        }
      }
    })

    const rootNodes = Array.from(nodeMap.values()).filter(node => !node.parent)
    const positionedNodes = calculatePositions(rootNodes)
    setTreeNodes(positionedNodes)
  }, [family])

  useEffect(() => {
    if (family && family.members.length > 0) {
      buildTreeStructure()
    }
  }, [family, buildTreeStructure])

  const calculatePositions = (rootNodes: TreeNode[]): TreeNode[] => {
    const nodeWidth = 200
    const nodeHeight = 120
    const levelHeight = 200
    const siblingSpacing = 40
    const spouseSpacing = 30

    const positioned = new Set<string>()
    const allNodes: TreeNode[] = []

    function positionTree(node: TreeNode, level: number, xOffset: number) {
        if (positioned.has(node.id)) return 0;

        let localX = xOffset;
        node.level = level;
        node.y = level * levelHeight;

        const childrenWidth = node.children.reduce((acc, child) => {
            return acc + positionTree(child, level + 1, localX + acc);
        }, 0);

        let spouseWidth = 0;
        if (node.spouse && !positioned.has(node.spouse.id)) {
            spouseWidth = nodeWidth + spouseSpacing;
        }

        const selfWidth = nodeWidth + (node.spouse ? spouseSpacing + nodeWidth : 0);
        const totalWidth = Math.max(selfWidth, childrenWidth);
        
        const childrenStartX = localX + (totalWidth - childrenWidth) / 2;
        let currentChildX = 0;
        node.children.forEach(child => {
            positionTree(child, level + 1, childrenStartX + currentChildX);
            currentChildX += child.width;
        });

        node.x = localX + (totalWidth - selfWidth) / 2;
        if (node.spouse && !positioned.has(node.spouse.id)) {
            node.spouse.x = node.x + nodeWidth + spouseSpacing;
            node.spouse.y = node.y;
            node.spouse.level = level;
            positioned.add(node.spouse.id);
            allNodes.push(node.spouse);
        }
        
        positioned.add(node.id);
        allNodes.push(node);
        node.width = totalWidth;
        return totalWidth + siblingSpacing;
    }

    let currentX = 0;
    rootNodes.forEach(root => {
        if (!positioned.has(root.id)) {
            currentX += positionTree(root, 0, currentX);
        }
    });

    return allNodes;
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
    const drawnConnections = new Set<string>()

    treeNodes.forEach(node => {
      // Spouse connection
      if (node.spouse && !drawnConnections.has(`spouse-${node.id}`)) {
        const spouse = node.spouse
        const startX = node.x + node.width / 2
        const endX = spouse.x + spouse.width / 2
        const y = node.y + node.height / 2

        // Line from node to heart
        connections.push(
          <line key={`spouse-line-1-${node.id}`} x1={startX} y1={y} x2={(startX + endX) / 2} y2={y} stroke="#6b7280" strokeWidth="2" />
        )
        // Heart
        connections.push(
          <Heart key={`spouse-heart-${node.id}`} x={(startX + endX) / 2 - 10} y={y - 10} className="w-5 h-5 text-red-500 fill-red-500" />
        )
        // Line from heart to spouse
        connections.push(
          <line key={`spouse-line-2-${node.id}`} x1={(startX + endX) / 2} y1={y} x2={endX} y2={y} stroke="#6b7280" strokeWidth="2" />
        )
        drawnConnections.add(`spouse-${node.id}`)
        drawnConnections.add(`spouse-${spouse.id}`)
      }

      // Parent-child connections
      if (node.children.length > 0) {
        const parentY = node.y + node.height
        const childY = node.children[0].y
        const midY = (parentY + childY) / 2

        let parentCenterX = node.x + node.width / 2
        if (node.spouse) {
            parentCenterX = (node.x + node.spouse.x + node.width) / 2
        }

        // Vertical line from parent(s)
        connections.push(
          <line key={`vline-down-${node.id}`} x1={parentCenterX} y1={node.y + node.height / 2 + (node.spouse ? 0 : 30)} x2={parentCenterX} y2={midY} stroke="#6b7280" strokeWidth="2" />
        )

        // Horizontal line for children
        const firstChild = node.children[0]
        const lastChild = node.children[node.children.length - 1]
        const hLineStartX = firstChild.x + firstChild.width / 2
        const hLineEndX = lastChild.x + lastChild.width / 2
        connections.push(
          <line key={`hline-children-${node.id}`} x1={hLineStartX} y1={midY} x2={hLineEndX} y2={midY} stroke="#6b7280" strokeWidth="2" />
        )

        // Vertical lines to children
        node.children.forEach(child => {
          const childCenterX = child.x + child.width / 2
          connections.push(
            <line key={`vline-child-${child.id}`} x1={childCenterX} y1={midY} x2={childCenterX} y2={child.y} stroke="#6b7280" strokeWidth="2" />
          )
        })
      }
    })

    return (
        <svg className="absolute pointer-events-none" style={{
            width: Math.max(1200, Math.max(...treeNodes.map(n => n.x)) + 400),
            height: Math.max(600, Math.max(...treeNodes.map(n => n.y)) + 200),
        }}>
            {connections}
        </svg>
    )
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
          width: Math.max(1200, Math.max(...treeNodes.map(n => n.x)) + 400),
          height: Math.max(600, Math.max(...treeNodes.map(n => n.y)) + 200),
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
              width: node.width,
              height: node.height,
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
          <li>• Lines show family relationships</li>
        </ul>
      </div>
    </div>
  )
}