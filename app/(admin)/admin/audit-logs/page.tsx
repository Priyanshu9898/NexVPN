'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'

interface AuditLog { id: string; action: string; metadata: unknown; createdAt: string; user: { email: string } }

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/v1/admin/audit-logs').then(res => {
      setLogs(res.data.logs)
      setTotal(res.data.total)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-display font-bold" style={{ fontSize: 24, color: 'var(--text-primary)' }}>Audit Logs</h1>
        <p className="font-sans" style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{total} events</p>
      </div>

      {loading ? <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-outfit)' }}>Loading…</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-outfit)', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
              {['Time', 'User', 'Action', 'Metadata'].map(h => (
                <th key={h} className="font-data" style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: 11, whiteSpace: 'nowrap' }}>{new Date(log.createdAt).toLocaleString()}</td>
                <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{log.user?.email ?? '—'}</td>
                <td style={{ padding: '10px 12px', color: 'var(--cyan)', fontFamily: 'monospace', fontSize: 12 }}>{log.action}</td>
                <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: 11 }}>
                  {log.metadata ? JSON.stringify(log.metadata).slice(0, 80) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
