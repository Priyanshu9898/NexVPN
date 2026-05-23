# NexVPN — Master Project File

## What This Is
A multi-tenant VPN SaaS with AI-powered smart routing. WireGuard protocol, globally distributed exit nodes.
**Differentiator:** AI picks the fastest/safest server using 40+ signals (latency, load, IP reputation, user behavior).

## Key Decisions Made
- Stack: Next.js 15 (frontend) + Fastify/Node.js (backend) + Python FastAPI (AI engine) + C/C++ (tunnel daemon)
- No Go/Rust — dev knows JS/TS, Python, C/C++
- Multi-tenant SaaS (not personal tool)
- WireGuard protocol (not OpenVPN)
- Agents communicate via `contracts/` files, never directly

---

## Project Structure
```
VPN/
├── CLAUDE.md               ← YOU ARE HERE (master orchestration file)
├── contracts/              ← SHARED TRUTH — all agents read before implementing
│   ├── types.ts            ← shared TypeScript types (Backend Agent owns)
│   ├── api.yaml            ← Management API OpenAPI spec (Backend Agent owns)
│   └── ai-engine.yaml      ← AI Engine API spec (AI Engine Agent owns)
├── frontend/               ← Next.js 15, port 3000 (Frontend Agent owns)
│   ├── CLAUDE.md           ← Frontend Agent instructions
│   ├── app/
│   │   ├── page.tsx                        ← Landing page (3D globe, parallax, Framer Motion)
│   │   ├── globals.css                     ← Full design system (tokens, animations)
│   │   ├── layout.tsx                      ← Fonts: Syne + Space Mono + Outfit
│   │   ├── (auth)/login/page.tsx           ← Glassmorphism + particle bg
│   │   ├── (auth)/signup/page.tsx          ← Same + password strength meter
│   │   ├── (dashboard)/dashboard/page.tsx  ← Globe hero + mission control layout
│   │   ├── (dashboard)/servers/page.tsx    ← Placeholder (Phase 5)
│   │   └── (dashboard)/settings/page.tsx  ← Placeholder (Phase 5)
│   ├── store/
│   │   └── auth.ts                         ← Zustand auth store (login/register/logout + cookie sync)
│   ├── middleware.ts                        ← Edge middleware: protect /dashboard, redirect if logged in
│   └── components/
│       ├── 3d/Globe.tsx            ← R3F globe, 12 server dots, animated arcs, data packets
│       ├── 3d/FloatingParticles.tsx ← 4000-point particle field, viewport-aware spread
│       ├── 3d/Shield3D.tsx         ← Auth page 3D rotating shield
│       └── layout/Sidebar.tsx      ← Dashboard sidebar with nav + status
├── backend/                ← Fastify + Prisma + Redis, port 3001 (Backend Agent owns)
│   ├── CLAUDE.md           ← Backend Agent instructions
│   ├── prisma/schema.prisma ← 5 models: User, Peer, Node, Subscription, AuditLog
│   ├── docker-compose.yml  ← postgres:16 + redis:7
│   └── src/
│       ├── routes/         ← auth.ts, peers.ts, nodes.ts, users.ts, subscriptions.ts
│       ├── services/       ← auth.service.ts, peer.service.ts, node.service.ts
│       ├── middleware/      ← auth.ts (JWT), errorHandler.ts
│       ├── lib/            ← prisma.ts, redis.ts, queue.ts (BullMQ)
│       ├── jobs/           ← metrics.job.ts, provisioning.job.ts (placeholders)
│       └── types/index.ts
├── ai-engine/              ← NOT CREATED YET (Phase 4)
├── tunnel/                 ← NOT CREATED YET (Phase 2)
└── docs/
    └── superpowers/specs/2026-05-14-vpn-design.md  ← Full design spec
```

---

## Domain Agents & Ownership

| Agent | Directory | Owns | Port |
|---|---|---|---|
| Frontend Agent | `/frontend` | All UI, reads contracts only | 3000 |
| Backend Agent | `/backend` | API routes, DB, auth, billing — writes `contracts/api.yaml` + `contracts/types.ts` | 3001 |
| AI Engine Agent | `/ai-engine` | Routing model, probing — writes `contracts/ai-engine.yaml` | 8000 |
| Tunnel Agent | `/tunnel` | WireGuard C/C++ daemon, gRPC to backend | — |

### Agent Communication Protocol
1. Agents talk through `contracts/` — never directly
2. Backend changes endpoint → updates `contracts/api.yaml`
3. Frontend needs new endpoint → leaves comment in component, flags for Backend Agent
4. AI Engine changes API → updates `contracts/ai-engine.yaml`

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion, React Three Fiber, Three.js |
| Backend | Node.js, TypeScript, Fastify, Prisma ORM, PostgreSQL, Redis, BullMQ, JWT, Stripe |
| AI Engine | Python, FastAPI, scikit-learn, pandas (NOT BUILT YET) |
| Tunnel | C/C++, WireGuard kernel module (NOT BUILT YET) |
| Infra | Docker, docker-compose, GitHub Actions CI/CD |

### Frontend Design System
- **Colors:** `--bg-base: #05080D`, `--cyan: #00D4FF`, `--green: #00FF9D`, `--amber: #F0A500`, `--red: #FF4455`
- **Fonts:** Syne (display/headings), Space Mono (data/labels), Outfit (body)
- **Key CSS classes:** `.panel`, `.dot-grid`, `.gradient-text`, `.font-display`, `.font-data`
- **3D:** Globe with 12 server dots + animated arcs + data packets; 4000-point particle field (viewport-aware)

---

## 7-Phase Implementation Plan

