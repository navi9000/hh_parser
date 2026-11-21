import 'reflect-metadata';
import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';

describe('AppController', () => {
  const users = [{ id: 1, email: 'user@example.com', name: 'User' }];
  const allUsers = vi.fn();
  let controller: AppController;

  beforeEach(async () => {
    allUsers.mockResolvedValue(users);
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            client: {
              orm: { public: { User: { all: allUsers } } },
            },
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(AppController);
  });

  it('reports the API status', () => {
    expect(controller.getStatus()).toEqual({ status: 'ok' });
  });

  it('lists users through the injected Prisma service', async () => {
    await expect(controller.listUsers()).resolves.toEqual(users);
    expect(allUsers).toHaveBeenCalledOnce();
  });
});
