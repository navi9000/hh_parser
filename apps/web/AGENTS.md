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

There are currently no web test or lint scripts or test files. Follow the
repository's test-first workflow and choose tests appropriate to the behavior;
use Playwright for browser and end-to-end flows once the test runner is
configured. The workspace Playwright MCP server is for interactive browser
control, not a Playwright test-runner configuration.
