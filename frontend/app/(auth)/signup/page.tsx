'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth'

/* ── Shared helpers ───────────────────────────────────────── */

function GoogleIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

const inputBase: React.CSSProperties = {
  width: '100%',
  background: 'var(--elevated)',
  border: '1px solid var(--app-border)',
  borderRadius: 'var(--r-md)',
  padding: '12px 16px',
  color: 'var(--text)',
  fontFamily: 'var(--font-manrope)',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}

const inputFocused: React.CSSProperties = {
  borderColor: 'var(--violet-border)',
  boxShadow: '0 0 0 3px var(--violet-dim)',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-jetbrains)',
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'var(--text-2)',
  marginBottom: 6,
}

/* ── Password strength ────────────────────────────────────── */

function getStrength(pw: string): number {
  let s = 0
  if (pw.length >= 8) s++
  if (pw.length >= 12) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

function segmentColor(strength: number): string {
  if (strength <= 1) return 'var(--rose)'
  if (strength <= 3) return 'var(--amber)'
  return 'var(--emerald)'
}

function strengthLabel(strength: number): string {
  if (strength === 0) return ''
  if (strength <= 1) return 'Weak'
  if (strength <= 3) return 'Fair'
  return 'Strong'
}

/* ── Animation variants ───────────────────────────────────── */

const formContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } },
}

const formItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

const leftContent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const leftItem = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

/* ── SecurityRings ────────────────────────────────────────── */

function SecurityRings() {
  return (
    <div style={{ position: 'relative', width: 180, height: 180, margin: '0 auto' }}>
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.04, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '1px solid var(--violet-border)',
          boxShadow: '0 0 30px rgba(124,92,255,0.08)',
        }}
      />
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.06, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        style={{
          position: 'absolute', inset: 24, borderRadius: '50%',
          border: '1px solid rgba(124,92,255,0.28)',
          boxShadow: '0 0 20px rgba(124,92,255,0.12)',
        }}
      />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        style={{
          position: 'absolute', inset: 48, borderRadius: '50%',
          border: '1px solid rgba(124,92,255,0.45)',
          boxShadow: '0 0 15px rgba(124,92,255,0.2)',
        }}
      />
      <div style={{
        position: 'absolute', inset: 64, borderRadius: '50%',
        background: 'var(--violet-dim)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 40px rgba(124,92,255,0.3)',
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z"
            stroke="var(--violet)" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M9 12l2 2 4-4" stroke="var(--emerald)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

/* ── BrandPanel ───────────────────────────────────────────── */

function BrandPanel({ headline1, headline2, tagline }: { headline1: string; headline2: string; tagline: string }) {
  return (
    <div
      className="auth-brand-panel"
      style={{
        flex: '0 0 60%',
        minHeight: '100dvh',
        display: 'none',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 56px',
        position: 'relative',
        overflow: 'hidden',
        background: `
          radial-gradient(ellipse 70% 60% at 30% 40%, rgba(124,92,255,0.2) 0%, transparent 60%),
          radial-gradient(ellipse 50% 50% at 70% 70%, rgba(0,229,160,0.08) 0%, transparent 60%),
          var(--bg)
        `,
      }}
    >
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(var(--app-border) 1px, transparent 1px), linear-gradient(90deg, var(--app-border) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 30% 40%, black 0%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 30% 40%, black 0%, transparent 70%)',
      }} />

      <motion.div variants={leftItem} initial="hidden" animate="show" style={{ position: 'relative', zIndex: 1 }}>
        <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.18em', color: 'var(--violet)', textTransform: 'uppercase' }}>NEX</span>
        <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.18em', color: 'var(--text-2)', textTransform: 'uppercase' }}>VPN</span>
      </motion.div>

      <motion.div
        variants={leftContent}
        initial="hidden"
        animate="show"
        style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 36 }}
      >
        <div>
          <motion.div variants={leftItem}>
            <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(3.5rem, 6vw, 5.5rem)', lineHeight: 1, letterSpacing: '0.02em', color: 'var(--text)', margin: 0 }}>
              {headline1}
            </h1>
          </motion.div>
          <motion.div variants={leftItem}>
            <h1 className="gradient-text" style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(3.5rem, 6vw, 5.5rem)', lineHeight: 1, letterSpacing: '0.02em', margin: 0 }}>
              {headline2}
            </h1>
          </motion.div>
          <motion.p variants={leftItem} style={{ fontFamily: 'var(--font-manrope)', fontSize: '15px', color: 'var(--text-2)', marginTop: 16, maxWidth: 340, lineHeight: 1.6 }}>
            {tagline}
          </motion.p>
        </div>

        <motion.div variants={leftItem}>
          <SecurityRings />
        </motion.div>

        <motion.div variants={leftItem} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {['WireGuard Protocol', 'Zero-Log Architecture', 'AI Smart Routing'].map((feat) => (
            <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 8px rgba(0,229,160,0.6)', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-manrope)', fontSize: '14px', color: 'var(--text-2)' }}>{feat}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.p
        variants={leftItem}
        initial="hidden"
        animate="show"
        style={{ position: 'relative', zIndex: 1, fontFamily: 'var(--font-jetbrains)', fontSize: '11px', color: 'var(--text-3)', letterSpacing: '0.06em' }}
      >
        Trusted by 50,000+ users worldwide
      </motion.p>
    </div>
  )
}

