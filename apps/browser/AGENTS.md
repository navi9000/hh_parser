# Browser instructions

This package owns the standalone, Playwright-controlled browser process. Keep
it independent from the Vue dashboard: browser lifecycle and automation code
belong here, and the dashboard should interact through an explicitly designed
API contract rather than importing browser internals.

The browser launches headful by default. `HH_BROWSER_START_URL` optionally sets
the initial page URL; `HH_BROWSER_HEADLESS=true` is intended for headless
environments. Keep launch options injectable so browser behavior can be
verified without coupling it to the dashboard.

Run `pnpm dev:browser` to launch the browser. Install its Chromium runtime with
`pnpm exec playwright install chromium`. Browser package tests are Vitest unit
tests; end-to-end web tests use the shared Playwright test runner. See the root
`AGENTS.md` for the unified test commands.
