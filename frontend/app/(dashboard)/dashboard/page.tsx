'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import {
  Wifi,
  WifiOff,
  Zap,
  Activity,
  BarChart2,
  Clock,
  Shield,
} from 'lucide-react'

const Globe = dynamic(() => import('@/components/3d/Globe'), { ssr: false })

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

// ── Mock Data ─────────────────────────────────────────────────────────────────

const SERVERS: ServerEntry[] = [
  { id: 'fra', city: 'Frankfurt', country: 'DE', flag: '🇩🇪', latencyMs: 8,   loadPercent: 23, status: 'online',   isRecommended: true,  mockIp: '185.220.101.47'  },
  { id: 'ams', city: 'Amsterdam', country: 'NL', flag: '🇳🇱', latencyMs: 11,  loadPercent: 31, status: 'online',   isRecommended: false, mockIp: '185.107.56.21'   },
  { id: 'nyc', city: 'New York',  country: 'US', flag: '🇺🇸', latencyMs: 45,  loadPercent: 67, status: 'online',   isRecommended: false, mockIp: '104.21.44.182'   },
  { id: 'lon', city: 'London',    country: 'UK', flag: '🇬🇧', latencyMs: 14,  loadPercent: 45, status: 'online',   isRecommended: false, mockIp: '51.79.81.129'    },
  { id: 'sgp', city: 'Singapore', country: 'SG', flag: '🇸🇬', latencyMs: 89,  loadPercent: 19, status: 'online',   isRecommended: false, mockIp: '139.99.91.144'   },
  { id: 'tyo', city: 'Tokyo',     country: 'JP', flag: '🇯🇵', latencyMs: 102, loadPercent: 38, status: 'degraded', isRecommended: false, mockIp: '103.178.228.11'  },
]

const TRAFFIC_BARS = [14, 22, 18, 35, 28, 42, 31, 55, 47, 62, 50, 78]

