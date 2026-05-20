'use client'

import { useEffect, useState } from 'react'
import { Trash2, ShieldCheck, ShieldOff, Ban, CheckCircle } from 'lucide-react'
import api from '@/lib/api'

interface AdminUser {
  id: string; email: string; name: string
  role: 'USER' | 'ADMIN'; plan: string; banned: boolean; createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/v1/admin/users')
      setUsers(res.data.users)
      setTotal(res.data.total)
    } catch { setError('Failed to load users') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const patch = async (id: string, data: { role?: 'USER' | 'ADMIN'; banned?: boolean }) => {
    await api.patch(`/api/v1/admin/users/${id}`, data)
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return
    await api.delete(`/api/v1/admin/users/${id}`)
    load()
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display font-bold" style={{ fontSize: 24, color: 'var(--text-primary)' }}>Users</h1>
        <p className="font-sans" style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{total} total</p>
      </div>

      {error && <p style={{ color: '#FF4455', marginBottom: 16 }}>{error}</p>}

      {loading ? (
        <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-outfit)' }}>Loading…</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-outfit)', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
                {['Email', 'Name', 'Role', 'Plan', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="font-data" style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: u.banned ? 0.5 : 1 }}>
                  <td style={{ padding: '12px', color: 'var(--text-primary)' }}>{u.email}</td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{u.name}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                      background: u.role === 'ADMIN' ? 'rgba(240,165,0,0.15)' : 'rgba(0,212,255,0.08)',
                      color: u.role === 'ADMIN' ? 'var(--amber)' : 'var(--cyan)',
                      border: `1px solid ${u.role === 'ADMIN' ? 'rgba(240,165,0,0.3)' : 'rgba(0,212,255,0.2)'}`,
                    }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{u.plan}</td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)', fontSize: 12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button title={u.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                        onClick={() => patch(u.id, { role: u.role === 'ADMIN' ? 'USER' : 'ADMIN' })}
                        style={{ background: 'none', border: '1px solid rgba(240,165,0,0.3)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: 'var(--amber)' }}>
                        {u.role === 'ADMIN' ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                      </button>
                      <button title={u.banned ? 'Unban' : 'Ban'}
                        onClick={() => patch(u.id, { banned: !u.banned })}
                        style={{ background: 'none', border: `1px solid ${u.banned ? 'rgba(0,255,157,0.3)' : 'rgba(255,68,85,0.3)'}`, borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: u.banned ? '#00FF9D' : '#FF4455' }}>
                        {u.banned ? <CheckCircle size={14} /> : <Ban size={14} />}
                      </button>
                      <button title="Delete" onClick={() => remove(u.id)}
                        style={{ background: 'none', border: '1px solid rgba(255,68,85,0.2)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: '#FF4455' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
