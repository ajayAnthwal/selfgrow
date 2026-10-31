import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isError?: boolean;
  error?: boolean;
  label?: string;
  helperText?: string;
  charCount?: number;
  maxCharCount?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      isError,
      error,
      disabled,
      label,
      helperText,
      charCount,
      maxCharCount,
      id,
      ...props
    },
    ref
  ) => {
    const hasError = Boolean(isError || error);
    const textareaId = id || props.name;

    const textareaElement = (
      <textarea
        id={textareaId}
        ref={ref}
        disabled={disabled}
        className={cn(
          'flex min-h-[120px] w-full rounded-sm border bg-surface px-4 py-3 text-[15px] text-heading placeholder:text-muted transition-all duration-150',
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

    if (label || helperText || maxCharCount !== undefined) {
      return (
        <div className="w-full space-y-1.5 text-left">
          <div className="flex items-center justify-between">
            {label && (
              <label htmlFor={textareaId} className="block text-xs md:text-[13px] font-medium text-heading">
                {label}
              </label>
            )}
            {maxCharCount !== undefined && (
              <span className="text-xs text-muted">
                {charCount || 0}/{maxCharCount}
              </span>
            )}
          </div>
          {textareaElement}
          {helperText && (
            <p className={cn('text-xs', hasError ? 'text-danger font-medium' : 'text-muted')}>
              {helperText}
            </p>
          )}
        </div>
      );
    }

    return textareaElement;
  }
);

Textarea.displayName = 'Textarea';

