# SimpleInvoice

Next.js 15 (App Router) invoicing app for 101 Digital's neobank API. Implements:

- **Auth** — login against the 101 Digital identity server (OAuth2 password grant), session cookie.
- **Invoices list** — server-backed pagination, per-column sorting, and filtering (keyword, status, date range, page size).
- **Create invoice** — a single-line-item invoice form (invoice details, customer, item, optional billing address / bank account / tax & discount) with full client-side validation, submitted synchronously to the real invoice-service API.

## Prerequisites

- Node.js 20+ (built and tested on 20.20.2)
- npm (repo uses `package-lock.json`; don't mix in yarn/pnpm lockfiles)
- Credentials for a 101 Digital identity server client and a neobank API environment (dev/sandbox) — see below

## Setup

```bash
npm install
cp .env.example .env.local
```

Fill in `.env.local`:

| Variable | Required | Purpose |
|---|---|---|
| `IDENTITY_SERVER_URL` | yes | Base URL of the 101 Digital identity server (OAuth2 token endpoint). |
| `IDENTITY_CLIENT_ID` | yes | OAuth2 client id for the password-grant login call. |
| `IDENTITY_CLIENT_SECRET` | yes | OAuth2 client secret. Server-only — never sent to the browser. |
| `NEOBANK_API_BASE_URL` | yes | Base URL of the neobank API gateway (membership-service, invoice-service). Server-only. |
| `NEXT_PUBLIC_API_BASE_URL` | no | Base URL the browser-side `apiClient` uses for this app's own `/api/*` routes. Defaults to same-origin `/api`; you shouldn't need to set it locally. |

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`. Sign in with a real account on the identity server configured above (there's no mock auth).

On success you land on `/`, the invoices list. The header's "New Invoice" link opens the create-invoice form at `/invoices/new`.

## Other commands

```bash
npm run build      # production build (Turbopack)
npm run start       # run the production build (after npm run build)
npm run lint        # ESLint
npx tsc --noEmit    # typecheck
```

No test framework is configured yet.

## Architecture

The browser never talks to the neobank API directly — every request goes through this app's own Next.js Route Handlers (`src/app/api/*`), which attach the right auth headers server-side and forward to the upstream API. This keeps the neobank API's base URL and credentials off the client entirely.

```
Browser
  │  fetch/axios to same-origin /api/*
  ▼
Next.js Route Handler (src/app/api/**/route.ts)
  │  proxyToNeobank() — attaches Authorization/org-token/extra headers from the session cookies
  ▼
Neobank API (membership-service, invoice-service)
```

### Two cookies, two purposes

- **`_uctx`** (session) — the raw OAuth2 access token from the identity server. Set once at login (`src/modules/login/repository/login.ts`), sent as `Authorization: Bearer <token>` on every proxied request.
- **`_uctx_ort`** (org) — a per-organisation membership token, also fetched and set during `login()` (from the user's first membership via membership-service). Sent as an `org-token` header alongside the session token for org-scoped services like invoice-service. Both cookies are set inside `login()` — a Server Action — because `cookies().set()` is only permitted there or in a Route Handler, not in a Server Component render.

### The proxy layer (`src/api/http/`)

- `client.ts` — the shared `axios` instance.
- `request-builder.ts` — chainable `RequestBuilder` (`.withMethod().withUrl().withData()...`) wrapping `apiClient`. `.withRedirectOn401(false)` opts a call out of the default "hard-redirect the browser to `/login` on 401" behavior — see the comment there for which calls need this and why.
- `error-request.ts` — the base class implementing that redirect behavior.
- `neobank-proxy.ts` — `proxyToNeobank(request, path, options)`, the one function every `src/app/api/*/route.ts` handler calls. Reads the session/org cookies, builds the upstream URL from `NEOBANK_SERVICES`, forwards query params and an optional body, and maps upstream errors straight through with their real status/body.

### Frontend layers, per feature module (`src/modules/<feature>/`)

- `repository/` — thin wrappers calling this app's own `/api/*` routes via `RequestBuilder`. Never called directly from components.
- `core/handlers/` — React Query hooks (`useQuery`/`useMutation`) wrapping the repository functions. Components call these, never the repository directly.
- `presentation/` — the actual UI, composed of small single-purpose components.
- `configuration/` — cookie names and other constants scoped to the module.

Shared types matching the upstream API contracts live in `src/types/`; form validation schemas (Zod) live in `src/shared/server-constract/`.

### Notable non-obvious decisions

- **`itemReference` and `bankAccount.bankId` are required by the live invoice-service API**, even though the sample request in `src/hooks/create_invice.md` shows `bankId: ""` — found by testing against the real API, documented inline in `src/types/invoice.ts` and `src/shared/server-constract/invoice.ts`.
- **`Operation-Mode: SYNC`** is sent on invoice creation so the API returns the finished invoice synchronously instead of queuing it — see `src/app/api/invoices/route.ts`.
- **Responsive design** uses Radix Themes' responsive prop objects (`{ initial: ..., sm: ... }`) rather than custom media queries, plus a `useIsMobile()` hook exposed app-wide via `DeviceProvider`/`useDeviceContext()` (`src/context/device/`) for cases that need the breakpoint in JS, not just CSS (e.g. the create-invoice form swaps between an inline submit button on mobile and a fixed action bar on desktop).
