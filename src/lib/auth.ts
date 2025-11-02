import bcrypt from 'bcryptjs'
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

const JWT_SECRET = '48fab8c24e990345483208d8270fab79809803bdd006dcdf20353f5eaa95a0cf352ed519439e3c5b53779b1ebf90ca2932db251d6c6fb3c95383419e29f238b4'

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
  // Create a simple token using base64 encoding for browser compatibility
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours expiration
  }
  
  // Simple encoding - not as secure as JWT but works in browser
  const tokenData = JSON.stringify(payload)
  const encoded = btoa(tokenData)
  
  // Add a simple signature using the secret
  const signature = btoa(encoded + JWT_SECRET)
  
  return `${encoded}.${signature}`
}

export function verifyToken(token: string): User | null {
  try {
    const [encoded, signature] = token.split('.')
    
    // Verify signature
    const expectedSignature = btoa(encoded + JWT_SECRET)
    if (signature !== expectedSignature) {
      return null
    }
    
    // Decode payload
    const payload = JSON.parse(atob(encoded))
    
    // Check expiration
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    
    return {
      id: payload.id,
      username: payload.username,
      role: payload.role
    }
  } catch (error) {
    return null
  }
}