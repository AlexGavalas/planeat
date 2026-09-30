import { type Page, expect, test } from '@playwright/test';

const expectNoHorizontalOverflow = async (page: Page): Promise<void> => {
    expect(
        await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
    ).toBe(true);
};

test('landing page is readable on mobile Chrome', async ({ page }) => {
    await page.goto('/');

    await expect(
        page.getByRole('heading', { name: 'Welcome to Planeat!' }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await expect(page).toHaveScreenshot('landing-mobile.png', {
        fullPage: true,
    });
});
