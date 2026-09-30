import { resolve } from 'path';

export const AUTH_STATE_PATH = resolve(
    process.cwd(),
    'playwright/.auth/user.json',
);

export const VISUAL_AUTH_STATE_PATH = resolve(
    process.cwd(),
    'playwright/.auth/visual-user.json',
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
