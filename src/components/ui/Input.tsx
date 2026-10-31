import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isError?: boolean;
  error?: boolean;
  label?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', isError, error, disabled, label, helperText, id, ...props }, ref) => {
    const hasError = Boolean(isError || error);
    const inputId = id || props.name;

    const inputElement = (
      <input
        id={inputId}
        type={type}
        ref={ref}
        disabled={disabled}
        className={cn(
          'flex h-[46px] w-full rounded-sm border bg-surface px-4 py-2.5 text-[15px] text-heading placeholder:text-muted transition-all duration-150',
          'focus-visible:outline-none focus-visible:ring-4',
          'disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-surface-secondary',
          hasError
            ? 'border-danger focus-visible:border-danger focus-visible:ring-danger/15'
            : 'border-input-border hover:border-[#CADCF8] focus-visible:border-primary focus-visible:ring-primary/15',
          className
        )}
        {...props}
      />
    );

    if (label || helperText) {
      return (
        <div className="w-full space-y-1.5 text-left">
          {label && (
            <label htmlFor={inputId} className="block text-xs md:text-[13px] font-medium text-heading">
              {label}
            </label>
          )}
          {inputElement}
          {helperText && (
            <p className={cn('text-xs', hasError ? 'text-danger font-medium' : 'text-muted')}>
              {helperText}
            </p>
          )}
        </div>
      );
    }

    return inputElement;
  }
);

Input.displayName = 'Input';
