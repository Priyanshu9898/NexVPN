'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'

interface Sub {
  id: string; plan: string; status: string; currentPeriodEnd: string | null
  createdAt: string; user: { email: string; name: string }
}

const PLANS = ['free', 'pro', 'enterprise']

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<Sub[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try { const res = await api.get('/api/v1/admin/subscriptions'); setSubs(res.data.subscriptions); setTotal(res.data.total) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const updatePlan = async (id: string, plan: string) => {
    await api.patch(`/api/v1/admin/subscriptions/${id}`, { plan })
    load()
  }

  const planColor = (p: string) =>
    p === 'enterprise' ? '#F0A500' : p === 'pro' ? '#00D4FF' : 'var(--text-muted)'

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display font-bold" style={{ fontSize: 24, color: 'var(--text-primary)' }}>Subscriptions</h1>
        <p className="font-sans" style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{total} total</p>
      </div>

      {loading ? <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-outfit)' }}>Loading…</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-outfit)', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
              {['User', 'Plan', 'Status', 'Period End', 'Override'].map(h => (
                <th key={h} className="font-data" style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subs.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ color: 'var(--text-primary)', fontSize: 13 }}>{s.user.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{s.user.email}</div>
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{ color: planColor(s.plan), fontWeight: 600, textTransform: 'uppercase', fontSize: 12 }}>{s.plan}</span>
                </td>
                <td style={{ padding: '12px', color: s.status === 'active' ? '#00FF9D' : '#FF4455', fontSize: 12 }}>{s.status}</td>
                <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: 12 }}>
                  {s.currentPeriodEnd ? new Date(s.currentPeriodEnd).toLocaleDateString() : '—'}
                </td>
                <td style={{ padding: '12px' }}>
                  <select value={s.plan} onChange={e => updatePlan(s.id, e.target.value)}
                    style={{ background: 'rgba(22,32,48,0.8)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: 6, padding: '4px 8px', color: 'var(--text-primary)', fontFamily: 'var(--font-outfit)', fontSize: 12, cursor: 'pointer' }}>
                    {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
