import { formatMoney } from './formatMoney';

/**
 * Converts rupees (which can be decimal or integer) into integer paise.
 * Rounds to nearest integer to avoid JS floating-point inaccuracies.
 */
export function rupeesToPaise(rupees: number | string): number {
  const num = typeof rupees === 'string' ? parseFloat(rupees) : rupees;
  if (isNaN(num) || num < 0) return 0;
  return Math.round(num * 100);
}

/**
 * Converts integer paise into rupees.
 */
export function paiseToRupees(paise: number | null | undefined): number {
  if (paise === null || paise === undefined || isNaN(paise)) return 0;
  return Number((paise / 100).toFixed(2));
}

export { formatMoney };

