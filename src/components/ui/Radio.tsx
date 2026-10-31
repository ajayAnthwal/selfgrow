import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, id, ...props }, ref) => {
    const generatedId = id || React.useId();

    return (
      <label
        htmlFor={generatedId}
        className="flex items-start space-x-3 cursor-pointer select-none group"
      >
        <input
          type="radio"
          id={generatedId}
          ref={ref}
          className={cn(
            'h-5 w-5 border border-input-border text-primary focus:ring-4 focus:ring-primary/15 transition-all duration-150 mt-0.5 cursor-pointer accent-primary',
            className
          )}
          {...props}
        />
        <div className="flex flex-col">
          {label && (
            <span className="text-[14px] md:text-[15px] font-medium text-heading group-hover:text-primary transition-colors">
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-muted mt-0.5 leading-relaxed">
              {description}
            </span>
          )}
        </div>
      </label>
    );
  }
);

Radio.displayName = 'Radio';

