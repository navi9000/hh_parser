import 'reflect-metadata';
import { of } from 'rxjs';
import { Test } from '@nestjs/testing';
import { describe, expect, it, vi } from 'vitest';
import { BrowserController } from './browser.controller';
import { BrowserProcessLauncherService } from './browser-process-launcher.service';

describe('BrowserController', () => {
  it('starts the browser microservice and launches a foreground session', async () => {
    const client = {
      send: vi.fn().mockReturnValue(
        of({
          state: 'foreground',
          mode: 'foreground',
          headless: false,
        }),
      ),
    };
    const launcher = {
      start: vi.fn().mockResolvedValue(undefined),
      stop: vi.fn().mockResolvedValue(undefined),
    };
    const moduleRef = await Test.createTestingModule({
      controllers: [BrowserController],
      providers: [
        { provide: 'BROWSER_MICROSERVICE', useValue: client },
        { provide: BrowserProcessLauncherService, useValue: launcher },
      ],
    }).compile();
    const controller = moduleRef.get(BrowserController);

    await expect(
      controller.start({ url: 'https://hh.ru' }),
    ).resolves.toMatchObject({
      status: 'started',
      state: 'foreground',
    });
    expect(launcher.start).toHaveBeenCalledOnce();
    expect(client.send).toHaveBeenCalledWith(
      'browser.launch.foreground',
      { startUrl: 'https://hh.ru' },
    );
  });

  it('launches a background browser session through the microservice', async () => {
    const client = {
      send: vi.fn().mockReturnValue(
        of({
          state: 'background',
          mode: 'background',
          headless: true,
        }),
      ),
    };
    const launcher = {
      start: vi.fn().mockResolvedValue(undefined),
      stop: vi.fn().mockResolvedValue(undefined),
    };
    const moduleRef = await Test.createTestingModule({
      controllers: [BrowserController],
      providers: [
        { provide: 'BROWSER_MICROSERVICE', useValue: client },
        { provide: BrowserProcessLauncherService, useValue: launcher },
      ],
    }).compile();
    const controller = moduleRef.get(BrowserController);

    await expect(
      controller.startBackground({ url: 'https://hh.ru' }),
    ).resolves.toMatchObject({
      status: 'started',
      state: 'background',
      mode: 'background',
    });
    expect(client.send).toHaveBeenCalledWith(
      'browser.launch.background',
      { startUrl: 'https://hh.ru' },
    );
  });

  it('terminates the browser session and browser microservice explicitly', async () => {
    const client = {
      send: vi.fn().mockReturnValue(of({ state: 'idle' })),
    };
    const launcher = {
      start: vi.fn().mockResolvedValue(undefined),
      stop: vi.fn().mockResolvedValue(undefined),
    };
    const moduleRef = await Test.createTestingModule({
      controllers: [BrowserController],
      providers: [
        { provide: 'BROWSER_MICROSERVICE', useValue: client },
        { provide: BrowserProcessLauncherService, useValue: launcher },
      ],
    }).compile();
    const controller = moduleRef.get(BrowserController);

    await expect(controller.stop()).resolves.toEqual({ status: 'stopped' });
    expect(client.send).toHaveBeenCalledWith('browser.terminate', {});
    expect(launcher.stop).toHaveBeenCalledOnce();
  });
});
