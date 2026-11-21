import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';

export interface BrowserLaunchOptions {
  headless?: boolean;
  startUrl?: string;
}

export interface ControlledBrowserSession {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  close: () => Promise<void>;
}

export async function launchControlledBrowser(
  options: BrowserLaunchOptions = {},
): Promise<ControlledBrowserSession> {
  const browser = await chromium.launch({ headless: options.headless ?? false });

  try {
    const context = await browser.newContext();
    const page = await context.newPage();

    if (options.startUrl) {
      await page.goto(options.startUrl);
    }

    return {
      browser,
      context,
      page,
      close: () => browser.close(),
    };
  } catch (error) {
    await browser.close();
    throw error;
  }
}
