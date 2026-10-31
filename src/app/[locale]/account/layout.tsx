'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { User, ShoppingBag, FileText, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('account');
  const pathname = usePathname();

  const navItems = [
    {
      href: '/account',
      label: t('tabProfile'),
      icon: User,
      isActive: pathname === '/account',
    },
    {
      href: '/account/orders',
      label: t('tabOrders'),
      icon: ShoppingBag,
      isActive: pathname.startsWith('/account/orders'),
    },
    {
      href: '/account/reports',
      label: t('tabReports'),
      icon: FileText,
      isActive: pathname.startsWith('/account/reports'),
    },
  ];

  return (
    <div className="py-10 bg-slate-50 min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('title')}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {t('subtitle')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mb-8 space-x-2 sm:space-x-4 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'inline-flex items-center space-x-2 py-3 px-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap',
                  item.isActive
                    ? 'border-brand-600 text-brand-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Child Pages */}
        <div>{children}</div>
      </div>
    </div>
  );
}

