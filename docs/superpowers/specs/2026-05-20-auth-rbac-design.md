# NexVPN — Auth & RBAC Design

**Date:** 2026-05-20  
**Scope:** Google OAuth, forgot/reset password, role-based access control, admin panel

---

## Overview

Replace the placeholder GitHub OAuth button with a working Google OAuth flow, add forgot/reset password via Nodemailer + Gmail SMTP, introduce a two-role RBAC system (`USER` / `ADMIN`), and build a full admin panel (users, nodes, audit logs, subscriptions).

---

## 1. Database Schema Changes

### 1.1 User Model

Two new fields, one changed:

```prisma
model User {
  id               String    @id @default(cuid())
  email            String    @unique
  name             String
  passwordHash     String?                        // nullable — Google users have no password
  googleId         String?   @unique             // null for email/password users
  role             Role      @default(USER)       // new
  banned           Boolean   @default(false)      // new — admin can ban accounts
  plan             String    @default("free")
  stripeCustomerId String?
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
  peers            Peer[]
  subscriptions    Subscription[]
  auditLogs        AuditLog[]
  passwordResets   PasswordResetToken[]
}

enum Role {
  USER
  ADMIN
}
```

### 1.2 New Model: PasswordResetToken

```prisma
model PasswordResetToken {
  id        String   @id @default(cuid())
  userId    String
  tokenHash String   @unique    // SHA-256(rawToken) — enables O(1) lookup without bcrypt slowness
  expiresAt DateTime            // createdAt + 1 hour
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
}
```

---

## 2. Backend

### 2.1 Google OAuth (custom, no Passport.js)

**New routes under `/api/v1/auth/`:**

| Route | Description |
|---|---|
| `GET /api/v1/auth/google` | Generate random `state` nonce, store in Redis (60s TTL), redirect to Google consent URL |
| `GET /api/v1/auth/google/callback` | Verify `state`, exchange `code` for Google profile via Google OAuth2 API, upsert user, issue JWT + refresh token, redirect to frontend |

**Upsert logic:**
1. Find user by `googleId` → found: issue tokens, done
2. Not found by `googleId` → find by `email`
   - Found by email: link `googleId` to existing account, issue tokens
   - Not found: create new user with `googleId`, `name`, `email` from Google profile (no `passwordHash`)
3. Redirect to `http://localhost:3000/auth/callback?token=ACCESS&refreshToken=REFRESH`

**Google OAuth2 scopes requested:** `openid email profile`

### 2.2 Forgot / Reset Password

**New routes:**

| Route | Body | Description |
|---|---|---|
| `POST /api/v1/auth/forgot-password` | `{ email }` | Generate token, send email, always return 200 |
| `POST /api/v1/auth/reset-password` | `{ token, newPassword }` | Verify token, update password, return new JWT pair |

