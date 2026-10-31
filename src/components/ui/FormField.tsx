import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface FormFieldProps {
  label?: React.ReactNode;
  htmlFor?: string;
  error?: string;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  description,
  helperText,
  required,
  children,
  className,
}) => {
  const hint = description || helperText;

  return (
    <div className={cn('flex flex-col space-y-1.5 w-full', className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="text-rose-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      {children}

      {hint && !error && (
        <p className="text-xs text-slate-500">{hint}</p>
      )}

      {error && (
        <p className="text-xs font-medium text-rose-600 animate-fadeIn" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
