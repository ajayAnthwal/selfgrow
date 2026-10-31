import React from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-primary',
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('p-5 flex flex-col justify-between border-border bg-surface shadow-card hover:shadow-hover transition-all rounded-xl', className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-muted">
          {title}
        </p>
        {icon && (
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-xs shrink-0', iconBgColor)}>
            {icon}
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-heading">
          {value}
        </p>
        {(subtitle || trend) && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-body">
            {trend && (
              <span
                className={cn(
                  'font-semibold',
                  trend.isPositive ? 'text-success' : 'text-danger'
                )}
              >
                {trend.value}
              </span>
            )}
            {subtitle && <span className="text-muted font-medium">{subtitle}</span>}
          </div>
        )}
      </div>
    </Card>
  );
}
