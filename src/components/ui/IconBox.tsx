import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface IconBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'blue' | 'purple' | 'green' | 'orange';
  color?: 'blue' | 'purple' | 'green' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode | React.ElementType;
}

export const IconBox: React.FC<IconBoxProps> = ({
  className,
  variant,
  color = 'blue',
  size = 'md',
  icon: Icon,
  children,
  ...props
}) => {
  const activeColor = variant || color;
  const variants = {
    blue: 'bg-light-blue text-primary border border-[#D4E4FC]',
    purple: 'bg-purple-light text-purple border border-[#E4D7FC]',
    green: 'bg-success-light text-success border border-[#CAEEDC]',
    orange: 'bg-warning-light text-[#D97706] border border-[#FDE68A]',
  };

  const sizes = {
    sm: 'w-9 h-9 rounded-md p-1.5',
    md: 'w-12 h-12 rounded-lg p-2.5',
    lg: 'w-14 h-14 rounded-lg p-3',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  const renderIcon = () => {
    if (Icon) {
      if (React.isValidElement(Icon)) return Icon;
      if (typeof Icon === 'function' || typeof Icon === 'object') {
        const IconComp = Icon as React.ElementType;
        return <IconComp className={iconSizes[size]} />;
      }
      return Icon;
    }
    return children;
  };

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center shrink-0 shadow-xs transition-transform duration-150',
        variants[activeColor],
        sizes[size],
        className
      )}
      {...props}
    >
      {renderIcon()}
    </div>
  );
};
