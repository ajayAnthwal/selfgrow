import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  isError?: boolean;
  error?: boolean;
  label?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, children, isError, error, disabled, label, helperText, id, ...props }, ref) => {
    const hasError = Boolean(isError || error);
    const selectId = id || props.name;

    const selectElement = (
      <div className="relative w-full">
        <select
          id={selectId}
          ref={ref}
          disabled={disabled}
          className={cn(
            'flex h-[46px] w-full appearance-none rounded-sm border bg-surface px-4 py-2.5 pr-10 text-[15px] text-heading transition-all duration-150 cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-4',
            'disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-surface-secondary',
            hasError
              ? 'border-danger focus-visible:border-danger focus-visible:ring-danger/15'
              : 'border-input-border hover:border-[#CADCF8] focus-visible:border-primary focus-visible:ring-primary/15',
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-muted">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    );

    if (label || helperText) {
      return (
        <div className="w-full space-y-1.5 text-left">
          {label && (
            <label htmlFor={selectId} className="block text-xs md:text-[13px] font-medium text-heading">
              {label}
            </label>
          )}
          {selectElement}
          {helperText && (
            <p className={cn('text-xs', hasError ? 'text-danger font-medium' : 'text-muted')}>
              {helperText}
            </p>
          )}
        </div>
      );
    }

    return selectElement;
  }
);

Select.displayName = 'Select';
