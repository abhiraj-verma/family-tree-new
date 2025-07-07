'use client'

import { useState } from 'react'
import { useFamily } from '@/contexts/FamilyContext'
import { X, Edit3, Save } from 'lucide-react'

interface EditFamilyNameModalProps {
  currentName: string
  onClose: () => void
}

export default function EditFamilyNameModal({ currentName, onClose }: EditFamilyNameModalProps) {
  const { updateFamilyName } = useFamily()
  const [familyName, setFamilyName] = useState(currentName)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!familyName.trim()) return

    setLoading(true)
    setError('')

    try {
      await updateFamilyName(familyName.trim())
      onClose()
    } catch (err: any) {
      setError(err.message || 'Failed to update family name')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Edit3 className="w-6 h-6 text-emerald-500" />
            <span>Edit Family Name</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="form-label">Family Name</label>
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="form-input"
              placeholder="Enter family name"
              required
              autoFocus
            />
            <p className="mt-2 text-sm text-gray-500">
              This name will appear at the top of your family tree and in shared links.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}