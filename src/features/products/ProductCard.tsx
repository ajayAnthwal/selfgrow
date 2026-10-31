'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useAuth } from '@/features/auth/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { IconBox } from '@/components/ui/IconBox';
import { formatMoney } from '@/lib/utils/formatMoney';
import { Clock, HelpCircle, ArrowRight, CheckCircle2, User, Compass, Brain, Sparkles } from 'lucide-react';

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceInPaise: number;
  currency: string;
  autoRelease?: boolean;
  assessment?: {
    id: string;
    slug: string;
    title: string;
    description: string;
    kind: string;
    timeLimitSeconds: number | null;
    questionsCount?: number;
  };
}

interface ProductCardProps {
  product: ProductItem;
  variantColor?: 'purple' | 'green' | 'orange' | 'blue';
}

function getIconVariant(slug: string, fallbackIndex: number = 0): { variant: 'purple' | 'green' | 'orange' | 'blue'; icon: React.ReactNode } {
  if (slug.includes('personality') || slug.includes('psychometric')) {
    return { variant: 'purple', icon: <User className="w-6 h-6" /> };
  }
  if (slug.includes('career') || slug.includes('guidance')) {
    return { variant: 'green', icon: <Compass className="w-6 h-6" /> };
  }
  if (slug.includes('development') || slug.includes('self') || slug.includes('growth')) {
    return { variant: 'orange', icon: <Sparkles className="w-6 h-6" /> };
  }
  return { variant: 'blue', icon: <Brain className="w-6 h-6" /> };
}

export function ProductCard({ product, variantColor }: ProductCardProps) {
  const t = useTranslations('products');
  const locale = useLocale();

  const title =
    product.name ||
    product.assessment?.title ||
    (product as any).title ||
    (product as any).locales?.[0]?.title ||
    'Assessment Report';

  const description =
    product.description ||
    product.assessment?.description ||
    (product as any).description ||
    (product as any).locales?.[0]?.description ||
    'Scientifically benchmarked evaluation with AI diagnostic report.';

  const priceInPaise =
    typeof product.priceInPaise === 'number'
      ? product.priceInPaise
      : typeof (product as any).price === 'number'
      ? (product as any).price * 100
      : 0;

  const isFree = priceInPaise === 0;
  const timeLimitMins = product.assessment?.timeLimitSeconds
    ? Math.round(product.assessment.timeLimitSeconds / 60)
    : (product as any).timeLimitMinutes || null;

  const questionsCount =
    product.assessment?.questionsCount ||
    (product as any).questionCount ||
    null;

  const { variant, icon } = getIconVariant(product.slug);
  const activeVariant = variantColor || variant;

  const { isAuthenticated } = useAuth();

  const buyNowUrl = isAuthenticated
    ? `/assessment/start/${product.slug}`
    : `/login?redirect=${encodeURIComponent(`/assessment/start/${product.slug}`)}&reason=purchase_required&product=${encodeURIComponent(title)}`;

  return (
    <Card hoverable className="flex flex-col h-full bg-surface border-border p-6 rounded-lg shadow-card hover:shadow-hover transition-all duration-200">
      <div className="flex-1 flex flex-col">
        {/* Top Header: IconBox + Badge & Price */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <IconBox variant={activeVariant} size="md" icon={icon} />
          
          <div className="flex flex-col items-end">
            <Badge variant={isFree ? 'success' : 'info'} size="sm">
              {isFree ? t('freeBadge') || 'Free' : t('paidBadge') || 'Premium'}
            </Badge>
            <span className="text-xl font-bold text-heading mt-1.5">
              {formatMoney(priceInPaise, locale)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[19px] font-bold text-heading leading-snug line-clamp-1 mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-body line-clamp-2 leading-relaxed mb-6">
          {description}
        </p>

        {/* Meta Pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted font-medium mb-6 mt-auto">
          {timeLimitMins && (
            <div className="inline-flex items-center space-x-1.5 bg-surface-secondary px-2.5 py-1 rounded-sm border border-border">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span className="text-body font-semibold">{timeLimitMins} {t('minutes') || 'mins'}</span>
            </div>
          )}
          {questionsCount && (
            <div className="inline-flex items-center space-x-1.5 bg-surface-secondary px-2.5 py-1 rounded-sm border border-border">
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              <span className="text-body font-semibold">{questionsCount} {t('questions') || 'Questions'}</span>
            </div>
          )}
          <div className="inline-flex items-center space-x-1 bg-surface-secondary px-2.5 py-1 rounded-sm border border-border">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            <span className="text-body font-semibold">Instant AI Report</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border mt-2">
        <Link href={`/products/${product.slug}`} className="w-full">
          <Button variant="outline" size="sm" isFullWidth className="text-xs md:text-sm font-semibold">
            View Details
          </Button>
        </Link>
        <Link href={buyNowUrl} className="w-full">
          <Button variant="primary" size="sm" isFullWidth className="text-xs md:text-sm font-semibold shadow-xs">
            <span>{isFree ? 'Start Free' : 'Buy Now'}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
