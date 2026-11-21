import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import {
  BROWSER_PROCESS_LAUNCHER,
  type BrowserProcessLauncher,
} from './browser/browser-process-launcher.service';

@Controller()
export class AppController {
  constructor(
    @Inject(BROWSER_PROCESS_LAUNCHER)
    private readonly browserProcessLauncher: BrowserProcessLauncher,
  ) {}

  @Post('browser/start')
  @HttpCode(HttpStatus.ACCEPTED)
  async startBrowser(@Body() body: unknown) {
    if (!isBrowserStartRequest(body)) {
      throw new BadRequestException('url must be https://hh.ru');
    }

    await this.browserProcessLauncher.launch({
      env: {
        ...process.env,
        HH_BROWSER_START_URL: body.url,
      },
    });

    return { status: 'started' };
  }
}

const BROWSER_START_URL = 'https://hh.ru';

function isBrowserStartRequest(body: unknown): body is { url: string } {
  return (
    typeof body === 'object' &&
    body !== null &&
    'url' in body &&
    body.url === BROWSER_START_URL
  );
}
