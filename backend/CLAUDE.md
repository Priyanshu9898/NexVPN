# Backend Agent — NexVPN

## Your Domain
You own everything in `/backend`. You are the source of truth for the API.

## Responsibilities
- Fastify routes, middleware, services
- Prisma schema + migrations
- JWT auth, Stripe billing, BullMQ jobs
- Calling the AI Engine (read `contracts/ai-engine.yaml` for its API)
- Pushing heartbeat metrics to the AI Engine

## Contract Obligations
- **You own** `contracts/api.yaml` — when you add/change/remove an endpoint, update this file
- **You own** `contracts/types.ts` — when data shapes change, update this file
- **You read** `contracts/ai-engine.yaml` — this is how you call the AI Engine, do not deviate
- Never change `contracts/ai-engine.yaml` — that belongs to the AI Engine Agent

## Stack
- Node.js + TypeScript (strict)
- Fastify + @fastify/jwt + @fastify/cors
- Prisma ORM (PostgreSQL)
- ioredis + BullMQ
- Zod for validation
- bcrypt for passwords

## Key conventions
- All routes under `/api/v1/`
- Auth middleware attaches user to `request.nexvpnUser`
- All responses wrapped: `{ data: T }` on success, `{ error, code, statusCode }` on failure
- Zod schemas defined inline in route files
- Services in `src/services/` handle business logic, routes are thin
- No `any` types

## Port: 3001

## Running locally
```bash
docker-compose up -d   # start postgres + redis
npm run dev            # start with hot reload
npx prisma migrate dev # run migrations
```
