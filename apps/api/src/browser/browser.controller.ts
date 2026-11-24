import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { BrowserProcessLauncherService } from './browser-process-launcher.service';

@Controller('browser')
export class BrowserController {
  constructor(
    @Inject('BROWSER_MICROSERVICE')
    private readonly browserClient: ClientProxy,
    @Inject(BrowserProcessLauncherService)
    private readonly browserProcessLauncher: BrowserProcessLauncherService,
  ) {}

  @Post('start')
  @HttpCode(HttpStatus.ACCEPTED)
  async start(@Body() body: unknown) {
    if (!isBrowserStartRequest(body)) {
      throw new BadRequestException('url must be https://hh.ru');
    }

    await this.browserProcessLauncher.start();
    const result = await firstValueFrom(
      this.browserClient.send('browser.launch.foreground', {
        startUrl: body.url,
      }),
    );

    return { status: 'started', ...result };
  }

  @Post('background')
  @HttpCode(HttpStatus.ACCEPTED)
  async startBackground(@Body() body: unknown) {
    if (!isBrowserStartRequest(body)) {
      throw new BadRequestException('url must be https://hh.ru');
    }

    await this.browserProcessLauncher.start();
    const result = await firstValueFrom(
      this.browserClient.send('browser.launch.background', {
        startUrl: body.url,
      }),
    );

    return { status: 'started', ...result };
  }

  @Post('stop')
  @HttpCode(HttpStatus.ACCEPTED)
  async stop() {
    await firstValueFrom(this.browserClient.send('browser.terminate', {}));
    await this.browserProcessLauncher.stop();
    return { status: 'stopped' };
  }
}

function isBrowserStartRequest(body: unknown): body is { url: string } {
  return (
    typeof body === 'object' &&
    body !== null &&
    'url' in body &&
    body.url === 'https://hh.ru'
  );
}
