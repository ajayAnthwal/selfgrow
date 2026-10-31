import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SectionHeaderProps {
  badge?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'center' | 'left';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className,
}) => {
  return (
    <div
      className={cn(
        'max-w-3xl mb-12 md:mb-16',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {badge && (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-light-blue text-primary border border-[#D4E4FC] mb-3">
          {badge}
        </div>
      )}
      <h2 className="text-3xl md:text-[36px] font-bold text-heading tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3.5 text-base md:text-lg text-body leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

