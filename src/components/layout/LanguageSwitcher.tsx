'use client';

import React, { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { api } from '@/lib/api/client';

export function LanguageSwitcher() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { isAuthenticated, refetchUser } = useAuth();

  const handleLocaleChange = (newLocale: 'en' | 'hi') => {
    if (newLocale === locale) return;

    // Persist locale cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // If authenticated, sync preferredLanguage to user profile
    if (isAuthenticated) {
      api.patch('/users/me', { preferredLanguage: newLocale.toUpperCase() })
        .then(() => refetchUser())
        .catch(() => {});
    }

    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="flex items-center space-x-1 bg-surface-secondary rounded-sm p-1 text-xs font-semibold border border-border">
      <Globe className="w-3.5 h-3.5 ml-1 text-muted" aria-hidden="true" />
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleLocaleChange('en')}
        className={`px-2.5 py-1 rounded-xs transition-all duration-150 cursor-pointer ${
          locale === 'en'
            ? 'bg-surface text-primary font-bold shadow-xs'
            : 'text-body hover:text-heading'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleLocaleChange('hi')}
        className={`px-2.5 py-1 rounded-xs transition-all duration-150 cursor-pointer ${
          locale === 'hi'
            ? 'bg-surface text-primary font-bold shadow-xs'
            : 'text-body hover:text-heading'
        }`}
        aria-label="Switch to Hindi"
      >
        हिन्दी
      </button>
    </div>
  );
}
