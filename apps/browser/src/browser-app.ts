import { chromium, type Browser } from 'playwright';

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
    const browserPromise = this.launchBrowser({ headless }).then(
      async (browser) => {
        browser.on('disconnected', () => {
          if (this.activeSession === session) {
            this.activeSession = undefined;
            this.state = 'idle';
          }
        });
        if (options.startUrl) {
          const context = await browser.newContext();
          const page = await context.newPage();
          await page.goto(options.startUrl);
        }
        return browser;
      },
    );

    let closed = false;
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
