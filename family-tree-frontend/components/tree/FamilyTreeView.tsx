'use client'

import { useFamily } from '@/contexts/FamilyContext'
import { User, Plus, Edit3, Trash2, Heart, Baby, Users, UserPlus, Crown } from 'lucide-react'

interface FamilyTreeViewProps {
  onAddMember: (parentId?: string, relationship?: string) => void
}

export default function FamilyTreeView({ onAddMember }: FamilyTreeViewProps) {
  const { family, removeMember, findRootMember } = useFamily()

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

  const getGenderIcon = (gender?: string) => {
    switch (gender) {
      case 'MALE':
        return <User className="w-5 h-5 text-blue-600" />
      case 'FEMALE':
        return <User className="w-5 h-5 text-pink-600" />
      default:
        return <User className="w-5 h-5 text-gray-600" />
    }
  }

  const getGenderColors = (gender?: string) => {
    switch (gender) {
      case 'MALE':
        return {
          bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
          border: 'border-blue-200 hover:border-blue-300',
          accent: 'bg-blue-50 text-blue-600 hover:bg-blue-100'
        }
      case 'FEMALE':
        return {
          bg: 'bg-gradient-to-br from-pink-400 to-pink-600',
          border: 'border-pink-200 hover:border-pink-300',
          accent: 'bg-pink-50 text-pink-600 hover:bg-pink-100'
        }
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-400 to-gray-600',
          border: 'border-gray-200 hover:border-gray-300',
          accent: 'bg-gray-50 text-gray-600 hover:bg-gray-100'
        }
    }
  }

  const MemberCard = ({ member, isRoot = false }: { member: any; isRoot?: boolean }) => {
    const colors = getGenderColors(member.gender)
    
    return (
      <div className={`relative bg-white rounded-xl border-2 ${
        isRoot 
          ? 'border-emerald-400 shadow-lg ring-2 ring-emerald-100' 
          : colors.border
      } p-4 transition-all duration-200 w-64 group hover:shadow-lg`}>
        
        {/* Root Badge */}
        {isRoot && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md flex items-center space-x-1">
              <Crown className="w-3 h-3" />
              <span>Family Root</span>
            </span>
          </div>
        )}

        {/* Member Header */}
        <div className="flex items-center space-x-3 mb-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isRoot 
              ? 'bg-gradient-to-br from-emerald-500 to-blue-500' 
              : colors.bg
          }`}>
            {getGenderIcon(member.gender)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate">
              {member.fullName}
            </h3>
            {member.nickName && (
              <p className="text-xs text-gray-600 italic truncate">"{member.nickName}"</p>
            )}
          </div>
        </div>

        {/* Member Details */}
        <div className="space-y-1.5 mb-3">
          {member.birthDay && (
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></span>
              <span className="truncate">Born: {new Date(member.birthDay).toLocaleDateString()}</span>
            </div>
          )}
          {member.job && (
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></span>
              <span className="truncate">Job: {member.job}</span>
            </div>
          )}
          {member.bloodGroup && (
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></span>
              <span>Blood: {member.bloodGroup}</span>
            </div>
          )}
        </div>

        {/* Edit/Remove Actions */}
        <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit member"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          {!isRoot && (
            <button
              onClick={() => removeMember(member.id)}
              className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Remove member"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Relationship Add Buttons */}
        <div className="border-t border-gray-100 pt-3 mt-3">
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onAddMember(member.id, 'child')}
              className="flex items-center justify-center space-x-1 bg-emerald-50 text-emerald-600 py-1.5 px-2 rounded-lg hover:bg-emerald-100 transition-colors text-xs font-medium"
              title="Add child"
            >
              <Baby className="w-3 h-3" />
              <span>Child</span>
            </button>
            <button
              onClick={() => onAddMember(member.id, 'spouse')}
              className="flex items-center justify-center space-x-1 bg-pink-50 text-pink-600 py-1.5 px-2 rounded-lg hover:bg-pink-100 transition-colors text-xs font-medium"
              title="Add spouse"
            >
              <Heart className="w-3 h-3" />
              <span>Spouse</span>
            </button>
            <button
              onClick={() => onAddMember(member.id, 'parent')}
              className="flex items-center justify-center space-x-1 bg-blue-50 text-blue-600 py-1.5 px-2 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
              title="Add parent"
            >
              <Users className="w-3 h-3" />
              <span>Parent</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

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
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 rounded-lg p-3">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tree Visualization */}
        <div className="p-8 overflow-x-auto bg-gradient-to-b from-gray-50 to-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeMembers.map((member) => (
              <MemberCard 
                key={member.id} 
                member={member} 
                isRoot={member.id === findRootMember()?.id} 
              />
            ))}
          </div>
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