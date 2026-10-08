import { type Page, expect, test } from '@playwright/test';

const expectNoHorizontalOverflow = async (page: Page): Promise<void> => {
    expect(
        await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
    ).toBe(true);
};

test.beforeEach(async ({ page }) => {
    await page.goto('/home');
    await expect(page.getByRole('heading', { name: 'Day plan' })).toBeVisible();
});

test('connections search result stacks on mobile Chrome', async ({ page }) => {
    await page.goto('/connections');
    await expect(
        page.getByRole('heading', { exact: true, name: 'Connections' }),
    ).toBeVisible();
    await expect(
        page.getByRole('heading', { name: 'Find people' }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);

    const search = page.getByRole('combobox', { name: 'Search' });
    await search.fill('E2E');
    await page.getByRole('option', { name: 'E2E User' }).first().click();
    await expect(
        page.getByRole('button', { name: 'Send connection request' }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await expect(page).toHaveScreenshot('connections-search-mobile.png', {
        fullPage: true,
    });

    await page.getByRole('button', { name: 'Clear' }).click();
    await expect(search).toHaveValue('');
});

test('connections remains usable at 320px', async ({ page }) => {
    await page.setViewportSize({ height: 568, width: 320 });
    await page.goto('/connections');
    await expect(
        page.getByRole('heading', { name: 'Find people' }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await expect(page).toHaveScreenshot('connections-mobile-320.png', {
        fullPage: true,
    });
});
