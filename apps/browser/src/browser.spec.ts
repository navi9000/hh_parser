import { afterEach, describe, expect, it } from 'vitest';
import { launchControlledBrowser } from './browser.js';

describe('launchControlledBrowser', () => {
  let close: (() => Promise<void>) | undefined;

  afterEach(async () => {
    await close?.();
    close = undefined;
  });

  it('opens a headless browser independently with an optional start URL', async () => {
    const session = await launchControlledBrowser({
      headless: true,
      startUrl: 'data:text/html,<title>Controlled browser</title>',
    });
    close = session.close;

    await expect(session.page.title()).resolves.toBe('Controlled browser');
  });
});
