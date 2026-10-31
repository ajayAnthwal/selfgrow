'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Bookmark } from 'lucide-react';

export interface SectionHeaderProps {
  sectionName: string;
}

export function SectionHeader({ sectionName }: SectionHeaderProps) {
  const t = useTranslations('assessment');

  if (!sectionName) return null;

  return (
    <div className="w-full mb-6 p-3 sm:p-4 rounded-xl bg-slate-100/80 border border-slate-200 flex items-center space-x-3">
      <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
        <Bookmark className="w-4 h-4" />
      </div>
      <div>
        <div className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
          {t('section')}
        </div>
        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
          {sectionName}
        </h3>
      </div>
    </div>
  );
}

