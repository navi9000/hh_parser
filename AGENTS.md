# Project instructions

## Project overview

HH Scraper is a pnpm monorepo for an hh.ru autoclicker/scraper. The intended
product has three parts: a NestJS backend, a Vue dashboard, and a controlled,
headful browser that can pause an automated run and hand control to the user.
Only the API starter and dashboard starter exist today; the scraper, browser
process, and pause/takeover flow are not implemented. Define and test their
interfaces and lifecycle as those features are introduced rather than assuming
an existing automation or UI-to-browser contract.

## Workspace commands

Requirements: Node.js 22.18+, 24.11+, or 26+; pnpm 10.27.0; PostgreSQL 15+.

- `pnpm install` — install workspace dependencies
- `pnpm dev:api` — run the API in watch mode
- `pnpm dev:web` — run the Vite dashboard
- `pnpm dev:browser` — launch the standalone controlled browser
- `pnpm build` — build all workspace apps
- `pnpm test` — run all Vitest and Playwright tests
- `pnpm test -- apps/api/src/app.controller.spec.ts` — run one test file
- `pnpm test:unit` — run all Nest and frontend/browser unit tests
- `pnpm test:e2e` — run the Playwright end-to-end suite
- `pnpm --filter @hh-scraper/api db:init` — initialize the database
- `pnpm --filter @hh-scraper/api contract:emit` — regenerate Prisma contract artifacts
- `pnpm --filter @hh-scraper/api db:plan` — plan schema changes
- `pnpm --filter @hh-scraper/api db:migrate` — apply planned database changes

For local API development, copy `apps/api/.env.example` to `apps/api/.env`,
ensure `DATABASE_URL` points to PostgreSQL, start the local database with
`docker compose up -d`, then initialize it with the API `db:init` command.

Use a test-first workflow for new behavior: add a focused failing test before
implementing it. API, frontend, and browser unit tests use Vitest (API tests
use Nest's testing utilities); Playwright Test covers end-to-end tests in
`tests/e2e`. `pnpm test -- <path>` dispatches a specific test file to the
appropriate runner. Install Chromium for Playwright with
`pnpm exec playwright install chromium`. The root `.mcp.json` separately
configures Playwright MCP for interactive browser control.

## Architecture and boundaries

- The workspace contains `apps/api`, `apps/web`, and `apps/browser`; use root
  scripts for cross-app work and `pnpm --filter @hh-scraper/api ...` for
  API-only database tasks.
- The API is NestJS 12. Keep HTTP handling in controllers and feature behavior
  in injectable providers organized into modules. See `apps/api/AGENTS.md` for
  API and persistence conventions.
- The dashboard is Vue 3 with Vite. Its current entry mounts `App.vue`; use
  Feature-Sliced Design for new frontend features instead of growing the
  starter component into a feature container. See `apps/web/AGENTS.md`.
- `apps/browser` owns the standalone Playwright browser process. Keep it
  separate from the dashboard; design any future API-to-browser control
  contract explicitly so each app can evolve independently. See
  `apps/browser/AGENTS.md`. Scraping and pause/takeover behavior remain future
  product work.
