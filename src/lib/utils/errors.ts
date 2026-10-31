export const DEFAULT_ERROR_CODE = 'GENERIC';

export function getErrorMessageKey(code?: string): string {
  if (!code) return DEFAULT_ERROR_CODE;

  const knownCodes = [
    'UNAUTHORIZED',
    'TOKEN_EXPIRED',
    'INVALID_CREDENTIALS',
    'EMAIL_ALREADY_EXISTS',
    'FORBIDDEN',
    'NOT_FOUND',
    'REPORT_NOT_FOUND',
    'REPORT_NOT_RELEASED',
    'NETWORK_ERROR',
  ];

  return knownCodes.includes(code) ? code : DEFAULT_ERROR_CODE;
}

export const mapErrorCode = getErrorMessageKey;
