'use client'

import { useState } from 'react'
import { useFamily } from '@/contexts/FamilyContext'
import { X, User, Phone, Mail, Calendar, Heart, Briefcase, Baby, Users } from 'lucide-react'

interface AddMemberModalProps {
  parentId?: string | null
  relationship?: string
  onClose: () => void
}

export default function AddMemberModal({ parentId, relationship, onClose }: AddMemberModalProps) {
  const { addMember } = useFamily()
  const [formData, setFormData] = useState({
    fullName: '',
    nickName: '',
    mobile: '',
    email: '',
    bio: '',
    gender: 'MALE',
    bloodGroup: '',
    birthDay: '',
    marriageAnniversary: '',
    job: '',
    education: '',
    familyDoctor: '',
    deathAnniversary: '',
    rewards: '',
    relationship: relationship || 'child',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.fullName.trim()) {
      setError('Full name is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const userData = {
        fullName: formData.fullName,
        nickName: formData.nickName || undefined,
        mobile: formData.mobile || undefined,
        email: formData.email || undefined,
        bio: formData.bio || undefined,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup || undefined,
        birthDay: formData.birthDay || undefined,
        marriageAnniversary: formData.marriageAnniversary || undefined,
        job: formData.job || undefined,
        education: formData.education || undefined,
        familyDoctor: formData.familyDoctor || undefined,
        deathAnniversary: formData.deathAnniversary || undefined,
        rewards: formData.rewards || undefined,
      }

      console.log('Submitting member data:', userData)
      await addMember(userData, parentId || undefined, formData.relationship)
      console.log('Member added successfully')
      onClose()
    } catch (err: any) {
      console.error('Failed to add member:', err)
      setError(err.message || 'Failed to add member')
    } finally {
      setLoading(false)
    }
  }

  const getRelationshipInfo = () => {
    switch (formData.relationship) {
      case 'child':
        return {
          title: 'Add Child',
          icon: <Baby className="w-6 h-6 text-emerald-500" />,
          emoji: '👶',
          description: 'Adding a new child to the family tree'
        }
      case 'spouse':
        return {
          title: 'Add Spouse',
          icon: <Heart className="w-6 h-6 text-pink-500" />,
          emoji: '💕',
          description: 'Adding a spouse/partner to the family tree'
        }
      case 'mother':
      case 'father':
      case 'parent':
        return {
          title: `Add ${formData.relationship === 'mother' ? 'Mother' : formData.relationship === 'father' ? 'Father' : 'Parent'}`,
          icon: <Users className="w-6 h-6 text-blue-500" />,
          emoji: formData.relationship === 'mother' ? '👩' : formData.relationship === 'father' ? '👨' : '👨‍👩‍👧‍👦',
          description: `Adding a ${formData.relationship} to the family tree`
        }
      default:
        return {
          title: 'Add Family Member',
          icon: <User className="w-6 h-6 text-gray-500" />,
          emoji: '👤',
          description: 'Adding a new member to the family tree'
        }
    }
  }

  const relationshipInfo = getRelationshipInfo()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{relationshipInfo.emoji}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{relationshipInfo.title}</h2>
                {parentId && (
                  <p className="text-gray-600 text-sm mt-1">{relationshipInfo.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <User className="w-5 h-5 text-emerald-500" />
              <span>Basic Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="form-input"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <label className="form-label">Nick Name</label>
                <input
                  type="text"
                  value={formData.nickName}
                  onChange={(e) => setFormData({ ...formData, nickName: e.target.value })}
                  className="form-input"
                  placeholder="Enter nick name"
                />
              </div>

              <div>
                <label className="form-label">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="form-input"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="form-label">Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="form-input"
                >
                  <option value="">Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Phone className="w-5 h-5 text-blue-500" />
              <span>Contact Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>

          {/* Important Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              <span>Important Dates</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Birth Date</label>
                <input
                  type="date"
                  value={formData.birthDay}
                  onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Marriage Anniversary</label>
                <input
                  type="date"
                  value={formData.marriageAnniversary}
                  onChange={(e) => setFormData({ ...formData, marriageAnniversary: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-orange-500" />
              <span>Professional Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Job/Profession</label>
                <input
                  type="text"
                  value={formData.job}
                  onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                  className="form-input"
                  placeholder="Enter job/profession"
                />
              </div>

              <div>
                <label className="form-label">Education</label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="form-input"
                  placeholder="Enter education details"
                />
              </div>
            </div>
          </div>

          {/* Relationship */}
          {parentId && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span>Relationship</span>
              </h3>
              
              <div>
                <label className="form-label">Relationship to existing member</label>
                <select
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  className="form-input"
                >
                  <option value="child">Child</option>
                  <option value="spouse">Spouse</option>
                  <option value="mother">Mother</option>
                  <option value="father">Father</option>
                  <option value="parent">Parent</option>
                </select>
              </div>
            </div>
          )}

          {/* Bio */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Biography</h3>
            <div>
              <label className="form-label">Bio/Description</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="form-input"
                placeholder="Tell us about this family member..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
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
              {relationshipInfo.icon}
              <span>
                {loading ? 'Adding...' : `Add ${formData.relationship === 'child' ? 'Child' : formData.relationship === 'spouse' ? 'Spouse' : 'Member'}`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}