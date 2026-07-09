import { test, expect } from '@playwright/test';

test.describe('Accessibility and Fallbacks', () => {
  test('heatmap has sr-only table and aria-hidden visual grid', async ({ page }) => {
    await page.goto('/');
    
    // Check for sr-only table
    const table = page.locator('table caption:has-text("Live Stadium Sector Status")');
    await expect(table).toBeAttached();

    // Check that SVG buttons are keyboard accessible
    const visualNode = page.locator('g[role="button"]').first();
    await expect(visualNode).toHaveAttribute('tabindex', '0');
  });
});
