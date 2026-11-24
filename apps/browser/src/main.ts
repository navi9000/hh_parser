import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { fileURLToPath } from 'node:url';
import {
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { BrowserApp } from './browser-app.js';
import { BrowserModule } from './browser.module.js';

export async function startBrowserApp(): Promise<BrowserApp> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    BrowserModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: Number(process.env.HH_BROWSER_MICROSERVICE_PORT ?? 3001),
      },
    },
  );
  await app.listen();
  return app.get(BrowserApp);
}

export async function terminateBrowserApp(options: {
  close: () => void | Promise<void>;
}): Promise<void> {
  await options.close();
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  void startBrowserApp()
    .then((browserApp) => {
      const shutdown = () => {
        void browserApp.terminate().finally(() => process.exit(0));
      };
      process.once('SIGINT', shutdown);
      process.once('SIGTERM', shutdown);
    })
    .catch((error: unknown) => {
      console.error('Failed to start the browser app:', error);
      process.exitCode = 1;
    });
}
