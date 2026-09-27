import { expect, test } from '@playwright/test';

test.describe('public routes', () => {
    test('shows the landing page and credentials login', async ({ page }) => {
        await page.goto('/');

        await expect(page).toHaveTitle('Planeat');
        await expect(
            page.getByRole('heading', { name: 'Welcome to Planeat!' }),
        ).toBeVisible();

        await page.getByRole('button', { exact: true, name: 'Log in' }).click();

        await expect(page.getByLabel('Email')).toBeVisible();
        await expect(
            page.getByLabel('Password', { exact: true }),
        ).toBeVisible();
    });

    test('redirects an anonymous user away from a protected route', async ({
        page,
    }) => {
        await page.goto('/home');

        await expect(page).toHaveURL('/');
        await expect(
            page.getByRole('heading', { name: 'Welcome to Planeat!' }),
        ).toBeVisible();
    });
});
