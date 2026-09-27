import { resolve } from 'path';

export const AUTH_STATE_PATH = resolve(
    process.cwd(),
    'playwright/.auth/user.json',
);

export const E2E_USER = Object.freeze({
    EMAIL: process.env.E2E_USER_EMAIL ?? 'e2e-user@example.test',
    FULL_NAME: 'E2E User',
    PASSWORD: 'e2e-password',
});
