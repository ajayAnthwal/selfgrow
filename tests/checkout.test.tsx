import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import messages from '../src/messages/en.json';
import { CheckoutContainer } from '../src/app/[locale]/checkout/[attemptId]/CheckoutContainer';
import { DetailedAttempt } from '../src/features/assessment';
import * as razorpayLib from '../src/features/checkout/lib/razorpay';
import { api } from '../src/lib/api/client';
import { ToastProvider } from '../src/components/ui/Toast';

// Mock routing
const mockPush = vi.fn();
const mockReplace = vi.fn();
vi.mock('@/i18n/routing', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  Link: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock AuthContext
vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'usr_1', name: 'Aarav Sharma', email: 'aarav@example.com' },
    isAuthenticated: true,
  }),
}));

function renderCheckout(attempt: DetailedAttempt) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <CheckoutContainer attempt={attempt} />
        </ToastProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  );
}

describe('Checkout Flow', () => {
  const submittedAttempt: DetailedAttempt = {
    id: 'att_sub_1',
    productId: 'prod_1',
    assessmentId: 'asm_1',
    status: 'SUBMITTED',
    language: 'EN',
    startedAt: new Date().toISOString(),
    expiresAt: null,
    remainingTimeSeconds: null,
    submittedAt: new Date().toISOString(),
    questions: [],
    savedResponses: [],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
    mockPush.mockReset();
    mockReplace.mockReset();
  });

  it('free flow skips gateway and redirects to report status', async () => {
    const postSpy = vi.spyOn(api, 'post').mockResolvedValueOnce({
      orderId: 'ord_free_123',
      amountInPaise: 0,
      status: 'PAID',
      isFree: true,
    });

    const openRzpSpy = vi.spyOn(razorpayLib, 'openRazorpayCheckout');

    renderCheckout(submittedAttempt);

    const button = screen.getByRole('button', { name: /Proceed|Pay|Free|Generate/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledWith('/orders', { attemptId: 'att_sub_1' });
    });

    // Razorpay must NOT be called for free assessments
    expect(openRzpSpy).not.toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/reports/status/ord_free_123');
  });

  it('paid flow opens Razorpay gateway and calls verify on success', async () => {
    // 1. Create order API response
    const postSpy = vi.spyOn(api, 'post').mockImplementation(async (url: string) => {
      if (url === '/orders') {
        return {
          orderId: 'ord_paid_456',
          amountInPaise: 99900,
          currency: 'INR',
          keyId: 'rzp_test_key_123',
          razorpayOrderId: 'order_rzp_789',
        };
      }
      if (url.includes('/verify')) {
        return {
          success: true,
          message: 'Payment verified',
          orderId: 'ord_paid_456',
        };
      }
      return {};
    });

    // 2. Mock Razorpay checkout success
    const openRzpSpy = vi.spyOn(razorpayLib, 'openRazorpayCheckout').mockResolvedValueOnce({
      razorpay_payment_id: 'pay_test_001',
      razorpay_order_id: 'order_rzp_789',
      razorpay_signature: 'sig_valid_123',
    });

    renderCheckout(submittedAttempt);

    const button = screen.getByRole('button', { name: /Proceed|Pay|Free|Generate/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledWith('/orders', { attemptId: 'att_sub_1' });
    });

    await waitFor(() => {
      expect(openRzpSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          key: 'rzp_test_key_123',
          amount: 99900,
          order_id: 'order_rzp_789',
        })
      );
    });

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledWith('/orders/ord_paid_456/verify', {
        razorpay_payment_id: 'pay_test_001',
        razorpay_signature: 'sig_valid_123',
      });
    });

    expect(mockPush).toHaveBeenCalledWith('/reports/status/ord_paid_456');
  });

  it('dismissing gateway stays on page and retry reuses unpaid order', async () => {
    const postSpy = vi.spyOn(api, 'post').mockResolvedValueOnce({
      orderId: 'ord_paid_777',
      amountInPaise: 49900,
      currency: 'INR',
      keyId: 'rzp_test_key_123',
      razorpayOrderId: 'order_rzp_999',
    });

    // First open rejects with DISMISSED
    const openRzpSpy = vi
      .spyOn(razorpayLib, 'openRazorpayCheckout')
      .mockRejectedValueOnce({ reason: 'DISMISSED' })
      .mockResolvedValueOnce({
        razorpay_payment_id: 'pay_retry_ok',
        razorpay_order_id: 'order_rzp_999',
        razorpay_signature: 'sig_retry_ok',
      });

    renderCheckout(submittedAttempt);

    const button = screen.getByRole('button', { name: /Proceed|Pay|Free|Generate/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledTimes(1);
      expect(openRzpSpy).toHaveBeenCalledTimes(1);
    });

    // Post to /orders was called once. Dismiss happened.
    // Now user clicks Retry or Pay button again
    fireEvent.click(button);

    await waitFor(() => {
      expect(openRzpSpy).toHaveBeenCalledTimes(2);
    });

    // The order creation API should NOT be called a second time (cached / reused!)
    const createOrderCalls = postSpy.mock.calls.filter(([url]) => url === '/orders');
    expect(createOrderCalls).toHaveLength(1);

    // And verify was called
    expect(postSpy).toHaveBeenCalledWith('/orders/ord_paid_777/verify', {
      razorpay_payment_id: 'pay_retry_ok',
      razorpay_signature: 'sig_retry_ok',
    });
  });

  it('network failure during verify routes to polling without claiming payment failure', async () => {
    vi.spyOn(api, 'post').mockImplementation(async (url: string) => {
      if (url === '/orders') {
        return {
          orderId: 'ord_net_fail',
          amountInPaise: 99900,
          currency: 'INR',
          keyId: 'rzp_test',
          razorpayOrderId: 'order_rzp_net',
        };
      }
      if (url.includes('/verify')) {
        throw new Error('Network timeout');
      }
      return {};
    });

    vi.spyOn(razorpayLib, 'openRazorpayCheckout').mockResolvedValueOnce({
      razorpay_payment_id: 'pay_net_ok',
      razorpay_order_id: 'order_rzp_net',
      razorpay_signature: 'sig_net_ok',
    });

    renderCheckout(submittedAttempt);

    const button = screen.getByRole('button', { name: /Proceed|Pay|Free|Generate/i });
    fireEvent.click(button);

    // Navigates to report status polling rather than throwing failure
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/reports/status/ord_net_fail');
    });
  });
});
