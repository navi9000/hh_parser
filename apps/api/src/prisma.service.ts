import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { db } from './prisma/db';

@Injectable()
export class PrismaService implements OnModuleDestroy {
  readonly client = db;

  async onModuleDestroy() {
    await this.client.close();
  }
}
