'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Compass } from 'lucide-react';

export default function NotFoundPage() {
  const tErrors = useTranslations('errors');
  const tNav = useTranslations('nav');

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      <Card className="max-w-md w-full text-center p-8 sm:p-10 shadow-card">
        <div className="w-16 h-16 mx-auto rounded-full bg-light-blue flex items-center justify-center text-primary mb-5">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>
        <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary bg-light-blue px-3 py-1 rounded-full mb-3">
          Error 404
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-heading mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-body mb-8 leading-relaxed">
          {tErrors('NOT_FOUND') || 'The page you are looking for does not exist or has been moved.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="primary" size="md" className="w-full sm:w-auto">
              {tNav('home')}
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" size="md" className="w-full sm:w-auto">
              Browse Reports
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

