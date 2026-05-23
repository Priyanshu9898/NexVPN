'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, accessToken } = useAuthStore()

  useEffect(() => {
    if (!accessToken || !user) { router.replace('/login'); return }
    if (user.role !== 'ADMIN') { router.replace('/dashboard') }
  }, [accessToken, user, router])

  if (!user || user.role !== 'ADMIN') return null

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
