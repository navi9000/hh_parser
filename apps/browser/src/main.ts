import { launchControlledBrowser } from './browser.js';

async function main() {
  const session = await launchControlledBrowser({
    headless: process.env.HH_BROWSER_HEADLESS === 'true',
    startUrl: process.env.HH_BROWSER_START_URL,
  });

  console.info('Controlled browser started. Close the window or press Ctrl+C to exit.');

  const shutdown = async () => {
    try {
      await session.close();
    } catch (error) {
      console.error('Failed to close the controlled browser:', error);
      process.exitCode = 1;
    }
  };

  process.once('SIGINT', () => void shutdown());
  process.once('SIGTERM', () => void shutdown());

  await new Promise<void>((resolve) => {
    session.browser.once('disconnected', () => resolve());
  });
}

void main().catch((error: unknown) => {
  console.error('Failed to start the controlled browser:', error);
  process.exitCode = 1;
});
