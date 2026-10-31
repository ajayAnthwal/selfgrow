import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Card } from '@/components/ui/Card';
import { IconBox } from '@/components/ui/IconBox';
import { FileCheck, ShieldAlert, Award, Timer } from 'lucide-react';

export default async function TermsPage() {
  const t = await getTranslations('static');

  return (
    <div className="py-12 lg:py-16 bg-background min-h-[75vh]">
      <div className="max-w-[850px] mx-auto px-4 lg:px-6">
        <div className="flex items-center space-x-3.5 mb-8">
          <IconBox icon={FileCheck} color="blue" size="md" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-heading tracking-tight">
              {t('termsTitle') || 'Terms of Service'}
            </h1>
            <p className="text-xs text-muted mt-1">
              Effective Date: January 2026 • Platform Usage &amp; Candidate Guidelines
            </p>
          </div>
        </div>

        <Card className="p-8 sm:p-10 border-border shadow-card space-y-8">
          <div>
            <p className="text-base text-heading font-medium leading-relaxed">
              {t('termsIntro') ||
                'Welcome to SelfGrow. By registering an account and undertaking evaluations, you agree to comply with the terms and standardized integrity policies detailed herein.'}
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex items-center space-x-2.5 text-primary mb-3">
              <ShieldAlert className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-heading">1. Assessment Propriety &amp; Independent Completion</h2>
            </div>
            <p className="text-sm text-body leading-relaxed">
              {t('termsP1') ||
                'Candidates must complete all questions individually without external assistance, unauthorized automated agents, or surrogate test takers. Submissions found violating integrity protocols are subject to cancellation.'}
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex items-center space-x-2.5 text-primary mb-3">
              <Award className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-heading">2. Evaluation Integrity &amp; Reproduction Rights</h2>
            </div>
            <p className="text-sm text-body leading-relaxed">
              {t('termsP2') ||
                'Assessment questions, scoring rubrics, and psychometric models are proprietary intellectual property. Candidates receive personal, non-transferable rights to their delivered diagnostic PDF report.'}
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <div className="flex items-center space-x-2.5 text-primary mb-3">
              <Timer className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-heading">3. Timed Attempts and Auto-Submission</h2>
            </div>
            <p className="text-sm text-body leading-relaxed">
              Assessments configured with a time limit will automatically finalize and submit upon expiration of the allocated server timer. Answers saved prior to expiration will be accurately computed and evaluated.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
