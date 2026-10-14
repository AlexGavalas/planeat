import { expect, test } from '@playwright/test';

test('keeps schedule header and actions in the viewport', async ({ page }) => {
    await page.setViewportSize({ height: 500, width: 1024 });
    await page.goto('/meal-plan');
    await page.getByRole('button', { name: 'Edit schedule' }).click();

    const drawer = page.getByRole('dialog', { name: 'Edit week schedule' });
    const heading = drawer.getByRole('heading', {
        name: 'Edit week schedule',
    });
    const cancel = drawer.getByRole('button', { name: 'Cancel' });
    const save = drawer.getByRole('button', { name: 'Save schedule' });

    await expect(heading).toBeInViewport();
    await expect(cancel).toBeInViewport();
    await expect(save).toBeInViewport();

    await drawer.getByText('Copy schedule from').scrollIntoViewIfNeeded();

    await expect(heading).toBeInViewport();
    await expect(cancel).toBeInViewport();
    await expect(save).toBeInViewport();
});
