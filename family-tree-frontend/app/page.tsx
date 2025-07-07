'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AuthPage from '@/components/auth/AuthPage'
import FamilyTreeBuilder from '@/components/tree/FamilyTreeBuilder'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { FamilyProvider } from '@/contexts/FamilyContext'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

function AppContent() {
  const { user, loading } = useAuth()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <FamilyProvider>
      <FamilyTreeBuilder />
    </FamilyProvider>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}