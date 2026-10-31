import React from 'react';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { IconBox } from '@/components/ui/IconBox';
import { StartAssessmentButton } from '@/features/products/StartAssessmentButton';
import { ProductItem } from '@/features/products/ProductCard';
import { formatMoney } from '@/lib/utils/formatMoney';
import {
  Clock,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  FileText,
  Sparkles,
  Star,
  Award,
  Zap,
} from 'lucide-react';

const FALLBACK_PRODUCTS: Record<string, ProductItem> = {
  'personality-dynamics': {
    id: 'prod_personality',
    slug: 'personality-dynamics',
    name: 'Personality & Leadership Dynamics',
    description:
      'Understand your core behavioral archetype, decision-making style, and leadership presence with deep AI diagnostic analysis.',
    priceInPaise: 49900,
    currency: 'INR',
    assessment: {
      id: 'asmt_personality',
      slug: 'personality-dynamics',
      title: 'Personality & Leadership Dynamics',
      description: 'Understand your behavioral archetype',
      kind: 'OBJECTIVE',
      timeLimitSeconds: 1200,
      questionsCount: 30,
    },
  },
  'career-aptitude': {
    id: 'prod_career',
    slug: 'career-aptitude',
    name: 'Career & Cognitive Aptitude',
    description:
      'Map your cognitive strengths to high-growth career trajectories and strategic roles benchmarked for 2026.',
    priceInPaise: 79900,
    currency: 'INR',
    assessment: {
      id: 'asmt_career',
      slug: 'career-aptitude',
      title: 'Career & Cognitive Aptitude',
      description: 'Identify highest-fit roles',
      kind: 'MIXED',
      timeLimitSeconds: 1500,
      questionsCount: 35,
    },
  },
  'emotional-resilience': {
    id: 'prod_emotional',
    slug: 'emotional-resilience',
    name: 'Emotional Resilience & EQ',
    description:
      'Evaluate your emotional quotient, stress tolerance, adaptability, and workplace interpersonal dynamics.',
    priceInPaise: 59900,
    currency: 'INR',
    assessment: {
      id: 'asmt_emotional',
      slug: 'emotional-resilience',
      title: 'Emotional Resilience & EQ',
      description: 'Measure stress handling',
      kind: 'OBJECTIVE',
      timeLimitSeconds: 900,
      questionsCount: 25,
    },
  },
  'free-leadership-sampler': {
    id: 'prod_sampler',
    slug: 'free-leadership-sampler',
    name: 'Free Leadership Sampler',
    description: 'A 5-minute quick diagnostic preview of executive cognitive metrics.',
    priceInPaise: 0,
    currency: 'INR',
    assessment: {
      id: 'asmt_sampler',
      slug: 'free-leadership-sampler',
      title: 'Free Leadership Sampler',
      description: 'Quick diagnostic preview',
      kind: 'OBJECTIVE',
      timeLimitSeconds: 300,
      questionsCount: 5,
    },
  },
  'pro-leadership-suite': {
    id: 'prod_pro_lead',
    slug: 'pro-leadership-suite',
    name: 'Pro Leadership Assessment Suite',
    description: 'Comprehensive executive psychometric and cognitive evaluation.',
    priceInPaise: 99900,
    currency: 'INR',
    assessment: {
      id: 'asmt_pro_lead',
      slug: 'pro-leadership-suite',
      title: 'Pro Leadership Assessment Suite',
      description: 'Comprehensive executive evaluation',
      kind: 'MIXED',
      timeLimitSeconds: 1800,
      questionsCount: 40,
    },
  },
  'cognitive-aptitude-mastery': {
    id: 'prod_cog_mastery',
    slug: 'cognitive-aptitude-mastery',
    name: 'Cognitive Aptitude Mastery',
    description: 'Advanced quantitative and deductive reasoning benchmark evaluation.',
    priceInPaise: 49900,
    currency: 'INR',
    assessment: {
      id: 'asmt_cog_mastery',
      slug: 'cognitive-aptitude-mastery',
      title: 'Cognitive Aptitude Mastery',
      description: 'Advanced quantitative and deductive reasoning benchmark',
      kind: 'OBJECTIVE',
      timeLimitSeconds: 1200,
      questionsCount: 30,
    },
  },
};

