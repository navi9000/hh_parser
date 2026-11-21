import { Module } from '@nestjs/common';
import {
  BROWSER_PROCESS_LAUNCHER,
  BrowserProcessLauncherService,
} from './browser-process-launcher.service';

@Module({
  providers: [
    BrowserProcessLauncherService,
    {
      provide: BROWSER_PROCESS_LAUNCHER,
      useExisting: BrowserProcessLauncherService,
    },
  ],
  exports: [BROWSER_PROCESS_LAUNCHER],
})
export class BrowserModule {}
