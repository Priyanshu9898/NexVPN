'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/store/auth'

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      aria-pressed={on}
      style={{
        width: 44,
        height: 24,
        borderRadius: 100,
        background: on ? 'var(--emerald)' : 'var(--elevated)',
        border: `1px solid ${on ? 'var(--emerald-border)' : 'var(--app-border)'}`,
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.2s, border-color 0.2s',
        padding: 0,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: on ? 22 : 3,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: on ? 'var(--bg)' : 'var(--text-2)',
          transition: 'left 0.2s',
        }}
      />
    </button>
  )
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="panel" style={{ padding: 24 }}>
      <h2
        style={{
          fontFamily: 'var(--font-manrope)',
          fontWeight: 700,
          fontSize: 14,
          color: 'var(--text)',
          marginBottom: 20,
          letterSpacing: '0.01em',
        }}
      >
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {children}
      </div>
    </div>
  )
}

// ── Row ───────────────────────────────────────────────────────────────────────

function Row({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-manrope)',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text)',
          }}
        >
          {label}
        </div>
        {description && (
          <div
            style={{
              fontFamily: 'var(--font-manrope)',
              fontSize: 11,
              color: 'var(--text-3)',
              marginTop: 2,
            }}
          >
            {description}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

function RowDivider() {
  return (
    <div
      style={{ height: 1, background: 'var(--app-border)', marginLeft: -24, marginRight: -24 }}
    />
  )
}

// ── Select ────────────────────────────────────────────────────────────────────

function StyledSelect({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: 'var(--elevated)',
        border: '1px solid var(--app-border)',
        borderRadius: 'var(--r-sm)',
        color: 'var(--text)',
        fontFamily: 'var(--font-manrope)',
        fontSize: 12,
        padding: '7px 12px',
        cursor: 'pointer',
        minWidth: 160,
        appearance: 'none',
        WebkitAppearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B6B9A' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
        paddingRight: 28,
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

const PROTOCOLS = [
  { value: 'wireguard', label: 'WireGuard' },
  { value: 'openvpn',   label: 'OpenVPN'   },
]

const DNS_OPTIONS = [
  { value: 'nexvpn',     label: 'NexVPN DNS'        },
  { value: 'cloudflare', label: 'Cloudflare 1.1.1.1' },
  { value: 'custom',     label: 'Custom'             },
]

export default function SettingsPage() {
  const { user } = useAuthStore()

  const email   = user?.email ?? 'user@nexvpn.io'
  const plan    = user?.plan  ?? 'FREE'
  const isFree  = plan === 'FREE'

  // Connection
  const [protocol,     setProtocol]     = useState('wireguard')
  const [killSwitch,   setKillSwitch]   = useState(false)
  const [autoConnect,  setAutoConnect]  = useState(false)

  // Privacy
  const [dns,              setDns]              = useState('nexvpn')
  const [customDns,        setCustomDns]        = useState('')
  const [ipv6Protection,   setIpv6Protection]   = useState(true)

  const isDirty =
    protocol     !== 'wireguard' ||
    killSwitch   !== false       ||
    autoConnect  !== false       ||
    dns          !== 'nexvpn'    ||
    customDns    !== ''          ||
    ipv6Protection !== true

  return (
    <div style={{ padding: 32, maxWidth: 720 }}>
      {/* ── Header ─────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 28,
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-manrope)',
              fontWeight: 800,
              fontSize: 26,
              color: 'var(--text)',
            }}
          >
            Settings
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-manrope)',
              fontSize: 13,
              color: 'var(--text-2)',
              marginTop: 4,
            }}
          >
            Manage your connection, privacy, and account.
          </p>
        </div>

        <motion.button
          className="btn-primary"
          disabled={!isDirty}
          whileHover={isDirty ? { scale: 1.02 } : {}}
          whileTap={isDirty ? { scale: 0.98 } : {}}
          style={{
            fontSize: 13,
            padding: '10px 20px',
            opacity: isDirty ? 1 : 0.35,
            cursor: isDirty ? 'pointer' : 'not-allowed',
          }}
        >
          Save changes
        </motion.button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* ── Connection ────────────────────────────────── */}
        <Section title="Connection">
          <Row label="Protocol" description="Encryption protocol for your VPN tunnel">
            <StyledSelect value={protocol} onChange={setProtocol} options={PROTOCOLS} />
          </Row>

          <RowDivider />

          <Row label="Kill switch" description="Block all traffic if the VPN drops unexpectedly">
            <Toggle on={killSwitch} onChange={() => setKillSwitch((v) => !v)} />
          </Row>

          <RowDivider />

          <Row label="Auto-connect" description="Connect automatically when the app launches">
            <Toggle on={autoConnect} onChange={() => setAutoConnect((v) => !v)} />
          </Row>
        </Section>

        {/* ── Privacy ───────────────────────────────────── */}
        <Section title="Privacy">
          <Row label="DNS resolver" description="Controls which DNS service resolves your requests">
            <StyledSelect value={dns} onChange={setDns} options={DNS_OPTIONS} />
          </Row>

          {dns === 'custom' && (
            <Row label="Custom DNS address">
              <input
                type="text"
                value={customDns}
                onChange={(e) => setCustomDns(e.target.value)}
                placeholder="e.g. 8.8.8.8"
                style={{
                  background: 'var(--elevated)',
                  border: '1px solid var(--app-border)',
                  borderRadius: 'var(--r-sm)',
                  color: 'var(--text)',
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: 12,
                  padding: '7px 12px',
                  width: 160,
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--violet-border)' }}
                onBlur={(e)  => { e.currentTarget.style.borderColor = 'var(--app-border)'    }}
              />
            </Row>
          )}

          <RowDivider />

          <Row label="IPv6 leak protection" description="Prevent IPv6 address exposure through the tunnel">
            <Toggle on={ipv6Protection} onChange={() => setIpv6Protection((v) => !v)} />
          </Row>
        </Section>

        {/* ── Account ───────────────────────────────────── */}
        <Section title="Account">
          <Row label="Email address">
            <span
              style={{
                fontFamily: 'var(--font-manrope)',
                fontSize: 13,
                color: 'var(--text-2)',
              }}
            >
              {email}
            </span>
          </Row>

          <RowDivider />

          <Row label="Plan">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                className={isFree ? 'badge badge-amber' : 'badge badge-violet'}
                style={{ fontSize: 9 }}
              >
                {plan}
              </span>
              {isFree && (
                <button
                  className="btn-primary"
                  style={{ fontSize: 12, padding: '6px 14px', borderRadius: 'var(--r-sm)' }}
                >
                  Upgrade to Pro
                </button>
              )}
            </div>
          </Row>

          <RowDivider />

          <Row label="Password">
            <button
              className="btn-ghost"
              style={{ fontSize: 12, padding: '7px 14px', borderRadius: 'var(--r-sm)' }}
            >
              Change password
            </button>
          </Row>
        </Section>

        {/* ── Danger zone ───────────────────────────────── */}
        <Section title="Danger zone">
          <Row
            label="Delete account"
            description="Permanently remove your account and all associated data. This cannot be undone."
          >
            <button
              style={{
                fontFamily: 'var(--font-manrope)',
                fontSize: 12,
                fontWeight: 600,
                padding: '7px 14px',
                borderRadius: 'var(--r-sm)',
                background: 'transparent',
                color: 'var(--rose)',
                border: '1px solid var(--rose-border)',
                cursor: 'pointer',
                transition: 'background 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--rose-dim)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'     }}
            >
              Delete account
            </button>
          </Row>
        </Section>

      </div>
    </div>
  )
}
