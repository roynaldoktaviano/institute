'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('lms_token')
    const savedUser = localStorage.getItem('lms_user')
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
      validateToken(savedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const validateToken = async (tokenToValidate: string) => {
    try {
      const response = await fetch('https://roynaldkalele.com/wp-json/jwt-auth/v1/token/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenToValidate}`
        }
      })

      if (!response.ok) {
        throw new Error('Token validation failed')
      }

      // Fetch user profile
      const userResponse = await fetch('https://roynaldkalele.com/wp-json/wp/v2/users/me', {
        headers: {
          'Authorization': `Bearer ${tokenToValidate}`
        }
      })

      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData)
        localStorage.setItem('lms_user', JSON.stringify(userData))
      }
    } catch (error) {
      console.error('Token validation error:', error)
      logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for username:', username)
      
      const response = await fetch('https://roynaldkalele.com/wp-json/jwt-auth/v1/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        })
      })

      console.log('Login response status:', response.status)
      console.log('Login response ok:', response.ok)

      if (!response.ok) {
        const errorData = await response.text()
        console.log('Login error response:', errorData)
        
        let errorMessage = 'Login failed'
        if (response.status === 400) {
          errorMessage = 'Invalid username or password format'
        } else if (response.status === 403) {
          errorMessage = 'Access denied. Please check your credentials.'
        } else if (response.status === 404) {
          errorMessage = 'Login service not available'
        } else if (response.status === 500) {
          errorMessage = 'Server error. Please try again later.'
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('Login response data:', data)
      
      const { token: newToken, user_email, user_display_name } = data

      if (!newToken) {
        throw new Error('No token received from server')
      }

      // Fetch user profile
      console.log('Fetching user profile...')
      const userResponse = await fetch('https://roynaldkalele.com/wp-json/wp/v2/users/me', {
        headers: {
          'Authorization': `Bearer ${newToken}`
        }
      })

      console.log('User profile response status:', userResponse.status)

      if (userResponse.ok) {
        const userData = await userResponse.json()
        console.log('User profile data:', userData)
        
        setToken(newToken)
        setUser(userData)
        localStorage.setItem('lms_token', newToken)
        localStorage.setItem('lms_user', JSON.stringify(userData))
        return true
      } else {
        const userError = await userResponse.text()
        console.log('User profile error:', userError)
        
        // If user profile fails but we have token, still consider login successful
        // and create a basic user object from the login response
        const basicUser = {
          id: 0,
          name: user_display_name || username,
          email: user_email || '',
          roles: ['subscriber']
        }
        
        setToken(newToken)
        setUser(basicUser)
        localStorage.setItem('lms_token', newToken)
        localStorage.setItem('lms_user', JSON.stringify(basicUser))
        return true
      }

    } catch (error) {
      console.error('Login error:', error)
      throw error // Re-throw to let the login page handle it
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('lms_token')
    localStorage.removeItem('lms_user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}