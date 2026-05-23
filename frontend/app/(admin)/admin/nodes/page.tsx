'use client'

import { useEffect, useState } from 'react'
import { Trash2, PlusCircle } from 'lucide-react'
import api from '@/lib/api'

interface Node { id: string; region: string; city: string; ip: string; status: string; loadPercent: number }

export default function AdminNodesPage() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ region: '', city: '', ip: '' })

  const load = async () => {
    setLoading(true)
    try { const res = await api.get('/api/v1/admin/nodes'); setNodes(res.data.nodes) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const toggleStatus = async (node: Node) => {
    await api.patch(`/api/v1/admin/nodes/${node.id}`, { status: node.status === 'online' ? 'offline' : 'online' })
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Remove this node?')) return
    await api.delete(`/api/v1/admin/nodes/${id}`)
    load()
  }

  const addNode = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.post('/api/v1/admin/nodes', form)
    setForm({ region: '', city: '', ip: '' })
    setAdding(false)
    load()
  }

  const inputStyle: React.CSSProperties = {
    background: 'rgba(22,32,48,0.6)', border: '1px solid rgba(0,212,255,0.15)',
    borderRadius: 6, padding: '8px 12px', color: 'var(--text-primary)',
    fontFamily: 'var(--font-outfit)', fontSize: 13, outline: 'none',
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 className="font-display font-bold" style={{ fontSize: 24, color: 'var(--text-primary)' }}>Nodes</h1>
          <p className="font-sans" style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{nodes.length} nodes</p>
        </div>
        <button onClick={() => setAdding(v => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', color: 'var(--cyan)', fontSize: 13, fontFamily: 'var(--font-outfit)' }}>
          <PlusCircle size={15} /> Add Node
        </button>
      </div>

      {adding && (
        <form onSubmit={addNode} style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          <input placeholder="Region (e.g. eu-west)" value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))} style={inputStyle} required />
          <input placeholder="City (e.g. Frankfurt)" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} style={inputStyle} required />
          <input placeholder="IP Address" value={form.ip} onChange={e => setForm(f => ({ ...f, ip: e.target.value }))} style={inputStyle} required />
          <button type="submit" style={{ background: 'linear-gradient(135deg,#00D4FF,#0099CC)', color: '#05080D', border: 'none', borderRadius: 8, padding: '8px 16px', cursor: 'pointer', fontWeight: 700, fontFamily: 'var(--font-outfit)', fontSize: 13 }}>
            Add
          </button>
        </form>
      )}

      {loading ? <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-outfit)' }}>Loading…</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-outfit)', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
              {['City', 'Region', 'IP', 'Status', 'Load', 'Actions'].map(h => (
                <th key={h} className="font-data" style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nodes.map(n => (
              <tr key={n.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px', color: 'var(--text-primary)' }}>{n.city}</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{n.region}</td>
                <td style={{ padding: '12px', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: 12 }}>{n.ip}</td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => toggleStatus(n)} style={{
                    padding: '2px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: 'none',
                    background: n.status === 'online' ? 'rgba(0,255,157,0.15)' : 'rgba(255,68,85,0.15)',
                    color: n.status === 'online' ? '#00FF9D' : '#FF4455',
                  }}>{n.status}</button>
                </td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{n.loadPercent.toFixed(0)}%</td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => remove(n.id)} style={{ background: 'none', border: '1px solid rgba(255,68,85,0.2)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: '#FF4455' }}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
