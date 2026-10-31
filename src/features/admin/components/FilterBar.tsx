'use client';

import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useTranslations } from 'next-intl';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
}

interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  onFilterChange?: (filterId: string, value: string) => void;
  onReset?: () => void;
  actions?: React.ReactNode;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters = [],
  onFilterChange,
  onReset,
  actions,
}: FilterBarProps) {
  const t = useTranslations('admin.table');

  const hasActiveFilters =
    Boolean(searchValue) || filters.some((f) => Boolean(f.value));

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        {onSearchChange && (
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
            <Input
              value={searchValue || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder || t('search')}
              className="h-9 pl-9 text-xs"
            />
          </div>
        )}

        {filters.map((filter) => (
          <div key={filter.id} className="min-w-[140px]">
            <Select
              value={filter.value || ''}
              onChange={(e) => onFilterChange?.(filter.id, e.target.value)}
              options={filter.options}
              className="h-9 text-xs"
            />
          </div>
        ))}

        {hasActiveFilters && onReset && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={onReset}
            className="h-9 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>

      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

