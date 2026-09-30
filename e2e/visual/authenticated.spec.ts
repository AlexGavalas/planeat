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
    await expect(
        page.getByRole('heading', { name: 'Body Mass Index (BMI)' }),
    ).toBeVisible();
});

test('homepage stacks its content on mobile Chrome', async ({ page }) => {
    await expectNoHorizontalOverflow(page);
    await expect(
        page.getByRole('link', { exact: true, name: 'Home' }),
    ).toBeHidden();

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
        fullPage: true,
    });
});

test('compact menu contains all navigation links', async ({ page }) => {
    await page.getByRole('button', { name: 'Open navigation menu' }).click();

    const menu = page.getByRole('menu');

    await expect(menu.getByRole('menuitem', { name: 'Home' })).toBeVisible();
    await expect(
        menu.getByRole('menuitem', { name: 'Meal plan' }),
    ).toBeVisible();
    await expect(
        menu.getByRole('menuitem', { name: 'Connections' }),
    ).toBeVisible();
    await expect(
        menu.getByRole('menuitem', { name: 'Settings' }),
    ).toBeVisible();
    await expect(menu.getByRole('menuitem', { name: 'Logout' })).toBeVisible();

    await expect(page).toHaveScreenshot('homepage-menu-mobile.png');

    await menu.getByRole('menuitem', { name: 'Meal plan' }).click();
    await expect(page).toHaveURL('/meal-plan');
    await expect(menu).toBeHidden();
});

test('homepage remains usable at 320px', async ({ page }) => {
    await page.setViewportSize({ height: 568, width: 320 });
    await expectNoHorizontalOverflow(page);

    await expect(page).toHaveScreenshot('homepage-mobile-320.png', {
        fullPage: true,
    });
});

test('expanded quick actions stay anchored to the right', async ({ page }) => {
    const trigger = page.getByRole('button', { name: 'Open quick actions' });
    await trigger.click();

    const expandedTrigger = page.getByRole('button', {
        name: 'Close quick actions',
    });
    const measurementAction = page.getByRole('button', {
        name: 'Add a new measurement',
    });
    await expect(measurementAction).toBeVisible();

    const [triggerBox, actionBox] = await Promise.all([
        expandedTrigger.boundingBox(),
        measurementAction.boundingBox(),
    ]);

    const viewport = page.viewportSize();

    if (!triggerBox || !actionBox || !viewport) {
        throw new Error('Could not measure the expanded quick actions');
    }

    expect(triggerBox.x + triggerBox.width).toBeCloseTo(
        actionBox.x + actionBox.width,
        0,
    );
    expect(triggerBox.x + triggerBox.width).toBeCloseTo(viewport.width - 20, 0);

    await expect(page).toHaveScreenshot('homepage-fab-mobile.png');
});

test('meal plan is touch-friendly on mobile Chrome', async ({ page }) => {
    await page.goto('/meal-plan');
    await expect(
        page.getByRole('heading', { name: 'Meal plan' }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);

    const dayPicker = page.getByRole('group', { name: 'Select a day' });
    await expect(dayPicker.getByRole('button')).toHaveCount(7);
    const secondDay = dayPicker.getByRole('button').nth(1);
    await secondDay.click();
    await expect(secondDay).toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('button', { name: 'Edit Lunch' }).click();
    const dialog = page.getByRole('dialog', { name: 'Edit meal' });
    await dialog
        .getByRole('textbox', { name: 'The meal' })
        .fill('Mobile lunch draft');
    await dialog.getByRole('button', { exact: true, name: 'Save' }).click();

    await expect(dialog).toBeHidden();
    const draftMeal = page.locator('p:visible').filter({
        hasText: /^Mobile lunch draft$/,
    });
    await expect(draftMeal).toBeVisible();
    await page.getByRole('button', { exact: true, name: 'Cancel' }).click();
    await expect(draftMeal).toHaveCount(0);

    await expect(page).toHaveScreenshot('meal-plan-mobile.png', {
        fullPage: true,
    });
});

test('meal plan remains usable at 320px', async ({ page }) => {
    await page.setViewportSize({ height: 568, width: 320 });
    await page.goto('/meal-plan');
    await expect(
        page.getByRole('heading', { name: 'Meal plan' }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await expect(
        page.getByRole('button', { name: 'Edit Lunch' }),
    ).toBeVisible();

    await expect(page).toHaveScreenshot('meal-plan-mobile-320.png', {
        fullPage: true,
    });
});

test('settings use mobile cards and stacked forms', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('tab', { name: 'Measurements' })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await expect(page.getByRole('listitem').first()).toBeVisible();
    await expect(
        page.getByRole('button', { exact: true, name: 'Edit' }).first(),
    ).toBeVisible();
    await expect(
        page.getByRole('button', { exact: true, name: 'Delete' }).first(),
    ).toBeVisible();

    await expect(page).toHaveScreenshot('settings-measurements-mobile.png', {
        fullPage: true,
    });

    await page.getByRole('tab', { name: 'Personal Information' }).click();
    await expect(page.getByLabel('Your height (in cm)')).toBeVisible();
    await expect(page.getByLabel('Your target weight (in kg)')).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await expect(page).toHaveScreenshot('settings-personal-mobile.png', {
        fullPage: true,
    });
});

test('advanced settings remain usable at 320px', async ({ page }) => {
    await page.setViewportSize({ height: 568, width: 320 });
    await page.goto('/settings');
    await page.getByRole('tab', { name: 'Advanced Settings' }).click();
    await expect(
        page.getByRole('switch', {
            name: 'Is my profile visible to other users?',
        }),
    ).toBeVisible();
    await expect(
        page.getByRole('heading', { name: 'Delete account' }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await expect(page).toHaveScreenshot('settings-advanced-mobile-320.png', {
        fullPage: true,
    });
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
