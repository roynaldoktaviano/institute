'use client'

import * as React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: number
  name: string
  email: string
  roles: string[]
  avatar_urls?: {
    [key: string]: string
  }
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('lms_token')
    const savedUser = localStorage.getItem('lms_user')
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('https://roynaldkalele.com/wp-json/jwt-auth/v1/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const data = await response.json()

      if (data.token) {
        setToken(data.token)
        localStorage.setItem('lms_token', data.token)

        const profileResponse = await fetch('https://roynaldkalele.com/wp-json/wp/v2/users/me', {
          headers: {
            'Authorization': `Bearer ${data.token}`,
          },
        })

        const profileData = await profileResponse.json()
        
        if (profileData.id) {
          const userData: User = {
            id: profileData.id,
            name: profileData.name,
            email: profileData.email,
            roles: profileData.roles,
            avatar_urls: profileData.avatar_urls,
          }
          setUser(userData)
          localStorage.setItem('lms_user', JSON.stringify(userData))
        }

        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('lms_token')
    localStorage.removeItem('lms_user')
  }

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isLoading
  }

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}