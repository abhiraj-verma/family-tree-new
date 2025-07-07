'use client'

import { useState } from 'react'
import { useFamily } from '@/contexts/FamilyContext'
import { User, UserPlus, Grid3X3, Network } from 'lucide-react'
import FamilyTreeCanvas from './FamilyTreeCanvas'

interface FamilyTreeViewProps {
  onAddMember: (parentId?: string, relationship?: string) => void
}

export default function FamilyTreeView({ onAddMember }: FamilyTreeViewProps) {
  const { family } = useFamily()
  const [viewMode, setViewMode] = useState<'canvas' | 'grid'>('canvas')

  if (!family || family.members.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
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

  const activeMembers = family.members.filter(member => member.isActive)

  // Legacy grid view component for fallback
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activeMembers.map((member) => (
        <div
          key={member.id}
          className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{member.fullName}</h3>
              {member.nickName && (
                <p className="text-sm text-gray-600">"{member.nickName}"</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            {member.birthDay && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Born: {new Date(member.birthDay).toLocaleDateString()}</span>
              </div>
            )}
            {member.job && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span>Job: {member.job}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="max-w-full mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Tree Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{family.name} Family Tree</h2>
              <p className="text-emerald-100">{activeMembers.length} family members</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('canvas')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  viewMode === 'canvas'
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'bg-white bg-opacity-10 text-emerald-100 hover:bg-white hover:bg-opacity-20'
                }`}
              >
                <Network className="w-4 h-4" />
                <span className="text-sm font-medium">Tree View</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white bg-opacity-20 text-white'
                    : 'bg-white bg-opacity-10 text-emerald-100 hover:bg-white hover:bg-opacity-20'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="text-sm font-medium">Grid View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tree Visualization */}
        <div className="p-6">
          {viewMode === 'canvas' ? (
            <FamilyTreeCanvas onAddMember={onAddMember} />
          ) : (
            <div className="bg-gradient-to-b from-gray-50 to-white p-6 rounded-xl">
              <GridView />
            </div>
          )}
        </div>

        {/* Add Member Section */}
        <div className="border-t border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-white">
          <div className="text-center">
            <button
              onClick={() => onAddMember()}
              className="btn-primary flex items-center space-x-3 mx-auto"
            >
              <UserPlus className="w-5 h-5" />
              <span>Add New Family Member</span>
            </button>
            <p className="text-gray-500 text-sm mt-3">
              Expand your family tree by adding relatives and their relationships
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}