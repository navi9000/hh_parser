import { describe, expect, it, vi } from 'vitest';

const browserMocks = vi.hoisted(() => {
  const browser = {
    newContext: vi.fn().mockResolvedValue({
      newPage: vi.fn().mockResolvedValue({
        goto: vi.fn().mockResolvedValue(undefined),
      }),
    }),
    close: vi.fn().mockResolvedValue(undefined),
  };
  return {
    browser,
    launch: vi.fn().mockResolvedValue(browser),
  };
});

vi.mock('playwright', () => ({
  chromium: {
    launch: browserMocks.launch,
  },
}));

import { BrowserApp } from './browser-app.js';

describe('BrowserApp states', () => {
  it('starts idle and ready to accept session requests', () => {
    const app = new BrowserApp();

    expect(app.state).toBe('idle');
  });

  it('launches a background browser session on request', async () => {
    const app = new BrowserApp();

    const session = app.launchBackground({
      startUrl: 'https://hh.ru',
    });

    expect(app.state).toBe('background');
    expect(session.mode).toBe('background');
    expect(session.headless).toBe(true);
    await session.close();
  });

  it('launches a foreground browser session for user intervention', async () => {
    const app = new BrowserApp();

    const session = app.launchForeground({
      startUrl: 'https://hh.ru',
    });

    expect(app.state).toBe('foreground');
    expect(session.mode).toBe('foreground');
    expect(session.headless).toBe(false);
    await session.close();
  });

  it('returns to idle after the active background session closes', async () => {
    const app = new BrowserApp();
    const session = app.launchBackground();

    await session.close();

    expect(app.state).toBe('idle');
  });

  it('returns to idle after the foreground session closes', async () => {
    const app = new BrowserApp();
    const session = app.launchForeground();

    await session.close();

    expect(app.state).toBe('idle');
  });

  it('accepts an intervention in the foreground while idle', () => {
    const app = new BrowserApp();
    const intervention = app.launchForeground({
      startUrl: 'https://hh.ru',
    });

    expect(app.state).toBe('foreground');
    expect(intervention.startUrl).toBe('https://hh.ru');
  });
});
