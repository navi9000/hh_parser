import { Controller, Get, Inject } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get()
  getStatus() {
    return { status: 'ok' };
  }

  @Get('users')
  listUsers() {
    return this.prisma.client.orm.public.User.all();
  }
}
