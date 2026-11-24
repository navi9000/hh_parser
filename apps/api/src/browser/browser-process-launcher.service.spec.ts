import { beforeEach, describe, expect, it, vi } from 'vitest';

const processMocks = vi.hoisted(() => {
  const listeners = new Map<string, (...args: unknown[]) => void>();
  const child = {
    exitCode: null as number | null,
    killed: false,
    once: vi.fn((event: string, listener: (...args: unknown[]) => void) => {
      listeners.set(event, listener);
      return child;
    }),
    kill: vi.fn(),
  };

  return {
    child,
    listeners,
    spawn: vi.fn(() => child),
  };
});

const networkMocks = vi.hoisted(() => {
  const socketListeners = new Map<string, () => void>();
  class MockSocket {
    setTimeout = vi.fn();
    once = vi.fn((event: string, listener: () => void) => {
      socketListeners.set(event, listener);
      return this;
    });
    destroy = vi.fn();
    connect = vi.fn(() => {
      queueMicrotask(() => socketListeners.get('connect')?.());
    });
  }

  return {
    socket: null as MockSocket | null,
    Socket: MockSocket,
  };
});

vi.mock('node:child_process', () => ({
  spawn: processMocks.spawn,
}));

vi.mock('node:net', () => ({
  Socket: networkMocks.Socket,
}));

import { BrowserProcessLauncherService } from './browser-process-launcher.service';

describe('BrowserProcessLauncherService', () => {
  beforeEach(() => {
    processMocks.child.exitCode = null;
    processMocks.child.killed = false;
    processMocks.listeners.clear();
    processMocks.spawn.mockClear();
  });

  it('waits until the browser microservice port is ready before resolving', async () => {
    const service = new BrowserProcessLauncherService();
    const starting = service.start();

    processMocks.listeners.get('spawn')?.();
    await starting;

    expect(processMocks.spawn).toHaveBeenCalledOnce();
  });

  it('does not report success when the browser process exits during startup', async () => {
    const service = new BrowserProcessLauncherService();
    const starting = service.start();

    processMocks.child.exitCode = 1;
    processMocks.listeners.get('exit')?.(1);

    await expect(starting).rejects.toThrow(
      'Browser app exited during startup',
    );
  });
});
