'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Server, Activity, AlertTriangle, BarChart2 } from 'lucide-react'

interface MockNode {
  id: string
  name: string
  ip: string
  location: string
  flag: string
  status: 'online' | 'degraded' | 'offline'
  loadPercent: number
  latencyMs: number
  peers: number
  uptime: string
  lastSeen: string
}

const MOCK_NODES: MockNode[] = [
  { id: 'n1', name: 'Frankfurt-DE-01', ip: '185.220.101.47', location: 'Frankfurt, Germany',     flag: '🇩🇪', status: 'online',   loadPercent: 23, latencyMs: 8,   peers: 142, uptime: '99.98%', lastSeen: 'just now' },
  { id: 'n2', name: 'Amsterdam-NL-01', ip: '185.107.56.21',  location: 'Amsterdam, Netherlands', flag: '🇳🇱', status: 'online',   loadPercent: 31, latencyMs: 11,  peers: 98,  uptime: '99.95%', lastSeen: '30s ago' },
  { id: 'n3', name: 'NewYork-US-01',   ip: '104.21.44.182',  location: 'New York, USA',          flag: '🇺🇸', status: 'online',   loadPercent: 67, latencyMs: 45,  peers: 213, uptime: '99.91%', lastSeen: '45s ago' },
  { id: 'n4', name: 'London-UK-01',    ip: '51.79.81.129',   location: 'London, UK',             flag: '🇬🇧', status: 'online',   loadPercent: 45, latencyMs: 14,  peers: 87,  uptime: '99.97%', lastSeen: 'just now' },
  { id: 'n5', name: 'Singapore-SG-01', ip: '139.99.91.144',  location: 'Singapore',              flag: '🇸🇬', status: 'online',   loadPercent: 19, latencyMs: 89,  peers: 56,  uptime: '99.99%', lastSeen: '1m ago' },
  { id: 'n6', name: 'Tokyo-JP-01',     ip: '103.178.228.11', location: 'Tokyo, Japan',           flag: '🇯🇵', status: 'degraded', loadPercent: 38, latencyMs: 102, peers: 71,  uptime: '98.12%', lastSeen: '2m ago' },
]

const STATS = [
  { label: 'Total Nodes', value: '6',   sub: 'exit nodes',      icon: Server,        color: 'var(--violet-2)', dim: 'var(--violet-dim)',  border: 'var(--violet-border)' },
  { label: 'Online',      value: '5',   sub: 'healthy',         icon: Activity,      color: 'var(--emerald)',  dim: 'var(--emerald-dim)', border: 'var(--emerald-border)' },
  { label: 'Degraded',    value: '1',   sub: 'needs attention',  icon: AlertTriangle, color: 'var(--amber)',   dim: 'var(--amber-dim)',   border: 'var(--amber-border)' },
  { label: 'Avg Load',    value: '32%', sub: 'across cluster',  icon: BarChart2,     color: 'var(--violet-2)', dim: 'var(--violet-dim)',  border: 'var(--violet-border)' },
]

function LoadBar({ pct }: { pct: number }) {
  const color =
    pct >= 75 ? 'var(--rose)' : pct >= 50 ? 'var(--amber)' : 'var(--emerald)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          width: 60,
          height: 4,
          background: 'var(--elevated)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: 2,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
      <span
        style={{
          fontFamily: 'var(--font-jetbrains)',
          fontSize: 11,
          color,
          minWidth: 28,
        }}
      >
        {pct}%
      </span>
    </div>
  )
}

function StatusBadge({ status }: { status: 'online' | 'degraded' | 'offline' }) {
  if (status === 'online') return <span className="badge badge-emerald">ONLINE</span>
  if (status === 'degraded') return <span className="badge badge-amber">DEGRADED</span>
  return <span className="badge badge-rose">OFFLINE</span>
}

export default function AdminNodesPage() {
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
            Nodes
          </h1>
          <p style={{ color: 'var(--text-2)', fontSize: 14, marginTop: 4 }}>
            Monitor and manage globally distributed exit nodes
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

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="panel"
        style={{ overflow: 'hidden' }}
      >
        <table className="data-table">
          <thead>
            <tr>
              <th>Node / Location</th>
              <th>IP Address</th>
              <th>Status</th>
              <th>Load</th>
              <th>Latency</th>
              <th>Active Peers</th>
              <th>Uptime</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {MOCK_NODES.map((node, i) => (
                <motion.tr
                  key={node.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                >
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 18, lineHeight: 1 }}>{node.flag}</span>
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-jetbrains)',
                            fontSize: 12,
                            color: 'var(--text)',
                            fontWeight: 500,
                            marginBottom: 2,
                          }}
                        >
                          {node.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                          {node.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: 11,
                        color: 'var(--text-3)',
                      }}
                    >
                      {node.ip}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={node.status} />
                  </td>
                  <td>
                    <LoadBar pct={node.loadPercent} />
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: 12,
                        color:
                          node.latencyMs < 20
                            ? 'var(--emerald)'
                            : node.latencyMs < 60
                            ? 'var(--amber)'
                            : 'var(--rose)',
                        fontWeight: 500,
                      }}
                    >
                      {node.latencyMs}ms
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: 12,
                        color: 'var(--text)',
                        fontWeight: 500,
                      }}
                    >
                      {node.peers}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: 'var(--font-jetbrains)',
                        fontSize: 11,
                        color:
                          parseFloat(node.uptime) >= 99.9
                            ? 'var(--emerald)'
                            : 'var(--amber)',
                      }}
                    >
                      {node.uptime}
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
                      <button
                        style={{
                          padding: '5px 12px',
                          borderRadius: 'var(--r-sm)',
                          fontSize: 11,
                          fontFamily: 'var(--font-manrope)',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: 'transparent',
                          border: '1px solid var(--amber-border)',
                          color: 'var(--amber)',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--amber-dim)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        Restart
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
