'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Loader2 } from 'lucide-react'

/* ── Shared styles ────────────────────────────────────────── */

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

/* ── Animations ───────────────────────────────────────────── */

const formContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
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
        style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid var(--violet-border)', boxShadow: '0 0 30px rgba(124,92,255,0.08)' }}
      />
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.06, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        style={{ position: 'absolute', inset: 24, borderRadius: '50%', border: '1px solid rgba(124,92,255,0.28)', boxShadow: '0 0 20px rgba(124,92,255,0.12)' }}
      />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        style={{ position: 'absolute', inset: 48, borderRadius: '50%', border: '1px solid rgba(124,92,255,0.45)', boxShadow: '0 0 15px rgba(124,92,255,0.2)' }}
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
          <rect x="9" y="11" width="6" height="5" rx="1" stroke="var(--amber)" strokeWidth="1.5"/>
          <path d="M12 8v3" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  )
}

/* ── BrandPanel ───────────────────────────────────────────── */

function BrandPanel() {
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
              RESET YOUR
            </h1>
          </motion.div>
          <motion.div variants={leftItem}>
            <h1 className="gradient-text" style={{ fontFamily: 'var(--font-bebas)', fontSize: 'clamp(3.5rem, 6vw, 5.5rem)', lineHeight: 1, letterSpacing: '0.02em', margin: 0 }}>
              ACCESS.
            </h1>
          </motion.div>
          <motion.p variants={leftItem} style={{ fontFamily: 'var(--font-manrope)', fontSize: '15px', color: 'var(--text-2)', marginTop: 16, maxWidth: 340, lineHeight: 1.6 }}>
            Locked out? No problem. Enter your email and we'll send a secure reset link within seconds.
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

/* ── ForgotPasswordPage ───────────────────────────────────── */

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [emailFocus, setEmailFocus] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/v1/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      )
      if (!res.ok) throw new Error('Request failed')
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
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
        <BrandPanel />

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

            {!sent ? (
              <>
                {/* Heading */}
                <div style={{ marginBottom: 32 }}>
                  <h2 style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: '1.75rem', color: 'var(--text)', margin: 0, lineHeight: 1.2 }}>
                    Forgot your password?
                  </h2>
                  <p style={{ fontFamily: 'var(--font-manrope)', fontSize: '14px', color: 'var(--text-2)', marginTop: 8, lineHeight: 1.6 }}>
                    Enter your email address and we'll send you a secure link to reset it.
                  </p>
                </div>

                {/* Error banner */}
                {error && (
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
                    ⚠ {error}
                  </motion.div>
                )}

                {/* Form */}
                <motion.form
                  variants={formContainer}
                  initial="hidden"
                  animate="show"
                  onSubmit={handleSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
                >
                  <motion.div variants={formItem}>
                    <label style={labelStyle}>Email address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      style={{ ...inputBase, ...(emailFocus ? inputFocused : {}) }}
                      onFocus={() => setEmailFocus(true)}
                      onBlur={() => setEmailFocus(false)}
                      required
                    />
                  </motion.div>

                  <motion.div variants={formItem}>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 30px rgba(124,92,255,0.35)' } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
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
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.75 : 1,
                        letterSpacing: '0.01em',
                        transition: 'opacity 0.2s',
                      }}
                    >
                      {loading
                        ? <><Loader2 size={15} className="animate-spin" /> Sending…</>
                        : <>Send Reset Link <ArrowRight size={15} /></>
                      }
                    </motion.button>
                  </motion.div>
                </motion.form>
              </>
            ) : (
              /* Success state */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div style={{
                  background: 'var(--emerald-dim)',
                  border: '1px solid var(--emerald-border)',
                  borderRadius: 'var(--r-lg)',
                  padding: '32px 28px',
                  textAlign: 'center',
                  marginBottom: 24,
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: 'rgba(0,229,160,0.15)',
                    border: '1px solid var(--emerald-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" stroke="var(--emerald)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-manrope)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text)', margin: '0 0 8px' }}>
                    Check your email
                  </h3>
                  <p style={{ fontFamily: 'var(--font-manrope)', fontSize: '14px', color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
                    We sent a reset link to{' '}
                    <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>{email}</span>.
                    It expires in 1 hour.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Back link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ textAlign: 'center', fontFamily: 'var(--font-manrope)', fontSize: '13px', color: 'var(--text-2)', marginTop: sent ? 0 : 28 }}
            >
              <Link href="/login" style={{ color: 'var(--violet)', fontWeight: 600, textDecoration: 'none' }}>
                ← Back to sign in
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
