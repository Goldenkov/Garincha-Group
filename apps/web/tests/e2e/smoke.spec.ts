import { test, expect } from '@playwright/test';

test('dashboard is reachable', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard');
  await expect(page.getByText('GG Territory Map')).toBeVisible();
});
