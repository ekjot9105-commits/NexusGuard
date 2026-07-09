import { test, expect } from '@playwright/test';

test.describe('Fan Portal Operations', () => {
  test('should load fan portal and toggle dark mode successfully', async ({ page }) => {
    // Navigate to fan portal directly
    await page.goto('/fan-portal');
    await expect(page.getByText('Bilingual Fan Concierge')).toBeVisible();

    // Verify Wayfinding Engine is visible
    await expect(page.getByText('Wayfinding Engine')).toBeVisible();

    // Test Theme Toggle functionality (Accessibility)
    const themeBtn = page.getByLabel('Toggle theme');
    await expect(themeBtn).toBeVisible();
    
    // Check initial mode
    const isDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    
    // Toggle
    await themeBtn.click();
    
    // Check mode changed
    const isDarkAfter = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    expect(isDarkAfter).not.toBe(isDark);
  });
});
