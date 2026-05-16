'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Check, AlertCircle, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

const FloatingParticles = dynamic(() => import('@/components/3d/FloatingParticles'), { ssr: false })

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

const strengthMeta = [
  { label: '',       color: 'transparent' },
  { label: 'Weak',   color: '#FF4455' },
  { label: 'Fair',   color: '#F0A500' },
  { label: 'Good',   color: '#F0A500' },
  { label: 'Strong', color: '#00FF9D' },
] as const

function getStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0
  if (pw.length < 5) return 1
  if (pw.length < 8) return 2
  if (pw.length < 12) return 3
  return 4
}

const item = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}
const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
}

export default function SignupPage() {
  const router = useRouter()
  const { register, isLoading, error, clearError } = useAuthStore()

  const [name,        setName]        = useState('')
  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [confirm,     setConfirm]     = useState('')
  const [agreed,      setAgreed]      = useState(false)
  const [showPw,      setShowPw]      = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [localError,  setLocalError]  = useState('')

  const [focusName,    setFocusName]    = useState(false)
  const [focusEmail,   setFocusEmail]   = useState(false)
  const [focusPw,      setFocusPw]      = useState(false)
  const [focusConfirm, setFocusConfirm] = useState(false)

  const strength = getStrength(password)
  const displayError = localError || error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    clearError()

    if (password !== confirm) {
      setLocalError('Passwords do not match.')
      return
    }
    if (!agreed) {
      setLocalError('You must agree to the Terms of Service.')
      return
    }

    try {
      await register(name, email, password)
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

  const focused: React.CSSProperties = {
    borderColor: 'rgba(0,212,255,0.5)',
    boxShadow: '0 0 0 3px rgba(0,212,255,0.08), 0 0 20px rgba(0,212,255,0.06)',
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '32px 16px', background: 'var(--bg-base)' }}>

      {/* Full-screen particle field */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <FloatingParticles />
      </div>

      {/* Radial spotlight */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(0,212,255,0.18) 0%, rgba(0,212,255,0.04) 50%, transparent 80%)' }} />

      {/* Bottom dark fade */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 z-0 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(5,8,13,0.8), transparent)' }} />

      {/* Glassmorphism card */}
      <motion.div
        className="relative z-10 w-full mx-4"
        style={{ maxWidth: 520 }}
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
          padding: '40px 40px 36px',
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
          <motion.div className="text-center mb-7" variants={item} initial="hidden" animate="show">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="1.5">
                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
              </svg>
            </div>
            <h1 className="font-display font-bold" style={{ fontSize: 26, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              Create account.
            </h1>
            <p className="font-sans mt-1.5" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Start free — no card required
            </p>
          </motion.div>

          {/* Error message */}
          {displayError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-lg"
              style={{ background: 'rgba(255,68,85,0.08)', border: '1px solid rgba(255,68,85,0.2)' }}
            >
              <AlertCircle size={14} color="#FF4455" />
              <span style={{ fontSize: 13, color: '#FF4455', fontFamily: 'var(--font-outfit)' }}>{displayError}</span>
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            variants={container} initial="hidden" animate="show"
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {/* Name */}
            <motion.div variants={item}>
              <label className="font-data block mb-1.5"
                style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ ...inputBase, ...(focusName ? focused : {}) }}
                onFocus={() => setFocusName(true)}
                onBlur={() => setFocusName(false)}
                required
              />
            </motion.div>

            {/* Email */}
            <motion.div variants={item}>
              <label className="font-data block mb-1.5"
                style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ ...inputBase, ...(focusEmail ? focused : {}) }}
                onFocus={() => setFocusEmail(true)}
                onBlur={() => setFocusEmail(false)}
                required
              />
            </motion.div>

            {/* Password + strength */}
            <motion.div variants={item}>
              <label className="font-data block mb-1.5"
                style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{ ...inputBase, paddingRight: 44, ...(focusPw ? focused : {}) }}
                  onFocus={() => setFocusPw(true)}
                  onBlur={() => setFocusPw(false)}
                  required
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Strength bars */}
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                {([1, 2, 3, 4] as const).map(i => (
                  <motion.div key={i} style={{ flex: 1, height: 3, borderRadius: 2 }}
                    animate={{ backgroundColor: i <= strength ? strengthMeta[strength].color : 'rgba(0,212,255,0.08)' }}
                    transition={{ duration: 0.3 }} />
                ))}
              </div>
              {strength > 0 && (
                <motion.span className="font-data" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ fontSize: 10, color: strengthMeta[strength].color, marginTop: 4, display: 'block' }}>
                  {strengthMeta[strength].label}
                </motion.span>
              )}
            </motion.div>

            {/* Confirm password */}
            <motion.div variants={item}>
              <label className="font-data block mb-1.5"
                style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  style={{ ...inputBase, paddingRight: 44, ...(focusConfirm ? focused : {}) }}
                  onFocus={() => setFocusConfirm(true)}
                  onBlur={() => setFocusConfirm(false)}
                  required
                />
                <button type="button" onClick={() => setShowConfirm(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </motion.div>

            {/* Terms */}
            <motion.div variants={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <button type="button" onClick={() => setAgreed(p => !p)}
                style={{
                  width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
                  background: agreed ? 'var(--cyan)' : 'rgba(22,32,48,0.6)',
                  border: `1px solid ${agreed ? 'var(--cyan)' : 'rgba(0,212,255,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>
                {agreed && <Check size={11} color="#05080D" strokeWidth={3} />}
              </button>
              <span className="font-sans" style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                I agree to the{' '}
                <Link href="#" style={{ color: 'var(--cyan)' }}>Terms of Service</Link>
                {' '}and{' '}
                <Link href="#" style={{ color: 'var(--cyan)' }}>Privacy Policy</Link>
              </span>
            </motion.div>

            {/* Submit */}
            <motion.div variants={item}>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { scale: 1.02, boxShadow: '0 0 30px rgba(0,212,255,0.35)' } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
                className="w-full flex items-center justify-center gap-2 font-display font-bold"
                style={{
                  background: 'linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)',
                  color: '#05080D', border: 'none', borderRadius: 10,
                  padding: '13px 20px', fontSize: 14,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  letterSpacing: '0.02em',
                  opacity: isLoading ? 0.75 : 1,
                }}>
                {isLoading ? (
                  <><Loader2 size={15} className="animate-spin" /> Creating account…</>
                ) : (
                  <>Create Account <ArrowRight size={15} /></>
                )}
              </motion.button>
            </motion.div>

            {/* Divider */}
            <motion.div variants={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(0,212,255,0.08)' }} />
              <span className="font-data" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>OR</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(0,212,255,0.08)' }} />
            </motion.div>

            {/* GitHub */}
            <motion.div variants={item}>
              <motion.button type="button"
                whileHover={{ scale: 1.02, borderColor: 'rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.04)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2.5 font-sans"
                style={{
                  background: 'rgba(22,32,48,0.4)', color: 'var(--text-primary)',
                  border: '1px solid rgba(0,212,255,0.12)', borderRadius: 10,
                  padding: '12px 20px', fontSize: 14, cursor: 'pointer', transition: 'background 0.2s',
                }}>
                <GitHubIcon size={16} /> Continue with GitHub
              </motion.button>
            </motion.div>
          </motion.form>

          <motion.p className="text-center font-sans mt-5"
            style={{ fontSize: 13, color: 'var(--text-muted)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--cyan)', fontWeight: 600 }}>Sign in →</Link>
          </motion.p>
        </div>

        {/* Trust strip */}
        <motion.div className="flex items-center justify-center gap-5 mt-5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
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
