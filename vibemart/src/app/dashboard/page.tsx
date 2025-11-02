'use client'

import { useAuth } from '@/components/auth-provider'
import { Card, Typography, Space } from 'antd'
import { UserRole } from '@prisma/client'

const { Title, Paragraph } = Typography

export default function DashboardPage() {
  const { user } = useAuth()

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.BOOKKEEPER:
        return 'Bookkeeper'
      case UserRole.STORE_CLERK:
        return 'Store Clerk'
      case UserRole.WAREHOUSE_CLERK:
        return 'Warehouse Clerk'
      default:
        return 'Unknown'
    }
  }

  const getWelcomeMessage = (role: UserRole) => {
    switch (role) {
      case UserRole.BOOKKEEPER:
        return 'Access your bookkeeping tools, financial reports, and transaction logs.'
      case UserRole.STORE_CLERK:
        return 'Manage store operations, search products, and process sales.'
      case UserRole.WAREHOUSE_CLERK:
        return 'Manage inventory, add/remove stock, and track warehouse locations.'
      default:
        return 'Welcome to VibeMart Retail Management System.'
    }
  }

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Title level={2}>Welcome to VibeMart</Title>
        <Paragraph>
          Hello, <strong>{user?.username}</strong>! You are logged in as a <strong>{getRoleDisplayName(user?.role || UserRole.STORE_CLERK)}</strong>.
        </Paragraph>
        <Paragraph>
          {getWelcomeMessage(user?.role || UserRole.STORE_CLERK)}
        </Paragraph>
      </Card>

      <Card title="Quick Actions">
        <Space direction="vertical" style={{ width: '100%' }}>
          {user?.role === UserRole.BOOKKEEPER && (
            <>
              <Paragraph>• View transaction logs</Paragraph>
              <Paragraph>• Generate GAAP reports</Paragraph>
              <Paragraph>• Track financial performance</Paragraph>
            </>
          )}
          {user?.role === UserRole.STORE_CLERK && (
            <>
              <Paragraph>• Search products</Paragraph>
              <Paragraph>• Process sales at cashier</Paragraph>
              <Paragraph>• Generate receipts</Paragraph>
            </>
          )}
          {user?.role === UserRole.WAREHOUSE_CLERK && (
            <>
              <Paragraph>• Add new products</Paragraph>
              <Paragraph>• Manage stock levels</Paragraph>
              <Paragraph>• Track warehouse locations</Paragraph>
            </>
          )}
        </Space>
      </Card>
    </Space>
  )
}