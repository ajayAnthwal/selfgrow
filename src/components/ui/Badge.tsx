import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'brand' | 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'purple' | 'outline' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-surface-secondary text-body border border-border',
    brand: 'bg-light-blue text-primary border border-[#D4E4FC]',
    primary: 'bg-light-blue text-primary border border-[#D4E4FC]',
    info: 'bg-light-blue text-primary border border-[#D4E4FC]',
    neutral: 'bg-surface-secondary text-body border border-border',
    success: 'bg-success-light text-success border border-[#CAEEDC]',
    warning: 'bg-warning-light text-[#D97706] border border-[#FDE68A]',
    danger: 'bg-danger-light text-danger border border-[#FDC4C6]',
    purple: 'bg-purple-light text-purple border border-[#E4D7FC]',
    outline: 'border border-border text-body bg-surface',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] font-semibold',
    md: 'px-2.5 py-0.5 text-xs font-semibold',
    lg: 'px-3 py-1 text-sm font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full tracking-wide transition-colors',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
