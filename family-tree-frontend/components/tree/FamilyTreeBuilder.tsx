'use client'

import { useState, useEffect } from 'react'
import { useFamily } from '@/contexts/FamilyContext'
import { useAuth } from '@/contexts/AuthContext'
import { User, Plus, Save, Share2, Edit3, LogOut } from 'lucide-react'
import FamilyTreeView from './FamilyTreeView'
import CreateFamilyModal from './CreateFamilyModal'
import AddMemberModal from './AddMemberModal'
import ShareModal from './ShareModal'
import EditFamilyNameModal from './EditFamilyNameModal'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function FamilyTreeBuilder() {
  const { family, loading, createFamily } = useFamily()
  const { user, logout } = useAuth()
  const [showCreateFamily, setShowCreateFamily] = useState(false)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showEditName, setShowEditName] = useState(false)
  const [selectedParent, setSelectedParent] = useState<string | null>(null)
  const [selectedRelationship, setSelectedRelationship] = useState<string>('child')

  useEffect(() => {
    if (!family && !loading && user) {
      setShowCreateFamily(true)
    }
  }, [family, loading, user])

  const handleAddMember = (parentId?: string, relationship?: string) => {
    setSelectedParent(parentId || null)
    setSelectedRelationship(relationship || 'child')
    setShowAddMember(true)
  }

  const handleSaveFamily = () => {
    // Show success message with better UX
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300'
    notification.textContent = 'Family tree saved successfully!'
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => document.body.removeChild(notification), 300)
    }, 2000)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!family) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">KnowYourFamilyTree</h1>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Welcome Section */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
              <User className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Your Family Tree</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              Start building your family tree by creating your family and adding members.
            </p>
            <button
              onClick={() => setShowCreateFamily(true)}
              className="btn-primary flex items-center space-x-3 mx-auto"
            >
              <Plus className="w-6 h-6" />
              <span className="text-lg">Create Family Tree</span>
            </button>
          </div>
        </div>

        {/* Modals */}
        {showCreateFamily && (
          <CreateFamilyModal
            onClose={() => setShowCreateFamily(false)}
            onCreate={createFamily}
          />
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <button
                onClick={() => setShowEditName(true)}
                className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-emerald-600 transition-colors group"
              >
                <span>{family.name}</span>
                <Edit3 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleAddMember()}
                className="flex items-center space-x-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors shadow-md hover:shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Member</span>
              </button>
              
              <button
                onClick={handleSaveFamily}
                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save</span>
              </button>
              
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors shadow-md hover:shadow-lg"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <FamilyTreeView onAddMember={handleAddMember} />
      </div>

      {/* Modals */}
      {showAddMember && (
        <AddMemberModal
          parentId={selectedParent}
          relationship={selectedRelationship}
          onClose={() => {
            setShowAddMember(false)
            setSelectedParent(null)
            setSelectedRelationship('child')
          }}
          isFoundingMember={user?.isFoundingMember}
        />
      )}

      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} />
      )}

      {showEditName && family && (
        <EditFamilyNameModal
          currentName={family.name}
          onClose={() => setShowEditName(false)}
        />
      )}
    </div>
  )
}