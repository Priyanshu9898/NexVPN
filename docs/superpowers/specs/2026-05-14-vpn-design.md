# VPN SaaS — Design Spec
**Date:** 2026-05-14  
**Status:** Approved

---

## Overview

A multi-tenant VPN SaaS product built around WireGuard, differentiated by an AI-powered smart routing engine that picks the best exit node based on performance, security signals, and per-user behavior patterns.

**Goals:** Portfolio showcase + personal daily use  
**Target:** Advanced developer, solo build

---

## Architecture

Five distinct layers:

```
[Mobile App]  [Web Dashboard]
      |              |
      └──────┬───────┘
             ▼
    [Management API]  ←→  [AI Routing Engine]
             |
    ┌────────┴────────┐
    ▼                 ▼
[Exit Node A]    [Exit Node B]   ... (N nodes globally)
(C/C++ daemon)   (C/C++ daemon)
```

- **Exit Nodes** — Linux VPS instances globally. Each runs a C/C++ daemon managing WireGuard interfaces. The WireGuard kernel module handles actual tunneling.
- **Management API** — Node.js/TypeScript. Handles users, auth, key provisioning, billing, metrics aggregation, exit node orchestration.
- **AI Routing Engine** — Python/FastAPI microservice. Probes exit nodes continuously, builds per-user behavior profiles, returns ranked routing recommendations.
- **Web Dashboard** — Next.js/TypeScript. User onboarding, interactive server map, usage stats, AI routing insights, admin panel.
- **Mobile App** — React Native + Expo. Connect/disconnect, AI server picker, kill switch, split tunneling.
- **Data layer** — PostgreSQL (users, peers, subscriptions), Redis (sessions, job queues, real-time metrics).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Tunnel Core | C/C++ + WireGuard kernel module |
| Node Control | C++ with wg-quick CLI / gRPC control channel |
| Management Backend | Node.js + TypeScript + Fastify |
| Auth | JWT + refresh tokens |
| Billing | Stripe SDK (Node.js) |
| AI Routing Engine | Python + FastAPI |
| ML / Routing Logic | scikit-learn + pandas |
| Metrics Collection | Python + ping3 + aiohttp |
| IP Reputation | AbuseIPDB API + custom blocklist |
| Web Dashboard | Next.js + TypeScript + Tailwind CSS |
| UI Components | shadcn/ui |
| Server Map | react-simple-maps |
| Charts | Recharts |
| Mobile App | React Native + Expo |
| VPN Mobile Layer | react-native-wireguard |
| Primary DB | PostgreSQL |
| Cache / Queues | Redis + BullMQ |
| Infra | Docker + docker-compose |
| Exit Node Hosting | DigitalOcean / Vultr Linux VPS |
| CI/CD | GitHub Actions |

**Service communication:**
- Web/Mobile → Management API: REST + WebSocket (HTTPS)
- Management API → AI Engine: REST (internal)
- Management API → Exit Nodes: gRPC control channel
- Exit Nodes → Management API: HTTP heartbeat every 30s

---

## AI Routing Engine

The core differentiator. Python FastAPI service that runs independently.

**Signals collected (every 60s per node):**
- Latency (ICMP ping from multiple probe locations)
- Download/upload speed
- Server CPU + connection load
- IP reputation score (AbuseIPDB)
- Jurisdiction / data retention laws
- Uptime / recent failure history

**Per-user behavior profiling:**
- Time-of-day patterns
- Inferred use case (streaming, browsing, security-sensitive)
- Historical server performance for that user

**Routing model — weighted scoring:**
- Latency: 40%
- Server load: 30%
- IP reputation: 20%
- User context: 10%

**Anomaly detection:**
- scikit-learn IsolationForest on speed time-series
- Flags ISP throttling, blacklisted exit IPs, degraded nodes

**API:** `GET /recommend?user_id=X` → ranked server list with human-readable reasoning string per entry.

---

## Data Models

**users** — id, email, password_hash, plan, created_at, stripe_customer_id  
**peers** — id, user_id, node_id, public_key, private_key_encrypted, ip_address, created_at, revoked_at  
**nodes** — id, region, ip, status, load_percent, last_heartbeat  
**subscriptions** — id, user_id, stripe_subscription_id, status, current_period_end  
**audit_logs** — id, user_id, action, metadata, created_at  

---

## Implementation Phases

| Phase | Focus | Duration |
|---|---|---|
| 1 | Single working WireGuard node + basic peer provisioning API | 2 weeks |
| 2 | Multi-tenant backend: auth, DB schema, Stripe billing | 3 weeks |
| 3 | Multi-node infrastructure + orchestration | 3 weeks |
| 4 | AI routing engine (Python FastAPI + ML model) | 5 weeks |
| 5 | Web dashboard (Next.js, server map, stats, admin) | 3 weeks |
| 6 | Mobile app (React Native, WireGuard tunnel, kill switch) | 3 weeks |
| 7 | Polish, CI/CD, docs, demo video, blog post | 2 weeks |
| **Total** | | **~21 weeks** |

---

## Error Handling

- **Node goes offline:** Heartbeat timeout → mark node unhealthy → AI router excludes it → management API triggers re-provisioning on another node for affected peers
- **Key compromise:** Revoke endpoint immediately removes peer from WireGuard config on the node
- **Stripe webhook failure:** BullMQ retry queue with exponential backoff
- **AI engine down:** Management API falls back to static latency-based selection (last known scores cached in Redis)

---

## Testing Strategy

- **Unit:** Fastify route handlers, AI scoring functions, key generation utilities
- **Integration:** Full provisioning flow against a test WireGuard node, Stripe webhook handling against test events
- **E2E:** Playwright — sign up → subscribe → get config → verify connection works
- **Load:** k6 load test on Management API (target: 500 concurrent users per node)
- **Mobile:** Expo + Jest for component tests, manual device testing for tunnel behavior
