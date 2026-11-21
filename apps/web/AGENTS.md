# Dashboard instructions

The dashboard is a Vue 3 application built with Vite. Its entry point is
`src/main.ts`, which mounts `src/App.vue`. The current app is a starter and is
not yet organized into feature layers.

## Feature-Sliced Design

Structure new frontend code using the FSD hierarchy:
`app`, `pages`, `widgets`, `features`, `entities`, `shared`.

- Imports flow from higher layers to lower layers only.
- Slices within the same layer must not import from one another.
- Keep each feature's UI and behavior in its appropriate slice rather than
  turning `App.vue` into a feature container.
- Keep shared, reusable infrastructure in `shared`; avoid putting product
  feature behavior there.

Frontend unit tests use Vitest and Vue Test Utils; place them beside the source
as `*.spec.ts`. Run the full suite with `pnpm test`, or one file with
`pnpm test -- apps/web/src/App.spec.ts`. Playwright Test covers browser and
end-to-end flows in `tests/e2e`; run the full suite with `pnpm test` or a
specific end-to-end file with `pnpm test -- tests/e2e/dashboard.spec.ts`.
