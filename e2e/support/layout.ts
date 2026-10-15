import { type Page, expect } from '@playwright/test';

export const expectNoHorizontalOverflow = async (page: Page): Promise<void> => {
    expect(
        await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
    ).toBe(true);
};
