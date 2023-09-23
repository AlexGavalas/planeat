import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('Planeat');
});

test('snapshot', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveScreenshot({ fullPage: true });
});