async function getProductBySlug(slug: string, locale: string): Promise<ProductItem | null> {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const res = await fetch(`${backendUrl}/api/v1/products/${slug}?lang=${locale}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      return FALLBACK_PRODUCTS[slug] || null;
    }
    const data = await res.json();
    return data?.data?.product || FALLBACK_PRODUCTS[slug] || null;
  } catch {
    return FALLBACK_PRODUCTS[slug] || null;
  }
}

export default async function ProductDetailPage({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}) {
  const t = await getTranslations('products');
  const tCommon = await getTranslations('common');
  const product = await getProductBySlug(slug, locale);

  if (!product) {
    notFound();
  }

  const isFree = product.priceInPaise === 0;
  const timeLimitMins = product.assessment?.timeLimitSeconds
    ? Math.round(product.assessment.timeLimitSeconds / 60)
    : null;

  const isMixed = product.assessment?.kind === 'MIXED';

  return (
    <div className="py-10 lg:py-14 bg-background min-h-[80vh]">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center text-sm font-semibold text-body hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>{tCommon('back') || 'Back to Assessments'}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 border-border shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant={isFree ? 'success' : 'info'} size="md">
                  {isFree ? t('freeBadge') || 'Free Evaluation' : t('paidBadge') || 'Premium Report'}
                </Badge>
                <div className="flex items-center text-amber-500 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                  <span>4.9 / 5.0 (verified)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-heading tracking-tight mb-4">
                {product.name}
              </h1>

              <p className="text-base text-body leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Assessment Specs Grid */}
              <div className="border-t border-border pt-6">
                <h2 className="text-base font-bold text-heading mb-4">
                  {t('assessmentFormat') || 'Evaluation Specifications'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-3.5 p-4 bg-surface-secondary rounded-sm border border-border">
                    <IconBox icon={Clock} color="blue" size="sm" />
                    <div>
                      <div className="text-xs text-muted font-medium">{t('timeLimit') || 'Time Allocation'}</div>
                      <div className="font-bold text-heading">
                        {timeLimitMins ? `${timeLimitMins} ${t('minutes') || 'Minutes'}` : t('noTimeLimit') || 'Self-Paced'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3.5 p-4 bg-surface-secondary rounded-sm border border-border">
                    <IconBox icon={HelpCircle} color="purple" size="sm" />
                    <div>
                      <div className="text-xs text-muted font-medium">{t('questions') || 'Items'}</div>
                      <div className="font-bold text-heading">
                        {product.assessment?.questionsCount ?? 0} {t('questions') || 'Questions'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-light-blue rounded-sm border border-border flex items-start space-x-3 text-xs text-navy">
                  <FileText className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Evaluation Type: </span>
                    {isMixed ? t('mixedKind') || 'Objective & Subjective (Mixed AI Evaluation)' : t('objectiveKind') || 'Multiple Choice Standardized'}
                  </div>
                </div>
              </div>
            </Card>

            {/* Included in Report Card */}
            <Card className="p-8 border-border shadow-card">
              <h2 className="text-lg font-bold text-heading mb-4 flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>{t('includedInReport') || 'What You Will Receive in Your Report'}</span>
              </h2>

              <ul className="space-y-3.5">
                {[
                  t('feature1') || 'Detailed dimensional radar chart across core competencies',
                  t('feature2') || 'Bilingual diagnostic summary available in English and हिन्दी',
                  t('feature3') || 'Actionable 30-60-90 day growth and development roadmap',
                  t('feature4') || 'Cryptographically signed publication-grade PDF download',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-sm text-body">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Sidebar / Checkout Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-6 border-border shadow-hover">
                <div className="mb-6">
                  <div className="text-xs font-bold text-muted uppercase tracking-wider mb-1">
                    Assessment Fee
                  </div>
                  <div className="text-3xl font-extrabold text-heading">
                    {formatMoney(product.priceInPaise, locale)}
                  </div>
                  <p className="text-xs text-muted mt-1">
                    One-time payment • Lifetime access to PDF report
                  </p>
                </div>

                <StartAssessmentButton
                  productSlug={product.slug}
                  productName={product.name}
                  buttonLabel={t('startAssessment') || 'Start Assessment'}
                  isFree={isFree}
                />

                <div className="mt-6 pt-6 border-t border-border space-y-3 text-xs text-muted">
                  <div className="flex items-center space-x-2.5">
                    <ShieldCheck className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="font-medium text-body">Instant access &amp; server auto-save</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Award className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="font-medium text-body">Bilingual PDF report via email</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Zap className="w-4 h-4 text-warning flex-shrink-0" />
                    <span className="font-medium text-body">Verified Razorpay secure checkout</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
