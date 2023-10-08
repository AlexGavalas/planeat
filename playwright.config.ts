import { defineConfig, devices } from '@playwright/test';

const envVarBaseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL;

const baseURL =
    typeof envVarBaseUrl === 'string' ? envVarBaseUrl : 'http://localhost:3000';

export default defineConfig({
    expect: {
        toHaveScreenshot: {
            maxDiffPixelRatio: 0.1,
        },
    },
    // Fail the build on CI if you accidentally left test.only in the source code.
    forbidOnly: !!process.env.CI,
    fullyParallel: true,
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    reporter: 'html',
    retries: process.env.CI ? 2 : 0,
    snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',
    testDir: './e2e',
    use: {
        baseURL,
        trace: 'on-first-retry',
    },
    workers: process.env.CI ? 1 : undefined,
    ...(!process.env.CI && {
        webServer: {
            command: 'pnpm dev',
            url: 'http://localhost:3000',
        },
    }),
});
