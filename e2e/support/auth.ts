import { type Page, expect } from '@playwright/test';
import { resolve } from 'path';

import { type E2eEnvironment } from './environment';

export const AUTH_STATE_PATH = resolve(
    process.cwd(),
    'playwright/.auth/user.json',
);

export const VISUAL_AUTH_STATE_PATH = resolve(
    process.cwd(),
    'playwright/.auth/visual-user.json',
);

export const PROFESSIONAL_AUTH_STATE_PATH = resolve(
    process.cwd(),
    'playwright/.auth/professional-user.json',
);

const e2eUserEmail = process.env.E2E_USER_EMAIL ?? 'e2e-user@example.test';

export const E2E_USER = Object.freeze({
    EMAIL: e2eUserEmail,
    FULL_NAME: 'E2E User',
    PASSWORD: 'e2e-password',
});

export const VISUAL_E2E_USER = Object.freeze({
    EMAIL: process.env.VISUAL_E2E_USER_EMAIL ?? `visual-${e2eUserEmail}`,
    FULL_NAME: 'Visual E2E User',
    PASSWORD: 'visual-e2e-password',
});

export const PROFESSIONAL_E2E_USER = Object.freeze({
    EMAIL: 'professional-e2e-user@example.test',
    FULL_NAME: 'Professional E2E User',
    PASSWORD: 'professional-e2e-password',
});

type E2eUser = {
    EMAIL: string;
    FULL_NAME: string;
    PASSWORD: string;
};

export const authenticateE2eUser = async (
    page: Page,
    user: E2eUser,
    mode: E2eEnvironment['mode'],
    expectedPath = '/home',
): Promise<void> => {
    await page.goto('/');
    await page.getByRole('button', { exact: true, name: 'Log in' }).click();

    if (mode === 'preview') {
        await page.getByRole('button', { name: 'Sign up' }).click();
        await page.getByLabel('Full name').fill(user.FULL_NAME);
    }

    await page.getByLabel('Email').fill(user.EMAIL);
    await page.getByLabel('Password', { exact: true }).fill(user.PASSWORD);

    if (mode === 'preview') {
        const registrationResponse = page.waitForResponse(
            (response) =>
                response.request().method() === 'POST' &&
                new URL(response.url()).pathname === '/api/auth/register',
        );

        await page
            .getByRole('button', { exact: true, name: 'Create account' })
            .click();

        const response = await registrationResponse;

        if (response.status() === 409) {
            const dialog = page.getByRole('dialog');

            await dialog
                .getByRole('button', { exact: true, name: 'Log in' })
                .click();
            await dialog.getByLabel('Email').fill(user.EMAIL);
            await dialog
                .getByLabel('Password', { exact: true })
                .fill(user.PASSWORD);
            await dialog
                .getByRole('button', {
                    exact: true,
                    name: 'Log in with email',
                })
                .click();
        } else {
            expect(response.status()).toBe(201);
        }
    } else {
        await page
            .getByRole('button', {
                exact: true,
                name: 'Log in with email',
            })
            .click();
    }

    await expect(page).toHaveURL(expectedPath);
};
