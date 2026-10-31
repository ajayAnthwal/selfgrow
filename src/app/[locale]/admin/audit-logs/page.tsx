'use client';

import React, { useState } from 'react';
import { Eye, ShieldAlert } from 'lucide-react';
import { PageHeader } from '@/features/admin/components/PageHeader';
import { DataTable, ColumnDef } from '@/features/admin/components/DataTable';
import { FilterBar } from '@/features/admin/components/FilterBar';
import { JsonViewer } from '@/features/admin/components/JsonViewer';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAdminAuditLogs, AuditLogItem } from '@/features/admin/api/adminApi';

export default function AdminAuditLogsPage() {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState('');
  const [entityType, setEntityType] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const { data, isLoading, isError, refetch } = useAdminAuditLogs({
    page,
    limit: 10,
    action: action || undefined,
    entityType: entityType || undefined,
  });

  const columns: ColumnDef<AuditLogItem>[] = [
    {
      id: 'createdAt',
      header: 'Timestamp',
      cell: (item) => (
        <span className="text-xs text-neutral-500">
          {new Date(item.createdAt).toLocaleString()}
        </span>
      ),
    },
    {
      id: 'actor',
      header: 'Actor',
      cell: (item) => (
        <div>
          <p className="font-medium text-neutral-900 dark:text-neutral-100">
            {item.actorEmail || item.actorId || 'System Worker'}
          </p>
          {item.ipAddress && <p className="text-[10px] text-neutral-400">IP: {item.ipAddress}</p>}
        </div>
      ),
    },
    {
      id: 'action',
      header: 'Action',
      cell: (item) => (
        <Badge variant="neutral" size="sm" className="font-mono text-[11px]">
          {item.action}
        </Badge>
      ),
    },
    {
      id: 'entity',
      header: 'Entity',
      cell: (item) => (
        <div>
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
            {item.entityType}
          </span>
          <p className="font-mono text-[10px] text-neutral-400">ID: {item.entityId.slice(0, 8)}...</p>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (item) => (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setSelectedLog(item)}
          className="h-7 px-2 text-xs"
        >
          <Eye className="mr-1 h-3 w-3" />
          Diff / Payload
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Immutable administrative and operational audit trail for compliance, security tracking, and state mutation audits."
      />

      <FilterBar
        filters={[
          {
            id: 'entityType',
            label: 'Entity',
            value: entityType,
            options: [
              { label: 'All Entities', value: '' },
              { label: 'User', value: 'User' },
              { label: 'Order', value: 'Order' },
              { label: 'Report', value: 'Report' },
              { label: 'Assessment', value: 'Assessment' },
              { label: 'Product', value: 'Product' },
            ],
          },
          {
            id: 'action',
            label: 'Action',
            value: action,
            options: [
              { label: 'All Actions', value: '' },
              { label: 'CREATE', value: 'CREATE' },
              { label: 'UPDATE', value: 'UPDATE' },
              { label: 'STATUS_CHANGE', value: 'STATUS_CHANGE' },
              { label: 'RELEASE', value: 'RELEASE' },
              { label: 'REGENERATE', value: 'REGENERATE' },
              { label: 'REJECT', value: 'REJECT' },
            ],
          },
        ]}
        onFilterChange={(id, val) => {
          if (id === 'entityType') setEntityType(val);
          if (id === 'action') setAction(val);
          setPage(1);
        }}
        onReset={() => {
          setAction('');
          setEntityType('');
          setPage(1);
        }}
      />

      <DataTable
        columns={columns}
        data={data?.items || []}
        total={data?.total || 0}
        page={page}
        pageSize={10}
        onPageChange={setPage}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
      />

      {/* Before / After Inspection Modal */}
      <Modal
        isOpen={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        title={`Audit Event: ${selectedLog?.action} on ${selectedLog?.entityType}`}
        size="xl"
      >
        {selectedLog && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-neutral-50 p-3 text-xs dark:bg-neutral-900/50">
              <div>
                <span className="text-neutral-500">Actor:</span>{' '}
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {selectedLog.actorEmail || selectedLog.actorId || 'System'}
                </span>
              </div>
              <div>
                <span className="text-neutral-500">Timestamp:</span>{' '}
                <span className="text-neutral-700 dark:text-neutral-300">
                  {new Date(selectedLog.createdAt).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-neutral-500">Entity ID:</span>{' '}
                <span className="font-mono text-neutral-700 dark:text-neutral-300">
                  {selectedLog.entityId}
                </span>
              </div>
              <div>
                <span className="text-neutral-500">IP Address:</span>{' '}
                <span className="font-mono text-neutral-700 dark:text-neutral-300">
                  {selectedLog.ipAddress || 'Internal'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-neutral-500">
                  State Before
                </h4>
                {selectedLog.before ? (
                  <JsonViewer data={selectedLog.before} title="Before Mutation" />
                ) : (
                  <div className="rounded-lg border border-neutral-200 p-6 text-center text-xs text-neutral-400 dark:border-neutral-800">
                    No prior state (Creation event).
                  </div>
                )}
              </div>

              <div>
                <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-neutral-500">
                  State After
                </h4>
                {selectedLog.after ? (
                  <JsonViewer data={selectedLog.after} title="After Mutation" />
                ) : (
                  <div className="rounded-lg border border-neutral-200 p-6 text-center text-xs text-neutral-400 dark:border-neutral-800">
                    No state after (Deletion event).
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

