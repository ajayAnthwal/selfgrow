'use client';

import React from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

interface RequireRoleProps {
  role?: 'ADMIN' | 'USER';
  children: React.ReactNode;
}

export function RequireRole({ role = 'ADMIN', children }: RequireRoleProps) {
  const { user, isLoading } = useAuth();
  const t = useTranslations('admin.forbidden');

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || (role && user.role !== role)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {t('title')}
        </h1>
        <p className="mt-2 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
          {t('description')}
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/">
            <Button variant="outline">{t('returnHome')}</Button>
          </Link>
          <Link href="/login">
            <Button variant="primary">{t('signInAsAdmin')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

