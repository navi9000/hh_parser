import { describe, expect, it, vi } from 'vitest';

const browserMocks = vi.hoisted(() => {
  const page = { goto: vi.fn() };
  const context = { newPage: vi.fn().mockResolvedValue(page) };
  const browser = {
    newContext: vi.fn().mockResolvedValue(context),
    close: vi.fn().mockResolvedValue(undefined),
  };
  const launch = vi.fn().mockResolvedValue(browser);

  return { browser, launch, page };
});

vi.mock('playwright', () => ({
  chromium: { launch: browserMocks.launch },
}));

import { launchControlledBrowser } from './browser.js';

describe('controlled browser start URL', () => {
  it('loads hh.ru when the API passes it as the initial URL', async () => {
    const session = await launchControlledBrowser({
      headless: true,
      startUrl: 'https://hh.ru',
    });

    expect(browserMocks.launch).toHaveBeenCalledWith({ headless: true });
    expect(browserMocks.page.goto).toHaveBeenCalledWith('https://hh.ru');
    await session.close();
  });
});
