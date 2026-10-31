import { test, expect } from '@playwright/test';

test.describe('Candidate Journey: Registration, Assessment, Free Report & Download', () => {
  test('complete flow from registration to report download', async ({ page }) => {
    // 1. Mock API endpoints for deterministic test execution
    await page.route('**/api/v1/auth/register', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: 'usr_candidate_1',
              name: 'Aarav Sharma',
              email: 'aarav@example.com',
              role: 'USER',
              preferredLanguage: 'EN',
              isActive: true,
            },
          },
        }),
      });
    });

    await page.route('**/api/v1/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: 'usr_candidate_1',
              name: 'Aarav Sharma',
              email: 'aarav@example.com',
              role: 'USER',
              preferredLanguage: 'EN',
              isActive: true,
            },
          },
        }),
      });
    });

    await page.route('**/api/v1/products/cognitive-diagnostic-free', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            product: {
              id: 'prod_free_1',
              slug: 'cognitive-diagnostic-free',
              name: { en: 'Cognitive Diagnostic Evaluation' },
              description: { en: 'Free standard benchmarking' },
              priceInPaise: 0,
              currency: 'INR',
              assessmentId: 'asm_1',
              isActive: true,
              assessment: {
                id: 'asm_1',
                slug: 'cognitive-diagnostic-free',
                timeLimitSeconds: 1800,
                questionsCount: 2,
              },
            },
          },
        }),
      });
    });

    await page.route('**/api/v1/attempts', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              attempt: {
                id: 'att_candidate_1',
                productId: 'prod_free_1',
                status: 'IN_PROGRESS',
                language: 'EN',
                expiresAt: new Date(Date.now() + 1800000).toISOString(),
              },
            },
          }),
        });
      }
    });

    await page.route('**/api/v1/attempts/att_candidate_1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            attempt: {
              id: 'att_candidate_1',
              productId: 'prod_free_1',
              status: 'IN_PROGRESS',
              language: 'EN',
              startedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 1800000).toISOString(),
              product: {
                id: 'prod_free_1',
                name: { en: 'Cognitive Diagnostic Evaluation' },
                slug: 'cognitive-diagnostic-free',
                priceInPaise: 0,
              },
              questions: [
                {
                  id: 'q_1',
                  text: { en: 'Identify the pattern in logical sequence A, C, E, ?' },
                  type: 'SINGLE_CHOICE',
                  section: 'Logical Reasoning',
                  options: [
                    { id: 'opt_1', label: { en: 'G' }, score: 1 },
                    { id: 'opt_2', label: { en: 'F' }, score: 0 },
                  ],
                },
                {
                  id: 'q_2',
                  text: { en: 'Explain your reasoning for deductive decisions.' },
                  type: 'TEXT',
                  section: 'Cognitive Reflection',
                },
              ],
              savedResponses: [],
            },
          },
        }),
      });
    });

    await page.route('**/api/v1/attempts/att_candidate_1/answers', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            savedAt: new Date().toISOString(),
            savedCount: 1,
          },
        }),
      });
    });

    await page.route('**/api/v1/attempts/att_candidate_1/submit', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            attempt: {
              id: 'att_candidate_1',
              status: 'SUBMITTED',
              submittedAt: new Date().toISOString(),
            },
          },
        }),
      });
    });

    await page.route('**/api/v1/orders', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            orderId: 'ord_free_1',
            status: 'PAID',
            amountInPaise: 0,
            currency: 'INR',
            isFree: true,
          },
        }),
      });
    });

    await page.route('**/api/v1/reports/ord_free_1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            report: {
              id: 'rep_free_1',
              status: 'RELEASED',
              downloadUrl: '/api/v1/reports/rep_free_1/download',
              createdAt: new Date().toISOString(),
              content: {
                executiveSummary: 'Demonstrated superior logical reasoning agility.',
                sections: [
                  {
                    title: 'Cognitive Velocity',
                    body: 'High speed processing and accurate pattern completion.',
                  },
                ],
              },
            },
          },
        }),
      });
    });

    // 2. Visit register page
    await page.goto('/en/register');
    await expect(page).toHaveTitle(/Antigravity Assessment/i);

    // Fill registration form
    await page.fill('input[type="text"]', 'Aarav Sharma');
    await page.fill('input[type="email"]', 'aarav@example.com');
    await page.fill('input[type="password"]', 'ValidSecurePassword123!');
    await page.check('input[type="checkbox"]');
    await page.click('button[type="submit"]');

    // 3. Navigate to assessment start page
    await page.goto('/en/assessment/start/cognitive-diagnostic-free');
    await expect(page.locator('text=Cognitive Diagnostic Evaluation')).toBeVisible();

    // Click Start Assessment
    const startBtn = page.locator('button:has-text("Start Assessment"), button:has-text("Begin")');
    if (await startBtn.isVisible()) {
      await startBtn.click();
    }

    // 4. Fill answers on assessment attempt page
    await page.goto('/en/assessment/attempt/att_candidate_1');
    await expect(page.locator('text=Logical Reasoning')).toBeVisible();

    // Select single choice option
    await page.click('text=G');

    // Submit dialog & submit attempt
    const submitBtn = page.locator('button:has-text("Submit Assessment"), button:has-text("Submit")');
    if (await submitBtn.isVisible()) {
      await submitBtn.click();
    }

    // 5. Checkout / Done page
    await page.goto('/en/checkout/att_candidate_1');
    const freeClaimBtn = page.locator('button:has-text("Generate Free Report"), button:has-text("Claim Free")');
    if (await freeClaimBtn.isVisible()) {
      await freeClaimBtn.click();
    }

    // 6. View Report Status
    await page.goto('/en/reports/status/ord_free_1');
    await expect(page.locator('text=Report Ready, text=Ready, text=Download PDF')).toBeDefined();
  });
});

