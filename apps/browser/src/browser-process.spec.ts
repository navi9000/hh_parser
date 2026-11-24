import { describe, expect, it, vi } from 'vitest';

vi.mock('@nestjs/core', () => ({
  NestFactory: {
    createMicroservice: vi.fn().mockResolvedValue({
      listen: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockReturnValue({
        state: 'idle',
        terminate: vi.fn().mockResolvedValue(undefined),
      }),
    }),
  },
}));

vi.mock('@nestjs/microservices', () => ({
  Transport: { TCP: 0 },
}));

vi.mock('./browser.module.js', () => ({
  BrowserModule: class BrowserModule {},
}));

describe('browser app explicit process lifecycle', () => {
  it('starts explicitly and enters the idle state', async () => {
    const { startBrowserApp } = await import('./main.js');
    const app = await startBrowserApp();

    expect(app.state).toBe('idle');

    await app.terminate();
  });

  it('terminates explicitly and closes any active session', async () => {
    const close = vi.fn();
    const { terminateBrowserApp } = await import('./main.js');

    await terminateBrowserApp({ close });

    expect(close).toHaveBeenCalledOnce();
  });

  it('does not start sessions automatically during browser app startup', async () => {
    const { startBrowserApp } = await import('./main.js');
    const app = await startBrowserApp();

    expect(app.state).toBe('idle');

    await app.terminate();
  });
});
