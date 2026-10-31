import { describe, it, expect } from 'vitest';
import { formatMoney } from '../src/lib/utils/formatMoney';

describe('formatMoney', () => {
  it('returns "Free" in English when amount is 0', () => {
    expect(formatMoney(0, { locale: 'en' })).toBe('Free');
    expect(formatMoney(0, 'en')).toBe('Free');
  });

  it('returns "मुफ्त" in Hindi when amount is 0', () => {
    expect(formatMoney(0, { locale: 'hi' })).toBe('मुफ्त');
    expect(formatMoney(0, 'hi')).toBe('मुफ्त');
  });

  it('handles null or undefined as Free', () => {
    expect(formatMoney(null)).toBe('Free');
    expect(formatMoney(undefined)).toBe('Free');
  });

  it('formats whole rupee amounts without trailing decimals', () => {
    // 99900 paise = 999 rupees
    const enFormatted = formatMoney(99900, 'en');
    expect(enFormatted).toContain('999');
    expect(enFormatted).toContain('₹');
    expect(enFormatted).not.toContain('.00');
  });

  it('formats fractional rupee amounts with 2 decimals', () => {
    // 49950 paise = 499.50 rupees
    const formatted = formatMoney(49950, 'en');
    expect(formatted).toContain('499.50');
    expect(formatted).toContain('₹');
  });

  it('supports custom freeLabel', () => {
    expect(formatMoney(0, { freeLabel: 'Complimentary' })).toBe('Complimentary');
  });
});

