import { expect, test } from '@playwright/test';

test('loads protected routes for a registered user', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL('/home');

    await expect(page.getByText('Body Mass Index (BMI)')).toBeVisible();

    await page.getByRole('link', { name: 'Meal plan' }).click();

    await expect(page).toHaveURL('/meal-plan');

    await expect(
        page.getByRole('button', { name: 'Previous week' }),
    ).toBeVisible();

    await expect(
        page.getByRole('button', { name: 'Create a meal' }),
    ).toBeVisible();
});
