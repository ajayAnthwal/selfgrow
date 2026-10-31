import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../src/messages/en.json';
import { DataTable, ColumnDef } from '../src/features/admin/components/DataTable';

interface TestRecord {
  id: string;
  name: string;
  role: string;
}

const columns: ColumnDef<TestRecord>[] = [
  { id: 'name', header: 'Name', accessorKey: 'name', sortable: true },
  { id: 'role', header: 'Role', accessorKey: 'role' },
];

const mockData: TestRecord[] = [
  { id: '1', name: 'Alice Admin', role: 'ADMIN' },
  { id: '2', name: 'Bob Candidate', role: 'USER' },
];

function renderTable(props: any) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <DataTable {...props} />
    </NextIntlClientProvider>
  );
}

describe('Admin DataTable', () => {
  it('renders records properly with headers and cell values', () => {
    renderTable({
      columns,
      data: mockData,
      total: 2,
      page: 1,
      pageSize: 10,
      onPageChange: vi.fn(),
    });

    expect(screen.getByText('Alice Admin')).toBeDefined();
    expect(screen.getByText('Bob Candidate')).toBeDefined();
    expect(screen.getByText('ADMIN')).toBeDefined();
    expect(screen.getByText('USER')).toBeDefined();
  });

  it('triggers onSortChange when clicking sortable header', () => {
    const onSortChange = vi.fn();
    renderTable({
      columns,
      data: mockData,
      total: 2,
      page: 1,
      pageSize: 10,
      onPageChange: vi.fn(),
      sortBy: 'name',
      sortOrder: 'asc',
      onSortChange,
    });

    const headerBtn = screen.getByRole('button', { name: /name/i });
    fireEvent.click(headerBtn);

    expect(onSortChange).toHaveBeenCalledWith('name');
  });

  it('renders empty state when data array is empty', () => {
    renderTable({
      columns,
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
      onPageChange: vi.fn(),
      emptyTitle: 'No records found',
    });

    expect(screen.getByText('No records found')).toBeDefined();
  });

  it('triggers onPageChange when clicking next page button', () => {
    const onPageChange = vi.fn();
    renderTable({
      columns,
      data: mockData,
      total: 25,
      page: 1,
      pageSize: 10,
      onPageChange,
    });

    const nextBtn = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextBtn);

    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});

