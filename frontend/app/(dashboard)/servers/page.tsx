'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Zap } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ServerEntry {
  id: string
  city: string
  country: string
  flag: string
  latencyMs: number
  loadPercent: number
  status: 'online' | 'degraded'
  isRecommended: boolean
  mockIp: string
}

type FilterKey = 'all' | 'online' | 'degraded'

// ── Mock Data ─────────────────────────────────────────────────────────────────

const SERVERS: ServerEntry[] = [
  { id: 'fra', city: 'Frankfurt', country: 'DE', flag: '🇩🇪', latencyMs: 8,   loadPercent: 23, status: 'online',   isRecommended: true,  mockIp: '185.220.101.47'  },
  { id: 'ams', city: 'Amsterdam', country: 'NL', flag: '🇳🇱', latencyMs: 11,  loadPercent: 31, status: 'online',   isRecommended: false, mockIp: '185.107.56.21'   },
  { id: 'nyc', city: 'New York',  country: 'US', flag: '🇺🇸', latencyMs: 45,  loadPercent: 67, status: 'online',   isRecommended: false, mockIp: '104.21.44.182'   },
  { id: 'lon', city: 'London',    country: 'UK', flag: '🇬🇧', latencyMs: 14,  loadPercent: 45, status: 'online',   isRecommended: false, mockIp: '51.79.81.129'    },
  { id: 'sgp', city: 'Singapore', country: 'SG', flag: '🇸🇬', latencyMs: 89,  loadPercent: 19, status: 'online',   isRecommended: false, mockIp: '139.99.91.144'   },
  { id: 'tyo', city: 'Tokyo',     country: 'JP', flag: '🇯🇵', latencyMs: 102, loadPercent: 38, status: 'degraded', isRecommended: false, mockIp: '103.178.228.11'  },
]

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',      label: 'All'      },
  { key: 'online',   label: 'Online'   },
  { key: 'degraded', label: 'Degraded' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function latencyBadgeClass(ms: number): string {
  if (ms < 20) return 'badge badge-emerald'
  if (ms < 60) return 'badge badge-amber'
  return 'badge badge-rose'
}

function loadColor(pct: number): string {
  if (pct < 50) return 'var(--emerald)'
  if (pct < 75) return 'var(--amber)'
  return 'var(--rose)'
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ServersPage() {
  const [query,  setQuery]  = useState('')
  const [filter, setFilter] = useState<FilterKey>('all')

  const filtered = useMemo(() => {
    return SERVERS.filter((s) => {
      const matchesSearch =
        s.city.toLowerCase().includes(query.toLowerCase()) ||
        s.country.toLowerCase().includes(query.toLowerCase()) ||
        s.mockIp.includes(query)
      const matchesFilter = filter === 'all' || s.status === filter
      return matchesSearch && matchesFilter
    })
  }, [query, filter])

  return (
    <div style={{ padding: 32, maxWidth: 1100 }}>
      {/* ── Header ────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
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
              lineHeight: 1.1,
            }}
          >
            Servers
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-manrope)',
              fontSize: 13,
              color: 'var(--text-2)',
              marginTop: 4,
            }}
          >
            {SERVERS.filter((s) => s.status === 'online').length} nodes online across{' '}
            {SERVERS.length} locations
          </p>
        </div>

        <button
          className="btn-ghost"
          style={{ fontSize: 13, padding: '9px 18px', display: 'flex', alignItems: 'center', gap: 7 }}
        >
          <Zap size={14} strokeWidth={2} style={{ color: 'var(--violet)' }} />
          AI pick
        </button>
      </div>

      {/* ── Search + Filters ──────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search
            size={14}
            strokeWidth={1.8}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-3)',
              pointerEvents: 'none',
            }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search servers..."
            style={{
              width: '100%',
              paddingLeft: 36,
              paddingRight: 14,
              paddingTop: 9,
              paddingBottom: 9,
              background: 'var(--elevated)',
              border: '1px solid var(--app-border)',
              borderRadius: 'var(--r-md)',
              fontFamily: 'var(--font-manrope)',
              fontSize: 13,
              color: 'var(--text)',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--violet-border)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--app-border)'
            }}
          />
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 6 }}>
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                fontFamily: 'var(--font-manrope)',
                fontSize: 12,
                fontWeight: 500,
                padding: '7px 14px',
                borderRadius: 100,
                cursor: 'pointer',
                border: `1px solid ${filter === key ? 'var(--violet-border)' : 'var(--app-border)'}`,
                background: filter === key ? 'var(--violet-dim)' : 'transparent',
                color: filter === key ? 'var(--violet-2)' : 'var(--text-2)',
                transition: 'all 0.15s',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Server Grid ───────────────────────────────────── */}
      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          <motion.div
            key="grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
            }}
          >
            {filtered.map((s, i) => (
              <motion.div
                key={s.id}
                className="panel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                whileHover={{ y: -2 }}
                style={{ padding: 20, cursor: 'default' }}
              >
                {/* Card header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: 14,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{s.flag}</span>
                    <div>
                      <div
                        style={{
                          fontFamily: 'var(--font-manrope)',
                          fontWeight: 700,
                          fontSize: 15,
                          color: 'var(--text)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        {s.city}
                        {s.isRecommended && (
                          <span className="badge badge-violet" style={{ fontSize: 8 }}>
                            AI
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--font-jetbrains)',
                          fontSize: 10,
                          color: 'var(--text-3)',
                          marginTop: 2,
                        }}
                      >
                        {s.country} · {s.mockIp}
                      </div>
                    </div>
                  </div>

                  {/* Status dot */}
                  <motion.span
                    animate={s.status === 'online' ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: s.status === 'online' ? 'var(--emerald)' : 'var(--amber)',
                      display: 'block',
                      flexShrink: 0,
                      marginTop: 3,
                    }}
                  />
                </div>

                {/* Latency badge */}
                <span className={latencyBadgeClass(s.latencyMs)} style={{ fontSize: 9 }}>
                  {s.latencyMs}ms
                </span>

                {/* Load bar */}
                <div
                  style={{
                    height: 3,
                    background: 'var(--overlay)',
                    borderRadius: 2,
                    marginTop: 12,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${s.loadPercent}%`,
                      background: loadColor(s.loadPercent),
                      borderRadius: 2,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 4,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-jetbrains)',
                      fontSize: 9,
                      color: 'var(--text-3)',
                    }}
                  >
                    Load
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-jetbrains)',
                      fontSize: 9,
                      color: 'var(--text-2)',
                    }}
                  >
                    {s.loadPercent}%
                  </span>
                </div>

                {/* Connect button */}
                <button
                  className="btn-ghost"
                  style={{
                    width: '100%',
                    marginTop: 14,
                    fontSize: 12,
                    padding: '8px 0',
                    borderRadius: 'var(--r-sm)',
                  }}
                >
                  Connect
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '64px 32px',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 32 }}>🌐</span>
            <p
              style={{
                fontFamily: 'var(--font-manrope)',
                fontWeight: 600,
                fontSize: 15,
                color: 'var(--text-2)',
              }}
            >
              No servers match your search
            </p>
            <p style={{ fontFamily: 'var(--font-manrope)', fontSize: 13, color: 'var(--text-3)' }}>
              Try a different city name, country code, or IP.
            </p>
            <button
              className="btn-ghost"
              onClick={() => { setQuery(''); setFilter('all') }}
              style={{ fontSize: 13, marginTop: 4 }}
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
