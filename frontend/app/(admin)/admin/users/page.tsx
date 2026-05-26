'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Search, UserCheck, UserX, CreditCard } from 'lucide-react'

interface MockUser {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  plan: 'FREE' | 'PRO' | 'ENTERPRISE'
  status: 'active' | 'suspended'
  createdAt: string
  lastSeen: string
}

const MOCK_USERS: MockUser[] = [
  { id: 'u1', name: 'Alice Chen',   email: 'alice@example.com',  role: 'USER',  plan: 'PRO',        status: 'active',    createdAt: '2026-01-15', lastSeen: '2 hours ago' },
  { id: 'u2', name: 'Bob Smith',    email: 'bob@example.com',    role: 'USER',  plan: 'FREE',       status: 'active',    createdAt: '2026-02-03', lastSeen: '1 day ago' },
  { id: 'u3', name: 'Carol Davis',  email: 'carol@example.com',  role: 'ADMIN', plan: 'ENTERPRISE', status: 'active',    createdAt: '2025-12-01', lastSeen: 'Online' },
  { id: 'u4', name: 'David Kim',    email: 'david@example.com',  role: 'USER',  plan: 'PRO',        status: 'suspended', createdAt: '2026-01-28', lastSeen: '5 days ago' },
  { id: 'u5', name: 'Eve Martinez', email: 'eve@example.com',    role: 'USER',  plan: 'FREE',       status: 'active',    createdAt: '2026-03-10', lastSeen: '3 hours ago' },
  { id: 'u6', name: 'Frank Wilson', email: 'frank@example.com',  role: 'USER',  plan: 'ENTERPRISE', status: 'active',    createdAt: '2025-11-20', lastSeen: '20 min ago' },
]

const STATS = [
  { label: 'Total Users',      value: '6',  sub: 'registered',      icon: Users,     color: 'var(--violet-2)',  dim: 'var(--violet-dim)',  border: 'var(--violet-border)' },
  { label: 'Pro / Enterprise', value: '4',  sub: 'paid plans',      icon: CreditCard,color: 'var(--violet-2)',  dim: 'var(--violet-dim)',  border: 'var(--violet-border)' },
  { label: 'Active',           value: '5',  sub: 'accounts',        icon: UserCheck, color: 'var(--emerald)',   dim: 'var(--emerald-dim)', border: 'var(--emerald-border)' },
  { label: 'Suspended',        value: '1',  sub: 'accounts',        icon: UserX,     color: 'var(--rose)',      dim: 'var(--rose-dim)',    border: 'var(--rose-border)' },
]

type FilterType = 'all' | 'active' | 'suspended'

function PlanBadge({ plan }: { plan: 'FREE' | 'PRO' | 'ENTERPRISE' }) {
  if (plan === 'PRO') return <span className="badge badge-violet">PRO</span>
  if (plan === 'FREE') return <span className="badge badge-amber">FREE</span>
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: 100,
        fontFamily: 'var(--font-jetbrains)',
        fontSize: 10,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        background: 'linear-gradient(135deg, rgba(124,92,255,0.15), rgba(0,229,160,0.1))',
        border: '1px solid rgba(124,92,255,0.3)',
        color: 'var(--violet-2)',
      }}
    >
      ENTERPRISE
    </span>
  )
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')

  const filtered = MOCK_USERS
    .filter(u => filter === 'all' || u.status === filter)
    .filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )

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
            Users
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 4 }}>
            Manage registered accounts and access levels
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

      {/* Filters + Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 6 }}>
          {(['all', 'active', 'suspended'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 16px',
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
              {f}
            </button>
          ))}
        </div>

        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--elevated)',
            border: '1px solid var(--app-border)',
            borderRadius: 'var(--r-md)',
            padding: '7px 14px',
            flex: '1 1 220px',
            maxWidth: 320,
          }}
        >
          <Search size={14} color="var(--text-3)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text)',
              fontSize: 13,
              fontFamily: 'var(--font-manrope)',
              width: '100%',
            }}
          />
        </div>
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
              <th>Name / Email</th>
              <th>Role</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Last Seen</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {filtered.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                >
                  <td>
                    <div
                      style={{
                        fontFamily: 'var(--font-manrope)',
                        fontWeight: 600,
                        fontSize: 13,
                        color: 'var(--text)',
                        marginBottom: 2,
                      }}
                    >
                      {user.name}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: 11,
                        color: 'var(--text-3)',
                      }}
                    >
                      {user.email}
                    </div>
                  </td>
                  <td>
                    {user.role === 'ADMIN' ? (
                      <span className="badge badge-rose">ADMIN</span>
                    ) : (
                      <span
                        style={{
                          fontFamily: 'var(--font-jetbrains)',
                          fontSize: 10,
                          color: 'var(--text-3)',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        }}
                      >
                        USER
                      </span>
                    )}
                  </td>
                  <td>
                    <PlanBadge plan={user.plan} />
                  </td>
                  <td>
                    {user.status === 'active' ? (
                      <span className="badge badge-emerald">ACTIVE</span>
                    ) : (
                      <span className="badge badge-rose">SUSPENDED</span>
                    )}
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: 11,
                        color: user.lastSeen === 'Online' ? 'var(--emerald)' : 'var(--text-3)',
                        fontWeight: user.lastSeen === 'Online' ? 600 : 400,
                      }}
                    >
                      {user.lastSeen}
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
                      {user.createdAt}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        style={{
                          padding: '5px 12px',
                          borderRadius: 'var(--r-sm)',
                          fontSize: 11,
                          fontFamily: 'var(--font-manrope)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: 'transparent',
                          border: '1px solid var(--rose-border)',
                          color: 'var(--rose)',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--rose-dim)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        {user.status === 'suspended' ? 'Restore' : 'Suspend'}
                      </button>
                      <button
                        style={{
                          padding: '5px 12px',
                          borderRadius: 'var(--r-sm)',
                          fontSize: 11,
                          fontFamily: 'var(--font-manrope)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: 'transparent',
                          border: '1px solid var(--violet-border)',
                          color: 'var(--violet-2)',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--violet-dim)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: 'center',
                    padding: 40,
                    color: 'var(--text-3)',
                    fontStyle: 'italic',
                  }}
                >
                  No users match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
