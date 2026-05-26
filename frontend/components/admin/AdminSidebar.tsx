'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutGrid, Users, Server, FileText, CreditCard, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

const navItems = [
  { href: '/dashboard',           label: 'Dashboard',     icon: LayoutGrid },
  { href: '/admin/users',         label: 'Users',         icon: Users },
  { href: '/admin/nodes',         label: 'Nodes',         icon: Server },
  { href: '/admin/audit-logs',    label: 'Audit Logs',    icon: FileText },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, user } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <aside
      style={{
        width: 240,
        minHeight: '100vh',
        background: 'var(--surface)',
        borderRight: '1px solid var(--app-border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Logo block */}
      <div
        style={{
          padding: '28px 24px 24px',
          borderBottom: '1px solid var(--app-border)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-manrope)',
            fontWeight: 800,
            fontSize: 20,
            letterSpacing: '-0.02em',
            lineHeight: 1,
            marginBottom: 8,
          }}
        >
          <span style={{ color: 'var(--violet)' }}>NEX</span>
          <span style={{ color: 'var(--text-3)' }}>VPN</span>
        </div>
        <span
          className="badge badge-rose"
          style={{ fontSize: 9, letterSpacing: '0.14em' }}
        >
          ADMIN
        </span>
        <div
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: 10,
            color: 'var(--text-3)',
            marginTop: 6,
            letterSpacing: '0.08em',
          }}
        >
          v2.0
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 'var(--r-md)',
                marginBottom: 2,
                background: active ? 'var(--violet-dim)' : 'transparent',
                border: active
                  ? '1px solid var(--violet-border)'
                  : '1px solid transparent',
                color: active ? 'var(--violet-2)' : 'var(--text-2)',
                textDecoration: 'none',
                fontSize: 13,
                fontFamily: 'var(--font-manrope)',
                fontWeight: active ? 600 : 400,
                transition: 'all 0.15s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Left accent bar */}
              {active && (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '20%',
                    bottom: '20%',
                    width: 2,
                    background: 'var(--violet)',
                    borderRadius: '0 2px 2px 0',
                    boxShadow: '0 0 8px var(--violet-glow)',
                  }}
                />
              )}
              <Icon
                size={15}
                style={{ opacity: active ? 1 : 0.6, flexShrink: 0 }}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User card + logout */}
      <div
        style={{
          padding: '16px 16px 20px',
          borderTop: '1px solid var(--app-border)',
        }}
      >
        {/* User info card */}
        <div
          style={{
            background: 'var(--elevated)',
            border: '1px solid var(--app-border)',
            borderRadius: 'var(--r-md)',
            padding: '12px 14px',
            marginBottom: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-manrope)',
                fontWeight: 600,
                fontSize: 12,
                color: 'var(--text)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: 120,
              }}
            >
              {user?.name ?? 'Admin'}
            </span>
            <span className="badge badge-rose" style={{ fontSize: 9 }}>
              ADMIN
            </span>
          </div>
          <p
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: 10,
              color: 'var(--text-3)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.email}
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            background: 'transparent',
            border: '1px solid var(--rose-border)',
            borderRadius: 'var(--r-md)',
            padding: '9px 14px',
            cursor: 'pointer',
            color: 'var(--rose)',
            fontSize: 13,
            fontFamily: 'var(--font-manrope)',
            fontWeight: 500,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.background = 'var(--rose-dim)'
            el.style.borderColor = 'var(--rose)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.background = 'transparent'
            el.style.borderColor = 'var(--rose-border)'
          }}
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
