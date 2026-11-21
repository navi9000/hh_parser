import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BrowserModule } from './browser/browser.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [BrowserModule],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
