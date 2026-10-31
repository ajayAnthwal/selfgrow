'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { useAuth } from '@/features/auth/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Menu, X, Sparkles, User, LogOut, LayoutDashboard, Compass } from 'lucide-react';

export function Header() {
  const t = useTranslations('nav');
  const tAuth = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await logout();
      // Ensure cookie purge on client
      document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      // Hard navigation ensures full state and session teardown
      window.location.href = `/${locale}`;
    } catch {
      window.location.href = `/${locale}`;
    }
  };

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/products', label: 'Assessments' },
    { href: '/methodology', label: 'Methodology' },
    { href: '/enterprise', label: 'Enterprise' },
    { href: '/about', label: 'About' },
  ];

  if (pathname.startsWith('/admin') || pathname.startsWith('/assessment/attempt')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full h-[72px] border-b border-border bg-surface/95 backdrop-blur-md transition-all">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 h-full flex items-center justify-between">
        {/* Logo Left */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center text-white shadow-xs group-hover:bg-primary-hover transition-colors">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-[22px] tracking-tight text-heading">
              Self<span className="text-primary">Grow</span>
            </span>
          </Link>
        </div>

        {/* Links Center */}
        <nav className="hidden md:flex items-center space-x-8 text-[15px] font-medium text-body">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-150 hover:text-primary ${
                  isActive ? 'text-primary font-semibold' : 'text-body'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Language Switcher + Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <LanguageSwitcher />

          {isLoading ? (
            <div className="w-24 h-10 bg-surface-secondary rounded-sm animate-pulse" />
          ) : isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <Link
                href="/account"
                className="inline-flex items-center text-[14px] font-semibold text-heading hover:text-primary transition-colors px-3 py-1.5 rounded-sm hover:bg-surface-secondary"
              >
                <LayoutDashboard className="w-4 h-4 mr-2 text-primary" />
                {t('dashboard') || 'My Dashboard'}
              </Link>

              {isAdmin && (
                <Link href="/admin">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-sm text-xs font-semibold bg-dark-navy text-white hover:bg-navy transition-colors">
                    Admin
                  </span>
                </Link>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                isLoading={isLoggingOut}
                className="text-body hover:text-danger hover:bg-danger-light"
                aria-label={t('logout')}
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                {t('logout')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2.5">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-semibold text-heading hover:text-primary">
                  {t('login')}
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm" className="font-semibold shadow-xs">
                  {t('register')}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center space-x-2 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-sm text-body hover:text-heading hover:bg-surface-secondary focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 pt-3 pb-6 space-y-4 shadow-card">
          <nav className="flex flex-col space-y-2 text-[15px] font-medium text-heading">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-sm hover:bg-surface-secondary hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-border">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-3 py-1 text-xs text-muted font-medium">
                  {user?.name} ({user?.email})
                </div>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-3 py-2 text-sm font-semibold text-heading rounded-sm hover:bg-surface-secondary"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2.5 text-primary" />
                  {t('dashboard') || 'My Dashboard'}
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 text-sm font-semibold text-heading rounded-sm hover:bg-surface-secondary"
                  >
                    <LayoutDashboard className="w-4 h-4 mr-2.5 text-navy" />
                    Admin Panel
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm font-semibold text-danger rounded-sm hover:bg-danger-light text-left"
                >
                  <LogOut className="w-4 h-4 mr-2.5" />
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2.5 pt-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="md" isFullWidth className="justify-center font-semibold">
                    {t('login')}
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" isFullWidth className="justify-center font-semibold shadow-xs">
                    {t('register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
