'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import PublicTreeView from '@/components/public/PublicTreeView'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorPage from '@/components/ui/ErrorPage'

export default function PublicFamilyPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const token = params.token as string

  useEffect(() => {
    if (!token) {
      setError('Invalid family tree link')
      setLoading(false)
      return
    }

    // Validate token format (basic check)
    if (token.length < 10) {
      setError('Invalid family tree token')
      setLoading(false)
      return
    }

    setLoading(false)
  }, [token])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <ErrorPage 
        title="Invalid Link"
        message={error}
        onGoHome={() => router.push('/')}
      />
    )
  }

  return <PublicTreeView token={token} />
}