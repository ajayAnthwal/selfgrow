export interface FormatMoneyOptions {
  locale?: string;
  currency?: string;
  freeLabel?: string;
}

/**
 * Formats an integer amount in paise into standard currency format (e.g. ₹499 or Free).
 * Always safe against float rounding errors.
 */
export function formatMoney(
  amountInPaise: number | null | undefined,
  optionsInput: FormatMoneyOptions | string = {}
): string {
  const options: FormatMoneyOptions =
    typeof optionsInput === 'string' ? { locale: optionsInput } : optionsInput;

  if (amountInPaise === null || amountInPaise === undefined || amountInPaise === 0) {
    return options.freeLabel || (options.locale === 'hi' ? 'मुफ्त' : 'Free');
  }

  const rupees = amountInPaise / 100;
  const isInteger = amountInPaise % 100 === 0;

  const intlLocale = options.locale === 'hi' ? 'hi-IN' : 'en-IN';
  const currency = options.currency || 'INR';

  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency,
    minimumFractionDigits: isInteger ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(rupees);
}
