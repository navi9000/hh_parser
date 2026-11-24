import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BrowserApp, type BrowserSessionOptions } from './browser-app.js';

@Controller()
export class BrowserController {
  constructor(
    @Inject(BrowserApp)
    private readonly browserApp: BrowserApp,
  ) {}

  @MessagePattern('browser.launch.background')
  launchBackground(options: BrowserSessionOptions = {}) {
    const session = this.browserApp.launchBackground(options);
    return {
      state: this.browserApp.state,
      mode: session.mode,
      headless: session.headless,
    };
  }

  @MessagePattern('browser.launch.foreground')
  launchForeground(options: BrowserSessionOptions = {}) {
    const session = this.browserApp.launchForeground(options);
    return {
      state: this.browserApp.state,
      mode: session.mode,
      headless: session.headless,
    };
  }

  @MessagePattern('browser.state')
  state() {
    return { state: this.browserApp.state };
  }

  @MessagePattern('browser.terminate')
  async terminate() {
    await this.browserApp.terminate();
    return { state: this.browserApp.state };
  }
}
