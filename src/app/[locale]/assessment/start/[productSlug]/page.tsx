import React from 'react';
import { notFound } from 'next/navigation';
import { StartBriefing } from './StartBriefing';
import { ProductItem } from '@/features/products/ProductCard';

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

export default async function AssessmentStartPage({
  params: { productSlug, locale },
}: {
  params: { productSlug: string; locale: string };
}) {
  const product = await getProductBySlug(productSlug, locale);

  if (!product) {
    notFound();
  }

  return (
    <div className="py-12 lg:py-16 bg-background min-h-[80vh] flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4 sm:px-6">
        <StartBriefing product={product} locale={locale} />
      </div>
    </div>
  );
}
