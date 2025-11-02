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

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const credentials = [
    {
      username: process.env.BOOKKEEPER_CREDENTIALS?.split(':')[0] || 'bookkeeper',
      password: process.env.BOOKKEEPER_CREDENTIALS?.split(':')[1] || 'password123',
      role: UserRole.BOOKKEEPER
    },
    {
      username: process.env.STORE_CLERK_CREDENTIALS?.split(':')[0] || 'storeclerk',
      password: process.env.STORE_CLERK_CREDENTIALS?.split(':')[1] || 'password123',
      role: UserRole.STORE_CLERK
    },
    {
      username: process.env.WAREHOUSE_CLERK_CREDENTIALS?.split(':')[0] || 'warehouseclerk',
      password: process.env.WAREHOUSE_CLERK_CREDENTIALS?.split(':')[1] || 'password123',
      role: UserRole.WAREHOUSE_CLERK
    }
  ]

  const user = credentials.find(cred => cred.username === username)
  
  if (!user) {
    return null
  }

  const isPasswordValid = await bcrypt.compare(password, await bcrypt.hash(user.password, 10))
  
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