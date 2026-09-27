import { defineConfig, devices } from '@playwright/test';

import { AUTH_STATE_PATH } from './e2e/support/auth';
import { loadE2eEnvironment } from './e2e/support/environment';

const environment = loadE2eEnvironment();
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

export default defineConfig({
    expect: {
        timeout: 30000,
        toHaveScreenshot: {
            maxDiffPixelRatio: 0.1,
            stylePath: 'e2e/styles.css',
        },
    },
    forbidOnly: Boolean(process.env.CI),
    fullyParallel: false,
    globalSetup: './e2e/global.setup.ts',
    projects: [
        {
            name: 'auth-setup',
            testMatch: /auth\.setup\.ts/,
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'public',
            testMatch: /public\/.*\.spec\.ts/,
            use: { ...devices['Desktop Chrome'] },
        },
        {
            dependencies: ['auth-setup'],
            name: 'authenticated',
            testMatch: /authenticated\/.*\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                storageState: AUTH_STATE_PATH,
            },
        },
    ],
    reporter: 'html',
    retries: process.env.CI ? 2 : 0,
    snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',
    testDir: './e2e',
    use: {
        baseURL: environment.baseUrl,
        extraHTTPHeaders: bypassSecret
            ? {
                  'x-vercel-protection-bypass': bypassSecret,
                  'x-vercel-set-bypass-cookie': 'true',
              }
            : {},
        trace: 'on-first-retry',
    },
    workers: 1,
    ...(environment.mode === 'local' &&
        environment.databaseUrl && {
            webServer: {
                command: 'mise exec -- pnpm preview',
                env: {
                    ...environment.serverEnvironment,
                    DATABASE_URL: environment.databaseUrl,
                },
                reuseExistingServer: false,
                url: environment.baseUrl,
            },
        }),
});
