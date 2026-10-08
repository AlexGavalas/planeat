import { expect, test } from '@playwright/test';

import { AUTH_STATE_PATH } from '../support/auth';

test('accepts an invitation and opens the assigned client meal plan', async ({
    baseURL,
    browser,
    page,
}) => {
    const clientContext = await browser.newContext({
        baseURL,
        storageState: AUTH_STATE_PATH,
    });
    const clientPage = await clientContext.newPage();

    await clientPage.goto('/connections');
    await clientPage
        .getByLabel('Search professionals')
        .fill('professional-e2e-user@');
    await expect(
        clientPage.getByText('professional-e2e-user@example.test'),
    ).toBeVisible();
    await clientPage
        .getByRole('button', { exact: true, name: 'Invite' })
        .click();
    await expect(
        clientPage.getByRole('button', {
            exact: true,
            name: 'Invitation pending',
        }),
    ).toBeDisabled();
    await page.goto('/connections');
    await expect(page.getByText('e2e-user@example.test')).toBeVisible();
    await page.getByRole('button', { exact: true, name: 'Accept' }).click();
    await expect(page.getByText('e2e-user@example.test')).not.toBeVisible();

    const profileResponse = await clientPage.request.get('/api/v1/user');
    const profile = (await profileResponse.json()) as { data: { id: number } };
    const originalMeal = {
        day: '2026-01-12',
        meal: 'Client meal',
        note: 'Client note',
        rating: 4,
        section_key: 'morning_12/01/2026',
        user_id: profile.data.id,
    };
    const createResponse = await clientPage.request.patch('/api/v1/meal', {
        data: { deletedIds: [], editedMeals: [], newMeals: [originalMeal] },
    });
    expect(createResponse.ok()).toBe(true);

    const mealsUrl = '/api/v1/meal?startDate=2026-01-12&endDate=2026-01-18';
    const mealsResponse = await clientPage.request.get(mealsUrl);
    const meals = (await mealsResponse.json()) as {
        data: (typeof originalMeal & { id: string })[];
    };
    const clientMeal = meals.data.find(
        ({ section_key }) => section_key === originalMeal.section_key,
    );
    expect(clientMeal).toBeDefined();

    const delegatedResponse = await page.request.patch('/api/v1/meal', {
        data: {
            deletedIds: [],
            editedMeals: [
                {
                    ...clientMeal,
                    meal: 'Professional edit',
                    note: 'Professional note',
                    rating: 1,
                },
            ],
            newMeals: [],
            ownerUserId: profile.data.id,
        },
    });
    expect(delegatedResponse.ok()).toBe(true);

    const updatedMealsResponse = await clientPage.request.get(mealsUrl);
    const updatedMeals = (await updatedMealsResponse.json()) as {
        data: (typeof originalMeal & { id: string })[];
    };
    expect(
        updatedMeals.data.find(
            ({ section_key }) => section_key === originalMeal.section_key,
        ),
    ).toMatchObject({
        meal: 'Professional edit',
        note: 'Client note',
        rating: 4,
    });

    await page.goto('/professional');

    await expect(page.getByText('1 of 10 clients')).toBeVisible();
    await expect(page.getByText('e2e-user@example.test')).toBeVisible();

    await page.getByLabel('Search clients').fill('e2e-user@');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page).toHaveURL(/q=e2e-user%40/);

    await page.getByRole('button', { name: 'E2E User' }).click();

    const drawer = page.getByRole('dialog');

    await expect(drawer).toBeVisible();
    await expect(
        drawer.getByRole('heading', { exact: true, name: 'E2E User' }),
    ).toBeVisible();
    await expect(
        drawer.getByRole('button', { name: 'Previous week' }),
    ).toBeVisible();
    await expect(
        drawer.getByRole('heading', { name: 'Meal schedule' }),
    ).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(drawer).toBeHidden();
    await expect(page).not.toHaveURL(/client=/);

    await clientContext.close();
});
