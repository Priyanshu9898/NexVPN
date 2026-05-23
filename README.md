# NexVPN

AI-powered VPN SaaS with smart routing. WireGuard protocol, globally distributed exit nodes.

The AI engine analyzes 40+ signals per request (latency, server load, IP reputation, user behavior patterns) to automatically route traffic through the optimal exit node — before you notice any slowdown.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js 16    │────▶│  Fastify API    │────▶│  PostgreSQL 16  │
│   (port 3000)   │     │  (port 3001)    │     │  + Redis 7      │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
             ┌──────────┐ ┌──────────┐ ┌──────────┐
             │ AI Engine│ │WireGuard │ │  Stripe  │
             │ FastAPI  │ │  Daemon  │ │ Billing  │
             │ (port    │ │ (C/C++)  │ │          │
             │  8000)   │ │          │ │          │
             └──────────┘ └──────────┘ └──────────┘
```

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion, React Three Fiber |
| Backend | Fastify, Prisma ORM, PostgreSQL, Redis, BullMQ, JWT |
| AI Engine | Python, FastAPI, scikit-learn *(Phase 5)* |
| Tunnel | C/C++, WireGuard *(Phase 3)* |

## Features

- **Auth** — Email/password + Google OAuth, JWT + refresh tokens, forgot/reset password via email
- **RBAC** — USER and ADMIN roles, admin panel with full CRUD
- **Dashboard** — 3D globe, server stats, AI routing analysis panel
- **3D UI** — Animated globe with server nodes, floating particle field, glassmorphism cards
- **Audit logs** — Every privileged action is logged with actor + timestamp

## Getting Started

### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL + Redis)
- Python 3.11+ *(for AI engine — Phase 5)*

### 1. Clone

```bash
git clone https://github.com/Priyanshu9898/NexVPN.git
cd NexVPN
```

### 2. Environment variables

```bash
# backend/.env
DATABASE_URL="postgresql://nexvpn:nexvpn@localhost:5432/nexvpn"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-secret-here"
JWT_REFRESH_SECRET="your-refresh-secret-here"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
GMAIL_USER="..."
GMAIL_PASS="..."
FRONTEND_URL="http://localhost:3000"
```

### 3. Start infrastructure

```bash
cd backend && docker-compose up -d
```

### 4. Run migrations

```bash
cd backend && npx prisma migrate deploy
```

### 5. Start backend

```bash
cd backend && npm run dev
# API running at http://localhost:3001
```

### 6. Start frontend

```bash
cd frontend && npm run dev
# App running at http://localhost:3000
```

## API

Base URL: `http://localhost:3001`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/v1/auth/register` | — | Create account |
| POST | `/api/v1/auth/login` | — | Get JWT tokens |
| POST | `/api/v1/auth/refresh` | — | Refresh access token |
| POST | `/api/v1/auth/forgot-password` | — | Send reset email |
| POST | `/api/v1/auth/reset-password` | — | Reset with token |
| GET | `/api/v1/auth/google` | — | Google OAuth redirect |
| GET | `/api/v1/nodes` | JWT | List VPN nodes |
| POST | `/api/v1/peers` | JWT | Provision WireGuard peer |
| GET | `/api/v1/users/me` | JWT | Get own profile |
| GET | `/api/v1/admin/users` | ADMIN | List all users |
| GET | `/api/v1/admin/audit-logs` | ADMIN | View audit trail |

Full spec: [`contracts/api.yaml`](contracts/api.yaml)

## Project Status

| Phase | Status | Description |
|---|---|---|
| 0 — Scaffolding | ✅ Done | Project structure, contracts, design system |
| 1 — Frontend UI | ✅ Done | Landing, auth pages, dashboard, 3D globe |
| 2 — Backend Auth | ✅ Done | JWT, OAuth, RBAC, admin panel |
| 3 — WireGuard Node | 🔲 Next | VPS setup, C/C++ daemon, peer provisioning |
| 4 — Multi-node | 🔲 Planned | Node registry, health checks, region picker |
| 5 — AI Routing | 🔲 Planned | FastAPI engine, latency probing, smart routing |
| 6 — Full Dashboard | 🔲 Planned | Live map, WebSocket stats, settings |
| 7 — Mobile | 🔲 Planned | React Native + Expo |

## License

MIT
