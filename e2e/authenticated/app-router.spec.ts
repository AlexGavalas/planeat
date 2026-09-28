import { expect, test } from '@playwright/test';

import en from '../../public/locales/en/common.json';
import gr from '../../public/locales/gr/common.json';
import { E2E_USER } from '../support/auth';

const hydrationCases = [
    { headings: [en.day_plan, en.fat_change, en.weight_change], path: '/home' },
    { headings: [], path: '/meal-plan' },
    { headings: [en.measurements, en.activities], path: '/settings' },
    {
        headings: [
            en.connections.manage_connection_requests.title,
            en.connections.manage_connections.title,
        ],
        path: '/connections',
    },
    { headings: [en.measurements, en.activities], path: '/gr/settings' },
];

for (const { headings, path } of hydrationCases) {
    test(`hydrates ${path} without duplicate browser data requests`, async ({
        page,
    }) => {
        const errors: string[] = [];
        const requests: string[] = [];

        page.on('pageerror', (error) => errors.push(error.message));
        page.on('request', (request) => {
            if (
                request.method() === 'GET' &&
                new URL(request.url()).pathname.startsWith('/api/v1/')
            ) {
                requests.push(request.url());
            }
        });

        await page.goto(path);

        // Wait for the route's content, including both streamed home sections.
        for (const name of headings) {
            await expect(
                page.getByRole('heading', { exact: true, name }),
            ).toBeVisible();
        }

        if (path === '/meal-plan') {
            await expect(
                page.getByRole('button', { name: en.week.previous }),
            ).toBeEnabled();

            await page.getByRole('button', { name: en.see_overview }).click();

            const overview = page.getByRole('dialog', {
                name: en.modals.week_overview.title,
            });

            await expect(overview).toBeVisible();

            await page.keyboard.press('Escape');

            await expect(overview).toBeHidden();
        }

        // Opening the account menu proves the client is interactive. Unlike
        // networkidle, this does not depend on Vercel's preview toolbar traffic.
        await page
            .getByRole('button')
            .filter({
                has: page.getByRole('img', { name: E2E_USER.FULL_NAME }),
            })
            .click();

        await expect(
            page.getByRole('menuitem', { name: en.settings }),
        ).toBeVisible();

        expect(requests).toEqual([]);
        expect(errors).toEqual([]);
    });
}

test('creates a measurement and refreshes the dashboard summary', async ({
    page,
}) => {
    await page.goto('/settings');

    await page.getByRole('button', { name: en.add_measurement }).click();

    const dialog = page.getByRole('dialog');

    await dialog.getByLabel(en.weight, { exact: true }).fill('81');

    await dialog.getByLabel(en.fat_label, { exact: true }).fill('19');

    await dialog.getByRole('button', { exact: true, name: 'Save' }).click();

    await expect(dialog).toBeHidden();

    await expect(
        page.getByRole('cell', { exact: true, name: '81' }),
    ).toBeVisible();

    await page.getByRole('link', { exact: true, name: 'Home' }).click();

    await expect(page.getByText('19', { exact: true })).toBeVisible();

    const response = await page.request.get('/api/v1/measurement?type=summary');

    const summary = (await response.json()) as {
        data: { currentWeight: number; currentFat: number };
    };

    expect(summary.data).toMatchObject({ currentFat: 19, currentWeight: 81 });
});

