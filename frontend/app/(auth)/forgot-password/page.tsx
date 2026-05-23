'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import api from '@/lib/api'

const FloatingParticles = dynamic(() => import('@/components/3d/FloatingParticles'), { ssr: false })

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await api.post('/api/v1/auth/forgot-password', { email })
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(22,32,48,0.6)',
    border: '1px solid rgba(0,212,255,0.12)',
    borderRadius: 8,
    padding: '11px 14px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-outfit)',
    fontSize: 14,
    outline: 'none',
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'var(--bg-base)' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <FloatingParticles />
      </div>
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0,212,255,0.15) 0%, transparent 80%)' }} />

      <motion.div
        className="relative z-10 w-full mx-4"
        style={{ maxWidth: 460 }}
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55 }}
      >
        <div style={{
          background: 'rgba(8,12,20,0.82)',
          backdropFilter: 'blur(32px)',
          border: '1px solid rgba(0,212,255,0.22)',
          borderRadius: 24,
          boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 80px rgba(0,212,255,0.1)',
          padding: '44px 40px 40px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 2, background: 'linear-gradient(90deg,transparent,#00D4FF,transparent)' }} />

          {!sent ? (
            <>
              <motion.div className="text-center mb-8" variants={item} initial="hidden" animate="show">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
                  style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="1.5">
                    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
                  </svg>
                </div>
                <h1 className="font-display font-bold" style={{ fontSize: 26, color: 'var(--text-primary)' }}>
                  Forgot password?
                </h1>
                <p className="font-sans mt-2" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  Enter your email and we'll send a reset link.
                </p>
              </motion.div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-lg"
                  style={{ background: 'rgba(255,68,85,0.08)', border: '1px solid rgba(255,68,85,0.2)' }}>
                  <AlertCircle size={14} color="#FF4455" />
                  <span style={{ fontSize: 13, color: '#FF4455', fontFamily: 'var(--font-outfit)' }}>{error}</span>
                </motion.div>
              )}

              <motion.form onSubmit={handleSubmit} variants={item} initial="hidden" animate="show"
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="font-data block mb-2" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 30px rgba(0,212,255,0.35)' } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  className="w-full flex items-center justify-center gap-2 font-display font-bold"
                  style={{
                    background: 'linear-gradient(135deg,#00D4FF 0%,#0099CC 100%)',
                    color: '#05080D', border: 'none', borderRadius: 10,
                    padding: '13px 20px', fontSize: 14,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.75 : 1,
                  }}
                >
                  {loading ? <><Loader2 size={15} className="animate-spin" /> Sending…</> : <>Send Reset Link <ArrowRight size={15} /></>}
                </motion.button>
              </motion.form>
            </>
          ) : (
            <motion.div className="text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <CheckCircle size={48} color="#00FF9D" style={{ margin: '0 auto 16px' }} />
              <h2 className="font-display font-bold" style={{ fontSize: 22, color: 'var(--text-primary)', marginBottom: 8 }}>
                Check your email
              </h2>
              <p className="font-sans" style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
                If an account exists for <strong style={{ color: 'var(--cyan)' }}>{email}</strong>, you'll receive a reset link shortly.
              </p>
            </motion.div>
          )}

          <p className="text-center font-sans mt-6" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            <Link href="/login" style={{ color: 'var(--cyan)', fontWeight: 600 }}>← Back to login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
