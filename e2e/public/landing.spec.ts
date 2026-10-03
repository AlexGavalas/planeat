import { expect, test } from '@playwright/test';

test.describe('public routes', () => {
    test('shows the landing page and credentials login', async ({ page }) => {
        await page.goto('/');

        await expect(page).toHaveTitle('Planeat');

        await expect(
            page.getByRole('heading', {
                name: 'Plan your meals. See your progress.',
            }),
        ).toBeVisible();

        await page.getByRole('button', { name: 'Create an account' }).click();

        await expect(
            page.getByRole('heading', {
                name: 'Create your Planeat account',
            }),
        ).toBeVisible();
        await expect(page.getByLabel('Full name')).toBeVisible();

        await page.keyboard.press('Escape');
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
            page.getByRole('heading', {
                name: 'Plan your meals. See your progress.',
            }),
        ).toBeVisible();
    });
});
