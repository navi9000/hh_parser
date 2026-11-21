# HH Scraper

A pnpm monorepo with a NestJS API backed by Prisma, a Vue 3/Vite web app, and
a standalone Playwright-controlled browser.

## Requirements

- Node.js 22.18+, 24.11+, or 26+
- pnpm 10.27.0
- PostgreSQL 15+

## Getting started

```powershell
pnpm install
pnpm exec playwright install chromium
Copy-Item apps/api/.env.example apps/api/.env
docker compose up -d
```

The Compose file starts a local PostgreSQL instance matching the example
connection string. If you use another PostgreSQL server, update `DATABASE_URL`
in `apps/api/.env`. Then initialize the database and start the API:

```powershell
pnpm --filter @hh-scraper/api db:init
pnpm dev:api
```

In another terminal, run `pnpm dev:web`. The API listens on port 3000 and the
Vite development server prints its local URL (by default, port 5173).

The controlled browser is a separate app. Run `pnpm dev:browser` in another
terminal to open its headful Chromium window. Set `HH_BROWSER_START_URL` before
launching to open an initial page. Browser lifecycle and automation are kept
out of the web dashboard.

## Workspace commands

- `pnpm dev:api` — start the NestJS API in watch mode
- `pnpm dev:web` — start the Vite development server
- `pnpm dev:browser` — launch the standalone controlled browser
- `pnpm build` — build all workspace apps
- `pnpm test` — run API, frontend, browser unit tests, and Playwright E2E tests
- `pnpm test:unit` — run API, frontend, and browser unit tests
- `pnpm test:e2e` — run Playwright end-to-end tests
- `pnpm test -- apps/web/src/App.spec.ts` — run one Vitest test file
- `pnpm test -- tests/e2e/dashboard.spec.ts` — run one Playwright test file
- `pnpm --filter @hh-scraper/api db:init` — initialize the database from the contract
- `pnpm --filter @hh-scraper/api contract:emit` — regenerate contract artifacts
- `pnpm --filter @hh-scraper/api db:plan` — plan schema changes as a migration
- `pnpm --filter @hh-scraper/api db:migrate` — apply planned migrations

The API uses NestJS 12 and Prisma ORM 8. Prisma ORM 8 is currently a release
candidate and uses its new contract/client APIs; it does not use
`@prisma/client`. PostgreSQL is selected because it is the supported Prisma 8
database target. SQLite support is experimental in Prisma 8.

API, frontend, and browser unit tests use Vitest; API tests use Nest's testing
utilities. End-to-end tests use Playwright Test and start the web app
automatically. Tests that launch Chromium require the browser installation from
the setup steps above; the API unit tests do not require a database.
