import { expect, test } from '@playwright/test';

test('loads protected routes for a registered user', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL('/home');

    await expect(
        page.getByRole('heading', { name: 'Health trend' }),
    ).toBeVisible();

    await page.getByRole('link', { exact: true, name: 'Meal plan' }).click();

    await expect(page).toHaveURL('/meal-plan');

    await expect(
        page.getByRole('button', { name: 'Previous week' }),
    ).toBeVisible();

    await expect(
        page.getByRole('button', { name: 'Create a meal' }),
    ).toBeVisible();
});

test('homepage actions open their advertised destinations', async ({
    page,
}) => {
    await page.goto('/home');

    await page.getByRole('link', { name: 'View meal plan' }).click();
    await expect(page).toHaveURL(/\/meal-plan\?date=\d{4}-\d{2}-\d{2}$/);

    await page.goto('/home');
    await page.getByRole('link', { name: 'Details' }).click();
    await expect(page).toHaveURL('/settings');
});