**Forgot password logic:**
1. Look up user by email — if not found, still return `200` (prevent email enumeration)
2. If user has `googleId` and no `passwordHash`: return `200` with message "If an account exists, a reset link was sent" (don't reveal OAuth-only status)
3. Generate `crypto.randomBytes(32).toString('hex')` (64-char hex token)
4. Store `sha256(token)` + `expiresAt = now + 1hr` + `used = false` in `PasswordResetToken`
5. Send email via Nodemailer (Gmail SMTP): link = `http://localhost:3000/reset-password?token=RAW_TOKEN`

**Reset password logic:**
1. Compute `sha256(rawToken)` → look up `PasswordResetToken` by `tokenHash` (O(1) DB lookup)
2. If not found: return `400 Bad Request`
3. If expired: return `410 Gone`
4. Update `user.passwordHash = bcrypt.hash(newPassword, 12)`
5. Mark token `used = true`
6. Issue new JWT + refresh token pair (auto-login after reset)

**Nodemailer config** (loaded from `.env`):
```
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx   # Gmail App Password (not account password)
```

### 2.3 RBAC

**JWT payload updated:**
```ts
{ sub: string, email: string, plan: string, role: 'USER' | 'ADMIN' }
```

**New middleware: `requireAdmin`**
```ts
// src/middleware/requireAdmin.ts
export async function requireAdmin(request, reply) {
  if (request.nexvpnUser.role !== 'ADMIN') {
    return reply.status(403).send({ statusCode: 403, error: 'Forbidden', message: 'Admin access required' })
  }
}
```

**Updated `AuthenticatedUser` type:**
```ts
interface AuthenticatedUser {
  id: string
  email: string
  plan: string
  role: 'USER' | 'ADMIN'
}
```

**`authenticate` middleware also checks `banned`:** if `user.banned === true`, return `403 Forbidden` with message "Account suspended". This is checked on every authenticated request — banned users are locked out immediately without needing to invalidate JWTs.

**Admin routes use:** `preHandler: [authenticate, requireAdmin]`

### 2.4 Admin API Routes

All under `/api/v1/admin/`, all require `[authenticate, requireAdmin]`.

**Users**
- `GET /api/v1/admin/users` — paginated list (`?page=1&limit=20`), returns id, email, name, role, plan, createdAt
- `PATCH /api/v1/admin/users/:id` — update `role` and/or `banned` status
- `DELETE /api/v1/admin/users/:id` — hard delete (cascades peers, subscriptions, tokens)

**Nodes**
- `GET /api/v1/admin/nodes` — all nodes with load/status
- `POST /api/v1/admin/nodes` — add node (region, city, ip)
- `PATCH /api/v1/admin/nodes/:id` — update status / city / region
- `DELETE /api/v1/admin/nodes/:id` — remove node

**Audit Logs**
- `GET /api/v1/admin/audit-logs` — paginated (`?page=1&limit=50`), filterable by userId

**Subscriptions**
- `GET /api/v1/admin/subscriptions` — all subscriptions with user info
- `PATCH /api/v1/admin/subscriptions/:id` — manually override plan

**All admin write actions** append to `AuditLog` with `action` and `metadata`.

### 2.5 Rate Limiting

`@fastify/rate-limit` applied globally to `/api/v1/auth/*`:
- Max 10 requests per minute per IP
- Stricter on `/forgot-password`: 3 per 15 minutes per IP

---

## 3. Frontend

### 3.1 Modified Pages

**`/login` and `/signup`:**
- Remove GitHub OAuth button
- Add Google OAuth button: clicking navigates to `GET /api/v1/auth/google`
- Login page: add "Forgot password?" link below password field (navigates to `/forgot-password`)

### 3.2 New Pages

| Route | Description |
|---|---|
| `/forgot-password` | Glassmorphism card. Email input + submit. Success state shows "Check your email." |
| `/reset-password` | Reads `?token=` from URL. New password + confirm. On success, auto-logs in and redirects to `/dashboard`. |
| `/auth/callback` | Invisible page. Reads `?token=` and `?refreshToken=` from URL, stores in Zustand + cookie, redirects to `/dashboard`. Shows spinner while processing. |
| `/admin` | Redirects to `/admin/users` |
| `/admin/users` | Data table: email, name, role badge, plan, joined date. Actions: change role, delete. |
| `/admin/nodes` | Table: region, city, IP, status toggle, load %. Add/remove buttons. |
| `/admin/audit-logs` | Read-only log table: timestamp, user email, action, metadata. |
| `/admin/subscriptions` | Table: user, plan badge, status, period end. Override plan dropdown. |

### 3.3 Admin Layout

- Left sidebar with admin-specific nav (Users, Nodes, Audit Logs, Subscriptions)
- Matches existing dashboard sidebar pattern
- `AdminGuard` component: reads role from Zustand store, redirects to `/dashboard` if not `ADMIN`
- Dark panel aesthetic matching existing design system (`--bg-base`, `--cyan`, etc.)

### 3.4 proxy.ts (rename from middleware.ts)

- Rename `middleware.ts` → `proxy.ts` (Next.js 16 requirement)
- Add `/admin/:path*` to protected routes
- Admin routes: check token exists AND role from JWT (`nexvpn-role` cookie alongside `nexvpn-token`)

### 3.5 Zustand Auth Store Updates

```ts
interface AuthUser {
  id: string
  email: string
  name: string
  plan: string
  role: 'USER' | 'ADMIN'   // new
}
```

Set `nexvpn-role` cookie on login/register (in addition to `nexvpn-token`) so proxy.ts can check admin status at the Edge without decoding the JWT.

---

## 4. Security Summary

| Concern | Mitigation |
|---|---|
| Email enumeration | `forgot-password` always returns 200 |
| CSRF on OAuth | `state` nonce in Redis, verified on callback |
| Reset token brute-force | bcrypt-hashed token, 1-hour expiry, single-use |
| Admin route bypass | Both `authenticate` + `requireAdmin` required |
| Audit trail | All admin writes logged to `AuditLog` |
| Google-only accounts | Password reset blocked gracefully |
| Auth endpoint abuse | Rate limiting: 10/min general, 3/15min on forgot-password |

---

## 5. New Environment Variables

```env
# Google OAuth (backend)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:3001/api/v1/auth/google/callback

# Nodemailer (backend)
GMAIL_USER=
GMAIL_APP_PASSWORD=

# Frontend
NEXT_PUBLIC_GOOGLE_AUTH_URL=http://localhost:3001/api/v1/auth/google
```

---

## 6. File Changes Summary

**Backend — new files:**
- `src/routes/admin.ts`
- `src/services/admin.service.ts`
- `src/services/oauth.service.ts`
- `src/services/email.service.ts`
- `src/middleware/requireAdmin.ts`

**Backend — modified files:**
- `prisma/schema.prisma` — Role enum, User fields, PasswordResetToken model
- `src/routes/auth.ts` — Google OAuth routes, forgot/reset password routes
- `src/services/auth.service.ts` — updated token signing (add role), reset password logic
- `src/types/index.ts` — AuthenticatedUser + JwtPayload get `role`
- `src/app.ts` — register admin routes, rate limiting
- `.env` — new vars

**Frontend — new files:**
- `app/(auth)/forgot-password/page.tsx`
- `app/(auth)/reset-password/page.tsx`
- `app/auth/callback/page.tsx`
- `app/(admin)/layout.tsx`
- `app/(admin)/admin/users/page.tsx`
- `app/(admin)/admin/nodes/page.tsx`
- `app/(admin)/admin/audit-logs/page.tsx`
- `app/(admin)/admin/subscriptions/page.tsx`
- `components/admin/AdminGuard.tsx`
- `components/admin/AdminSidebar.tsx`

**Frontend — modified files:**
- `middleware.ts` → renamed to `proxy.ts`
- `app/(auth)/login/page.tsx` — GitHub → Google, forgot password link
- `app/(auth)/signup/page.tsx` — GitHub → Google
- `store/auth.ts` — add `role` to AuthUser
