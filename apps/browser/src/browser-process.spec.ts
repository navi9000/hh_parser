import { describe, expect, it, vi } from 'vitest';

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
