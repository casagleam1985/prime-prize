---
name: Clerk Auth Setup
description: How Clerk authentication is wired in this project (api-server + competitions web app).
---

# Clerk Auth Setup

Clerk was provisioned via `setupClerkWhitelabelAuth()` (Replit-managed, app_3F12pNmgE8oNhlu0cy0lt1Jq5tG).

## Server (artifacts/api-server)
- Packages: `@clerk/express`, `@clerk/shared`, `http-proxy-middleware`
- Proxy middleware in `src/middlewares/clerkProxyMiddleware.ts` (copied from skill template)
- `app.ts` mounts `CLERK_PROXY_PATH` proxy BEFORE `cors`, `express.json()`, body parsers, and `clerkMiddleware`
- `clerkMiddleware` uses `publishableKeyFromHost` from `@clerk/shared/keys` to resolve the key
- Protected routes use `getAuth(req)` from `@clerk/express` for `userId`
- Auth-optional routes (ticket purchase) call `getAuth(req)` and store `userId` if present (null if guest)

## Client (artifacts/competitions)
- Packages: `@clerk/react`, `@clerk/themes`
- `index.css`: `@layer theme, base, clerk, components, utilities;` BEFORE `@import "tailwindcss"` + `@import "@clerk/themes/shadcn.css"` (Tailwind v4 required)
- `vite.config.ts`: `tailwindcss({ optimize: false })` — required to prevent Clerk CSS breaking in prod builds
- `App.tsx`: `publishableKeyFromHost` from `@clerk/react/internal`; `ClerkProvider` wraps everything inside `WouterRouter`; sign-in/sign-up routes use `/*?` wildcard
- Logo at `public/logo.svg` — required by `clerkAppearance.options.logoImageUrl`

**Why:** Clerk proxy setup is production-only; in dev, Clerk hits FAPI directly. The cssLayerName and @layer ordering is critical for Tailwind v4 compatibility.

**How to apply:** If adding more protected API routes, use `getAuth(req)` and check `auth?.userId`. Do not add bearer token handling in web — Clerk uses cookies automatically.
