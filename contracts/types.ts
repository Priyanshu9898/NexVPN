// Shared contract types — all agents read this before implementing features.
// Backend Agent owns this file. Frontend Agent consumes it.

export interface User {
  id: string
  email: string
  name: string
  plan: 'free' | 'pro' | 'enterprise'
  stripeCustomerId?: string
  createdAt: string
}

export interface VPNNode {
  id: string
  region: string
  city: string
  ip: string
  status: 'online' | 'offline' | 'degraded'
  loadPercent: number
  latencyMs: number
  lastHeartbeat: string
}

export interface Peer {
  id: string
  userId: string
  nodeId: string
  publicKey: string
  ipAddress: string
  createdAt: string
  revokedAt?: string
}

export interface Subscription {
  id: string
  userId: string
  status: 'active' | 'canceled' | 'past_due' | 'trialing'
  plan: 'free' | 'pro' | 'enterprise'
  currentPeriodEnd?: string
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  metadata?: Record<string, unknown>
  createdAt: string
}

// AI Engine contracts
export interface RouteRecommendation {
  node: VPNNode
  score: number
  reasoning: string
  signals: {
    latencyScore: number
    loadScore: number
    reputationScore: number
    contextScore: number
  }
}

export interface AIRecommendationResponse {
  recommendations: RouteRecommendation[]
  userContext: string
  generatedAt: string
}

// WebSocket event contracts
export type WSEventType =
  | 'peer.connected'
  | 'peer.disconnected'
  | 'node.status_change'
  | 'metrics.update'

export interface WSEvent<T = unknown> {
  type: WSEventType
  payload: T
  timestamp: string
}

// API response envelope
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  error: string
  code: string
  statusCode: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
