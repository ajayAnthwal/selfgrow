'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

interface StartAssessmentButtonProps {
  productSlug: string;
  productName: string;
  buttonLabel?: string;
  isFree?: boolean;
}

export function StartAssessmentButton({
  productSlug,
  productName,
  buttonLabel,
  isFree = false,
}: StartAssessmentButtonProps) {
  const { isAuthenticated } = useAuth();

  const targetUrl = isAuthenticated
    ? `/assessment/start/${productSlug}`
    : `/login?redirect=${encodeURIComponent(`/assessment/start/${productSlug}`)}&reason=purchase_required&product=${encodeURIComponent(productName)}`;

  return (
    <Link href={targetUrl} className="w-full block">
      <Button variant="primary" size="lg" isFullWidth className="h-12 font-semibold shadow-card">
        <span>{buttonLabel || (isFree ? 'Start Free Assessment' : 'Start Assessment')}</span>
        <ArrowRight className="w-4 h-4 ml-1.5" />
      </Button>
    </Link>
  );
}

