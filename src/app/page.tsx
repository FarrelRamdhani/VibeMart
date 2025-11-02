'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form, Input, Button, Card, Select, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { authenticateUser, generateToken, User } from '@/lib/auth'
import { UserRole } from '@prisma/client'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('vibemart_token')
    if (token) {
      router.push('/dashboard')
    }
  }, [router])

  const onFinish = async (values: { username: string; password: string; role: UserRole }) => {
    setLoading(true)
    try {
      const user = await authenticateUser(values.username, values.password)
      
      if (user && user.role === values.role) {
        const token = generateToken(user)
        localStorage.setItem('vibemart_token', token)
        localStorage.setItem('vibemart_user', JSON.stringify(user))
        message.success('Login successful!')
        router.push('/dashboard')
      } else {
        if (!user) {
          message.error('Invalid username or password')
        } else {
          message.error('Role mismatch')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      message.error('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <Card className="login-card" title="VibeMart Login" variant="borderless">
        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select your role!' }]}
          >
            <Select placeholder="Select your role">
              <Select.Option value={UserRole.BOOKKEEPER}>Bookkeeper</Select.Option>
              <Select.Option value={UserRole.STORE_CLERK}>Store Clerk</Select.Option>
              <Select.Option value={UserRole.WAREHOUSE_CLERK}>Warehouse Clerk</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}