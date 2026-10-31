import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { Spinner } from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'navy';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isFullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isFullWidth = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold whitespace-nowrap transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-sm select-none cursor-pointer';

    const variants = {
      primary:
        'bg-primary text-white hover:bg-primary-hover active:bg-[#0c47b5] focus-visible:ring-primary/30 shadow-xs',
      secondary:
        'border border-border bg-surface text-heading hover:bg-surface-secondary hover:border-primary/40 active:bg-light-blue focus-visible:ring-primary/20 shadow-xs',
      outline:
        'border border-border bg-surface text-heading hover:bg-surface-secondary hover:border-primary/40 active:bg-light-blue focus-visible:ring-primary/20 shadow-xs',
      ghost:
        'text-body hover:bg-surface-secondary hover:text-heading active:bg-light-blue focus-visible:ring-primary/20',
      danger:
        'bg-danger text-white hover:bg-danger-dark active:bg-[#b91c1c] focus-visible:ring-danger/20 shadow-xs',
      navy:
        'bg-navy text-white hover:bg-dark-navy active:bg-[#081735] focus-visible:ring-navy/20 shadow-xs',
    };

    const sizes = {
      sm: 'h-9 px-3.5 text-xs gap-1.5',
      md: 'h-11 px-5 text-[14px] md:text-[15px] gap-2',
      lg: 'h-12 px-7 text-[15px] md:text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          isFullWidth ? 'w-full' : '',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="inline-flex items-center justify-center gap-2">
            <Spinner size={size === 'lg' ? 'md' : 'sm'} />
            <span>{children}</span>
          </div>
        ) : (
          <div className="inline-flex items-center justify-center gap-2">
            {leftIcon && <span className="inline-flex shrink-0 items-center">{leftIcon}</span>}
            <span className="inline-flex items-center">{children}</span>
            {rightIcon && <span className="inline-flex shrink-0 items-center">{rightIcon}</span>}
          </div>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
