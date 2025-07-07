'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'
import { authAPI } from '@/lib/api'

interface User {
  username: string
  familyName?: string
  familyKey?: string
  token: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: { username: string; password: string }) => Promise<void>
  register: (data: {
    username: string
    password: string
    email?: string
    mobile?: string
  }) => Promise<void>
  googleSignIn: () => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const token = Cookies.get('auth_token')
    const userData = Cookies.get('user_data')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser({ ...parsedUser, token })
      } catch (error) {
        console.error('Error parsing user data:', error)
        Cookies.remove('auth_token')
        Cookies.remove('user_data')
      }
    }
    
    setLoading(false)
  }, [])

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await authAPI.login(credentials)
      const { token, username, familyName, familyKey } = response.data
      
      const userData = { username, familyName, familyKey }
      
      // Store in cookies
      Cookies.set('auth_token', token, { expires: 30 }) // 30 days
      Cookies.set('user_data', JSON.stringify(userData), { expires: 30 })
      
      setUser({ ...userData, token })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  const register = async (data: {
    username: string
    password: string
    email?: string
    mobile?: string
  }) => {
    try {
      const response = await authAPI.register(data)
      const { token, username, familyName, familyKey } = response.data
      
      const userData = { username, familyName, familyKey }
      
      // Store in cookies
      Cookies.set('auth_token', token, { expires: 30 })
      Cookies.set('user_data', JSON.stringify(userData), { expires: 30 })
      
      setUser({ ...userData, token })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed')
    }
  }

  const googleSignIn = async () => {
    try {
      // Mock Google sign-in for now
      const response = await authAPI.googleSignIn('mock-google-token')
      const { token, username, familyName, familyKey } = response.data
      
      const userData = { username, familyName, familyKey }
      
      // Store in cookies
      Cookies.set('auth_token', token, { expires: 30 })
      Cookies.set('user_data', JSON.stringify(userData), { expires: 30 })
      
      setUser({ ...userData, token })
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Google sign-in failed')
    }
  }

  const logout = () => {
    Cookies.remove('auth_token')
    Cookies.remove('user_data')
    setUser(null)
    
    // Call logout API
    authAPI.logout().catch(console.error)
  }

  const value = {
    user,
    loading,
    login,
    register,
    googleSignIn,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}