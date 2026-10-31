'use client';

import React from 'react';
import { Button } from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      className={`flex items-center justify-between sm:justify-end space-x-2 pt-4 ${className || ''}`}
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        leftIcon={<ChevronLeft className="w-4 h-4" />}
      >
        Previous
      </Button>

      <span className="text-xs text-body px-3 font-medium">
        Page <strong className="text-heading font-semibold">{currentPage}</strong> of{' '}
        <strong className="text-heading font-semibold">{totalPages}</strong>
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        rightIcon={<ChevronRight className="w-4 h-4" />}
      >
        Next
      </Button>
    </nav>
  );
}
