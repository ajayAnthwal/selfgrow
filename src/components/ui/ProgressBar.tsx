import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface ProgressBarProps {
  value: number; // 0 to 100 or current count
  max?: number;
  label?: React.ReactNode;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'purple' | 'warning';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  variant = 'primary',
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const variantClasses = {
    primary: 'bg-primary',
    success: 'bg-success',
    purple: 'bg-purple',
    warning: 'bg-warning',
  };

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs font-medium text-body">
          {label && <span>{label}</span>}
          {showValue && <span className="font-semibold text-heading">{percentage}%</span>}
        </div>
      )}
      <div
        className={cn('w-full bg-light-blue rounded-full overflow-hidden', sizeClasses[size])}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-300 ease-out', variantClasses[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

