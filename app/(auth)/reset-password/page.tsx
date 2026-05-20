'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import api from '@/lib/api'
import { useAuthStore } from '@/store/auth'

const FloatingParticles = dynamic(() => import('@/components/3d/FloatingParticles'), { ssr: false })

export default function ResetPasswordPage() {
  const router = useRouter()
  const params = useSearchParams()
  const { setSession } = useAuthStore()
  const token = params.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/api/v1/auth/reset-password', { token, newPassword: password })
      const { user, accessToken, refreshToken } = res.data
      setSession(user, accessToken, refreshToken)
      router.replace('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Reset failed. The link may have expired.'
      setError(msg)
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

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', color: 'var(--text-secondary)', fontFamily: 'var(--font-outfit)' }}>
        Invalid reset link.
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'var(--bg-base)' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}><FloatingParticles /></div>
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(0,212,255,0.15) 0%, transparent 80%)' }} />

      <motion.div className="relative z-10 w-full mx-4" style={{ maxWidth: 460 }}
        initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <div style={{
          background: 'rgba(8,12,20,0.82)', backdropFilter: 'blur(32px)',
          border: '1px solid rgba(0,212,255,0.22)', borderRadius: 24,
          boxShadow: '0 40px 100px rgba(0,0,0,0.7)', padding: '44px 40px 40px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 2, background: 'linear-gradient(90deg,transparent,#00D4FF,transparent)' }} />

          <div className="text-center mb-8">
            <h1 className="font-display font-bold" style={{ fontSize: 26, color: 'var(--text-primary)' }}>
              Choose a new password
            </h1>
          </div>

          {error && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2.5 rounded-lg"
              style={{ background: 'rgba(255,68,85,0.08)', border: '1px solid rgba(255,68,85,0.2)' }}>
              <AlertCircle size={14} color="#FF4455" />
              <span style={{ fontSize: 13, color: '#FF4455', fontFamily: 'var(--font-outfit)' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="font-data block mb-2" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: 44 }} required minLength={8} />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="font-data block mb-2" style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                Confirm Password
              </label>
              <input type="password" placeholder="••••••••"
                value={confirm} onChange={e => setConfirm(e.target.value)}
                style={inputStyle} required />
            </div>

            <motion.button type="submit" disabled={loading}
              whileHover={!loading ? { scale: 1.02, boxShadow: '0 0 30px rgba(0,212,255,0.35)' } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full flex items-center justify-center gap-2 font-display font-bold"
              style={{
                background: 'linear-gradient(135deg,#00D4FF 0%,#0099CC 100%)',
                color: '#05080D', border: 'none', borderRadius: 10,
                padding: '13px 20px', fontSize: 14,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.75 : 1,
              }}>
              {loading ? <><Loader2 size={15} className="animate-spin" /> Resetting…</> : <>Reset Password <ArrowRight size={15} /></>}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
