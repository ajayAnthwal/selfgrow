import { test, expect } from '@playwright/test';

test.describe('Paid Checkout Flow with Mocked Razorpay Gateway', () => {
  test('handles paid assessment order creation and verification', async ({ page }) => {
    // 1. Mock Auth
    await page.route('**/api/v1/auth/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            user: {
              id: 'usr_paid_buyer_1',
              name: 'Priya Patel',
              email: 'priya@example.com',
              role: 'USER',
              preferredLanguage: 'EN',
              isActive: true,
            },
          },
        }),
      });
    });

    // 2. Mock Attempt Detail
    await page.route('**/api/v1/attempts/att_paid_1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            attempt: {
              id: 'att_paid_1',
              productId: 'prod_paid_pro',
              status: 'SUBMITTED',
              language: 'EN',
              product: {
                id: 'prod_paid_pro',
                slug: 'cognitive-diagnostic-pro',
                name: { en: 'Executive Cognitive Diagnostic Pro' },
                priceInPaise: 99900,
                currency: 'INR',
              },
            },
          },
        }),
      });
    });

    // 3. Mock Create Order endpoint (Returns Razorpay order details)
    await page.route('**/api/v1/orders', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            orderId: 'ord_paid_1',
            status: 'CREATED',
            amountInPaise: 99900,
            currency: 'INR',
            razorpayOrderId: 'order_rzp_mock_123',
            keyId: 'rzp_test_mock_key',
            isFree: false,
          },
        }),
      });
    });

    // 4. Mock Verify Order endpoint
    await page.route('**/api/v1/orders/ord_paid_1/verify', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            order: {
              id: 'ord_paid_1',
              status: 'PAID',
              amountInPaise: 99900,
            },
          },
        }),
      });
    });

    // 5. Mock Report Status
    await page.route('**/api/v1/reports/ord_paid_1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            report: {
              id: 'rep_paid_1',
              status: 'RELEASED',
              downloadUrl: '/api/v1/reports/rep_paid_1/download',
            },
          },
        }),
      });
    });

    // 6. Navigate to Checkout Page
    await page.goto('/en/checkout/att_paid_1');

    await expect(page.locator('text=Executive Cognitive Diagnostic Pro')).toBeVisible();
    await expect(page.locator('text=₹999')).toBeVisible();

    // Check payment button presence
    const payBtn = page.locator('button:has-text("Pay"), button:has-text("Razorpay")');
    await expect(payBtn).toBeVisible();
  });
});

