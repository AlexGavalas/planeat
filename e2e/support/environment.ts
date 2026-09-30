import { config as loadDotenv } from 'dotenv';
import { resolve } from 'path';

type E2eEnvironment = {
    baseUrl: string;
    databaseUrl?: string;
    mode: 'local' | 'preview';
    serverEnvironment: Record<string, string>;
};

const getEnvironmentValue = (key: string, fallback?: string): string => {
    const value = process.env[key] ?? fallback;

    if (!value) {
        throw new Error(
            `Missing ${key}. Copy .env.e2e.example to .env.e2e or set it in the environment.`,
        );
    }

    return value;
};

export const assertE2eDatabaseUrl = (databaseUrl: string): void => {
    const parsedUrl = new URL(databaseUrl);
    const databaseName = parsedUrl.pathname.split('/').filter(Boolean).at(-1);

    if (!databaseName?.toLowerCase().includes('e2e')) {
        throw new Error(
            `Refusing to reset database "${
                databaseName ?? 'unknown'
            }". The e2e database name must contain "e2e".`,
        );
    }
};

export const loadE2eEnvironment = (): E2eEnvironment => {
    loadDotenv({
        path: resolve(process.cwd(), '.env.e2e'),
        quiet: true,
    });

    const baseUrl = getEnvironmentValue(
        'PLAYWRIGHT_TEST_BASE_URL',
        'http://localhost:3000',
    );

    const mode = process.env.E2E_MODE === 'preview' ? 'preview' : 'local';

    if (mode === 'preview') {
        return { baseUrl, mode, serverEnvironment: {} };
    }

    const databaseUrl = getEnvironmentValue('E2E_DATABASE_URL');

    const googleId = getEnvironmentValue('GOOGLE_ID', 'planeat-e2e-google-id');

    const googleSecret = getEnvironmentValue(
        'GOOGLE_SECRET',
        'planeat-e2e-google-secret',
    );

    const nextAuthSecret = getEnvironmentValue(
        'NEXTAUTH_SECRET',
        'planeat-e2e-only-secret',
    );

    const nextAuthUrl = getEnvironmentValue('NEXTAUTH_URL', baseUrl);

    const requestDate = getEnvironmentValue(
        'E2E_REQUEST_DATE',
        '2026-01-12T12:00:00.000Z',
    );

    assertE2eDatabaseUrl(databaseUrl);

    const serverEnvironment = {
        E2E_DATABASE_URL: databaseUrl,
        E2E_REQUEST_DATE: requestDate,
        GOOGLE_ID: googleId,
        GOOGLE_SECRET: googleSecret,
        NEXTAUTH_SECRET: nextAuthSecret,
        NEXTAUTH_URL: nextAuthUrl,
        PLAYWRIGHT_TEST_BASE_URL: baseUrl,
    };

    Object.assign(process.env, serverEnvironment, {
        DATABASE_URL: databaseUrl,
    });

    return { baseUrl, databaseUrl, mode, serverEnvironment };
};
