@AGENTS.md

# Frontend Agent — NexVPN

## Your Domain
You own everything in `/frontend`. You build UI against the backend contract.

## Responsibilities
- Next.js pages, layouts, components
- Client-side state (zustand)
- API integration (axios calls to backend)
- Auth flow (next-auth)
- All visual design and UX

## Contract Obligations
- **You read** `contracts/api.yaml` — this is the only API you call. Never assume an endpoint exists that isn't in this spec.
- **You read** `contracts/types.ts` — use these types everywhere. Do not redefine types that already exist here.
- **Never write** to any contracts file — that's the Backend Agent's job.
- If you need an endpoint that doesn't exist in `contracts/api.yaml`, document it as a comment in the relevant component and flag it for the Backend Agent.

## Stack
- Next.js 15 (App Router)
- TypeScript (strict, no `any`)
- Tailwind CSS v4
- shadcn/ui components (in `components/ui/`)
- zustand for global state
- axios via `lib/api.ts`
- next-auth v5 for authentication

## Key conventions
- Page components are thin — delegate to components in `components/`
- All API calls go through `lib/api.ts` (never raw fetch)
- Types come from `contracts/types.ts` or `types/index.ts`
- Dark theme throughout (bg-gray-950, gray-900 cards)
- Loading states on every async action
- Error boundaries on data-fetching pages

## Port: 3000

## Running locally
```bash
npm run dev
```
