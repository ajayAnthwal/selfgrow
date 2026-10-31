import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../src/messages/en.json';
import { ConfirmDialog } from '../src/features/admin/components/ConfirmDialog';

function renderConfirmDialog(props: any) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ConfirmDialog {...props} />
    </NextIntlClientProvider>
  );
}

describe('Report Review Actions & ConfirmDialog', () => {
  it('calls onConfirm when confirming standard action', async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    renderConfirmDialog({
      isOpen: true,
      onClose,
      onConfirm,
      title: 'Release Diagnostic Report?',
      description: 'Releasing will dispatch the official report PDF.',
      confirmLabel: 'Release & Dispatch',
    });

    expect(screen.getByText('Release Diagnostic Report?')).toBeDefined();
    const confirmBtn = screen.getByRole('button', { name: 'Release & Dispatch' });
    fireEvent.click(confirmBtn);

    expect(onConfirm).toHaveBeenCalled();
  });

  it('prevents submission and displays validation error when reason is required but empty', async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    renderConfirmDialog({
      isOpen: true,
      onClose,
      onConfirm,
      title: 'Reject Report Generation?',
      confirmLabel: 'Reject Report',
      requireReason: true,
      reasonPlaceholder: 'Enter rejection reason',
    });

    const confirmBtn = screen.getByRole('button', { name: 'Reject Report' });
    fireEvent.click(confirmBtn);

    expect(onConfirm).not.toHaveBeenCalled();
    expect(
      screen.getByText('Please enter a specific reason to proceed.')
    ).toBeDefined();
  });

  it('successfully passes reason to onConfirm callback when reason is provided', async () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();

    renderConfirmDialog({
      isOpen: true,
      onClose,
      onConfirm,
      title: 'Regenerate Report with AI?',
      confirmLabel: 'Regenerate',
      requireReason: true,
      reasonPlaceholder: 'Enter reason for AI retry',
    });

    const input = screen.getByPlaceholderText('Enter reason for AI retry');
    fireEvent.change(input, {
      target: { value: 'Incomplete output due to upstream model timeout' },
    });

    const confirmBtn = screen.getByRole('button', { name: 'Regenerate' });
    fireEvent.click(confirmBtn);

    expect(onConfirm).toHaveBeenCalledWith(
      'Incomplete output due to upstream model timeout'
    );
  });
});

