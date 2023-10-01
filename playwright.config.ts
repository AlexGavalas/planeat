import { defineConfig, devices } from '@playwright/test';

const envVarBaseUrl = process.env.PLAYWRIGHT_TEST_BASE_URL;

const baseURL =
    typeof envVarBaseUrl === 'string' ? envVarBaseUrl : 'http://localhost:3000';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    expect: {
        toHaveScreenshot: {
            maxDiffPixelRatio: 0.1,
        },
    },
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Run tests in files in parallel */
    fullyParallel: true,

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,

    snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',

    testDir: './e2e',

    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        baseURL,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
    },

    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,

    ...(!process.env.CI && {
        webServer: {
            command: 'pnpm dev',
            url: 'http://localhost:3000',
        },
    }),
});
