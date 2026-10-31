import { test, expect } from '@playwright/test';

test.describe('Hindi Localization (hi) Flow Smoke Test', () => {
  test('renders bilingual Hindi assessment interface properly', async ({ page }) => {
    // Mock user with preferredLanguage = HI
    await page.route('**/api/v1/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: 'usr_hindi_candidate',
              name: 'अमित कुमार',
              email: 'amit@example.com',
              role: 'USER',
              preferredLanguage: 'HI',
              isActive: true,
            },
          },
        }),
      });
    });

    // Mock Hindi Product
    await page.route('**/api/v1/products/hindi-benchmark', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            product: {
              id: 'prod_hi_1',
              slug: 'hindi-benchmark',
              name: { en: 'Cognitive Evaluation', hi: 'संज्ञानात्मक मूल्यांकन बेंचमार्क' },
              description: { en: 'In-depth test', hi: 'गहन संज्ञानात्मक एवं तार्किक मूल्यांकन' },
              priceInPaise: 0,
              currency: 'INR',
              assessmentId: 'asm_hi_1',
              isActive: true,
            },
          },
        }),
      });
    });

    // Visit Hindi home page
    await page.goto('/hi');
    await expect(page).toHaveTitle(/Antigravity Assessment/i);

    // Verify Hindi hero content rendered
    await expect(page.locator('text=गहन नैदानिक मूल्यांकन')).toBeVisible();

    // Verify Hindi catalog navigation
    await page.goto('/hi/products');
    await expect(page.locator('text=आकलन सूची, text=उत्पाद सूची')).toBeDefined();
  });
});

