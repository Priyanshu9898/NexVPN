'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/auth'

function CallbackHandler() {
  const router = useRouter()
  const params = useSearchParams()
  const { setSession } = useAuthStore()

  useEffect(() => {
    const token = params.get('token')
    const refreshToken = params.get('refreshToken')
    const role = params.get('role') as 'USER' | 'ADMIN' | null
    const error = params.get('error')

    if (error || !token || !refreshToken || !role) {
      router.replace('/login?error=oauth_failed')
      return
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setSession(
        { id: payload.sub, email: payload.email, name: payload.email, plan: payload.plan, role },
        token,
        refreshToken,
      )
      router.replace('/dashboard')
    } catch {
      router.replace('/login?error=oauth_failed')
    }
  }, [params, router, setSession])

  return null
}

export default function AuthCallbackPage() {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
    }}>
      <Suspense>
        <CallbackHandler />
      </Suspense>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid var(--violet-dim)',
          borderTop: `3px solid var(--violet)`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'var(--text-2)', fontFamily: 'var(--font-manrope)', fontSize: 14 }}>
          Signing you in…
        </p>
      </div>
    </div>
  )
}
