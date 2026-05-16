'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Wifi, WifiOff, Zap, Activity, Server, Clock, Shield } from 'lucide-react'

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
  { id: 'fra', city: 'Frankfurt', country: 'DE', flag: '🇩🇪', latencyMs: 8,   loadPercent: 23, status: 'online',   isRecommended: true,  mockIp: '185.220.101.47' },
  { id: 'ams', city: 'Amsterdam', country: 'NL', flag: '🇳🇱', latencyMs: 11,  loadPercent: 31, status: 'online',   isRecommended: false, mockIp: '185.107.56.21'  },
  { id: 'nyc', city: 'New York',  country: 'US', flag: '🇺🇸', latencyMs: 45,  loadPercent: 67, status: 'online',   isRecommended: false, mockIp: '104.21.44.182'  },
  { id: 'lon', city: 'London',    country: 'UK', flag: '🇬🇧', latencyMs: 14,  loadPercent: 45, status: 'online',   isRecommended: false, mockIp: '51.79.81.129'   },
  { id: 'sgp', city: 'Singapore', country: 'SG', flag: '🇸🇬', latencyMs: 89,  loadPercent: 19, status: 'online',   isRecommended: false, mockIp: '139.99.91.144'  },
  { id: 'tyo', city: 'Tokyo',     country: 'JP', flag: '🇯🇵', latencyMs: 102, loadPercent: 38, status: 'degraded', isRecommended: false, mockIp: '103.178.228.11'  },
]

const TRAFFIC_BARS = [14, 22, 18, 35, 28, 42, 31, 55, 47, 62, 50, 78]

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTime(s: number): string {
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60]
    .map((v) => String(v).padStart(2, '0'))
    .join(':')
}

// ── Shared style ──────────────────────────────────────────────────────────────

