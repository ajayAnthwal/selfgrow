'use client';

import React, { useState, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { Eye, EyeOff } from 'lucide-react';
import { InputProps } from './Input';

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, isError, error, disabled, label, helperText, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const hasError = Boolean(isError || error);
    const inputId = id || props.name;

    const inputElement = (
      <div className="relative w-full">
        <input
          id={inputId}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          disabled={disabled}
          className={cn(
            'flex h-[46px] w-full rounded-sm border bg-surface px-4 pr-11 py-2.5 text-[15px] text-heading placeholder:text-muted transition-all duration-150',
            'focus-visible:outline-none focus-visible:ring-4',
            'disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-surface-secondary',
            hasError
              ? 'border-danger focus-visible:border-danger focus-visible:ring-danger/15'
              : 'border-input-border hover:border-[#CADCF8] focus-visible:border-primary focus-visible:ring-primary/15',
            className
          )}
          {...props}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-0 top-0 h-full px-3.5 flex items-center justify-center text-muted hover:text-heading focus:outline-none cursor-pointer"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
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

PasswordInput.displayName = 'PasswordInput';
