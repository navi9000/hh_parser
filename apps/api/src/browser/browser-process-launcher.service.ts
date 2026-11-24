import { Injectable, Logger } from '@nestjs/common';
import { spawn, type ChildProcess } from 'node:child_process';
import { Socket } from 'node:net';
import { resolve } from 'node:path';

@Injectable()
export class BrowserProcessLauncherService {
  private readonly logger = new Logger(BrowserProcessLauncherService.name);
  private child?: ChildProcess;

  async start(): Promise<void> {
    if (this.child && this.child.exitCode === null && !this.child.killed) {
      return;
    }

    const workspaceRoot = resolve(__dirname, '../../../..');
    const isProduction = process.env.NODE_ENV === 'production';
    const command = isProduction ? process.execPath : 'pnpm';
    const args = isProduction
      ? [resolve(workspaceRoot, 'apps', 'browser', 'dist', 'main.js')]
      : ['--filter', '@hh-scraper/browser', 'dev'];

    this.child = spawn(command, args, {
      cwd: workspaceRoot,
      detached: false,
      env: { ...process.env },
      shell: !isProduction && process.platform === 'win32',
      stdio: 'ignore',
    });

    await new Promise<void>((resolveSpawn, rejectSpawn) => {
      const child = this.child!;
      child.once('spawn', () => resolveSpawn());
      child.once('error', (error) => {
        this.logger.error(`Failed to start browser app: ${error.message}`);
        rejectSpawn(error);
      });
      child.once('exit', (code) => {
        this.child = undefined;
        if (code !== null) {
          rejectSpawn(new Error(`Browser app exited during startup (code ${code})`));
        }
      });
    });

    await this.waitUntilReady();
  }

  private async waitUntilReady(): Promise<void> {
    const host = '127.0.0.1';
    const port = Number(process.env.HH_BROWSER_MICROSERVICE_PORT ?? 3001);
    const deadline = Date.now() + 10_000;

    while (Date.now() < deadline) {
      if (this.child?.exitCode !== null && this.child?.exitCode !== undefined) {
        throw new Error(
          `Browser app exited before becoming ready (code ${this.child.exitCode})`,
        );
      }

      const ready = await this.canConnect(host, port);
      if (ready) {
        return;
      }

      await new Promise((resolveDelay) => setTimeout(resolveDelay, 100));
    }

    throw new Error('Browser app microservice did not become ready');
  }

  private canConnect(host: string, port: number): Promise<boolean> {
    return new Promise((resolveConnection) => {
      const socket = new Socket();
      socket.setTimeout(500);
      socket.once('connect', () => {
        socket.destroy();
        resolveConnection(true);
      });
      socket.once('timeout', () => {
        socket.destroy();
        resolveConnection(false);
      });
      socket.once('error', () => {
        socket.destroy();
        resolveConnection(false);
      });
      socket.connect(port, host);
    });
  }

  async stop(): Promise<void> {
    if (!this.child) {
      return;
    }

    await new Promise<void>((resolveStop) => {
      const child = this.child!;
      if (child.exitCode !== null || child.killed) {
        resolveStop();
        return;
      }
      child.once('exit', () => resolveStop());
      child.kill('SIGTERM');
    });
    this.child = undefined;
  }
}
