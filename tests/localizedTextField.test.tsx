import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../src/messages/en.json';
import { LocalizedTextField } from '../src/features/admin/components/LocalizedTextField';

function renderLocalizedField(props: any) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <LocalizedTextField {...props} />
    </NextIntlClientProvider>
  );
}

describe('LocalizedTextField', () => {
  it('renders label and both English and Hindi inputs', () => {
    const onChange = vi.fn();
    renderLocalizedField({
      label: 'Benchmark Name',
      value: { en: 'Cognitive Test', hi: 'संज्ञानात्मक परीक्षण' },
      onChange,
    });

    expect(screen.getByText('Benchmark Name')).toBeDefined();
    expect(screen.getByDisplayValue('Cognitive Test')).toBeDefined();
    expect(screen.getByDisplayValue('संज्ञानात्मक परीक्षण')).toBeDefined();
  });

  it('displays "Missing Hindi" warning indicator when English has text but Hindi is empty', () => {
    const onChange = vi.fn();
    renderLocalizedField({
      label: 'Question Prompt',
      value: { en: 'Analyze the logic of this argument.', hi: '' },
      onChange,
    });

    const indicator = screen.getByTestId('missing-hindi-indicator');
    expect(indicator).toBeDefined();
    expect(indicator.textContent).toContain('Missing Hindi Translation');
  });

  it('does NOT display "Missing Hindi" indicator when both English and Hindi are populated', () => {
    const onChange = vi.fn();
    renderLocalizedField({
      label: 'Question Prompt',
      value: { en: 'Analyze the logic.', hi: 'तर्क का विश्लेषण करें।' },
      onChange,
    });

    expect(screen.queryByTestId('missing-hindi-indicator')).toBeNull();
  });

  it('calls onChange with updated English text', () => {
    const onChange = vi.fn();
    renderLocalizedField({
      label: 'Title',
      value: { en: 'Old Title', hi: 'पुराना शीर्षक' },
      onChange,
    });

    const enInput = screen.getByDisplayValue('Old Title');
    fireEvent.change(enInput, { target: { value: 'New Title' } });

    expect(onChange).toHaveBeenCalledWith({
      en: 'New Title',
      hi: 'पुराना शीर्षक',
    });
  });

  it('calls onChange with updated Hindi text', () => {
    const onChange = vi.fn();
    renderLocalizedField({
      label: 'Title',
      value: { en: 'Title', hi: '' },
      onChange,
    });

    const hiInput = screen.getByPlaceholderText('हिन्दी पाठ दर्ज करें');
    fireEvent.change(hiInput, { target: { value: 'नया शीर्षक' } });

    expect(onChange).toHaveBeenCalledWith({
      en: 'Title',
      hi: 'नया शीर्षक',
    });
  });
});

