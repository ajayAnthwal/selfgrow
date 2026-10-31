'use client';

import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { cn } from '@/lib/utils/cn';
import { useTranslations } from 'next-intl';

export interface ColumnDef<T> {
  id: string;
  header: React.ReactNode;
  cell?: (item: T) => React.ReactNode;
  accessorKey?: keyof T;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange?: (field: string) => void;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  total,
  page,
  pageSize,
  onPageChange,
  sortBy,
  sortOrder,
  onSortChange,
  isLoading = false,
  isError = false,
  onRetry,
  emptyTitle,
  emptyDescription,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const t = useTranslations('admin.table');
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className={cn('space-y-4', className)}>
      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400">
            <tr>
              {columns.map((column) => {
                const isCurrentSort = sortBy === column.id;
                return (
                  <th
                    key={column.id}
                    scope="col"
                    className={cn('px-4 py-3', column.className)}
                  >
                    {column.sortable && onSortChange ? (
                      <button
                        type="button"
                        onClick={() => onSortChange(column.id)}
                        className="flex items-center gap-1 font-semibold uppercase tracking-wider hover:text-neutral-900 dark:hover:text-neutral-100"
                      >
                        {column.header}
                        {isCurrentSort ? (
                          sortOrder === 'asc' ? (
                            <ArrowUp className="h-3 w-3 text-neutral-900 dark:text-neutral-100" />
                          ) : (
                            <ArrowDown className="h-3 w-3 text-neutral-900 dark:text-neutral-100" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-neutral-400" />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Spinner size="md" />
                    <span className="text-xs text-neutral-500">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <p className="text-sm font-medium text-red-500">Failed to load records.</p>
                  {onRetry && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={onRetry}
                      className="mt-2 text-xs"
                    >
                      Retry
                    </Button>
                  )}
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8">
                  <EmptyState
                    title={emptyTitle || t('noResults')}
                    description={emptyDescription}
                  />
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr
                  key={item.id || rowIndex}
                  onClick={() => onRowClick?.(item)}
                  className={cn(
                    'transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
                    onRowClick ? 'cursor-pointer' : ''
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.id}
                      className={cn(
                        'px-4 py-3 text-xs text-neutral-700 dark:text-neutral-300',
                        column.className
                      )}
                    >
                      {column.cell
                        ? column.cell(item)
                        : column.accessorKey
                        ? String(item[column.accessorKey] ?? '—')
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && !isError && total > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 px-1 sm:flex-row">
          <p className="text-xs text-neutral-500">
            {t('pageOf', { page, totalPages })} ({total} total)
          </p>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
