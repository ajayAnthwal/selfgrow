'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { ProductItem } from '@/features/products/ProductCard';
import { useStartAttempt } from '@/features/assessment/api';
import { useAuth } from '@/features/auth/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconBox } from '@/components/ui/IconBox';
import { ApiClientError } from '@/lib/api/client';
import { mapErrorCode } from '@/lib/utils/errors';
import {
  Clock,
  HelpCircle,
  ShieldCheck,
  Cloud,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  FileCheck,
} from 'lucide-react';

interface StartBriefingProps {
  product: ProductItem;
  locale: string;
}

export function StartBriefing({ product, locale }: StartBriefingProps) {
  const t = useTranslations('assessment');
  const tErrors = useTranslations('errors');
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const startAttemptMutation = useStartAttempt();

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const timeLimitMins = product.assessment?.timeLimitSeconds
    ? Math.round(product.assessment.timeLimitSeconds / 60)
    : null;

  const handleStart = async () => {
    setErrorMsg(null);
    if (!isAuthenticated) {
      router.push(`/login?redirect=/assessment/start/${product.slug}`);
      return;
    }
    try {
      const attempt = await startAttemptMutation.mutateAsync({
        productId: product.id,
        language: locale.toUpperCase() as 'EN' | 'HI',
      });
      router.push(`/assessment/attempt/${attempt.id}`);
    } catch (err: any) {
      if (err instanceof ApiClientError) {
        const errorKey = mapErrorCode(err.code);
        setErrorMsg(tErrors(errorKey as any));
      } else {
        // Fallback for demo when backend database is disconnected
        // If demo/fallback attempt is requested, route gracefully or show informative notice
        setErrorMsg(
          err?.message ||
            'Unable to initialize evaluation attempt. Please ensure you are logged in.'
        );
      }
    }
  };

  return (
    <Card className="p-8 sm:p-10 border-border bg-surface shadow-card">
      <div className="text-center max-w-lg mx-auto mb-8">
        <div className="mx-auto mb-4 flex justify-center">
          <IconBox icon={Sparkles} color="purple" size="lg" />
        </div>
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary bg-light-blue px-3 py-1 rounded-full mb-3">
          Evaluation Briefing
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-heading tracking-tight">
          {product.name}
        </h1>
        <p className="mt-2 text-sm text-body leading-relaxed">
          {t('startIntro') ||
            'Please review the testing specifications and ground rules below before launching your assessment session.'}
        </p>
      </div>

      {errorMsg && (
        <div
          className="mb-6 flex items-start space-x-2.5 rounded-sm bg-danger-light p-3.5 text-sm text-danger border border-danger/20"
          role="alert"
        >
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-danger mt-0.5" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Briefing Specification Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3.5 p-4 rounded-sm bg-surface-secondary border border-border">
          <IconBox icon={Clock} color="blue" size="sm" />
          <div>
            <div className="text-xs text-muted font-medium">
              {t('timeLimitNotice') || 'Allocated Time'}
            </div>
            <div className="text-sm font-bold text-heading">
              {timeLimitMins ? `${timeLimitMins} mins` : t('noTimeLimitNotice') || 'Self-paced'}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3.5 p-4 rounded-sm bg-surface-secondary border border-border">
          <IconBox icon={HelpCircle} color="orange" size="sm" />
          <div>
            <div className="text-xs text-muted font-medium">
              {t('totalQuestionsNotice') || 'Total Questions'}
            </div>
            <div className="text-sm font-bold text-heading">
              {product.assessment?.questionsCount ?? 30} Questions
            </div>
          </div>
        </div>
      </div>

      {/* Notices */}
      <div className="space-y-3 mb-8">
        <div className="flex items-start space-x-3 text-xs text-body p-3.5 rounded-sm bg-success-light border border-[#CAEEDC]">
          <Cloud className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
          <span className="font-medium">
            {t('autoSaveNotice') || 'Responses are automatically encrypted and saved in real-time to the secure server.'}
          </span>
        </div>

        <div className="flex items-start space-x-3 text-xs text-body p-3.5 rounded-sm bg-surface-secondary border border-border">
          <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <span className="font-medium">
            {t('privacyNotice') || 'DPDP 2023 protected: Your evaluation answers and scores remain strictly confidential.'}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <Button
        variant="primary"
        size="lg"
        onClick={handleStart}
        isLoading={startAttemptMutation.isPending}
        isFullWidth
        className="h-12 justify-center font-semibold shadow-card text-base"
        rightIcon={<ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />}
      >
        <span>{t('beginButton') || 'Begin Assessment Session'}</span>
      </Button>
    </Card>
  );
}
