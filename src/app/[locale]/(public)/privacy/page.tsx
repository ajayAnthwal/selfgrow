import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Card } from '@/components/ui/Card';
import { IconBox } from '@/components/ui/IconBox';
import { ShieldCheck, Lock, Eye, Database } from 'lucide-react';

export default async function PrivacyPage() {
  const t = await getTranslations('static');

  return (
    <div className="py-12 lg:py-16 bg-background min-h-[75vh]">
      <div className="max-w-[850px] mx-auto px-4 lg:px-6">
        <div className="flex items-center space-x-3.5 mb-8">
          <IconBox icon={ShieldCheck} color="green" size="md" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-heading tracking-tight">
              {t('privacyTitle') || 'Privacy & Data Protection Policy'}
            </h1>
            <p className="text-xs text-muted mt-1">
              Compliant with Digital Personal Data Protection Act (DPDP), 2023
            </p>
          </div>
        </div>

        <Card className="p-8 sm:p-10 border-border shadow-card space-y-8">
          <div>
            <p className="text-base text-heading font-medium leading-relaxed">
              {t('privacyIntro') ||
                'SelfGrow is dedicated to upholding candidate trust and privacy. We treat psychological and cognitive testing data with the strictest confidential controls.'}
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex items-center space-x-2.5 text-primary mb-3">
              <Database className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-heading">1. Data Collection &amp; Purpose Limitation</h2>
            </div>
            <p className="text-sm text-body leading-relaxed">
              {t('privacyP1') ||
                'We collect user registration credentials (name, email), localized language preferences, assessment response choices, and timing metrics strictly for computing psychometric diagnostic dimensions and delivering your final evaluation report.'}
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex items-center space-x-2.5 text-primary mb-3">
              <Eye className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-heading">2. Zero Third-Party Monetization</h2>
            </div>
            <p className="text-sm text-body leading-relaxed">
              {t('privacyP2') ||
                'Your answers, dimension scores, and synthesized reports are never sold, rented, or shared with commercial advertising networks. Only authorized subprocessors (OpenAI for structured synthesis, Razorpay for payments, and transactional email dispatchers) process minimum necessary payloads.'}
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex items-center space-x-2.5 text-primary mb-3">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-heading">3. Diagnostic Integrity &amp; Security Controls</h2>
            </div>
            <p className="text-sm text-body leading-relaxed">
              All candidate attempts, answers, and generated reports are encrypted at rest using AES-256 and in transit via TLS 1.3. Report access is strictly restricted to authenticated candidate accounts through secure httpOnly session cookies.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
