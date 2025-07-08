'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { familyAPI } from '@/lib/api'
import { useAuth } from './AuthContext'

interface User {
  id: string
  fullName: string
  nickName?: string
  mobile?: string
  email?: string
  imageUrl?: string
  bio?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  bloodGroup?: string
  birthDay?: string
  marriageAnniversary?: string
  rewards?: string
  job?: string
  education?: string
  familyDoctor?: string
  deathAnniversary?: string
  location: number
  isActive: boolean
  relationships?: {
    spouseId?: string
    childrenIds?: string[]
    parentIds?: string[]
    motherId?: string
    fatherId?: string
  }
}

interface Relationship {
  id: string
  fromId: string
  toId: string
  type: 'MOTHER' | 'FATHER' | 'CHILD' | 'SPOUSE'
  createdAt: string
}

interface Family {
  id: string
  name: string
  familyKey: string
  members: User[]
  relationships: Relationship[]
  createdAt: string
  updatedAt: string
}

interface FamilyContextType {
  family: Family | null
  loading: boolean
  createFamily: (name: string) => Promise<void>
  loadFamily: () => Promise<void>
  addMember: (
    userData: any,
    parentId?: string,
    relationshipType?: string
  ) => Promise<void>
  removeMember: (userId: string) => Promise<void>
  updateFamilyName: (name: string) => Promise<void>
  findRootMember: () => User | null
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined)

export const useFamily = () => {
  const context = useContext(FamilyContext)
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider')
  }
  return context
}

interface FamilyProviderProps {
  children: ReactNode
}

export const FamilyProvider: React.FC<FamilyProviderProps> = ({ children }) => {
  const { user } = useAuth()
  const [family, setFamily] = useState<Family | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user?.familyKey) {
      loadFamily()
    }
  }, [user])

  const createFamily = async (name: string) => {
    if (!user) throw new Error('User not authenticated')
    
    setLoading(true)
    try {
      const response = await familyAPI.createFamily(name)
      setFamily(response.data)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create family')
    } finally {
      setLoading(false)
    }
  }

  const loadFamily = async () => {
    if (!user?.familyKey) return
    
    setLoading(true)
    try {
      const response = await familyAPI.getFamily(user.familyKey)
      setFamily(response.data)
    } catch (error: any) {
      console.error('Failed to load family:', error)
      // Don't throw error here as family might not exist yet
    } finally {
      setLoading(false)
    }
  }

  const addMember = async (
    userData: any,
    parentId?: string,
    relationshipType?: string
  ) => {
    if (!user?.familyKey) throw new Error('No family key available')
    
    try {
      console.log('Adding member:', { userData, parentId, relationshipType, familyKey: user.familyKey })
      const response = await familyAPI.addMember(
        user.familyKey,
        userData,
        parentId,
        relationshipType
      )
      
      console.log('Member added successfully:', response.data)
      // Reload family data
      await loadFamily()
    } catch (error: any) {
      console.error('Add member error:', error)
      throw new Error(error.response?.data?.message || error.message || 'Failed to add member')
    }
  }

  const removeMember = async (userId: string) => {
    if (!user?.familyKey) throw new Error('No family key available')
    
    try {
      await familyAPI.removeMember(user.familyKey, userId)
      
      // Reload family data
      await loadFamily()
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove member')
    }
  }

  const updateFamilyName = async (name: string) => {
    if (!user?.familyKey) throw new Error('No family key available')
    
    try {
      await familyAPI.updateFamilyName(user.familyKey, name)
      
      // Update local state
      if (family) {
        setFamily({ ...family, name })
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update family name')
    }
  }

  const findRootMember = (): User | null => {
    if (!family || family.members.length === 0) return null
    
    const activeMembers = family.members.filter(m => m.isActive)
    
    // Find member with no parents (root of the tree)
    const rootMember = activeMembers.find(member => 
      !member.relationships?.parentIds?.length && 
      !member.relationships?.motherId && 
      !member.relationships?.fatherId
    )
    
    return rootMember || activeMembers[0] // Fallback to first member
  }

  const value = {
    family,
    loading,
    createFamily,
    loadFamily,
    addMember,
    removeMember,
    updateFamilyName,
    findRootMember,
  }

  return <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>
}