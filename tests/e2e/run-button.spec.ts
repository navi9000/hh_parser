import { expect, test } from '@playwright/test';

const browserStartApiUrl = 'http://127.0.0.1:3000/browser/start';

test('Run opens a browser window at hh.ru', async ({ page }) => {
  await page.route(browserStartApiUrl, (route) =>
    route.fulfill({
      status: 202,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'started' }),
    }),
  );

  await page.goto('/');
  const runButton = page.getByRole('button', { name: 'Run', exact: true });
  await expect(runButton).toBeVisible();

  const startRequest = page.waitForRequest((request) =>
    request.url() === browserStartApiUrl,
  );

  await runButton.click();

  const request = await startRequest;
  expect(request.method()).toBe('POST');
  expect(request.postDataJSON()).toEqual({ url: 'https://hh.ru' });
});
