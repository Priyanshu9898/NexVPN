'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, TrendingUp, XCircle, UserCheck } from 'lucide-react'

interface MockSub {
  id: string
  userId: string
  userEmail: string
  plan: 'FREE' | 'PRO' | 'ENTERPRISE'
  status: 'active' | 'cancelled' | 'past_due'
  amount: string
  period: string
  nextBilling: string
  startedAt: string
}

const MOCK_SUBS: MockSub[] = [
  { id: 's1', userId: 'u1', userEmail: 'alice@example.com',  plan: 'PRO',        status: 'active',    amount: '$8.00',  period: 'monthly', nextBilling: '2026-06-15', startedAt: '2026-01-15' },
  { id: 's2', userId: 'u3', userEmail: 'carol@example.com',  plan: 'ENTERPRISE', status: 'active',    amount: '$20.00', period: 'monthly', nextBilling: '2026-06-01', startedAt: '2025-12-01' },
  { id: 's3', userId: 'u4', userEmail: 'david@example.com',  plan: 'PRO',        status: 'cancelled', amount: '$8.00',  period: 'monthly', nextBilling: 'N/A',        startedAt: '2026-01-28' },
  { id: 's4', userId: 'u6', userEmail: 'frank@example.com',  plan: 'ENTERPRISE', status: 'active',    amount: '$20.00', period: 'monthly', nextBilling: '2026-06-20', startedAt: '2025-11-20' },
  { id: 's5', userId: 'u2', userEmail: 'bob@example.com',    plan: 'FREE',       status: 'active',    amount: '$0.00',  period: '—',       nextBilling: '—',          startedAt: '2026-02-03' },
]

const STATS = [
  { label: 'Active Subs', value: '4',   sub: 'paying customers', icon: UserCheck,  color: 'var(--violet-2)', dim: 'var(--violet-dim)',  border: 'var(--violet-border)' },
  { label: 'Cancelled',   value: '1',   sub: 'churned',          icon: XCircle,    color: 'var(--rose)',     dim: 'var(--rose-dim)',    border: 'var(--rose-border)' },
  { label: 'Free Users',  value: '1',   sub: 'free tier',        icon: CreditCard, color: 'var(--amber)',    dim: 'var(--amber-dim)',   border: 'var(--amber-border)' },
  { label: 'MRR',         value: '$56', sub: 'monthly revenue',  icon: TrendingUp, color: 'var(--emerald)',  dim: 'var(--emerald-dim)', border: 'var(--emerald-border)' },
]

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

function StatusBadge({ status }: { status: 'active' | 'cancelled' | 'past_due' }) {
  if (status === 'active') return <span className="badge badge-emerald">ACTIVE</span>
  if (status === 'cancelled') return <span className="badge badge-rose">CANCELLED</span>
  return <span className="badge badge-amber">PAST DUE</span>
}

export default function AdminSubscriptionsPage() {
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
            Subscriptions
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 4 }}>
            Billing plans, revenue tracking, and subscription management
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

      {/* Revenue summary panel */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--emerald-border)',
          borderRadius: 'var(--r-lg)',
          padding: '20px 28px',
          marginBottom: 24,
          display: 'flex',
          gap: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle emerald gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 60% 80% at 90% 50%, rgba(0,229,160,0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {[
          { label: 'MRR', value: '$56',  sub: 'monthly recurring' },
          { label: 'ARR', value: '$672', sub: 'annual run rate' },
          { label: 'ARPU', value: '$14', sub: 'avg revenue / user' },
        ].map((metric, i) => (
          <div
            key={metric.label}
            style={{
              flex: 1,
              paddingLeft: i > 0 ? 32 : 0,
              borderLeft: i > 0 ? '1px solid var(--app-border)' : 'none',
              marginLeft: i > 0 ? 32 : 0,
              position: 'relative',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-bebas)',
                fontSize: 40,
                color: 'var(--emerald)',
                lineHeight: 1,
                letterSpacing: '0.02em',
                marginBottom: 4,
              }}
            >
              {metric.value}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: 10,
                color: 'var(--text-3)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {metric.label}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--text-2)',
                marginTop: 2,
              }}
            >
              {metric.sub}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="panel"
        style={{ overflow: 'hidden' }}
      >
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Period</th>
              <th>Next Billing</th>
              <th>Started</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {MOCK_SUBS.map((sub, i) => (
                <motion.tr
                  key={sub.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                >
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: 11,
                        color: 'var(--text-2)',
                      }}
                    >
                      {sub.userEmail}
                    </span>
                  </td>
                  <td>
                    <PlanBadge plan={sub.plan} />
                  </td>
                  <td>
                    <StatusBadge status={sub.status} />
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: 12,
                        color:
                          sub.amount === '$0.00' ? 'var(--text-3)' : 'var(--text)',
                        fontWeight: sub.amount !== '$0.00' ? 600 : 400,
                      }}
                    >
                      {sub.amount}
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
                      {sub.period}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: 11,
                        color:
                          sub.nextBilling === 'N/A' || sub.nextBilling === '—'
                            ? 'var(--text-3)'
                            : 'var(--text-2)',
                      }}
                    >
                      {sub.nextBilling}
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
                      {sub.startedAt}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        disabled={sub.status === 'cancelled'}
                        style={{
                          padding: '5px 12px',
                          borderRadius: 'var(--r-sm)',
                          fontSize: 11,
                          fontFamily: 'var(--font-manrope)',
                          fontWeight: 600,
                          cursor: sub.status === 'cancelled' ? 'not-allowed' : 'pointer',
                          background: 'transparent',
                          border: '1px solid var(--rose-border)',
                          color: sub.status === 'cancelled' ? 'var(--text-3)' : 'var(--rose)',
                          opacity: sub.status === 'cancelled' ? 0.4 : 1,
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (sub.status !== 'cancelled') {
                            e.currentTarget.style.background = 'var(--rose-dim)'
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        Cancel
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
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}
