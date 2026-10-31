'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  FileQuestion,
  Package,
  FileCode,
  FileCheck,
  ShieldAlert,
  Server,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/AuthContext';
import { cn } from '@/lib/utils/cn';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const t = useTranslations('admin.sidebar');
  const locale = useLocale();
  const pathname = usePathname();
  const { user } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    {
      href: `/${locale}/admin`,
      label: t('dashboard') || 'Dashboard',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: `/${locale}/admin/orders`,
      label: t('orders') || 'Orders',
      icon: ShoppingCart,
    },
    {
      href: `/${locale}/admin/customers`,
      label: t('customers') || 'Customers',
      icon: Users,
    },
    {
      href: `/${locale}/admin/attempts`,
      label: 'Attempts',
      icon: FileQuestion,
    },
    {
      href: `/${locale}/admin/assessments`,
      label: t('assessments') || 'Assessments',
      icon: FileQuestion,
    },
    {
      href: `/${locale}/admin/products`,
      label: t('products') || 'Products',
      icon: Package,
    },
    {
      href: `/${locale}/admin/templates`,
      label: t('templates') || 'Templates',
      icon: FileCode,
    },
    {
      href: `/${locale}/admin/reports`,
      label: t('reports') || 'Reports',
      icon: FileCheck,
    },
    {
      href: `/${locale}/admin/audit-logs`,
      label: t('auditLogs') || 'Audit Logs',
      icon: ShieldAlert,
    },
    {
      href: `/${locale}/admin/system`,
      label: t('system') || 'System Status',
      icon: Server,
    },
  ];

  const isActive = (item: typeof navItems[0]) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  return (
    <div className="flex min-h-screen bg-background text-body font-sans">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile (Dark Navy Theme) */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#152B52] bg-[#0B1F44] text-white transition-all duration-300 shadow-xl',
          isCollapsed ? 'w-16' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand / Logo */}
        <div className="flex h-16 items-center justify-between border-b border-[#1A335E] px-4">
          {!isCollapsed && (
            <Link
              href={`/${locale}/admin`}
              className="flex items-center gap-2.5 font-bold tracking-tight text-white"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white shadow-xs">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-extrabold tracking-tight text-white leading-tight">
                  SelfGrow Admin
                </span>
                <span className="text-[10px] text-white/60 font-medium">
                  Management Console
                </span>
              </div>
            </Link>
          )}

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors lg:flex"
              title={isCollapsed ? t('expand') : t('collapse')}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 text-white" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-white" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors lg:hidden"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto p-3">
          {navItems.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all group',
                  active
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'text-white/75 hover:bg-white/10 hover:text-white',
                  isCollapsed && 'justify-center px-2'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    active ? 'text-white' : 'text-white/75 group-hover:text-white'
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Profile / Quick Links */}
        <div className="border-t border-[#1A335E] p-3 space-y-2">
          <Link
            href={`/${locale}`}
            target="_blank"
            className={cn(
              'flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors',
              isCollapsed && 'justify-center px-0'
            )}
          >
            <ExternalLink className="h-4 w-4 text-white/70" />
            {!isCollapsed && <span>View Public Site</span>}
          </Link>

          {!isCollapsed && user && (
            <div className="flex items-center gap-2.5 rounded-lg bg-[#122A56] p-2.5 border border-[#1E3B6E]">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-xs shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-white">
                  {user.name}
                </p>
                <p className="truncate text-[10px] text-white/60">
                  {user.email}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area (Clean White Theme) */}
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300 min-h-screen bg-background',
          isCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        )}
      >
        {/* Topbar (Clean White Header) */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface/95 px-4 sm:px-6 backdrop-blur-md shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-heading hover:bg-surface-secondary lg:hidden transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted">
                Admin Console
              </span>
              <span className="text-muted text-xs">/</span>
              <span className="text-xs font-bold text-heading">Overview</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1 text-xs font-bold text-success border border-success/20 shadow-xs">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Active System
            </span>
          </div>
        </header>

        {/* Page Body (Light Background & White Cards) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
