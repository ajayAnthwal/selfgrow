import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '../src/features/auth/auth.schema';

describe('auth.schema', () => {
  describe('loginSchema', () => {
    it('validates correct email and password', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'ValidPassword123!',
      });
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'not-an-email',
        password: 'ValidPassword123!',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('email');
      }
    });

    it('rejects empty password', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('validates a complete valid registration', () => {
      const result = registerSchema.safeParse({
        name: 'Aarav Sharma',
        email: 'aarav@example.com',
        password: 'Password123!',
        preferredLanguage: 'EN',
        acceptedTerms: true,
      });
      expect(result.success).toBe(true);
    });

    it('rejects password shorter than 8 characters', () => {
      const result = registerSchema.safeParse({
        name: 'Aarav Sharma',
        email: 'aarav@example.com',
        password: 'short',
        preferredLanguage: 'EN',
        acceptedTerms: true,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('password'))).toBe(true);
      }
    });

    it('rejects registration when acceptedTerms is false', () => {
      const result = registerSchema.safeParse({
        name: 'Aarav Sharma',
        email: 'aarav@example.com',
        password: 'Password123!',
        preferredLanguage: 'HI',
        acceptedTerms: false,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes('acceptedTerms'))).toBe(true);
      }
    });

    it('defaults preferredLanguage to EN if omitted', () => {
      const result = registerSchema.safeParse({
        name: 'Aarav Sharma',
        email: 'aarav@example.com',
        password: 'Password123!',
        acceptedTerms: true,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.preferredLanguage).toBe('EN');
      }
    });
  });
});

