import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { BrowserModule } from './browser/browser.module';

@Module({
  imports: [BrowserModule],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
