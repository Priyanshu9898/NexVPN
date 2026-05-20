'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Users, Server, FileText, CreditCard, Shield, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

const navItems = [
  { href: '/admin/users',         label: 'Users',         icon: Users },
  { href: '/admin/nodes',         label: 'Nodes',         icon: Server },
  { href: '/admin/audit-logs',    label: 'Audit Logs',    icon: FileText },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, user } = useAuthStore()

  const handleLogout = () => { logout(); router.push('/login') }

  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      background: 'rgba(8,12,20,0.95)',
      borderRight: '1px solid rgba(0,212,255,0.08)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 24px 24px', borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Shield size={18} color="#00D4FF" />
          <span className="font-display font-bold" style={{ color: 'var(--text-primary)', fontSize: 16 }}>
            <span style={{ color: 'var(--cyan)' }}>NEX</span>VPN
          </span>
        </div>
        <span className="font-data" style={{ fontSize: 9, letterSpacing: '0.14em', color: 'var(--amber)', textTransform: 'uppercase' }}>
          Admin Panel
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8, marginBottom: 4,
                background: active ? 'rgba(0,212,255,0.08)' : 'transparent',
                border: active ? '1px solid rgba(0,212,255,0.15)' : '1px solid transparent',
                color: active ? 'var(--cyan)' : 'var(--text-secondary)',
                textDecoration: 'none', fontSize: 14,
                fontFamily: 'var(--font-outfit)',
                transition: 'all 0.15s',
              }}>
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(0,212,255,0.08)' }}>
        <p className="font-data" style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '0.08em' }}>
          Signed in as
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'var(--font-outfit)', marginBottom: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.email}
        </p>
        <button onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'none', border: '1px solid rgba(255,68,85,0.2)',
            borderRadius: 8, padding: '8px 12px', cursor: 'pointer',
            color: '#FF4455', fontSize: 13, fontFamily: 'var(--font-outfit)',
            width: '100%',
          }}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
