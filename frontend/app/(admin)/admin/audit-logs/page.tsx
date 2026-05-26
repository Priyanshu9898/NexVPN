'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Shield, Settings, Activity } from 'lucide-react'

interface AuditLog {
  id: string
  action: string
  userId: string
  userEmail: string
  ip: string
  timestamp: string
  details: string
}

const MOCK_LOGS: AuditLog[] = [
  { id: 'l1', action: 'USER_LOGIN',         userId: 'u1', userEmail: 'alice@example.com',  ip: '192.168.1.1',   timestamp: '2026-05-25 14:32:01', details: 'Login via email/password' },
  { id: 'l2', action: 'USER_REGISTER',      userId: 'u5', userEmail: 'eve@example.com',    ip: '10.0.0.55',     timestamp: '2026-05-25 13:15:44', details: 'New user registration' },
  { id: 'l3', action: 'PLAN_UPGRADED',      userId: 'u2', userEmail: 'bob@example.com',    ip: '172.16.0.12',   timestamp: '2026-05-25 11:08:22', details: 'FREE → PRO upgrade' },
  { id: 'l4', action: 'PEER_CREATED',       userId: 'u1', userEmail: 'alice@example.com',  ip: '192.168.1.1',   timestamp: '2026-05-25 10:44:18', details: 'WireGuard peer provisioned: Frankfurt' },
  { id: 'l5', action: 'USER_SUSPENDED',     userId: 'u4', userEmail: 'david@example.com',  ip: '10.1.2.3',      timestamp: '2026-05-25 09:22:55', details: 'Account suspended by admin' },
  { id: 'l6', action: 'PASSWORD_RESET',     userId: 'u3', userEmail: 'carol@example.com',  ip: '198.51.100.42', timestamp: '2026-05-24 22:11:30', details: 'Password reset via email token' },
  { id: 'l7', action: 'GOOGLE_OAUTH_LOGIN', userId: 'u6', userEmail: 'frank@example.com',  ip: '203.0.113.5',   timestamp: '2026-05-24 18:55:12', details: 'OAuth login via Google' },
  { id: 'l8', action: 'NODE_RESTART',       userId: 'u3', userEmail: 'carol@example.com',  ip: '10.0.0.1',      timestamp: '2026-05-24 15:30:00', details: 'Node Tokyo-JP-01 restarted' },
]

const AUTH_ACTIONS = new Set(['USER_LOGIN', 'USER_REGISTER', 'GOOGLE_OAUTH_LOGIN', 'PASSWORD_RESET'])
const ADMIN_ACTIONS = new Set(['USER_SUSPENDED', 'NODE_RESTART', 'PLAN_UPGRADED', 'PEER_CREATED'])

type FilterType = 'all' | 'auth' | 'admin'

function getActionBadgeClass(action: string): string {
  if (action === 'USER_SUSPENDED') return 'badge badge-rose'
  if (['PLAN_UPGRADED', 'PEER_CREATED'].includes(action)) return 'badge badge-violet'
  if (action === 'NODE_RESTART') return 'badge badge-amber'
  return 'badge badge-emerald'
}

const STATS = [
  { label: 'Total Events', value: '8', sub: 'all time',       icon: FileText,  color: 'var(--text-2)',   dim: 'var(--elevated)',    border: 'var(--app-border)' },
  { label: 'Today',        value: '5', sub: 'events today',   icon: Activity,  color: 'var(--violet-2)', dim: 'var(--violet-dim)',  border: 'var(--violet-border)' },
  { label: 'Auth Events',  value: '4', sub: 'login / access', icon: Shield,    color: 'var(--emerald)',  dim: 'var(--emerald-dim)', border: 'var(--emerald-border)' },
  { label: 'Admin Actions',value: '3', sub: 'privileged ops', icon: Settings,  color: 'var(--amber)',    dim: 'var(--amber-dim)',   border: 'var(--amber-border)' },
]

export default function AdminAuditLogsPage() {
  const [filter, setFilter] = useState<FilterType>('all')

  const filtered = MOCK_LOGS.filter((log) => {
    if (filter === 'auth') return AUTH_ACTIONS.has(log.action)
    if (filter === 'admin') return ADMIN_ACTIONS.has(log.action)
    return true
  })

  return (
    <div style={{ padding: 32, minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 32,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-manrope)',
              fontWeight: 800,
              fontSize: 28,
              color: 'var(--text)',
              letterSpacing: '-0.02em',
            }}
          >
            Audit Logs
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 4 }}>
            Immutable activity trail across all accounts and infrastructure
          </p>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}
      >
        {STATS.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: 'var(--surface)',
              border: `1px solid ${stat.border}`,
              borderRadius: 'var(--r-lg)',
              padding: '18px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 'var(--r-md)',
                background: stat.dim,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <stat.icon size={17} color={stat.color} />
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-manrope)',
                  fontWeight: 800,
                  fontSize: 24,
                  color: stat.color,
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Filter pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ display: 'flex', gap: 6, marginBottom: 20 }}
      >
        {(['all', 'auth', 'admin'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 18px',
              borderRadius: 100,
              fontSize: 12,
              fontFamily: 'var(--font-manrope)',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1px solid',
              textTransform: 'capitalize',
              transition: 'all 0.15s ease',
              borderColor: filter === f ? 'var(--violet-border)' : 'var(--app-border)',
              background: filter === f ? 'var(--violet-dim)' : 'transparent',
              color: filter === f ? 'var(--violet-2)' : 'var(--text-2)',
            }}
          >
            {f === 'all' ? 'All Events' : f === 'auth' ? 'Auth' : 'Admin'}
          </button>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="panel"
        style={{ overflow: 'hidden' }}
      >
        <table className="data-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>User</th>
              <th>IP Address</th>
              <th>Timestamp</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {filtered.map((log, i) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                >
                  <td>
                    <span className={getActionBadgeClass(log.action)}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: 11,
                        color: 'var(--text-2)',
                      }}
                    >
                      {log.userEmail}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: 11,
                        color: 'var(--text-3)',
                      }}
                    >
                      {log.ip}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: 11,
                        color: 'var(--text-3)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {log.timestamp}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--text-2)',
                        fontFamily: 'var(--font-manrope)',
                      }}
                    >
                      {log.details}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: 'center',
                    padding: 40,
                    color: 'var(--text-3)',
                    fontStyle: 'italic',
                  }}
                >
                  No events match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
