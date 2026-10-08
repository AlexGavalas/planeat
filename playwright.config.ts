import { defineConfig, devices } from '@playwright/test';

import {
    AUTH_STATE_PATH,
    PROFESSIONAL_AUTH_STATE_PATH,
    VISUAL_AUTH_STATE_PATH,
} from './e2e/support/auth';
import { loadE2eEnvironment } from './e2e/support/environment';

const environment = loadE2eEnvironment();
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const isCi = Boolean(process.env.CI);

export default defineConfig({
    expect: {
        timeout: 30000,
        toHaveScreenshot: {
            maxDiffPixelRatio: isCi ? 0.1 : 0,
            stylePath: 'e2e/styles.css',
        },
    },
    forbidOnly: isCi,
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
            name: 'visual-auth-setup',
            testMatch: /visual\.setup\.ts/,
            use: { ...devices['Desktop Chrome'] },
        },
        ...(environment.mode === 'local'
            ? [
                  {
                      name: 'professional-auth-setup',
                      testMatch: /professional\.setup\.ts/,
                      use: { ...devices['Desktop Chrome'] },
                  },
                  {
                      dependencies: ['auth-setup', 'professional-auth-setup'],
                      name: 'professional',
                      testMatch: /professional\/.*\.spec\.ts/,
                      use: {
                          ...devices['Desktop Chrome'],
                          storageState: PROFESSIONAL_AUTH_STATE_PATH,
                      },
                  },
              ]
            : []),
        {
            dependencies: ['auth-setup'],
            name: 'authenticated',
            testMatch: /authenticated\/.*\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                storageState: AUTH_STATE_PATH,
            },
        },
        {
            name: 'mobile-public',
            testMatch: /visual\/public\.spec\.ts/,
            use: { ...devices['Pixel 5'] },
        },
        {
            dependencies: ['visual-auth-setup'],
            name: 'mobile-authenticated',
            testMatch: /visual\/(authenticated|connections)\.spec\.ts/,
            use: {
                ...devices['Pixel 5'],
                storageState: VISUAL_AUTH_STATE_PATH,
            },
        },
    ],
    reporter: 'html',
    retries: isCi ? 2 : 0,
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
