import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Inbox } from 'lucide-react';
import { IconBox } from './IconBox';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  message,
  action,
  className,
}) => {
  const desc = description || message;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-lg border border-dashed border-border bg-surface-secondary/40',
        className
      )}
    >
      <div className="mb-4">
        {icon ? (
          <IconBox variant="blue" size="lg" icon={icon} />
        ) : (
          <IconBox variant="blue" size="lg" icon={<Inbox className="w-7 h-7" />} />
        )}
      </div>
      <h4 className="text-lg font-semibold text-heading tracking-tight">{title}</h4>
      {desc && <p className="mt-1.5 text-sm text-body max-w-sm leading-relaxed">{desc}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
