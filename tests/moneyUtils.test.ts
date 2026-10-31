import { describe, it, expect } from 'vitest';
import { rupeesToPaise, paiseToRupees } from '../src/lib/utils/money';

describe('money utils (rupees <-> paise)', () => {
  describe('rupeesToPaise', () => {
    it('converts integer rupees to paise accurately', () => {
      expect(rupeesToPaise(499)).toBe(49900);
      expect(rupeesToPaise(999)).toBe(99900);
      expect(rupeesToPaise(0)).toBe(0);
    });

    it('converts decimal rupees avoiding float inaccuracies', () => {
      expect(rupeesToPaise(499.5)).toBe(49950);
      expect(rupeesToPaise(19.99)).toBe(1999);
      expect(rupeesToPaise(0.01)).toBe(1);
    });

    it('handles string input safely', () => {
      expect(rupeesToPaise('499')).toBe(49900);
      expect(rupeesToPaise('99.90')).toBe(9990);
    });

    it('handles negative or invalid input by returning 0', () => {
      expect(rupeesToPaise(-50)).toBe(0);
      expect(rupeesToPaise('invalid')).toBe(0);
    });
  });

  describe('paiseToRupees', () => {
    it('converts integer paise back to rupees', () => {
      expect(paiseToRupees(49900)).toBe(499);
      expect(paiseToRupees(99900)).toBe(999);
      expect(paiseToRupees(0)).toBe(0);
    });

    it('converts fractional paise to rounded rupee decimal', () => {
      expect(paiseToRupees(49950)).toBe(499.5);
      expect(paiseToRupees(1999)).toBe(19.99);
    });

    it('handles null, undefined, and NaN safely', () => {
      expect(paiseToRupees(null)).toBe(0);
      expect(paiseToRupees(undefined)).toBe(0);
      expect(paiseToRupees(NaN)).toBe(0);
    });
  });
});

