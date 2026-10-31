'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ArrowRight, ShieldCheck, FileCheck } from 'lucide-react';

export default function AttemptDonePage() {
  const t = useTranslations('assessment');
  const params = useParams();
  const attemptId = String(params?.attemptId || '');

  return (
    <div className="py-16 bg-slate-50 min-h-[75vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <Card className="p-8 sm:p-10 border-slate-200 text-center shadow-sm">
          {/* Success Icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xs border border-emerald-200">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            {t('submittedTitle')}
          </h1>

          <p className="text-sm font-medium text-emerald-700 mb-4">
            {t('submittedSubtitle')}
          </p>

          <p className="text-xs text-slate-600 leading-relaxed mb-8">
            {t('submittedMessage')}
          </p>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-8 flex items-center space-x-3 text-left">
            <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Attempt ID
              </div>
              <div className="font-mono text-xs font-semibold text-slate-800 truncate max-w-[200px]">
                {attemptId}
              </div>
            </div>
          </div>

          {/* Continue button linking to checkout placeholder */}
          <Link href={`/checkout/${attemptId}`} className="block w-full">
            <Button variant="primary" size="lg" className="w-full justify-center group shadow-sm">
              <span>{t('continueToCheckout')}</span>
              <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          <div className="mt-6 flex items-center justify-center space-x-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Responses tamper-locked &amp; server verified</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

