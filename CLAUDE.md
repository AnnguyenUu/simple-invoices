# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Next.js 15 (App Router) invoice app, bootstrapped with `create-next-app`. TypeScript, Tailwind CSS v4 (mostly for page-level layout now — see UI note below), ESLint. UI is **Radix Themes** (`@radix-ui/themes`) for all visual components, paired with headless `@radix-ui/react-form` for validation wiring; forms use react-hook-form + Zod. Currently implements only the auth entry point (login page + session cookie); invoicing features have not been built yet.

## Commands

- `npm run dev` — start dev server (Turbopack) at http://localhost:3000
- `npm run build` — production build (Turbopack)
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config: `next/core-web-vitals` + `next/typescript`)
- `npx tsc --noEmit` — typecheck only
- `npm run test` — run the full Vitest suite once (`vitest run`)
- `npm run test:watch` — Vitest in watch mode
- `npx vitest run path/to/file.test.ts` — run a single test file; add `-t "test name"` to filter to one test

Vitest (`vitest.config.ts`, `jsdom` environment) + React Testing Library, mirroring the `tsconfig.json` path aliases (`@/*`, `@api/*`, `@modules/*`). Tests live in `__tests__/` folders next to the code they cover. Scope so far is unit/integration-level: Zod schemas, the `login` server action, `RequestBuilder`/`ErrorRequest`/`proxyToNeobank` (401-redirect and upstream-proxy infra), invoice/user-profile repositories and React Query hooks, the `/api/invoices` and `/api/users/me` route handlers, and the `(protected)` layout's session-redirect logic. Presentational components are not covered yet.

For code under test that constructs `new RequestBuilder()`, mock the module with a real `class` (not `vi.fn().mockImplementation(() => ({...}))`) since the source calls it with `new`; `src/test/mock-request-builder.ts` has a reusable factory for the common case. `vi.mock()` paths resolve relative to the test file, not the file under test — double-check the relative depth when a test lives in a `__tests__/` subfolder.

## Version pinning

- Next.js is pinned to `15.5.20` (not `latest`) deliberately: the 14.x line never received backports for a long list of high-severity advisories (DoS, SSRF, cache poisoning, XSS) — those were only patched starting at `15.5.10`. Don't downgrade to 14.x without re-checking `npm audit`.
- `package.json` has a `postcss` override (`^8.5.10`) because Next 15 bundles an older internal postcss with a known moderate XSS advisory. Keep this override when upgrading Next unless the bundled version is confirmed fixed upstream.
- Run `npm audit` after bumping Next.js and resolve findings before considering an upgrade done.

## Architecture

### Auth flow (`src/app/login/`)

Login is implemented with React 19 / Next.js Server Actions, not a client-side fetch to an API route:

- `src/app/login/actions.ts` — `"use server"` module. `login()` calls the 101 Digital identity server's `POST /oauth2/token` (password grant, `application/x-www-form-urlencoded` body: `client_id`/`client_secret`/`scope=openid`/`username`/`password`) via `fetchToken()`, which goes through `RequestBuilder` (see below) with an absolute URL, wrapped in a try/catch that turns any failure into `null`. Credentials (`IDENTITY_SERVER_URL`, `IDENTITY_CLIENT_ID`, `IDENTITY_CLIENT_SECRET`) come from server-only env vars — see `.env.example`. On success it stores the returned `access_token` in an httpOnly session cookie (`SESSION_COOKIE`, `maxAge` = the token's `expires_in`) and calls `redirect("/")`. `logout()` deletes the cookie and redirects to `/login`.
  - Note: a `"use server"` file may only export async functions — shared constants (e.g. `SESSION_COOKIE`) live in the sibling `session.ts` instead.
  - The cookie holds an opaque access token now (not decodable JSON), so `src/app/page.tsx` can't pull the email back out of it — it shows a generic signed-in message. Getting the user's name/email back requires calling whatever userinfo/`/me` endpoint the identity server exposes.
- `src/app/login/login-form.tsx` — `"use client"` component. Client-side validation is Zod (`loginSchema`) via `react-hook-form`'s `zodResolver`. Structure/accessibility comes from `@radix-ui/react-form` (`Form.Root`/`Field`/`Label`/`Control`/`Submit`); the actual visible controls are Radix **Themes** components (`TextField.Root`/`Slot`, `Button`, `Card`, `Callout`, `Text`, `Heading`) passed into `Form.Control`/`Form.Submit` via `asChild` — this is the reference pattern for any new form. On valid submit it builds a `FormData` and invokes the `useActionState` dispatch (`formAction`) inside `startTransition` — that's what still gives the server round-trip (invalid-credentials errors, pending state) after client validation passes.
  - Trade-off: driving submission through `handleSubmit` (which always calls `preventDefault`) means the no-JS/progressive-enhancement fallback that a plain `<form action={formAction}>` gets for free no longer works — submission requires JS. Acceptable here since react-hook-form already requires JS.
- `src/app/login/page.tsx` — Server Component route shell that just renders `<LoginForm />`.
- `src/app/page.tsx` — Server Component that reads the `session` cookie directly via `next/headers`; redirects to `/login` if absent, otherwise renders the signed-in view with a sign-out form bound to `logout`.

This Server Component (route shell) + Client Component (interactive form) split, and the “pages never fetch directly” boundary, is the intended pattern going forward for any new route with a form or other interactive element — see the conventions below.

### Adopted frontend conventions (not yet fully built out)

This repo is meant to follow the layered structure below, ported from a sibling Vite/React SPA project's conventions (`docs/nextjs-frontend-conventions.md` in that project). Only the pieces actual features need should be created — don't pre-create empty layers.

