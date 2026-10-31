import React from 'react';
import { getTranslations } from 'next-intl/server';
import { ProductCard, ProductItem } from '@/features/products/ProductCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { Layers } from 'lucide-react';

async function getProducts(locale: string): Promise<ProductItem[]> {
  try {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const res = await fetch(`${backendUrl}/api/v1/products?lang=${locale}`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.data?.items || [];
  } catch {
    return [];
  }
}

export default async function ProductsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations('products');
  const products = await getProducts(locale);

  const displayProducts: ProductItem[] =
    products.length > 0
      ? products
      : [
          {
            id: '1',
            slug: 'personality-dynamics',
            priceInPaise: 49900,
            currency: 'INR',
            name: 'Personality & Leadership Dynamics',
            description:
              'Discover your core psychological traits, leadership aptitude, and social interaction style with deep AI diagnostic analysis.',
            assessment: {
              id: 'a1',
              slug: 'personality-dynamics',
              title: 'Personality & Leadership Dynamics',
              description: 'Understand your behavioral archetype',
              kind: 'OBJECTIVE',
              timeLimitSeconds: 1200,
              questionsCount: 30,
            },
          },
          {
            id: '2',
            slug: 'career-aptitude',
            priceInPaise: 79900,
            currency: 'INR',
            name: 'Career & Cognitive Aptitude',
            description:
              'Map your cognitive strengths to high-growth career trajectories and strategic roles benchmarked for 2026.',
            assessment: {
              id: 'a2',
              slug: 'career-aptitude',
              title: 'Career & Cognitive Aptitude',
              description: 'Identify highest-fit roles',
              kind: 'MIXED',
              timeLimitSeconds: 1500,
              questionsCount: 35,
            },
          },
          {
            id: '3',
            slug: 'emotional-resilience',
            priceInPaise: 59900,
            currency: 'INR',
            name: 'Emotional Resilience & EQ',
            description:
              'Evaluate your emotional quotient, stress tolerance, adaptability, and workplace interpersonal dynamics.',
            assessment: {
              id: 'a3',
              slug: 'emotional-resilience',
              title: 'Emotional Resilience & EQ',
              description: 'Measure stress handling',
              kind: 'OBJECTIVE',
              timeLimitSeconds: 900,
              questionsCount: 25,
            },
          },
        ];

  return (
    <div className="py-12 lg:py-16 bg-background min-h-[75vh]">
      <div className="max-w-[1200px] mx-auto px-4 lg:px-6">
        {/* Header */}
        <SectionHeader
          badge="Evaluations Catalog"
          title={t('catalogTitle') || 'Choose Your Report'}
          subtitle={
            t('catalogSubtitle') ||
            'Select from our scientifically validated assessments to discover your cognitive strengths, personality traits, and career roadmap.'
          }
        />

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
