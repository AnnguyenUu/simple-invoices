# invoice

Next.js 15 (App Router) app. Currently implements the auth entry point only (login page + session cookie) — invoicing features are not built yet.

## Prerequisites

- Node.js 20+ (project was set up and tested on 20.20.2)
- npm (repo uses `package-lock.json`; don't mix in yarn/pnpm lockfiles)

## Setup

```bash
npm install
```

No environment variables are required yet — there's no database or external backend wired up.

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be redirected to `/login`.

Sign in with any email and any password of **8 or more characters** — there's no real backend yet, so `login()` in `src/app/login/actions.ts` only checks password length as a placeholder. On success it sets an httpOnly `session` cookie and redirects to `/`, which shows the signed-in email and a sign-out button.

## Other commands

```bash
npm run build      # production build (Turbopack)
npm run start       # run the production build (after npm run build)
npm run lint        # ESLint
npx tsc --noEmit    # typecheck
```

No test framework is configured yet.

## Project docs

See [CLAUDE.md](./CLAUDE.md) for architecture notes, the intended frontend conventions this project is meant to grow into, and the reasoning behind the pinned Next.js version.
