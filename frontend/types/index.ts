export interface User {
  id: string
  email: string
  name: string
  plan: 'free' | 'pro' | 'enterprise'
}

export interface VPNNode {
  id: string
  region: string
  city: string
  ip: string
  status: 'online' | 'offline'
  loadPercent: number
  latencyMs: number
}

export interface Peer {
  id: string
  userId: string
  nodeId: string
  publicKey: string
  ipAddress: string
  createdAt: string
}

export interface Subscription {
  id: string
  status: 'active' | 'canceled' | 'past_due'
  currentPeriodEnd: string
  plan: string
}
