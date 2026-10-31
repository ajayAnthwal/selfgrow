import React from 'react';
import { Card } from './Card';
import { IconBox, IconBoxProps } from './IconBox';
import { cn } from '@/lib/utils/cn';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  iconVariant?: IconBoxProps['variant'];
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconVariant = 'blue',
  trend,
  className,
}) => {
  return (
    <Card className={cn('p-6 flex flex-col justify-between hover:shadow-hover transition-all duration-150', className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs md:text-[13px] font-medium text-body uppercase tracking-wider">
          {title}
        </p>
        {icon && (
          <IconBox variant={iconVariant} size="sm" icon={icon} />
        )}
      </div>

      <div className="mt-4">
        <p className="text-2xl md:text-3xl font-bold tracking-tight text-heading">
          {value}
        </p>
        {(subtitle || trend) && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-full font-semibold text-[11px]',
                  trend.isPositive
                    ? 'bg-success-light text-success border border-[#CAEEDC]'
                    : 'bg-danger-light text-danger border border-[#FDC4C6]'
                )}
              >
                {trend.value}
              </span>
            )}
            {subtitle && <span className="text-muted">{subtitle}</span>}
          </div>
        )}
      </div>
    </Card>
  );
};

