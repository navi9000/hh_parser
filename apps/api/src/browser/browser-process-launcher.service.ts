import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

export const BROWSER_PROCESS_LAUNCHER = 'BROWSER_PROCESS_LAUNCHER';

export interface BrowserProcessLauncher {
  launch(options: { env: NodeJS.ProcessEnv }): Promise<void>;
}

@Injectable()
export class BrowserProcessLauncherService implements BrowserProcessLauncher {
  private readonly logger = new Logger(BrowserProcessLauncherService.name);

  launch(options: { env: NodeJS.ProcessEnv }): Promise<void> {
    const workspaceRoot = resolve(__dirname, '../../..');
    const isProduction = process.env.NODE_ENV === 'production';
    const command = isProduction ? process.execPath : 'pnpm';
    const args = isProduction
      ? [resolve(workspaceRoot, 'apps', 'browser', 'dist', 'main.js')]
      : ['--filter', '@hh-scraper/browser', 'dev'];
    const child = spawn(command, args, {
      cwd: workspaceRoot,
      detached: true,
      env: { ...process.env, ...options.env },
      shell: !isProduction && process.platform === 'win32',
      stdio: 'ignore',
    });

    return new Promise((resolveLaunch, rejectLaunch) => {
      let launched = false;

      child.once('error', (error) => {
        this.logger.error(`Failed to launch the browser process: ${error.message}`);
        if (!launched) {
          rejectLaunch(error);
        }
      });

      child.once('spawn', () => {
        launched = true;
        child.unref();
        resolveLaunch();
      });

      child.once('exit', (code, signal) => {
        if (code !== 0 || signal !== null) {
          this.logger.error(
            `Browser process exited unexpectedly (code: ${code}, signal: ${signal}).`,
          );
        }
      });
    });
  }
}
