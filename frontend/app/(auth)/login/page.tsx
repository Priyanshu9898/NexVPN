'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

const FloatingParticles = dynamic(() => import('@/components/3d/FloatingParticles'), { ssr: false })

function GoogleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.45, ease: 'easeOut' as const } },
}

const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
}

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuthStore()

  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPw, setShowPw]       = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)
  const [pwFocus,    setPwFocus]    = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch {
      // error is already in store state
    }
  }

  const inputBase: React.CSSProperties = {
    width: '100%',
    background: 'rgba(22, 32, 48, 0.6)',
    border: '1px solid rgba(0,212,255,0.12)',
    borderRadius: 8,
    padding: '11px 14px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-outfit)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  const inputFocus: React.CSSProperties = {
    borderColor: 'rgba(0,212,255,0.5)',
    boxShadow: '0 0 0 3px rgba(0,212,255,0.08), 0 0 20px rgba(0,212,255,0.06)',
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'var(--bg-base)' }}>

      {/* ── Full-screen particle field ── */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <FloatingParticles />
      </div>

      {/* ── Radial cyan spotlight ── */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0,212,255,0.18) 0%, rgba(0,212,255,0.04) 50%, transparent 80%)' }} />

      {/* ── Bottom dark fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 z-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(5,8,13,0.8), transparent)' }} />

      {/* ── Corner accent lines ── */}
      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none opacity-20" preserveAspectRatio="none">
        <line x1="0" y1="0" x2="200" y2="200" stroke="#00D4FF" strokeWidth="0.5" />
        <line x1="100%" y1="0" x2="calc(100% - 200px)" y2="200" stroke="#00D4FF" strokeWidth="0.5" />
      </svg>

      {/* ── Glassmorphism card ── */}
      <motion.div
        className="relative z-10 w-full mx-4"
        style={{ maxWidth: 500 }}
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div style={{
          background: 'rgba(8, 12, 20, 0.82)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(0,212,255,0.22)',
          borderRadius: 24,
          boxShadow: '0 0 0 1px rgba(0,212,255,0.06) inset, 0 40px 100px rgba(0,0,0,0.7), 0 0 80px rgba(0,212,255,0.12)',
          padding: '44px 40px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Top accent bar */}
          <div style={{
            position: 'absolute', top: 0, left: '15%', right: '15%', height: 2,
            background: 'linear-gradient(90deg, transparent, #00D4FF, transparent)',
            borderRadius: '0 0 4px 4px',
          }} />

          {/* Logo + heading */}
          <motion.div className="text-center mb-8" variants={item} initial="hidden" animate="show">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
              style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="1.5">
                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
              </svg>
            </div>
            <h1 className="font-display font-bold" style={{ fontSize: 28, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Welcome back.
            </h1>
            <p className="font-sans mt-1.5" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Sign in to{' '}
              <span style={{ color: 'var(--cyan)', fontWeight: 600 }}>NEX</span>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>VPN</span>
            </p>
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-lg"
              style={{ background: 'rgba(255,68,85,0.08)', border: '1px solid rgba(255,68,85,0.2)' }}
            >
              <AlertCircle size={14} color="#FF4455" />
              <span style={{ fontSize: 13, color: '#FF4455', fontFamily: 'var(--font-outfit)' }}>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            variants={container}
            initial="hidden"
            animate="show"
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
          >
            {/* Email */}
            <motion.div variants={item}>
              <label className="font-data block mb-2"
                style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ ...inputBase, ...(emailFocus ? inputFocus : {}) }}
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                required
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={item}>
              <div className="flex items-center justify-between mb-2">
                <label className="font-data"
                  style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <Link href="/forgot-password" className="font-sans" style={{ fontSize: 12, color: 'var(--cyan)' }}>
                  Forgot?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ ...inputBase, paddingRight: 44, ...(pwFocus ? inputFocus : {}) }}
                  onFocus={() => setPwFocus(true)}
                  onBlur={() => setPwFocus(false)}
                  required
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            {/* Sign in button */}
            <motion.div variants={item}>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02, boxShadow: '0 0 30px rgba(0,212,255,0.35)' } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                className="w-full flex items-center justify-center gap-2 font-display font-bold"
                style={{
                  background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                  color: '#05080D',
                  border: 'none',
                  borderRadius: 10,
                  padding: '13px 20px',
                  fontSize: 14,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.02em',
                  opacity: isLoading ? 0.75 : 1,
                }}
              >
                {isLoading ? (
                  <><Loader2 size={15} className="animate-spin" /> Signing in…</>
                ) : (
                  <>Sign In <ArrowRight size={15} /></>
                )}
              </motion.button>
            </motion.div>

            {/* Divider */}
            <motion.div variants={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(0,212,255,0.08)' }} />
              <span className="font-data" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(0,212,255,0.08)' }} />
            </motion.div>

            {/* Google OAuth */}
            <motion.div variants={item}>
              <motion.a
                href={process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || 'http://localhost:3001/api/v1/auth/google'}
                whileHover={{ scale: 1.02, borderColor: 'rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.04)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2.5 font-sans"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  background: 'rgba(22,32,48,0.4)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(0,212,255,0.12)',
                  borderRadius: 10,
                  padding: '12px 20px',
                  fontSize: 14,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
              >
                <GoogleIcon size={18} /> Continue with Google
              </motion.a>
            </motion.div>
          </motion.form>

          {/* Footer link */}
          <motion.p
            className="text-center font-sans mt-6"
            style={{ fontSize: 13, color: 'var(--text-muted)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          >
            No account?{' '}
            <Link href="/signup" style={{ color: 'var(--cyan)', fontWeight: 600 }}>
              Start free →
            </Link>
          </motion.p>
        </div>

        {/* Trust strip below card */}
        <motion.div
          className="flex items-center justify-center gap-5 mt-5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        >
          {['WireGuard', 'Zero Logs', 'Open Source'].map(t => (
            <span key={t} className="font-data flex items-center gap-1.5"
              style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
              <span style={{ color: 'var(--green)' }}>✓</span> {t}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
