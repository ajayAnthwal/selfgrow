'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Card } from '@/components/ui/Card';
import { formatMoney } from '@/lib/utils/formatMoney';
import { CheckCircle2, ShieldCheck, FileText, Globe } from 'lucide-react';

export interface OrderSummaryCardProps {
  productName: string;
  amountInPaise: number;
  currency?: string;
  language: string;
  attemptId: string;
}

export function OrderSummaryCard({
  productName,
  amountInPaise,
  currency = 'INR',
  language,
  attemptId,
}: OrderSummaryCardProps) {
  const t = useTranslations('checkout');
  const locale = useLocale();

  const formattedAmount = formatMoney(amountInPaise, {
    locale,
    currency,
  });

  const languageLabel = language.toUpperCase() === 'HI' ? 'हिन्दी (Hindi)' : 'English';

  return (
    <Card className="p-6 sm:p-8 border-slate-200 shadow-sm space-y-6">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          {t('orderSummary')}
        </h2>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {productName}
        </h3>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-100 text-sm">
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>{t('productLabel')}</span>
          </span>
          <span className="font-semibold text-slate-900">Comprehensive Report</span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-slate-400" />
            <span>{t('reportLanguage')}</span>
          </span>
          <span className="font-semibold text-slate-900">{languageLabel}</span>
        </div>

        <div className="flex items-center justify-between text-base pt-3 border-t border-slate-200">
          <span className="font-bold text-slate-900">{t('amountLabel')}</span>
          <span className="text-2xl font-extrabold text-brand-700">{formattedAmount}</span>
        </div>
      </div>

      {/* What happens next note */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          {t('whatNextTitle')}
        </h4>
        <ul className="space-y-2 text-xs text-slate-600">
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{t('whatNext1')}</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{t('whatNext2')}</span>
          </li>
          <li className="flex items-start space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{t('whatNext3')}</span>
          </li>
        </ul>
      </div>

      <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Secure 256-Bit Encrypted Checkout</span>
      </div>
    </Card>
  );
}

