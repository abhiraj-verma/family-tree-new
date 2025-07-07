'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { publicAPI } from '@/lib/api'
import { User, ArrowLeft, Eye, Users, X } from 'lucide-react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorPage from '@/components/ui/ErrorPage'

interface PublicTreeViewProps {
  token: string
}

export default function PublicTreeView({ token }: PublicTreeViewProps) {
  const router = useRouter()
  const [family, setFamily] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [familyName, setFamilyName] = useState('')

  useEffect(() => {
    const loadPublicFamily = async () => {
      try {
        // For now, we'll use a mock family name
        // In a real app, this might come from URL params or be prompted
        const mockFamilyName = 'Demo Family'
        setFamilyName(mockFamilyName)
        
        const response = await publicAPI.getPublicFamily(token, mockFamilyName)
        setFamily(response.data)
      } catch (err: any) {
        console.error('Failed to load public family:', err)
        setError('Family tree not found or access denied')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      loadPublicFamily()
    }
  }, [token])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <ErrorPage
        title="Access Denied"
        message={error}
        onGoHome={() => router.push('/')}
      />
    )
  }

  if (!family) {
    return (
      <ErrorPage
        title="Family Tree Not Found"
        message="The requested family tree could not be found."
        onGoHome={() => router.push('/')}
      />
    )
  }

  const activeMembers = family.members?.filter((member: any) => member.isActive) || []

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{family.name}</h1>
                  <p className="text-sm text-gray-500">Family Tree</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Eye className="w-4 h-4" />
                <span>View Only</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{activeMembers.length} members</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Tree Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white p-6">
            <h2 className="text-2xl font-bold mb-2">{family.name} Family Tree</h2>
            <p className="text-emerald-100">{activeMembers.length} family members</p>
          </div>

          {/* Tree Content */}
          <div className="p-6">
            {activeMembers.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Family Members</h3>
                <p className="text-gray-500">This family tree doesn't have any members yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeMembers.map((member: any) => (
                  <div
                    key={member.id}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                  >
                    {/* Member Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-xl flex items-center justify-center">
                        {getGenderIcon(member.gender)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{member.fullName}</h3>
                        {member.nickName && (
                          <p className="text-sm text-gray-600">"{member.nickName}"</p>
                        )}
                      </div>
                    </div>

                    {/* Member Details */}
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
                      {member.bloodGroup && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                          <span>Blood Group: {member.bloodGroup}</span>
                        </div>
                      )}
                      {member.bio && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{member.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Powered by <span className="font-semibold">KnowYourFamilyTree</span>
          </p>
        </div>
      </div>
    </div>
  )
}