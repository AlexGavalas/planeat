import { expect, test as setup } from '@playwright/test';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

import { AUTH_STATE_PATH, E2E_USER } from './support/auth';
import { loadE2eEnvironment } from './support/environment';

setup('authenticate the test user', async ({ page }) => {
    const { mode } = loadE2eEnvironment();

    await page.goto('/');
    await page.getByRole('button', { exact: true, name: 'Log in' }).click();

    if (mode === 'preview') {
        await page.getByRole('button', { name: 'Sign up' }).click();
        await page.getByLabel('Full name').fill(E2E_USER.FULL_NAME);
    }

    await page.getByLabel('Email').fill(E2E_USER.EMAIL);

    await page.getByLabel('Password', { exact: true }).fill(E2E_USER.PASSWORD);

    await page
        .getByRole('button', {
            name: mode === 'preview' ? 'Create account' : 'Log in with email',
        })
        .click();

    await expect(page).toHaveURL('/home');

    if (mode === 'preview') {
        const response = await page.request.patch('/api/v1/user', {
            data: {
                hasCompletedOnboarding: true,
                height: 180,
                isDiscoverable: true,
                language: 'en',
                targetWeight: 75,
            },
        });

        expect(response.ok()).toBe(true);

        await page.reload();
    }

    await expect(page.getByRole('link', { name: 'Meal plan' })).toBeVisible();

    await mkdir(dirname(AUTH_STATE_PATH), { recursive: true });
    await page.context().storageState({ path: AUTH_STATE_PATH });
});
