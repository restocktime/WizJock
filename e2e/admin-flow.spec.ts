import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Mock authentication or login
        // For now, assuming we can access /admin directly or via a mock login
        await page.goto('/admin');
    });

    test('should generate and publish a report', async ({ page }) => {
        // Navigate to Reports page
        await page.getByRole('link', { name: 'Reports' }).click();

        // Generate Report
        await page.getByRole('button', { name: 'Generate Report' }).click();
        await page.getByLabel('Sport').selectOption('NFL');
        await page.getByRole('button', { name: 'Generate' }).click();

        // Verify report is generated
        await expect(page.getByText('NFL Report')).toBeVisible();

        // Edit a pick
        await page.getByRole('button', { name: 'Edit' }).first().click();
        await page.getByLabel('Units').fill('5');
        await page.getByRole('button', { name: 'Save' }).click();

        // Verify change
        await expect(page.getByText('5 Units')).toBeVisible();

        // Publish
        await page.getByRole('button', { name: 'Publish Report' }).click();
        await page.getByRole('button', { name: 'Confirm' }).click();

        // Verify published status
        await expect(page.getByText('Published')).toBeVisible();
    });
});
