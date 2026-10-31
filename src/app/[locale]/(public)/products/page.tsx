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
            price: 499,
            category: 'Psychological',
            timeLimitMinutes: 20,
            questionCount: 30,
            locales: [
              {
                lang: locale,
                title: 'Personality & Leadership Dynamics',
                description:
                  'Discover your core psychological traits, leadership aptitude, and social interaction style with deep AI diagnostic analysis.',
              },
            ],
          },
          {
            id: '2',
            slug: 'career-aptitude',
            price: 799,
            category: 'Career Guidance',
            timeLimitMinutes: 25,
            questionCount: 35,
            locales: [
              {
                lang: locale,
                title: 'Career & Cognitive Aptitude',
                description:
                  'Map your cognitive strengths to high-growth career trajectories and strategic roles benchmarked for 2026.',
              },
            ],
          },
          {
            id: '3',
            slug: 'emotional-resilience',
            price: 599,
            category: 'Self Development',
            timeLimitMinutes: 15,
            questionCount: 25,
            locales: [
              {
                lang: locale,
                title: 'Emotional Resilience & EQ',
                description:
                  'Evaluate your emotional quotient, stress tolerance, adaptability, and workplace interpersonal dynamics.',
              },
            ],
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
