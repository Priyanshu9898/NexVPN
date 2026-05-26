'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutGrid, Server, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/auth'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/servers',   label: 'Servers',   icon: Server },
  { href: '/settings',  label: 'Settings',  icon: Settings },
]

function getInitials(name: string | undefined): string {
  if (!name) return 'NX'
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function Sidebar() {
  const pathname  = usePathname()
  const router    = useRouter()
  const { user, logout } = useAuthStore()

  const email    = user?.email ?? 'user@nexvpn.io'
  const plan     = user?.plan  ?? 'FREE'
  const initials = getInitials(user?.name)
  const isPro    = plan !== 'FREE'

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <aside
      style={{
        width: 220,
        height: '100%',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--surface)',
        borderRight: '1px solid var(--app-border)',
      }}
    >
      {/* ── Logo ─────────────────────────────── */}
      <div
        style={{
          padding: '24px 18px 20px',
          borderBottom: '1px solid var(--app-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-manrope)',
            fontWeight: 800,
            fontSize: 15,
            letterSpacing: '0.02em',
          }}
        >
          <span style={{ color: 'var(--violet)' }}>NEX</span>
          <span style={{ color: 'var(--text-3)' }}>VPN</span>
        </span>
        <span
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: 9,
            color: 'var(--text-3)',
            background: 'var(--elevated)',
            border: '1px solid var(--app-border)',
            borderRadius: 4,
            padding: '2px 6px',
            letterSpacing: '0.04em',
          }}
        >
          v2.0
        </span>
      </div>

      {/* ── Navigation ───────────────────────── */}
      <nav
        style={{
          flex: 1,
          padding: '14px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname?.startsWith(href)

          return (
            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={isActive ? {} : { x: 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 'var(--r-md)',
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: 'var(--font-manrope)',
                  letterSpacing: '0.01em',
                  color: isActive ? 'var(--violet-2)' : 'var(--text-2)',
                  background: isActive ? 'var(--violet-dim)' : 'transparent',
                  border: `1px solid ${isActive ? 'var(--violet-border)' : 'transparent'}`,
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'color 0.15s, background 0.15s, border-color 0.15s',
                }}
              >
                {/* Active accent bar */}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 2,
                      height: '60%',
                      background: 'var(--violet)',
                      borderRadius: '0 2px 2px 0',
                      boxShadow: '0 0 8px var(--violet-glow)',
                    }}
                  />
                )}
                <Icon
                  size={15}
                  strokeWidth={isActive ? 2.2 : 1.8}
                  style={{ color: isActive ? 'var(--violet)' : 'var(--text-2)', flexShrink: 0 }}
                />
                {label}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* ── User + Logout ─────────────────────── */}
      <div
        style={{
          padding: '12px 10px',
          borderTop: '1px solid var(--app-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {/* User card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 12px',
            borderRadius: 'var(--r-md)',
            background: 'var(--elevated)',
            border: '1px solid var(--app-border)',
          }}
        >
          {/* Avatar circle */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--violet-dim)',
              border: '1px solid var(--violet-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-manrope)',
              fontWeight: 700,
              fontSize: 11,
              color: 'var(--violet-2)',
              flexShrink: 0,
            }}
          >
            {initials}
          </div>

          {/* Email + plan */}
          <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <span
              style={{
                fontFamily: 'var(--font-manrope)',
                fontSize: 11,
                color: 'var(--text-2)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 108,
              }}
            >
              {email}
            </span>
            <span
              className={isPro ? 'badge badge-violet' : 'badge badge-amber'}
              style={{ fontSize: 8, padding: '1px 6px', borderRadius: 4, alignSelf: 'flex-start' }}
            >
              {plan}
            </span>
          </div>
        </div>

        {/* Logout */}
        <motion.button
          onClick={handleLogout}
          whileHover={{ backgroundColor: 'rgba(255,51,102,0.08)' }}
          transition={{ duration: 0.15 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            width: '100%',
            padding: '9px 12px',
            borderRadius: 'var(--r-md)',
            fontFamily: 'var(--font-manrope)',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text-3)',
            background: 'transparent',
            border: '1px solid transparent',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'color 0.15s, border-color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--rose)'
            e.currentTarget.style.borderColor = 'var(--rose-border)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-3)'
            e.currentTarget.style.borderColor = 'transparent'
          }}
        >
          <LogOut size={14} strokeWidth={1.8} style={{ flexShrink: 0 }} />
          Sign out
        </motion.button>
      </div>
    </aside>
  )
}
