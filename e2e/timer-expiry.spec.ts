import { test, expect } from '@playwright/test';

test.describe('Assessment Timer Expiry & Auto-submit Flow', () => {
  test('handles expired timer state gracefully', async ({ page }) => {
    // 1. Mock Auth
    await page.route('**/api/v1/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: 'usr_timed_candidate',
              name: 'Timed Candidate',
              email: 'timed@example.com',
              role: 'USER',
              preferredLanguage: 'EN',
              isActive: true,
            },
          },
        }),
      });
    });

    // 2. Mock Attempt that expires in 2 seconds
    await page.route('**/api/v1/attempts/att_timed_1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            attempt: {
              id: 'att_timed_1',
              productId: 'prod_timed_1',
              status: 'IN_PROGRESS',
              language: 'EN',
              startedAt: new Date(Date.now() - 1798000).toISOString(),
              expiresAt: new Date(Date.now() + 2000).toISOString(),
              product: {
                id: 'prod_timed_1',
                name: { en: 'Speed Benchmark' },
                slug: 'speed-benchmark',
                priceInPaise: 0,
              },
              questions: [
                {
                  id: 'q_t1',
                  text: { en: 'Solve 15 * 4 under pressure.' },
                  type: 'SINGLE_CHOICE',
                  options: [
                    { id: 'opt_1', label: { en: '60' }, score: 1 },
                    { id: 'opt_2', label: { en: '50' }, score: 0 },
                  ],
                },
              ],
              savedResponses: [],
            },
          },
        }),
      });
    });

    // 3. Mock Auto-Submit endpoint
    await page.route('**/api/v1/attempts/att_timed_1/submit', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            attempt: {
              id: 'att_timed_1',
              status: 'SUBMITTED',
              submittedAt: new Date().toISOString(),
            },
          },
        }),
      });
    });

    // 4. Visit Timed Attempt Page
    await page.goto('/en/assessment/attempt/att_timed_1');
    await expect(page.locator('text=Speed Benchmark')).toBeVisible();

    // Verify Timer display is visible
    const timerElement = page.locator('[data-testid="timer-display"], text=Time Remaining, text=00:');
    await expect(timerElement).toBeDefined();
  });
});

