'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Badge, BadgeProps } from './Badge';

export type AnyStatus =
  | 'CREATED'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'QUEUED'
  | 'GENERATING'
  | 'GENERATED'
  | 'PENDING_REVIEW'
  | 'RELEASED'
  | 'REJECTED';

export interface StatusBadgeProps {
  status: AnyStatus | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function getStatusVariant(status: string): BadgeProps['variant'] {
  switch (status) {
    case 'PAID':
    case 'RELEASED':
      return 'success';
    case 'GENERATING':
    case 'GENERATED':
      return 'brand';
    case 'PENDING_REVIEW':
    case 'REFUNDED':
      return 'warning';
    case 'FAILED':
    case 'REJECTED':
      return 'danger';
    case 'CREATED':
    case 'QUEUED':
    default:
      return 'default';
  }
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  const t = useTranslations('status');

  const variant = getStatusVariant(status);
  let label = status;

  try {
    label = t(status as any);
  } catch {
    label = status;
  }

  return (
    <Badge variant={variant} size={size} className={className}>
      {label}
    </Badge>
  );
}

