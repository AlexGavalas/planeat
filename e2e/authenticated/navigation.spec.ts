import { expect, test } from '@playwright/test';

import { DEFAULT_E2E_REQUEST_DATE } from '../../src/constants/e2e';

const FIXED_E2E_DAY = DEFAULT_E2E_REQUEST_DATE.slice(0, 10);

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

    await page.getByRole('link', { name: 'Plan Lunch' }).click();
    await expect(page).toHaveURL(`/meal-plan?date=${FIXED_E2E_DAY}&meal=lunch`);
    const mealDialog = page.getByRole('dialog', { name: 'Edit meal' });
    await expect(mealDialog).toBeVisible();
    await expect(mealDialog.getByLabel('The meal')).toBeVisible();
    await mealDialog.getByRole('button', { name: 'Cancel' }).click();

    await page.goto('/home');
    await page.getByRole('link', { name: 'View meal plan' }).click();
    await expect(page).toHaveURL(`/meal-plan?date=${FIXED_E2E_DAY}`);

    await page.goto('/home');
    await page.getByRole('link', { name: 'Details' }).click();
    await expect(page).toHaveURL('/settings');

    await page.goto('/settings?tab=personal');
    await expect(
        page.getByRole('tab', { name: 'Personal Information' }),
    ).toHaveAttribute('aria-selected', 'true');
});
