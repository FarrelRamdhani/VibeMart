'use client'

import { useState } from 'react'
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd'
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  BookOutlined, 
  ShopOutlined, 
  ShoppingCartOutlined, 
  WarehouseOutlined,
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import { useAuth } from '@/components/auth-provider'
import { UserRole } from '@prisma/client'
import { useRouter, usePathname } from 'next/navigation'

const { Header, Sider, Content } = Layout

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const getMenuItems = () => {
    const items = []

    if (user?.role === UserRole.BOOKKEEPER) {
      items.push({
        key: '/dashboard/bookkeeping',
        icon: <BookOutlined />,
        label: 'Bookkeeping',
      })
    }

    if (user?.role === UserRole.STORE_CLERK) {
      items.push({
        key: '/dashboard/store',
        icon: <ShopOutlined />,
        label: 'Store',
      })
    }

    if (user?.role === UserRole.WAREHOUSE_CLERK) {
      items.push({
        key: '/dashboard/warehouse',
        icon: <WarehouseOutlined />,
        label: 'Warehouse',
      })
    }

    if (user?.role === UserRole.STORE_CLERK) {
      items.push({
        key: '/dashboard/cashier',
        icon: <ShoppingCartOutlined />,
        label: 'Cashier',
      })
    }

    return items
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: logout,
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key)
  }

  return (
    <Layout className="main-layout">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          {collapsed ? 'VM' : 'VibeMart'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={getMenuItems()}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Space style={{ marginRight: 24 }}>
            <span>Welcome, {user?.username}</span>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
            </Dropdown>
          </Space>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: 6,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}