### ✅ Phase 0 — Scaffolding (COMPLETE)
- [x] Next.js 15 frontend project created and building
- [x] Fastify + Prisma backend scaffolded (18 TypeScript files, builds clean)
- [x] PostgreSQL + Redis via docker-compose
- [x] Contract layer: `contracts/api.yaml`, `contracts/types.ts`, `contracts/ai-engine.yaml`
- [x] Multi-agent architecture with CLAUDE.md per domain
- [x] Design system (globals.css, fonts, tokens, animations)

### ✅ Phase 1 — Frontend UI (COMPLETE)
- [x] Landing page: animated SVG network + 3D Globe + floating particles + Framer Motion parallax
- [x] Login page: glassmorphism card + full-screen particle field + staggered form animations
- [x] Signup page: same + animated password strength indicator
- [x] Dashboard: Globe takes top 50vh + mission control stats + server list + AI analysis panel
- [x] Sidebar: connection status indicator + nav links
- [x] All pages build clean (zero TypeScript errors)

### ✅ Phase 2 — Backend Auth + Database (COMPLETE)
- [x] Backend auth routes fully implemented (register → bcrypt hash → JWT + refresh token)
- [x] Zustand auth store (`frontend/store/auth.ts`) with login/register/logout + cookie sync
- [x] Login + signup forms wired to real API (loading state, error banners, redirect to /dashboard)
- [x] Next.js Edge middleware protects /dashboard routes; redirects logged-in users away from /login+/signup
- [x] Start Docker: `cd backend && docker-compose up -d`
- [x] Run Prisma migration: `npx prisma migrate dev --name init`
- [x] Google OAuth (replaces GitHub placeholder) — custom flow, no Passport.js
- [x] Forgot / reset password via Gmail SMTP (Nodemailer, SHA-256 token, 1hr expiry)
- [x] RBAC: USER / ADMIN roles in JWT + DB, `requireAdmin` middleware
- [x] Admin panel: users, nodes, audit-logs, subscriptions (full CRUD + audit trail)
- [x] `middleware.ts` renamed to `proxy.ts` (Next.js 16 requirement)
- [ ] Stripe integration (subscription plans) — deferred to Phase 6
- **Result:** User can sign up and log in with real JWT, dashboard is protected, admin panel available at /admin

### 🔲 Phase 3 — WireGuard Exit Node (NEXT — needs VPS)
- [ ] Spin up Linux VPS (DigitalOcean/Vultr ~$6/mo)
- [ ] Install WireGuard kernel module
- [ ] Write C/C++ daemon: manage WireGuard interfaces, add/remove peers, generate keypairs
- [ ] Peer provisioning API endpoint (`POST /api/v1/peers`)
- [ ] Return `.conf` file user can import into WireGuard client
- [ ] **Result:** Real device can connect through the VPN

### 🔲 Phase 4 — Multi-node Infrastructure
- [ ] Deploy 3-5 VPS nodes in different regions
- [ ] Node registry + health checks (heartbeat every 30s)
- [ ] Management API orchestrates all nodes
- [ ] **Result:** Users can pick a region

### 🔲 Phase 5 — AI Routing Engine
- [ ] Scaffold `/ai-engine` Python FastAPI service
- [ ] Latency probing (ping3 + aiohttp) every 60s per node
- [ ] IP reputation scoring (AbuseIPDB)
- [ ] ISP throttling detection (IsolationForest anomaly detection)
- [ ] Per-user behavior profiling
- [ ] Weighted scoring model (latency 40%, load 30%, reputation 20%, context 10%)
- [ ] `GET /recommend?user_id=X` → ranked server list with reasoning
- [ ] Wire into backend + show live in dashboard
- [ ] **Result:** AI badge in dashboard is real

### 🔲 Phase 6 — Web Dashboard (Full)
- [ ] Servers page: interactive world map (react-simple-maps) with live nodes
- [ ] Settings page: kill switch, split tunneling, protocol selection
- [ ] Admin panel: user management, node management, billing overview
- [ ] Real-time stats via WebSocket

### 🔲 Phase 7 — Mobile App
- [ ] React Native + Expo
- [ ] WireGuard tunnel integration
- [ ] AI server picker
- [ ] Kill switch, split tunneling
- [ ] iOS + Android

### 🔲 Phase 8 — Polish + Portfolio
- [ ] GitHub Actions CI/CD
- [ ] README with architecture diagram
- [ ] 3-minute demo video
- [ ] Load testing (k6)
- [ ] Blog post on technical decisions

---

## Running Everything Locally

```bash
# 1. Infrastructure (PostgreSQL + Redis)
cd backend && docker-compose up -d

# 2. Backend API (port 3001)
cd backend && npm run dev

# 3. Run DB migrations (first time only)
cd backend && npx prisma migrate dev --name init

# 4. Frontend (port 3000)
cd frontend && npm run dev

# 5. AI Engine — Phase 5 (port 8000)
cd ai-engine && uvicorn main:app --reload --port 8000
```

---

## Important Notes
- `--legacy-peer-deps` required for npm installs (react-simple-maps peer dep conflict with React 19)
- Auth middleware attaches user to `request.nexvpnUser` (not `request.user` — Fastify JWT conflict)
- FloatingParticles Canvas needs explicit `width: 100% / height: 100%` (not `inset: 0`) to fill viewport
- Particle spread uses `useThree().viewport` to match actual viewport dimensions
- All Framer Motion `ease` in Variants must use named strings (`'easeOut'`), not bezier arrays

---

## Design Spec
Full architecture, data models, and rationale: `docs/superpowers/specs/2026-05-14-vpn-design.md`
