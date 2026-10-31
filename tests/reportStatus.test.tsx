import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import messages from '../src/messages/en.json';
import { ReportStatusContainer } from '../src/app/[locale]/reports/status/[orderId]/ReportStatusContainer';
import { api } from '../src/lib/api/client';
import { ToastProvider } from '../src/components/ui/Toast';

vi.mock('@/i18n/routing', () => ({
  Link: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

function renderReportStatus(orderId: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <ReportStatusContainer orderId={orderId} />
        </ToastProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  );
}

describe('Report Status & Download', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders terminal RELEASED state with download button and requests fresh signed URL', async () => {
    // Mock order
    vi.spyOn(api, 'get').mockImplementation(async (url: string) => {
      if (url.includes('/orders/ord_123')) {
        return {
          order: {
            id: 'ord_123',
            status: 'PAID',
            amountInPaise: 99900,
            currency: 'INR',
            createdAt: new Date().toISOString(),
          },
        };
      }
      if (url === '/reports' || url.startsWith('/reports?')) {
        return {
          items: [
            {
              id: 'rep_123',
              orderId: 'ord_123',
              status: 'RELEASED',
              language: 'EN',
              createdAt: new Date().toISOString(),
              content: { executiveSummary: 'Candidate demonstrated exemplary diagnostic problem solving.' },
            },
          ],
          meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
        };
      }
      if (url.includes('/reports/rep_123/download')) {
        return {
          downloadUrl: 'https://storage.test.com/signed-report-123.pdf?token=xyz',
          expiresInSeconds: 300,
        };
      }
      if (url.includes('/reports/rep_123')) {
        return {
          report: {
            id: 'rep_123',
            orderId: 'ord_123',
            status: 'RELEASED',
            language: 'EN',
            createdAt: new Date().toISOString(),
            content: { executiveSummary: 'Candidate demonstrated exemplary diagnostic problem solving.' },
          },
        };
      }
      return {};
    });

    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    renderReportStatus('ord_123');

    // Wait for RELEASED UI
    await waitFor(() => {
      expect(screen.getByText(/Your personalized AI diagnostic evaluation is ready!/i)).toBeDefined();
    });

    // Check Download button is present
    const downloadBtn = screen.getByRole('button', { name: /Download PDF Report/i });
    expect(downloadBtn).toBeDefined();

    // Click download
    fireEvent.click(downloadBtn);

    await waitFor(() => {
      expect(windowOpenSpy).toHaveBeenCalledWith(
        'https://storage.test.com/signed-report-123.pdf?token=xyz',
        '_blank',
        'noopener,noreferrer'
      );
    });
  });
});

