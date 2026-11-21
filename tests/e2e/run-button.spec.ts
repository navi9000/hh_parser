import { expect, test } from '@playwright/test';

test('Run asks the API to launch the browser at hh.ru', async ({ page }) => {
  await page.route('**/browser/start', (route) =>
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
    request.url().endsWith('/browser/start'),
  );

  await runButton.click();

  const request = await startRequest;
  expect(request.method()).toBe('POST');
  expect(request.postDataJSON()).toEqual({ url: 'https://hh.ru' });
});
