import { chromium } from 'playwright';

export type BrowserAppState = 'idle' | 'background' | 'foreground';
export type BrowserSessionMode = 'background' | 'foreground';

export interface BrowserSessionOptions {
  startUrl?: string;
}

export interface BrowserSession {
  mode: BrowserSessionMode;
  headless: boolean;
  startUrl?: string;
  close: () => Promise<void>;
}

function isBrowserClosedError(error: unknown): boolean {
  return (
    error instanceof Error &&
    error.message.includes('Target page, context or browser has been closed')
  );
}

export class BrowserApp {
  state: BrowserAppState = 'idle';
  private activeSession?: BrowserSession;

  constructor(
    private readonly launchBrowser = chromium.launch.bind(chromium),
  ) {}

  launchBackground(options: BrowserSessionOptions = {}): BrowserSession {
    return this.launchSession('background', true, options);
  }

  launchForeground(options: BrowserSessionOptions = {}): BrowserSession {
    return this.launchSession('foreground', false, options);
  }

  async terminate(): Promise<void> {
    await this.activeSession?.close();
    this.activeSession = undefined;
    this.state = 'idle';
  }

  private launchSession(
    mode: BrowserSessionMode,
    headless: boolean,
    options: BrowserSessionOptions,
  ): BrowserSession {
    this.state = mode;

    let session: BrowserSession;
    let closed = false;
    let browserDisconnected = false;
    const browserPromise = this.launchBrowser({ headless }).then((browser) => {
      browser.on('disconnected', () => {
        browserDisconnected = true;
        if (this.activeSession === session) {
          this.activeSession = undefined;
          this.state = 'idle';
        }
      });
      return browser;
    });

    const startUrl = options.startUrl;
    if (startUrl) {
      void browserPromise
        .then(async (browser) => {
          const context = await browser.newContext();
          const page = await context.newPage();
          await page.goto(startUrl);
        })
        .catch((error: unknown) => {
          if (!closed && !browserDisconnected && !isBrowserClosedError(error)) {
            console.error('Failed to load the browser start URL', error);
          }
        });
    }

    session = {
      mode,
      headless,
      startUrl: options.startUrl,
      close: async () => {
        if (closed) {
          return;
        }
        closed = true;
        if (this.activeSession === session) {
          this.activeSession = undefined;
          this.state = 'idle';
        }
        const browser = await browserPromise;
        await browser.close();
      },
    };

    this.activeSession = session;
    return session;
  }
}