const AI_ROWS: [string, string, 'ok' | 'star'][] = [
  ['Latency',        '8ms',    'ok'],
  ['Server load',    '23%',    'ok'],
  ['IP reputation',  '99/100', 'ok'],
  ['ISP throttling', 'None',   'ok'],
  ['Score',          '94/100', 'star'],
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(s: number): string {
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
    .map((v) => String(v).padStart(2, '0'))
    .join(':')
}

function loadColor(pct: number): string {
  if (pct < 50) return 'var(--emerald)'
  if (pct < 75) return 'var(--amber)'
  return 'var(--rose)'
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon,
  iconColor,
  label,
  children,
}: {
  icon: React.ReactNode
  iconColor: string
  label: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="panel"
      style={{ padding: 20 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span style={{ color: iconColor, display: 'flex' }}>{icon}</span>
        <span
          style={{
            fontFamily: 'var(--font-jetbrains)',
            fontSize: 9,
            color: 'var(--text-2)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
      </div>
      {children}
    </motion.div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [isConnected, setIsConnected]     = useState(false)
  const [selectedServer, setSelectedServer] = useState<string>('fra')
  const [elapsed, setElapsed]             = useState(0)

  useEffect(() => {
    if (!isConnected) { setElapsed(0); return }
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [isConnected])

  function handleConnect() {
    setIsConnected((p) => !p)
  }

  function handleServerClick(id: string) {
    setSelectedServer(id)
    if (!isConnected) setIsConnected(true)
  }

  const activeServer = SERVERS.find((s) => s.id === selectedServer) ?? SERVERS[0]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Globe Hero ──────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          height: '45vh',
          minHeight: 280,
          overflow: 'hidden',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--app-border)',
          flexShrink: 0,
        }}
      >
        {/* Globe */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Globe />
        </div>

        {/* Edge-blending overlays */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 65% 65% at 50% 50%, transparent 25%, rgba(7,7,11,0.35) 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '45%',
            background: 'linear-gradient(to top, var(--bg), transparent)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '18%',
            background: 'linear-gradient(to right, var(--surface), transparent)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '18%',
            background: 'linear-gradient(to left, var(--surface), transparent)',
            pointerEvents: 'none',
          }}
        />

        {/* Top-left: status badge */}
        <div style={{ position: 'absolute', top: 18, left: 20, zIndex: 10 }}>
          <motion.div
            animate={{
              borderColor: isConnected ? 'rgba(0,229,160,0.35)' : 'rgba(255,51,102,0.35)',
            }}
            transition={{ duration: 0.3 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              background: 'rgba(7,7,11,0.75)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: `1px solid ${isConnected ? 'rgba(0,229,160,0.35)' : 'rgba(255,51,102,0.35)'}`,
              borderRadius: 100,
              padding: '5px 12px',
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: isConnected ? 'var(--emerald)' : 'var(--rose)',
                display: 'block',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: 10,
                letterSpacing: '0.1em',
                color: isConnected ? 'var(--emerald)' : 'var(--rose)',
              }}
            >
              {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </motion.div>
        </div>

        {/* Top-center: label */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            fontFamily: 'var(--font-jetbrains)',
            fontSize: 9,
            letterSpacing: '0.28em',
            color: 'rgba(124,92,255,0.4)',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          NEXVPN · NETWORK OPS
        </div>

        {/* Top-right: server info when connected */}
        <AnimatePresence>
          {isConnected && (
            <motion.div
              key="server-card"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25 }}
              style={{
                position: 'absolute',
                top: 18,
                right: 20,
                zIndex: 10,
                background: 'rgba(7,7,11,0.78)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid var(--app-border)',
                borderRadius: 'var(--r-md)',
                padding: '10px 14px',
                textAlign: 'right',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-manrope)',
                  fontWeight: 700,
                  fontSize: 15,
                  color: 'var(--text)',
                }}
              >
                {activeServer.flag} {activeServer.city}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: 10,
                  color: 'var(--text-2)',
                  marginTop: 2,
                }}
              >
                {activeServer.mockIp}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: 10,
                  color: 'var(--violet-2)',
                  marginTop: 1,
                }}
              >
                {activeServer.latencyMs}ms latency
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom-center: connect button */}
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
          }}
        >
          <motion.button
            onClick={handleConnect}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              background: isConnected
                ? 'var(--rose-dim)'
                : 'linear-gradient(135deg, var(--violet) 0%, var(--violet-2) 100%)',
              color: isConnected ? 'var(--rose)' : '#fff',
              border: isConnected ? '1px solid var(--rose-border)' : '1px solid transparent',
              borderRadius: 100,
              padding: '11px 28px',
              fontFamily: 'var(--font-manrope)',
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              boxShadow: isConnected ? 'none' : '0 0 48px rgba(124,92,255,0.55)',
              whiteSpace: 'nowrap',
            }}
          >
            {isConnected ? <WifiOff size={17} strokeWidth={2} /> : <Wifi size={17} strokeWidth={2} />}
            {isConnected ? 'DISCONNECT' : 'CONNECT'}
          </motion.button>
        </div>

        {/* Bottom-left: protocol label */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            left: 20,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <Shield size={11} style={{ color: 'rgba(124,92,255,0.4)' }} strokeWidth={1.8} />
          <span
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: 9,
              color: 'rgba(124,92,255,0.4)',
              letterSpacing: '0.14em',
            }}
          >
            AES-256 · WireGuard
          </span>
        </div>
      </section>

      {/* ── Stats row ────────────────────────────────────────────────── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
          padding: '16px 16px 0',
        }}
      >
        {/* AI Pick */}
        <StatCard icon={<Zap size={13} strokeWidth={2} />} iconColor="var(--violet)" label="AI Pick">
          <div
            style={{
              fontFamily: 'var(--font-manrope)',
              fontWeight: 700,
              fontSize: 17,
              color: 'var(--text)',
            }}
          >
            Frankfurt 🇩🇪
          </div>
          <div
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: 10,
              color: 'var(--violet-2)',
              marginTop: 3,
            }}
          >
            94/100
          </div>
          <div
            style={{
              fontFamily: 'var(--font-manrope)',
              fontSize: 11,
              color: 'var(--text-3)',
              marginTop: 3,
            }}
          >
            Low latency · Clean IP
          </div>
        </StatCard>

        {/* Latency */}
        <StatCard icon={<Activity size={13} strokeWidth={2} />} iconColor="var(--emerald)" label="Latency">
          <div
            style={{
              fontFamily: 'var(--font-manrope)',
              fontWeight: 700,
              fontSize: 28,
              color: isConnected ? 'var(--emerald)' : 'var(--text-3)',
              lineHeight: 1,
            }}
          >
            {isConnected ? '8' : '—'}
            {isConnected && (
              <span
                style={{
                  fontSize: 13,
                  color: 'var(--text-2)',
                  fontWeight: 400,
                  marginLeft: 3,
                }}
              >
                ms
              </span>
            )}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: 10,
              color: 'var(--text-3)',
              marginTop: 5,
            }}
          >
            avg round trip
          </div>
        </StatCard>

        {/* Data Used */}
        <StatCard icon={<BarChart2 size={13} strokeWidth={2} />} iconColor="var(--amber)" label="Data used">
          <div
            style={{
              fontFamily: 'var(--font-manrope)',
              fontWeight: 700,
              fontSize: 28,
              color: 'var(--text)',
              lineHeight: 1,
            }}
          >
            0.00
            <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 400, marginLeft: 3 }}>
              GB
            </span>
          </div>
          <div
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontSize: 10,
              color: 'var(--text-3)',
              marginTop: 5,
            }}
          >
            this session
          </div>
        </StatCard>

        {/* Session */}
        <StatCard icon={<Clock size={13} strokeWidth={2} />} iconColor="var(--text-2)" label="Session">
          <div
            style={{
              fontFamily: 'var(--font-jetbrains)',
              fontWeight: 600,
              fontSize: 22,
              color: 'var(--text)',
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}
          >
            {formatTime(elapsed)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
            {isConnected && (
              <motion.span
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: 'var(--emerald)',
                  display: 'block',
                  flexShrink: 0,
                }}
              />
            )}
            <span
              style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: 9,
                color: 'var(--text-3)',
                letterSpacing: '0.1em',
              }}
            >
              {isConnected ? 'LIVE' : 'INACTIVE'}
            </span>
          </div>
        </StatCard>
      </section>

      {/* ── Bottom grid ─────────────────────────────────────────────── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          padding: '10px 16px 24px',
        }}
      >
        {/* Server list */}
        <div
          className="panel"
          style={{ padding: 20 }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-manrope)',
                fontWeight: 700,
                fontSize: 14,
                color: 'var(--text)',
              }}
            >
              Servers
            </h3>
            <button
              onClick={() => { setSelectedServer('fra'); if (!isConnected) setIsConnected(true) }}
              style={{
                fontFamily: 'var(--font-jetbrains)',
                fontSize: 10,
                color: 'var(--violet-2)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.06em',
              }}
            >
              AI CHOOSE →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SERVERS.map((s) => {
              const isSelected = selectedServer === s.id
              return (
                <motion.div
                  key={s.id}
                  onClick={() => handleServerClick(s.id)}
                  whileHover={isSelected ? {} : { backgroundColor: 'rgba(124,92,255,0.04)' }}
                  transition={{ duration: 0.12 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 'var(--r-sm)',
                    cursor: 'pointer',
                    border: `1px solid ${isSelected ? 'var(--violet-border)' : 'transparent'}`,
                    background: isSelected ? 'var(--violet-dim)' : 'transparent',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{s.flag}</span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-manrope)',
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'var(--text)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      {s.city}
                      {s.isRecommended && (
                        <span className="badge badge-violet" style={{ fontSize: 8, padding: '1px 5px' }}>
                          AI
                        </span>
                      )}
                    </div>
                    {/* Load bar */}
                    <div
                      style={{
                        height: 2,
                        background: 'var(--overlay)',
                        borderRadius: 1,
                        marginTop: 4,
                        width: 56,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${s.loadPercent}%`,
                          background: loadColor(s.loadPercent),
                          borderRadius: 1,
                        }}
                      />
                    </div>
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-jetbrains)',
                      fontSize: 11,
                      color: s.status === 'online' ? 'var(--violet-2)' : 'var(--amber)',
                    }}
                  >
                    {s.latencyMs}ms
                  </span>

                  <motion.span
                    animate={{ opacity: s.status === 'online' ? [1, 0.4, 1] : 1 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: s.status === 'online' ? 'var(--emerald)' : 'var(--amber)',
                      display: 'block',
                      flexShrink: 0,
                    }}
                  />
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Traffic chart */}
          <div className="panel" style={{ padding: 20, flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-manrope)',
                  fontWeight: 700,
                  fontSize: 14,
                  color: 'var(--text)',
                }}
              >
                Traffic
              </h3>
              <span className="badge badge-violet" style={{ fontSize: 8 }}>
                LAST 60 MIN
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 3,
                height: 64,
              }}
            >
              {TRAFFIC_BARS.map((h, i) => {
                const isLast = i === TRAFFIC_BARS.length - 1
                return (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.35, ease: 'easeOut' }}
                    style={{
                      flex: 1,
                      height: `${h}%`,
                      borderRadius: '2px 2px 0 0',
                      transformOrigin: 'bottom',
                      background: isLast
                        ? 'var(--violet)'
                        : `rgba(124,92,255,${0.08 + (h / 100) * 0.42})`,
                      boxShadow: isLast ? '0 0 10px rgba(124,92,255,0.55)' : 'none',
                    }}
                  />
                )
              })}
            </div>
          </div>

          {/* AI Analysis panel */}
          <div
            className="panel"
            style={{
              padding: 20,
              background: 'var(--violet-dim)',
              borderColor: 'var(--violet-border)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <Zap size={13} style={{ color: 'var(--violet-2)' }} strokeWidth={2} />
              <span
                style={{
                  fontFamily: 'var(--font-jetbrains)',
                  fontSize: 9,
                  color: 'var(--violet-2)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                AI Analysis
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {AI_ROWS.map(([label, val, kind]) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-jetbrains)',
                      fontSize: 11,
                      color: 'var(--text-2)',
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-jetbrains)',
                      fontSize: 11,
                      color: kind === 'star' ? 'var(--amber)' : 'var(--emerald)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {val}
                    <span style={{ opacity: 0.8 }}>{kind === 'star' ? '★' : '✓'}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
