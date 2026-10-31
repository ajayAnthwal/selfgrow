import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  helperText?: string;
  isError?: boolean;
  error?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, helperText, isError, error, id, ...props }, ref) => {
    const generatedId = id || React.useId();
    const hasError = Boolean(isError || error);

    return (
      <div className="flex flex-col text-left">
        <label
          htmlFor={generatedId}
          className="flex items-start space-x-3 cursor-pointer select-none group"
        >
          <input
            type="checkbox"
            id={generatedId}
            ref={ref}
            className={cn(
              'h-5 w-5 rounded-sm border border-input-border text-primary focus:ring-4 focus:ring-primary/15 transition-all duration-150 mt-0.5 cursor-pointer accent-primary',
              hasError && 'border-danger focus:ring-danger/20',
              className
            )}
            {...props}
          />
          {label && (
            <span className="text-[14px] md:text-[15px] leading-snug text-body group-hover:text-heading transition-colors">
              {label}
            </span>
          )}
        </label>
        {helperText && (
          <p className={cn('text-xs mt-1 ml-8', hasError ? 'text-danger font-medium' : 'text-muted')}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
