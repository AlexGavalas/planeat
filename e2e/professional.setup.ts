import { expect, test as setup } from '@playwright/test';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

import {
    PROFESSIONAL_AUTH_STATE_PATH,
    PROFESSIONAL_E2E_USER,
    authenticateE2eUser,
} from './support/auth';
import { loadE2eEnvironment } from './support/environment';

setup('authenticate the professional test user', async ({ page }) => {
    const { mode } = loadE2eEnvironment();

    await authenticateE2eUser(
        page,
        PROFESSIONAL_E2E_USER,
        mode,
        '/professional',
    );

    await expect(
        page.getByRole('heading', { name: 'Professional dashboard' }),
    ).toBeVisible();

    await mkdir(dirname(PROFESSIONAL_AUTH_STATE_PATH), { recursive: true });
    await page.context().storageState({ path: PROFESSIONAL_AUTH_STATE_PATH });
});