- `src/api/http/` — **implemented**, ported from the sibling project's repository/builder pattern, and used from **both** Server Actions/Server Components and Client Components (unlike the sibling SPA project, where it's browser-only by necessity):
  - `client.ts` — the `axios` instance (`apiClient`), `baseURL` from `NEXT_PUBLIC_API_BASE_URL` (defaults to same-origin `/api`), `withCredentials: true`. `baseURL` only applies to relative URLs — pass an absolute URL to `.withUrl()` to hit an external service (e.g. the OAuth identity server) and axios uses it as-is, bypassing `baseURL` entirely. `NEXT_PUBLIC_*` env vars are safe to read on both server and client (same value either way), so this instance doesn't need to be split per environment.
  - `error-request.ts` — `ErrorRequest` base class; on a `401` it redirects to `/login`, branching on environment since the two sides need genuinely different mechanisms:
    - **Server** (`typeof window === "undefined"`): calls `next/navigation`'s `redirect("/login")` — the idiomatic way to bail out of a Server Component/Action.
    - **Client**: `redirect()` from `next/navigation` only works during render in a Client Component, not from an event handler or async callback like this one (Next.js's own restriction) — and there's no importable router singleton like the sibling project's React Router `router.navigate` (Next's client router only exists behind the `useRouter()` hook, unusable from a plain class). So this falls back to a hard `window.location.href = "/login"`.
  - `request-builder.ts` — `RequestBuilder<T>` extends `ErrorRequest`; chainable `.withMethod()/.withUrl()/.withData()/.withParams()/.withHeaders()` then `.send()`. `login/actions.ts`'s `fetchToken()` is the first real caller — it wraps `.send()` in a try/catch that turns any error (invalid grant, network failure, etc.) into `null`, since `ErrorRequest.handleError` rethrows everything except silently redirecting on 401.
  - There's no `requests/<domain>.ts` yet since no domain endpoints exist beyond auth; add one file per domain there when the first real data-fetching feature lands, following the sibling project's "one file per domain" rule.
  - Naming: this repo's other multi-word filenames are kebab-case (`login-form.tsx`), so these files are `error-request.ts`/`request-builder.ts` rather than the sibling project's camelCase `errorRequest.ts`/`requestBuilder.ts`.
- `src/queries/`, `src/mutations/` — one React Query hook per domain/action, once there's client-side data fetching to do (React Query itself isn't installed yet either). Components must never call `useQuery`/`fetchX` directly — always through a hook.
- `src/context/query-keys/`, `src/context/request-url/` — centralized constants instead of string literals
- `src/types/` — shared types matching the API contract 1:1
- Path aliases: `@/*` → `src/*`, `@api/*` → `src/api/*` (both in `tsconfig.json`). Add `@queries`, `@mutations`, `@components`, `@apptypes` the same way once those directories exist.
- Server/Client boundary rule: `app/**/page.tsx` stays a Server Component doing the first-read fetch (or none, as with `/login`); anything interactive (forms, filters, mutation buttons) is split into a `"use client"` sibling component
- UI primitives: **`@radix-ui/themes`** (Radix Themes) is the standard component library — `Button`, `TextField`, `Card`, `Callout`, `Text`, `Heading`, `Flex`, etc. This superseded an earlier headless-Radix-primitives-only + Tailwind approach; the sibling project's Ant Design notes don't apply here either way. Reach for a Radix Themes component before writing a styled native element; use Tailwind (or inline `style`) only for page-level layout Radix Themes doesn't cover (e.g. a full-height centering wrapper) or for a one-off `@radix-ui/react-icons` icon.
- Forms: **react-hook-form + Zod** (`@hookform/resolvers/zod`) is the standard for any form with validation — define a Zod schema next to the component, wire it with `zodResolver`, and use `@radix-ui/react-form`'s `Form.*` primitives for field/label/error structure with Radix Themes components as the `asChild` targets (see `login-form.tsx`).
- Cookie-based session auth (not `localStorage` tokens) is the established pattern for this app, matching the sibling project's security posture — see its `docs/adr/security-considerations.md`.

### Theming (`src/app/providers.tsx`)

Radix Themes' `<Theme appearance="light" | "dark" | "inherit">` does **not** auto-follow OS dark mode by itself — `appearance="inherit"` (the default) just omits the light/dark class entirely, and there's no `prefers-color-scheme` media query anywhere in its shipped CSS. OS-based dark mode requires `next-themes`, wired up as:

- `providers.tsx` (`"use client"`) — `next-themes`' `ThemeProvider` (`attribute="class"`, `defaultTheme="system"`, `enableSystem`) wraps a `RadixThemeSync` component that reads `useTheme().resolvedTheme` and passes it to Radix's `<Theme appearance={...}>`.
- `layout.tsx` renders `<Providers>` around `{children}` and has `suppressHydrationWarning` on `<html>` (the standard `next-themes` requirement, since it sets the `class` attribute before hydration).
- **The non-obvious part**: `RadixThemeSync` gates on a `mounted` state (`useState(false)` flipped to `true` in a `useEffect`) and renders `appearance="light"` until then, *even though* `resolvedTheme` is already correct on the first client render. Skipping this gate causes a real bug, not just a console warning: React discovers a `light`/`dark` `className` mismatch **during hydration** and — for this category of attribute — deliberately leaves the server-rendered value in place rather than patching it, so the page gets stuck in light mode on every load regardless of OS/localStorage preference. Matching the server's "light" render on the first client pass (via the mount gate) avoids the hydration-time mismatch entirely; the correct theme then applies in the very next render, which is an ordinary post-hydration update React does patch normally. Verified empirically (screenshotted at 300ms and 1500ms after load in a dark-`colorScheme` browser context) before concluding this was necessary — don't remove the gate to "simplify" this file.