/* ── SignupPage ───────────────────────────────────────────── */

export default function SignupPage() {
  const router = useRouter()
  const { register, isLoading, error, clearError } = useAuthStore()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [localError, setLocalError] = useState('')

  const [focusName, setFocusName] = useState(false)
  const [focusEmail, setFocusEmail] = useState(false)
  const [focusPw, setFocusPw] = useState(false)

  const strength = getStrength(password)
  const displayError = localError || error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')
    clearError()
    try {
      await register(name, email, password)
      router.push('/dashboard')
    } catch {
      // error handled by store
    }
  }

  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .auth-brand-panel { display: flex !important; }
          .auth-mobile-logo { display: none !important; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100dvh', background: 'var(--bg)' }}>
        {/* Left brand panel */}
        <BrandPanel
          headline1="JOIN THE"
          headline2="NETWORK."
          tagline="Free your internet with AI-powered routing and enterprise-grade privacy. No logs, ever."
        />

        {/* Right form panel */}
        <div style={{
          flex: '1 1 40%',
          minHeight: '100dvh',
          background: 'var(--surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          borderLeft: '1px solid var(--app-border)',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', maxWidth: 420 }}
          >
            {/* Mobile-only logo */}
            <div className="auth-mobile-logo" style={{ marginBottom: 32, textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.18em', color: 'var(--violet)', textTransform: 'uppercase' }}>NEX</span>
              <span style={{ fontFamily: 'var(--font-manrope)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.18em', color: 'var(--text-2)', textTransform: 'uppercase' }}>VPN</span>
            </div>

            {/* Heading */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: '1.75rem', color: 'var(--text)', margin: 0, lineHeight: 1.2 }}>
                Create your account
              </h2>
              <p style={{ fontFamily: 'var(--font-manrope)', fontSize: '14px', color: 'var(--text-2)', marginTop: 8 }}>
                Free forever — no credit card required
              </p>
            </div>

            {/* Error banner */}
            {displayError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: 'var(--rose-dim)',
                  border: '1px solid var(--rose-border)',
                  borderRadius: 'var(--r-md)',
                  padding: '10px 14px',
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  color: 'var(--rose)',
                  fontSize: 13,
                  fontFamily: 'var(--font-manrope)',
                  marginBottom: 16,
                }}
              >
                ⚠ {displayError}
              </motion.div>
            )}

            {/* Form */}
            <motion.form
              variants={formContainer}
              initial="hidden"
              animate="show"
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {/* Full name */}
              <motion.div variants={formItem}>
                <label style={labelStyle}>Full name</label>
                <input
                  type="text"
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ ...inputBase, ...(focusName ? inputFocused : {}) }}
                  onFocus={() => setFocusName(true)}
                  onBlur={() => setFocusName(false)}
                  required
                />
              </motion.div>

              {/* Email */}
              <motion.div variants={formItem}>
                <label style={labelStyle}>Email address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{ ...inputBase, ...(focusEmail ? inputFocused : {}) }}
                  onFocus={() => setFocusEmail(true)}
                  onBlur={() => setFocusEmail(false)}
                  required
                />
              </motion.div>

              {/* Password + strength meter */}
              <motion.div variants={formItem}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ ...inputBase, paddingRight: 44, ...(focusPw ? inputFocused : {}) }}
                    onFocus={() => setFocusPw(true)}
                    onBlur={() => setFocusPw(false)}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(p => !p)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-2)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Strength segments */}
                {password.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <motion.div
                          key={i}
                          animate={{ backgroundColor: i <= strength ? segmentColor(strength) : 'var(--elevated)' }}
                          transition={{ duration: 0.3 }}
                          style={{ flex: 1, height: 3, borderRadius: 2 }}
                        />
                      ))}
                    </div>
                    {strength > 0 && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-jetbrains)',
                          fontSize: '10px',
                          color: segmentColor(strength),
                          marginTop: 4,
                          letterSpacing: '0.06em',
                        }}
                      >
                        {strengthLabel(strength)}
                      </motion.span>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Submit */}
              <motion.div variants={formItem} style={{ marginTop: 4 }}>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={!isLoading ? { scale: 1.02, boxShadow: '0 0 30px rgba(124,92,255,0.35)' } : {}}
                  whileTap={!isLoading ? { scale: 0.98 } : {}}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    background: 'linear-gradient(135deg, var(--violet) 0%, #5B3FD9 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 'var(--r-md)',
                    padding: '13px 20px',
                    fontSize: '14px',
                    fontFamily: 'var(--font-manrope)',
                    fontWeight: 600,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.75 : 1,
                    letterSpacing: '0.01em',
                    transition: 'opacity 0.2s',
                  }}
                >
                  {isLoading
                    ? <><Loader2 size={15} className="animate-spin" /> Creating account…</>
                    : <>Create Account <ArrowRight size={15} /></>
                  }
                </motion.button>
              </motion.div>

              {/* Divider */}
              <motion.div variants={formItem} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, height: 1, background: 'var(--app-border)' }} />
                <span style={{ fontFamily: 'var(--font-jetbrains)', fontSize: '10px', color: 'var(--text-3)', letterSpacing: '0.08em' }}>OR</span>
                <div style={{ flex: 1, height: 1, background: 'var(--app-border)' }} />
              </motion.div>

              {/* Google OAuth */}
              <motion.div variants={formItem}>
                <motion.a
                  href={process.env.NEXT_PUBLIC_GOOGLE_AUTH_URL || 'http://localhost:3001/api/v1/auth/google'}
                  whileHover={{ borderColor: 'var(--app-border-hover)', background: 'var(--elevated)' }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    width: '100%',
                    background: 'var(--elevated)',
                    color: 'var(--text)',
                    border: '1px solid var(--app-border)',
                    borderRadius: 'var(--r-md)',
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontFamily: 'var(--font-manrope)',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                >
                  <GoogleIcon /> Continue with Google
                </motion.a>
              </motion.div>
            </motion.form>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ textAlign: 'center', fontFamily: 'var(--font-manrope)', fontSize: '13px', color: 'var(--text-2)', marginTop: 28 }}
            >
              Already have an account?{' '}
              <Link href="/login" style={{ color: 'var(--violet)', fontWeight: 600, textDecoration: 'none' }}>
                Sign in →
              </Link>
            </motion.p>

            {/* Legal */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ textAlign: 'center', fontFamily: 'var(--font-manrope)', fontSize: '11px', color: 'var(--text-3)', marginTop: 16, lineHeight: 1.6 }}
            >
              By creating an account you agree to our{' '}
              <Link href="#" style={{ color: 'var(--text-2)', textDecoration: 'underline' }}>Terms</Link>
              {' '}and{' '}
              <Link href="#" style={{ color: 'var(--text-2)', textDecoration: 'underline' }}>Privacy Policy</Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
