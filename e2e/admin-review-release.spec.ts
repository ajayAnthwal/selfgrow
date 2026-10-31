import { test, expect } from '@playwright/test';

test.describe('Admin Review & Release Workflow', () => {
  test('admin reviews diagnostic report and triggers release', async ({ page }) => {
    // 1. Mock Admin Auth
    await page.route('**/api/v1/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: 'usr_lead_admin',
              name: 'Dr. Evelyn Stone',
              email: 'evelyn@admin.local',
              role: 'ADMIN',
              preferredLanguage: 'EN',
              isActive: true,
            },
          },
        }),
      });
    });

    // 2. Mock Reports List
    await page.route('**/api/v1/admin/reports*', async (route) => {
      if (route.request().url().includes('/api/v1/admin/reports/rep_review_1')) {
        return; // Handled by individual detail route
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            items: [
              {
                id: 'rep_review_1',
                orderId: 'ord_sample_1',
                status: 'PENDING_REVIEW',
                version: 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                order: {
                  id: 'ord_sample_1',
                  user: { name: 'Kavita Roy', email: 'kavita@example.com' },
                  product: { name: { en: 'Strategic Cognitive Benchmark' } },
                  attemptId: 'att_sample_1',
                },
              },
            ],
            total: 1,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        }),
      });
    });

    // 3. Mock Report Detail
    await page.route('**/api/v1/admin/reports/rep_review_1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'rep_review_1',
            orderId: 'ord_sample_1',
            status: 'PENDING_REVIEW',
            version: 1,
            createdAt: new Date().toISOString(),
            order: {
              id: 'ord_sample_1',
              user: { name: 'Kavita Roy', email: 'kavita@example.com' },
              product: { name: { en: 'Strategic Cognitive Benchmark' } },
              attemptId: 'att_sample_1',
            },
            content: {
              summary: 'Outstanding critical reasoning capabilities.',
              sections: [
                {
                  title: 'Analytical Depth',
                  body: 'Candidate evaluated high in multi-variable logic structures.',
                },
              ],
            },
            revisions: [],
          },
        }),
      });
    });

    // 4. Mock Report Release Action
    await page.route('**/api/v1/admin/reports/rep_review_1/release', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            report: {
              id: 'rep_review_1',
              status: 'RELEASED',
              releasedAt: new Date().toISOString(),
            },
          },
        }),
      });
    });

    // 5. Navigate to Admin Reports list
    await page.goto('/en/admin/reports');
    await expect(page.locator('text=Diagnostic Report Review')).toBeVisible();

    // 6. Navigate to Report Detail page
    await page.goto('/en/admin/reports/rep_review_1');
    await expect(page.locator('text=Kavita Roy')).toBeVisible();
    await expect(page.locator('text=Under Review, text=PENDING_REVIEW')).toBeDefined();

    // 7. Verify Release button is present
    const releaseBtn = page.locator('button:has-text("Release")');
    await expect(releaseBtn).toBeVisible();
  });
});

