import { test, expect } from '@playwright/test';

test.describe('Client Portal Flow', () => {
    test('should display picks and filter by sport', async ({ page }) => {
        // Navigate to the client app
        await page.goto('/');

        // Check if the title is present
        await expect(page.getByText('IBY Picks')).toBeVisible();

        // Check if default sport (NFL) is active
        await expect(page.getByRole('link', { name: 'NFL' })).toHaveClass(/bg-accent\/5/);

        // Verify picks are displayed
        await expect(page.getByText('Chiefs vs. Bills')).toBeVisible();

        // Filter by NBA
        await page.getByRole('link', { name: 'NBA' }).click();

        // Verify NBA picks are displayed
        await expect(page.getByText('Lakers vs. Warriors')).toBeVisible();

        // Verify NFL picks are hidden
        await expect(page.getByText('Chiefs vs. Bills')).not.toBeVisible();
    });

    test('should show update indicator', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByText(/Last Updated:/)).toBeVisible();
    });
});
