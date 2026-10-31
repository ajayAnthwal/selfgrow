'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Sparkles, ShieldCheck, Lock, Globe2 } from 'lucide-react';

export function Footer() {
  const tNav = useTranslations('nav');
  const tStatic = useTranslations('static');
  const tCommon = useTranslations('common');
  const pathname = usePathname();

  if (pathname.startsWith('/admin') || pathname.startsWith('/assessment/attempt')) {
    return null;
  }

  return (
    <footer className="bg-surface text-body text-sm border-t border-border">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-3.5 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-heading">
                Self<span className="text-primary">Grow</span>
              </span>
            </div>
            <p className="text-xs text-body leading-relaxed">
              Personalized cognitive and behavioral evaluations with actionable AI diagnostic guidance.
            </p>
            <div className="inline-flex items-center text-xs font-medium text-heading bg-surface-secondary px-3 py-1.5 rounded-sm border border-border">
              <Lock className="w-3.5 h-3.5 mr-1.5 text-primary" />
              <span>DPDP 2023 &amp; SSL Secured</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-heading mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  Assessments Catalog
                </Link>
              </li>
              <li>
                <Link href="/sample-report" className="hover:text-primary transition-colors">
                  Interactive Sample Report
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-primary transition-colors">
                  {tNav('dashboard') || 'My Dashboard'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Science & Solutions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-heading mb-4">
              Solutions &amp; Science
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  About SelfGrow
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-primary transition-colors">
                  Scientific Methodology
                </Link>
              </li>
              <li>
                <Link href="/enterprise" className="hover:text-primary transition-colors">
                  Enterprise Teams
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-heading mb-4">
              Support &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  FAQ &amp; Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  {tStatic('contactTitle')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  {tStatic('privacyTitle')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  {tStatic('termsTitle')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} SelfGrow. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <span>English &amp; हिन्दी Localization</span>
            <span>Razorpay Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
