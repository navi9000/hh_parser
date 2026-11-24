import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BrowserController } from './browser.controller';
import { BrowserProcessLauncherService } from './browser-process-launcher.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BROWSER_MICROSERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: Number(process.env.HH_BROWSER_MICROSERVICE_PORT ?? 3001),
        },
      },
    ]),
  ],
  controllers: [BrowserController],
  providers: [BrowserProcessLauncherService],
})
export class BrowserModule {}
