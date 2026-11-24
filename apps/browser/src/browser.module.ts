import { Module } from '@nestjs/common';
import { BrowserApp } from './browser-app.js';
import { BrowserController } from './browser.controller.js';

@Module({
  controllers: [BrowserController],
  providers: [BrowserApp],
})
export class BrowserModule {}
