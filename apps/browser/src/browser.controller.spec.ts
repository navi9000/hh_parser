import { describe, expect, it, vi } from 'vitest';
import { BrowserApp } from './browser-app.js';
import { BrowserController } from './browser.controller.js';

describe('BrowserController', () => {
  it('injects the browser app and launches a foreground session', async () => {
    const browserApp = {
      state: 'idle',
      launchForeground: vi.fn().mockReturnValue({
        mode: 'foreground',
        headless: false,
      }),
    };
    const controller = new BrowserController(
      browserApp as unknown as BrowserApp,
    );

    expect(
      controller.launchForeground({ startUrl: 'https://hh.ru' }),
    ).toEqual({
      state: 'idle',
      mode: 'foreground',
      headless: false,
    });
    expect(browserApp.launchForeground).toHaveBeenCalledWith({
      startUrl: 'https://hh.ru',
    });
  });
});