const panelStyle: React.CSSProperties = {
  background: 'var(--bg-surface)',
  border: '1px solid rgba(0,212,255,0.08)',
  borderRadius: 16,
  padding: 24,
  position: 'relative',
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [selectedServer, setSelectedServer] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!isConnected) {
      setElapsed(0)
      return
    }
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [isConnected])

  function handleConnect() {
    if (!selectedServer) setSelectedServer('fra')
    setIsConnected((p) => !p)
  }

  const activeServer = SERVERS.find((s) => s.id === (selectedServer ?? 'fra'))

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Section 1: Globe Hero ─────────────────────────────────── */}
      <section
        style={{
          position: 'relative',
          height: '50vh',
          overflow: 'hidden',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid rgba(0,212,255,0.08)',
          flexShrink: 0,
        }}
      >
        {/* Globe fills the entire section */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Globe />
        </div>

        {/* Dark gradient overlays to blend edges */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 60% 60% at 50% 50%, transparent 30%, rgba(5,8,13,0.3) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(to top, var(--bg-base), transparent)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '20%',
            background: 'linear-gradient(to right, var(--bg-surface), transparent)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '20%',
            background: 'linear-gradient(to left, var(--bg-surface), transparent)',
          }}
        />

        {/* Top-left: Status indicator */}
        <div style={{ position: 'absolute', top: 20, left: 24, zIndex: 10 }}>
          <motion.div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(8,12,20,0.8)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${isConnected ? 'rgba(0,255,157,0.3)' : 'rgba(255,68,85,0.3)'}`,
              borderRadius: 100,
              padding: '6px 14px',
            }}
            animate={{
              borderColor: isConnected ? 'rgba(0,255,157,0.3)' : 'rgba(255,68,85,0.3)',
            }}
          >
            <motion.span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: isConnected ? 'var(--green)' : 'var(--red)',
                display: 'block',
              }}
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span
              className="font-data"
              style={{
                fontSize: 11,
                letterSpacing: '0.1em',
                color: isConnected ? 'var(--green)' : 'var(--red)',
              }}
            >
              {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </motion.div>
        </div>

        {/* Top-center: Mission control label */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
          }}
        >
          <div
            className="font-data"
            style={{
              fontSize: 9,
              letterSpacing: '0.25em',
              color: 'rgba(0,212,255,0.4)',
              textTransform: 'uppercase',
            }}
          >
            NexVPN · Network Operations
          </div>
        </div>

        {/* Top-right: Current server info */}
        <AnimatePresence>
          {isConnected && activeServer && (
            <motion.div
              key="server-info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{
                position: 'absolute',
                top: 20,
                right: 24,
                zIndex: 10,
                background: 'rgba(8,12,20,0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(0,212,255,0.15)',
                borderRadius: 12,
                padding: '10px 16px',
                textAlign: 'right',
              }}
            >
              <div
                className="font-display font-bold"
                style={{ fontSize: 16, color: 'var(--text-primary)' }}
              >
                {activeServer.flag} {activeServer.city}
              </div>
              <div
                className="font-data"
                style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 2 }}
              >
                {activeServer.mockIp}
              </div>
              <div
                className="font-data"
                style={{ fontSize: 10, color: 'var(--cyan)', marginTop: 1 }}
              >
                {activeServer.latencyMs}ms latency
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom center: Big CONNECT button */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
          }}
        >
          <motion.button
            onClick={handleConnect}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: isConnected
                ? 'rgba(255,68,85,0.15)'
                : 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
              color: isConnected ? 'var(--red)' : '#05080D',
              border: isConnected ? '1px solid rgba(255,68,85,0.4)' : 'none',
              borderRadius: 100,
              padding: '12px 28px',
              fontFamily: 'var(--font-syne)',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              letterSpacing: '0.05em',
              boxShadow: isConnected ? 'none' : '0 0 40px rgba(0,212,255,0.4)',
            }}
          >
            {isConnected ? <WifiOff size={18} /> : <Wifi size={18} />}
            {isConnected ? 'DISCONNECT' : 'CONNECT'}
          </motion.button>
        </div>

        {/* Bottom-left: Shield badge */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: 24,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Shield size={12} style={{ color: 'rgba(0,212,255,0.4)' }} />
          <span
            className="font-data"
            style={{ fontSize: 9, color: 'rgba(0,212,255,0.4)', letterSpacing: '0.12em' }}
          >
            AES-256 · WireGuard
          </span>
        </div>
      </section>

      {/* ── Section 2: 4 Stats Cards ──────────────────────────────── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          padding: '20px 12px 0',
        }}
      >
        {/* AI Pick */}
        <motion.div whileHover={{ y: -2 }} style={{ ...panelStyle, borderColor: 'rgba(0,212,255,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Zap size={13} style={{ color: 'var(--cyan)' }} />
            <span
              className="font-data"
              style={{ fontSize: 9, color: 'var(--text-secondary)', letterSpacing: '0.1em' }}
            >
              AI PICK
            </span>
          </div>
          <div
            className="font-display font-bold"
            style={{ fontSize: 18, color: 'var(--text-primary)' }}
          >
            Frankfurt 🇩🇪
          </div>
          <div className="font-data" style={{ fontSize: 10, color: 'var(--cyan)', marginTop: 3 }}>
            Score: 94/100
          </div>
          <div
            className="font-sans"
            style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}
          >
            Low latency · Clean IP
          </div>
        </motion.div>

        {/* Latency */}
        <motion.div whileHover={{ y: -2 }} style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Activity size={13} style={{ color: 'var(--green)' }} />
            <span
              className="font-data"
              style={{ fontSize: 9, color: 'var(--text-secondary)', letterSpacing: '0.1em' }}
            >
              LATENCY
            </span>
          </div>
          <div
            className="font-display font-bold"
            style={{ fontSize: 28, color: 'var(--green)' }}
          >
            {isConnected ? '8' : '—'}
            {isConnected && (
              <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 400 }}>
                {' '}
                ms
              </span>
            )}
          </div>
          <div
            className="font-data"
            style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}
          >
            avg round trip
          </div>
        </motion.div>

        {/* Data Used */}
        <motion.div whileHover={{ y: -2 }} style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Server size={13} style={{ color: 'var(--amber)' }} />
            <span
              className="font-data"
              style={{ fontSize: 9, color: 'var(--text-secondary)', letterSpacing: '0.1em' }}
            >
              DATA USED
            </span>
          </div>
          <div
            className="font-display font-bold"
            style={{ fontSize: 28, color: 'var(--text-primary)' }}
          >
            0.00
            <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 400 }}>
              {' '}
              GB
            </span>
          </div>
          <div
            className="font-data"
            style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}
          >
            this session
          </div>
        </motion.div>

        {/* Session timer */}
        <motion.div whileHover={{ y: -2 }} style={panelStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <Clock size={13} style={{ color: 'var(--text-secondary)' }} />
            <span
              className="font-data"
              style={{ fontSize: 9, color: 'var(--text-secondary)', letterSpacing: '0.1em' }}
            >
              SESSION
            </span>
          </div>
          <div
            className="font-data font-bold"
            style={{ fontSize: 24, color: 'var(--text-primary)', letterSpacing: '0.05em' }}
          >
            {formatTime(elapsed)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            {isConnected && (
              <motion.span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--green)',
                  display: 'block',
                }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
            <span className="font-data" style={{ fontSize: 9, color: 'var(--text-muted)' }}>
              {isConnected ? 'LIVE' : 'INACTIVE'}
            </span>
          </div>
        </motion.div>
      </section>

      {/* ── Section 3: Bottom Two-Column Grid ─────────────────────── */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          padding: '12px 12px 24px',
        }}
      >
        {/* Server list — LEFT */}
        <div style={panelStyle}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <h3
              className="font-display font-bold"
              style={{ fontSize: 14, color: 'var(--text-primary)' }}
            >
              Servers
            </h3>
            <button
              className="font-data"
              style={{
                fontSize: 10,
                color: 'var(--cyan)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                letterSpacing: '0.06em',
              }}
            >
              AI CHOOSE →
            </button>
          </div>

          {SERVERS.map((s) => (
            <motion.div
              key={s.id}
              whileHover={{ backgroundColor: 'rgba(0,212,255,0.04)' }}
              onClick={() => {
                setSelectedServer(s.id)
                if (!isConnected) handleConnect()
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 8,
                cursor: 'pointer',
                border: `1px solid ${selectedServer === s.id ? 'rgba(0,212,255,0.3)' : 'transparent'}`,
                background:
                  selectedServer === s.id ? 'rgba(0,212,255,0.05)' : 'transparent',
                marginBottom: 4,
                transition: 'border-color 0.2s',
              }}
            >
              <span style={{ fontSize: 18 }}>{s.flag}</span>
              <div style={{ flex: 1 }}>
                <div
                  className="font-sans"
                  style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}
                >
                  {s.city}
                  {s.isRecommended && (
                    <span
                      className="font-data"
                      style={{
                        fontSize: 8,
                        color: 'var(--cyan)',
                        marginLeft: 6,
                        letterSpacing: '0.08em',
                        background: 'rgba(0,212,255,0.1)',
                        padding: '1px 5px',
                        borderRadius: 3,
                      }}
                    >
                      AI
                    </span>
                  )}
                </div>
                {/* Thin load bar */}
                <div
                  style={{
                    height: 2,
                    background: 'var(--bg-overlay)',
                    borderRadius: 1,
                    marginTop: 4,
                    width: 60,
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${s.loadPercent}%`,
                      background:
                        s.loadPercent < 50
                          ? 'var(--green)'
                          : s.loadPercent < 75
                          ? 'var(--amber)'
                          : 'var(--red)',
                      borderRadius: 1,
                    }}
                  />
                </div>
              </div>
              <span
                className="font-data"
                style={{
                  fontSize: 12,
                  color: s.status === 'online' ? 'var(--cyan)' : 'var(--amber)',
                }}
              >
                {s.latencyMs}ms
              </span>
              <motion.span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: s.status === 'online' ? 'var(--green)' : 'var(--amber)',
                  flexShrink: 0,
                  display: 'block',
                }}
                animate={{ opacity: s.status === 'online' ? [1, 0.5, 1] : 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          ))}
        </div>

        {/* Traffic + AI panel — RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Traffic chart */}
          <div style={{ ...panelStyle, flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <h3
                className="font-display font-bold"
                style={{ fontSize: 14, color: 'var(--text-primary)' }}
              >
                Traffic
              </h3>
              <span
                className="font-data"
                style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.06em' }}
              >
                LAST 60 MIN
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 60 }}>
              {TRAFFIC_BARS.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                  style={{
                    flex: 1,
                    borderRadius: '2px 2px 0 0',
                    background:
                      i === TRAFFIC_BARS.length - 1
                        ? 'var(--cyan)'
                        : `rgba(0,212,255,${0.1 + (h / 100) * 0.4})`,
                    height: `${h}%`,
                    transformOrigin: 'bottom',
                    boxShadow:
                      i === TRAFFIC_BARS.length - 1
                        ? '0 0 8px rgba(0,212,255,0.6)'
                        : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* AI reasoning card */}
          <div
            style={{
              ...panelStyle,
              borderColor: 'rgba(0,212,255,0.2)',
              background: 'rgba(0,212,255,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Zap size={13} style={{ color: 'var(--cyan)' }} />
              <span
                className="font-data"
                style={{ fontSize: 9, color: 'var(--cyan)', letterSpacing: '0.1em' }}
              >
                AI ANALYSIS
              </span>
            </div>
            <div
              className="font-data"
              style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.8 }}
            >
              {(
                [
                  ['Latency', '8ms', true],
                  ['Server Load', '23%', true],
                  ['IP Reputation', '99/100', true],
                  ['ISP Throttling', 'None', true],
                  ['Score', '94/100', true],
                ] as [string, string, boolean][]
              ).map(([label, val, ok]) => (
                <div
                  key={label}
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ color: ok ? 'var(--green)' : 'var(--red)' }}>
                    {val} {ok ? '✓' : '✗'}
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
