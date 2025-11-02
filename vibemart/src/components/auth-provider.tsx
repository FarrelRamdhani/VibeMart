'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { message } from 'antd'
import { User, verifyToken } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('vibemart_token')
    const userStr = localStorage.getItem('vibemart_user')

    if (token && userStr) {
      const verifiedUser = verifyToken(token)
      if (verifiedUser) {
        setUser(verifiedUser)
      } else {
        localStorage.removeItem('vibemart_token')
        localStorage.removeItem('vibemart_user')
        router.push('/')
      }
    }
    setLoading(false)
  }, [router])

  const logout = () => {
    localStorage.removeItem('vibemart_token')
    localStorage.removeItem('vibemart_user')
    setUser(null)
    message.success('Logged out successfully')
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
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