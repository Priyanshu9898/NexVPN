'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Globe, Activity, Settings } from 'lucide-react'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/servers',   label: 'Servers',   icon: Globe },
  { href: '/activity',  label: 'Activity',  icon: Activity },
  { href: '/settings',  label: 'Settings',  icon: Settings },
]

// Hardcoded as disconnected for now — will be driven by global VPN state later
const IS_CONNECTED = false
const USER_EMAIL   = 'user@nexvpn.io'
const USER_PLAN    = 'FREE'
const USER_INITIALS = 'NX'

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="flex flex-col"
      style={{
        width: '240px',
        minHeight: '100vh',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--cyan-border)',
        flexShrink: 0,
      }}
    >
      {/* ── Logo ─────────────────────────────────────────── */}
      <div
        className="flex flex-col gap-3"
        style={{
          padding: '28px 20px 20px',
          borderBottom: '1px solid var(--cyan-border)',
        }}
      >
        <div className="flex items-center justify-between">
          <span
            className="font-display tracking-widest"
            style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '0.12em' }}
          >
            <span style={{ color: 'var(--cyan)' }}>NEX</span>
            <span style={{ color: 'var(--text-muted)' }}>VPN</span>
          </span>
          <span
            className="font-data"
            style={{
              fontSize: '9px',
              color: 'var(--text-muted)',
              background: 'var(--bg-overlay)',
              border: '1px solid var(--cyan-border)',
              borderRadius: '4px',
              padding: '2px 6px',
              letterSpacing: '0.05em',
            }}
          >
            v1.0
          </span>
        </div>

        {/* Connection status indicator */}
        <div className="flex items-center gap-2">
          <span className="status-dot" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <span
              style={{
                display: 'block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: IS_CONNECTED ? 'var(--green)' : 'var(--red)',
                boxShadow: IS_CONNECTED
                  ? '0 0 6px var(--green)'
                  : '0 0 6px var(--red)',
                animation: IS_CONNECTED ? 'pulse-ring 2s ease-out infinite' : undefined,
                flexShrink: 0,
              }}
            />
          </span>
          <span
            className="font-data uppercase"
            style={{
              fontSize: '9px',
              letterSpacing: '0.15em',
              color: IS_CONNECTED ? 'var(--green)' : 'var(--red)',
            }}
          >
            {IS_CONNECTED ? 'CONNECTED' : 'DISCONNECTED'}
          </span>
        </div>
      </div>

      {/* ── Navigation ───────────────────────────────────── */}
      <nav className="flex flex-col" style={{ flex: 1, padding: '16px 12px', gap: '2px' }}>
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname?.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 transition-all duration-150 font-display"
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: isActive ? 600 : 500,
                letterSpacing: '0.08em',
                color: isActive ? 'var(--cyan)' : 'var(--text-secondary)',
                background: isActive ? 'var(--bg-overlay)' : 'transparent',
                border: isActive ? '1px solid var(--cyan-border)' : '1px solid transparent',
                textDecoration: 'none',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.background = 'var(--bg-overlay)'
                  el.style.color = 'var(--cyan)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.background = 'transparent'
                  el.style.color = 'var(--text-secondary)'
                }
              }}
            >
              {/* Active accent line */}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '2px',
                    height: '60%',
                    background: 'var(--cyan)',
                    borderRadius: '0 2px 2px 0',
                    boxShadow: '0 0 8px var(--cyan)',
                  }}
                />
              )}
              <Icon
                size={15}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{ color: isActive ? 'var(--cyan)' : 'var(--text-secondary)', flexShrink: 0 }}
              />
              <span style={{ paddingLeft: '2px' }}>{label.toUpperCase()}</span>
            </Link>
          )
        })}
      </nav>

      {/* ── User Info ────────────────────────────────────── */}
      <div
        style={{
          padding: '16px 12px',
          borderTop: '1px solid var(--cyan-border)',
        }}
      >
        <div
          className="flex items-center gap-3"
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--cyan-border)',
          }}
        >
          {/* Avatar initials circle */}
          <div
            className="font-display flex items-center justify-center"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              background: 'var(--bg-overlay)',
              border: '1px solid var(--cyan-border)',
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--cyan)',
              letterSpacing: '0.05em',
              flexShrink: 0,
            }}
          >
            {USER_INITIALS}
          </div>

          {/* Email + plan */}
          <div className="flex flex-col min-w-0" style={{ gap: '2px' }}>
            <span
              className="font-sans"
              style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '110px',
              }}
            >
              {USER_EMAIL}
            </span>
            <span
              className="font-data uppercase"
              style={{
                fontSize: '8px',
                letterSpacing: '0.15em',
                color: 'var(--amber)',
                background: 'rgba(240,165,0,0.08)',
                border: '1px solid rgba(240,165,0,0.2)',
                borderRadius: '3px',
                padding: '1px 5px',
                alignSelf: 'flex-start',
              }}
            >
              {USER_PLAN}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
