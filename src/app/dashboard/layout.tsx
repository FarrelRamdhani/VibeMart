'use client'

import { AuthProvider } from '@/components/auth-provider'
import DashboardLayout from './dashboard-layout'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthProvider>
  )
}