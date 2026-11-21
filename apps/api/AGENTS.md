# API instructions

## NestJS structure

The NestJS 12 application starts at `src/main.ts` and wires its root module in
`src/app.module.ts`. Keep controllers focused on HTTP routing and delegate
feature behavior to injectable providers. Organize new features in Nest
modules, using dependency injection so providers can be tested independently.
Follow the official NestJS module, provider, and testing patterns.

## Persistence

This app uses Prisma ORM 8's contract/client APIs with PostgreSQL; it does not
use `@prisma/client`. Read `src/prisma/contract.prisma` and the existing
database setup before changing persistence. The Prisma contract is the schema
source; `src/prisma/contract.json` and `src/prisma/contract.d.ts` are generated
artifacts. Edit the schema and run
`pnpm --filter @hh-scraper/api contract:emit`; do not hand-edit generated
contract files.

Runtime database access is configured in `src/prisma/db.ts` and exposed to Nest
through `PrismaService` in `src/prisma.service.ts`. Keep database access
centralized there and use the injected service from feature providers.

## Commands and configuration

- `pnpm --filter @hh-scraper/api build` — build the API
- `pnpm --filter @hh-scraper/api contract:emit` — regenerate contract artifacts
- `pnpm --filter @hh-scraper/api db:init` — initialize the database
- `pnpm --filter @hh-scraper/api db:plan` — plan schema changes
- `pnpm --filter @hh-scraper/api db:migrate` — apply planned migrations

The API requires PostgreSQL 15+ and `DATABASE_URL` in `apps/api/.env`. Use
`apps/api/.env.example` and the root `compose.yaml` for local setup.

There are currently no API test or lint scripts or test files. Keep new
behavior test-first; introduce and document an appropriate focused test runner
when adding the first tests.
