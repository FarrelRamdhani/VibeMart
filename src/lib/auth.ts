import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UserRole } from '@prisma/client'

export interface User {
  id: string
  username: string
  role: UserRole
}

export interface LoginCredentials {
  username: string
  password: string
  role: UserRole
}

const JWT_SECRET = 'vibemart-jwt-secret-key-2024'

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  // Hardcoded credentials for testing
  const credentials = [
    {
      username: 'bookkeeper',
      password: 'password123',
      role: UserRole.BOOKKEEPER
    },
    {
      username: 'storeclerk',
      password: 'password123',
      role: UserRole.STORE_CLERK
    },
    {
      username: 'warehouseclerk',
      password: 'password123',
      role: UserRole.WAREHOUSE_CLERK
    }
  ]

  const user = credentials.find(cred => cred.username === username)
  
  if (!user) {
    return null
  }

  // Direct password comparison for demo purposes
  const isPasswordValid = password === user.password
  
  if (isPasswordValid) {
    return {
      id: user.username,
      username: user.username,
      role: user.role
    }
  }

  return null
}

export function generateToken(user: User): string {
  return jwt.sign(
    { 
      id: user.id,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    }
  } catch (error) {
    return null
  }
}