test('saves calendar drafts through a server action and copies the week', async ({
    page,
}) => {
    await page.goto('/meal-plan');

    await page.getByText('N/A', { exact: true }).first().hover();

    await page.getByRole('button', { exact: true, name: 'Edit' }).click();

    const dialog = page.getByRole('dialog');

    await dialog
        .locator('textarea[name="meal"]')
        .fill('App Router migration meal');

    await dialog.getByRole('button', { exact: true, name: 'Save' }).click();

    await expect(dialog).toBeHidden();

    await expect(
        page.getByText('App Router migration meal', { exact: true }),
    ).toBeVisible();

    // Draft state survives App Router navigation through the shared provider.
    await page.getByRole('link', { exact: true, name: 'Home' }).click();

    await page.getByRole('link', { exact: true, name: 'Meal plan' }).click();

    await expect(
        page.getByText('App Router migration meal', { exact: true }),
    ).toBeVisible();

    await page.getByRole('button', { exact: true, name: 'Save' }).click();

    await expect(
        page.getByRole('button', { exact: true, name: 'Save' }),
    ).toBeHidden();

    await page.reload();

    await expect(
        page.getByText('App Router migration meal', { exact: true }),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Copy to next week' }).click();

    await page.getByRole('button', { exact: true, name: 'Save' }).click();

    await expect(
        page.getByRole('button', { exact: true, name: 'Save' }),
    ).toBeHidden();

    await page.getByRole('button', { name: 'Previous week' }).click();

    await expect(
        page.getByText('App Router migration meal', { exact: true }),
    ).toBeVisible();

    await page.getByRole('button', { exact: true, name: 'Next week' }).click();

    await expect(
        page.getByText('App Router migration meal', { exact: true }),
    ).toBeVisible();
});

test('persists profile language through a server action and reload', async ({
    page,
}) => {
    await page.goto('/settings');

    await page.getByRole('tab', { name: en.personal_info }).click();

    await page
        .getByRole('combobox', { exact: true, name: en.languages.label })
        .click();

    await page.getByRole('option', { name: en.languages.options.el }).click();

    await page
        .getByRole('button', { exact: true, name: en.generic.actions.save })
        .first()
        .click();

    await expect(
        page.getByRole('tab', { name: gr.personal_info }),
    ).toBeVisible();

    await page.reload();

    await expect(
        page.getByRole('tab', { name: gr.personal_info }),
    ).toBeVisible();

    await page.getByRole('tab', { name: gr.personal_info }).click();

    await page
        .getByRole('combobox', { exact: true, name: gr.languages.label })
        .click();

    await page.getByRole('option', { name: gr.languages.options.en }).click();

    await page
        .getByRole('button', { exact: true, name: gr.generic.actions.save })
        .first()
        .click();

    await expect(
        page.getByRole('tab', { name: en.personal_info }),
    ).toBeVisible();
});

test('rejects unauthenticated API access and preserves the not-found page', async ({
    browser,
    baseURL,
}) => {
    const context = await browser.newContext({
        baseURL,
        storageState: { cookies: [], origins: [] },
    });

    const response = await context.request.get(
        '/api/v1/measurement?type=summary',
    );

    expect(response.status()).toBe(401);

    const page = await context.newPage();

    await page.goto('/does-not-exist');

    await expect(
        page.getByRole('heading', { name: '404 - Page Not Found' }),
    ).toBeVisible();

    await context.close();
});

test('rolls back the whole meal save when an insert fails', async ({
    request,
}) => {
    const profile = (await (await request.get('/api/v1/user')).json()) as {
        data: { id: number };
    };

    const meal = {
        day: '2030-01-01 00:00',
        meal: 'Transaction original',
        section_key: 'morning_01/01/2030',
        user_id: profile.data.id,
    };

    const created = await request.patch('/api/v1/meal', {
        data: { deletedIds: [], editedMeals: [], newMeals: [meal] },
    });

    expect(created.ok()).toBe(true);

    const url = '/api/v1/meal?startDate=2030-01-01&endDate=2030-01-02';

    const before = (await (await request.get(url)).json()) as {
        data: { id: string; meal: string }[];
    };

    const original = before.data.find((item) => item.meal === meal.meal);

    expect(original).toBeDefined();

    const failed = await request.patch('/api/v1/meal', {
        data: {
            deletedIds: [original?.id],
            editedMeals: [],
            newMeals: [{ ...meal, day: 'invalid-date' }],
        },
    });

    expect(failed.status()).toBe(500);

    const after = (await (await request.get(url)).json()) as {
        data: { id: string }[];
    };

    expect(after.data.map((item) => item.id)).toContain(original?.id);
});

test('accepts a connection request atomically and removes the connection', async ({
    page,
    browser,
    baseURL,
}) => {
    const other = await browser.newContext({
        baseURL,
        storageState: { cookies: [], origins: [] },
    });

    const email = `connection-${Date.now()}@example.com`;
    const password = 'PlaneatTestPassword123!';

    const register = await other.request.post('/api/auth/register', {
        data: { email, fullName: 'Connection migration test', password },
    });

    expect(register.status()).toBe(201);

    const csrf = (await (await other.request.get('/api/auth/csrf')).json()) as {
        csrfToken: string;
    };

    await other.request.post('/api/auth/callback/credentials', {
        form: { csrfToken: csrf.csrfToken, email, json: 'true', password },
    });

    const user = (await (await page.request.get('/api/v1/user')).json()) as {
        data: { id: number };
    };

    expect(
        (
            await other.request.post('/api/v1/notification', {
                data: { targetUserId: user.data.id },
            })
        ).ok(),
    ).toBe(true);

    await page.goto('/connections');

    await page.getByRole('button', { exact: true, name: 'Accept' }).click();

    await expect(
        page.getByRole('button', { exact: true, name: 'Accept' }),
    ).toBeHidden();

    await expect(
        page.getByText('Connection migration test', { exact: true }),
    ).toBeVisible();

    const reciprocal = (await (
        await other.request.get('/api/v1/connection')
    ).json()) as { data: unknown[] };

    expect(reciprocal.data).toHaveLength(1);

    await page
        .getByRole('button', {
            name: en.connections.manage_connections.remove_connection,
        })
        .click();

    await expect(
        page.getByText('Connection migration test', { exact: true }),
    ).toBeHidden();

    await other.request.delete('/api/v1/user');
    await other.close();
});

test('enforces upload size and missing-file responses', async ({ request }) => {
    const missing = await request.post('/api/v1/pool/upload', {
        multipart: { description: 'No file' },
    });

    expect(missing.status()).toBe(400);

    const oversized = await request.post('/api/v1/pool/upload', {
        multipart: {
            file: {
                buffer: Buffer.alloc(10 * 1024 * 1024 + 1),
                mimeType:
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                name: 'large.docx',
            },
        },
    });

    expect(oversized.status()).toBe(413);
});
