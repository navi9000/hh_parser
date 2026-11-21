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
- `pnpm build` — build all workspace apps
- `pnpm --filter @hh-scraper/api db:init` — initialize the database
- `pnpm --filter @hh-scraper/api contract:emit` — regenerate Prisma contract artifacts
- `pnpm --filter @hh-scraper/api db:plan` — plan schema changes
- `pnpm --filter @hh-scraper/api db:migrate` — apply planned database changes

For local API development, copy `apps/api/.env.example` to `apps/api/.env`,
ensure `DATABASE_URL` points to PostgreSQL, start the local database with
`docker compose up -d`, then initialize it with the API `db:init` command.

There are currently no test or lint scripts, test files, or Playwright
test-runner configuration. Use a test-first workflow for new behavior: add a
focused failing test before implementing it. Prefer Playwright for browser and
end-to-end coverage, especially for the headful browser flow. The root
`.mcp.json` configures Playwright MCP for interactive browser control; it does
not install or configure the Playwright test runner. Once that runner is
configured, run one spec with
`pnpm exec playwright test <path-to-spec>` or one case with
`pnpm exec playwright test <path-to-spec> --grep "<test title>"`.

## Architecture and boundaries

- The workspace contains `apps/api` and `apps/web`; use root scripts for
  cross-app work and `pnpm --filter @hh-scraper/api ...` for API-only tasks.
- The API is NestJS 12. Keep HTTP handling in controllers and feature behavior
  in injectable providers organized into modules. See `apps/api/AGENTS.md` for
  API and persistence conventions.
- The dashboard is Vue 3 with Vite. Its current entry mounts `App.vue`; use
  Feature-Sliced Design for new frontend features instead of growing the
  starter component into a feature container. See `apps/web/AGENTS.md`.
- The scraper and controlled browser are future product components, not
  existing source-tree modules. Keep their boundaries explicit so the API,
  dashboard, and browser lifecycle can evolve independently.
