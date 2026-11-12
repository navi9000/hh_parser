# HH Scraper

A pnpm monorepo with a NestJS API backed by Prisma and a Vue 3/Vite web app.

## Requirements

- Node.js 22.18+, 24.11+, or 26+
- pnpm 10.27.0
- PostgreSQL 15+

## Getting started

```powershell
pnpm install
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

## Workspace commands

- `pnpm dev:api` — start the NestJS API in watch mode
- `pnpm dev:web` — start the Vite development server
- `pnpm build` — build all workspace apps
- `pnpm --filter @hh-scraper/api db:init` — initialize the database from the contract
- `pnpm --filter @hh-scraper/api contract:emit` — regenerate contract artifacts
- `pnpm --filter @hh-scraper/api db:plan` — plan schema changes as a migration
- `pnpm --filter @hh-scraper/api db:migrate` — apply planned migrations

The API uses NestJS 12 and Prisma ORM 8. Prisma ORM 8 is currently a release
candidate and uses its new contract/client APIs; it does not use
`@prisma/client`. PostgreSQL is selected because it is the supported Prisma 8
database target. SQLite support is experimental in Prisma 8.
