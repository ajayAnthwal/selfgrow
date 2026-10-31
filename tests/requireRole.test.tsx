import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../src/messages/en.json';
import { RequireRole } from '../src/features/admin/components/RequireRole';
import * as AuthContextModule from '../src/features/auth/AuthContext';

vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: vi.fn(),
}));

function renderWithIntl(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
}

describe('RequireRole guard', () => {
  it('renders loading spinner while authentication status is loading', () => {
    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      isAdmin: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refetchUser: vi.fn(),
    });

    renderWithIntl(
      <RequireRole role="ADMIN">
        <div>Protected Admin Content</div>
      </RequireRole>
    );

    expect(screen.queryByText('Protected Admin Content')).toBeNull();
  });

  it('renders 403 Access Denied page when user is not authenticated or not ADMIN', () => {
    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: {
        id: 'usr_user1',
        name: 'Regular Candidate',
        email: 'user@example.com',
        role: 'USER',
        preferredLanguage: 'EN',
        isActive: true,
      },
      isLoading: false,
      isAuthenticated: true,
      isAdmin: false,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refetchUser: vi.fn(),
    });

    renderWithIntl(
      <RequireRole role="ADMIN">
        <div>Protected Admin Content</div>
      </RequireRole>
    );

    expect(screen.queryByText('Protected Admin Content')).toBeNull();
    expect(screen.getByText('403 - Administrative Access Denied')).toBeDefined();
    expect(
      screen.getByText(
        'You do not have administrative privileges to view or manage this section. Please sign in with an administrator account.'
      )
    ).toBeDefined();
  });

  it('renders children when authenticated user has ADMIN role', () => {
    vi.mocked(AuthContextModule.useAuth).mockReturnValue({
      user: {
        id: 'usr_admin1',
        name: 'Administrator',
        email: 'admin@example.com',
        role: 'ADMIN',
        preferredLanguage: 'EN',
        isActive: true,
      },
      isLoading: false,
      isAuthenticated: true,
      isAdmin: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      refetchUser: vi.fn(),
    });

    renderWithIntl(
      <RequireRole role="ADMIN">
        <div>Protected Admin Content</div>
      </RequireRole>
    );

    expect(screen.getByText('Protected Admin Content')).toBeDefined();
    expect(screen.queryByText('403 - Administrative Access Denied')).toBeNull();
  });
});

