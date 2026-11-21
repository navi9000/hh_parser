import 'reflect-metadata';
import type { AddressInfo } from 'node:net';
import { Test } from '@nestjs/testing';
import { describe, expect, it, vi } from 'vitest';
import { AppController } from './app.controller';

const browserProcessLauncher = 'BROWSER_PROCESS_LAUNCHER';

describe('POST /browser/start', () => {
  it('starts the detached browser with the requested initial URL', async () => {
    const launcher = { launch: vi.fn().mockResolvedValue(undefined) };
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: browserProcessLauncher, useValue: launcher }],
    }).compile();
    const app = moduleRef.createNestApplication({ cors: true });

    try {
      await app.listen(0, '127.0.0.1');
      const address: AddressInfo | string | null =
        app.getHttpServer().address();
      if (address === null || typeof address === 'string') {
        throw new Error('Test server did not bind to a TCP port');
      }

      const origin = 'http://127.0.0.1:4173';
      const preflightResponse = await fetch(
        `http://127.0.0.1:${address.port}/browser/start`,
        {
          method: 'OPTIONS',
          headers: {
            origin,
            'access-control-request-method': 'POST',
            'access-control-request-headers': 'content-type',
          },
        },
      );

      expect(preflightResponse.status).toBe(204);
      expect(preflightResponse.headers.get('access-control-allow-origin')).toBe(
        '*',
      );
      expect(
        preflightResponse.headers.get('access-control-allow-methods'),
      ).toContain('POST');
      expect(
        preflightResponse.headers.get('access-control-allow-headers'),
      ).toMatch(/content-type/i);

      const response = await fetch(
        `http://127.0.0.1:${address.port}/browser/start`,
        {
          method: 'POST',
          headers: {
            origin,
            'content-type': 'application/json',
          },
          body: JSON.stringify({ url: 'https://hh.ru' }),
        },
      );

      expect(response.status).toBe(202);
      expect(response.headers.get('access-control-allow-origin')).toBe('*');
      expect(launcher.launch).toHaveBeenCalledOnce();
      expect(launcher.launch).toHaveBeenCalledWith(
        expect.objectContaining({
          env: expect.objectContaining({
            HH_BROWSER_START_URL: 'https://hh.ru',
          }),
        }),
      );
    } finally {
      await app.close();
    }
  });
});
