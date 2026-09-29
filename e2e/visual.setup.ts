import { expect, test as setup } from '@playwright/test';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

import { VISUAL_AUTH_STATE_PATH, VISUAL_E2E_USER } from './support/auth';
import { loadE2eEnvironment } from './support/environment';

setup('authenticate the visual test user', async ({ page }) => {
    const { mode } = loadE2eEnvironment();

    await page.goto('/');
    await page.getByRole('button', { exact: true, name: 'Log in' }).click();

    if (mode === 'preview') {
        await page.getByRole('button', { name: 'Sign up' }).click();
        await page.getByLabel('Full name').fill(VISUAL_E2E_USER.FULL_NAME);
    }

    await page.getByLabel('Email').fill(VISUAL_E2E_USER.EMAIL);
    await page
        .getByLabel('Password', { exact: true })
        .fill(VISUAL_E2E_USER.PASSWORD);
    await page
        .getByRole('button', {
            exact: true,
            name: mode === 'preview' ? 'Create account' : 'Log in with email',
        })
        .click();

    await expect(page).toHaveURL('/home');

    if (mode === 'preview') {
        const response = await page.request.patch('/api/v1/user', {
            data: { hasCompletedOnboarding: true },
        });

        expect(response.ok()).toBe(true);
        await page.reload();
    }

    const summaryResponse = await page.request.get(
        '/api/v1/measurement?type=summary',
    );
    const summary = (await summaryResponse.json()) as {
        data: { currentWeight: number };
    };

    if (summary.data.currentWeight !== 78) {
        for (const measurement of [
            { date: '2026-01-05', fatPercent: 21, weight: 82 },
            { date: '2026-01-08', fatPercent: 20, weight: 80 },
            { date: '2026-01-12', fatPercent: 19, weight: 78 },
        ]) {
            const response = await page.request.post('/api/v1/measurement', {
                data: measurement,
            });

            expect(response.ok()).toBe(true);
        }

        await page.reload();
    }

    await expect(page.getByRole('heading', { name: 'Day plan' })).toBeVisible();

    await mkdir(dirname(VISUAL_AUTH_STATE_PATH), { recursive: true });
    await page.context().storageState({ path: VISUAL_AUTH_STATE_PATH });
});
