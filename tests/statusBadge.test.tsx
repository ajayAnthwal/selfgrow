import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../src/messages/en.json';
import { StatusBadge, getStatusVariant } from '../src/components/ui/StatusBadge';

function renderWithIntl(component: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
}

describe('StatusBadge', () => {
  it('maps order statuses to appropriate badge variants', () => {
    expect(getStatusVariant('PAID')).toBe('success');
    expect(getStatusVariant('CREATED')).toBe('default');
    expect(getStatusVariant('FAILED')).toBe('danger');
    expect(getStatusVariant('REFUNDED')).toBe('warning');
  });

  it('maps report statuses to appropriate badge variants', () => {
    expect(getStatusVariant('RELEASED')).toBe('success');
    expect(getStatusVariant('GENERATING')).toBe('brand');
    expect(getStatusVariant('GENERATED')).toBe('brand');
    expect(getStatusVariant('PENDING_REVIEW')).toBe('warning');
    expect(getStatusVariant('QUEUED')).toBe('default');
    expect(getStatusVariant('REJECTED')).toBe('danger');
  });

  it('renders translated status labels', () => {
    const { unmount } = renderWithIntl(<StatusBadge status="PAID" />);
    expect(screen.getByText('Paid')).toBeDefined();
    unmount();

    renderWithIntl(<StatusBadge status="RELEASED" />);
    expect(screen.getByText('Ready')).toBeDefined();
  });
});

