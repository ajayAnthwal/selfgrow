'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Eye, UserX, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from '@/features/admin/components/PageHeader';
import { DataTable, ColumnDef } from '@/features/admin/components/DataTable';
import { FilterBar } from '@/features/admin/components/FilterBar';
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  useAdminUsers,
  useAdminUser,
  useUpdateUserStatus,
  AdminUserListItem,
} from '@/features/admin/api/adminApi';
import { useAuth } from '@/features/auth/AuthContext';
import { Spinner } from '@/components/ui/Spinner';
import { formatMoney } from '@/lib/utils/formatMoney';

export default function AdminCustomersPage() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const { user: currentAdmin } = useAuth();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [isActiveFilter, setIsActiveFilter] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Status toggle confirmation
  const [statusTargetUser, setStatusTargetUser] = useState<AdminUserListItem | null>(null);

  const { data, isLoading, isError, refetch } = useAdminUsers({
    page,
    limit: 10,
    search: search.trim() || undefined,
    role: role || undefined,
    isActive: isActiveFilter || undefined,
  });

  const { data: userDetail, isLoading: isLoadingDetail } = useAdminUser(
    selectedUserId || ''
  );

  const updateStatusMutation = useUpdateUserStatus();

  const handleConfirmToggleStatus = async () => {
    if (!statusTargetUser) return;
    await updateStatusMutation.mutateAsync({
      id: statusTargetUser.id,
      isActive: !statusTargetUser.isActive,
    });
    setStatusTargetUser(null);
  };

  const columns: ColumnDef<AdminUserListItem>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (item) => (
        <div>
          <p className="font-medium text-neutral-900 dark:text-neutral-100">{item.name}</p>
          <p className="text-[11px] text-neutral-500">{item.email}</p>
        </div>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      cell: (item) => (
        <Badge variant={item.role === 'ADMIN' ? 'primary' : 'neutral'} size="sm">
          {item.role}
        </Badge>
      ),
    },
    {
      id: 'preferredLanguage',
      header: 'Language',
      cell: (item) => (
        <span className="text-xs uppercase">{item.preferredLanguage}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (item) => (
        <Badge variant={item.isActive ? 'success' : 'danger'} size="sm">
          {item.isActive ? 'Active' : 'Deactivated'}
        </Badge>
      ),
    },
    {
      id: 'counts',
      header: 'Activity',
      cell: (item) => (
        <span className="text-xs text-neutral-500">
          {item._count?.orders ?? 0} orders · {item._count?.attempts ?? 0} attempts
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (item) => {
        const isSelf = currentAdmin?.id === item.id;
        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setSelectedUserId(item.id)}
              className="h-7 px-2 text-xs"
            >
              <Eye className="mr-1 h-3 w-3" />
              View
            </Button>
            <Button
              type="button"
              size="sm"
              variant={item.isActive ? 'danger' : 'primary'}
              disabled={isSelf || updateStatusMutation.isPending}
              onClick={() => setStatusTargetUser(item)}
              className="h-7 px-2 text-xs"
              title={isSelf ? 'Cannot deactivate your own admin account' : undefined}
            >
              {item.isActive ? (
                <>
                  <UserX className="mr-1 h-3 w-3" />
                  Deactivate
                </>
              ) : (
                <>
                  <UserCheck className="mr-1 h-3 w-3" />
                  Activate
                </>
              )}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers & Users"
        description="Inspect registered candidates, manage account statuses, and review their assessment records."
      />

      <FilterBar
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        searchPlaceholder="Search candidates by name or email..."
        filters={[
          {
            id: 'role',
            label: 'Role',
            value: role,
            options: [
              { label: 'All Roles', value: '' },
              { label: 'USER', value: 'USER' },
              { label: 'ADMIN', value: 'ADMIN' },
            ],
          },
          {
            id: 'status',
            label: 'Status',
            value: isActiveFilter,
            options: [
              { label: 'All Statuses', value: '' },
              { label: 'Active Only', value: 'true' },
              { label: 'Deactivated Only', value: 'false' },
            ],
          },
        ]}
        onFilterChange={(id, val) => {
          if (id === 'role') setRole(val);
          if (id === 'status') setIsActiveFilter(val);
          setPage(1);
        }}
        onReset={() => {
          setSearch('');
          setRole('');
          setIsActiveFilter('');
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

      {/* User Detail Drawer / Modal */}
      <Modal
        isOpen={Boolean(selectedUserId)}
        onClose={() => setSelectedUserId(null)}
        title="Candidate Profile & History"
        size="lg"
      >
        {isLoadingDetail || !userDetail ? (
          <div className="flex h-48 items-center justify-center">
            <Spinner size="md" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900/50">
              <div>
                <p className="text-xs text-neutral-500">Name</p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {userDetail.name}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Email</p>
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {userDetail.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Role & Status</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant={userDetail.role === 'ADMIN' ? 'primary' : 'neutral'} size="sm">
                    {userDetail.role}
                  </Badge>
                  <Badge variant={userDetail.isActive ? 'success' : 'danger'} size="sm">
                    {userDetail.isActive ? 'Active' : 'Deactivated'}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Joined</p>
                <p className="text-xs text-neutral-700 dark:text-neutral-300">
                  {new Date(userDetail.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Orders list */}
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Purchased Orders ({userDetail.orders?.length || 0})
              </h4>
              {!userDetail.orders || userDetail.orders.length === 0 ? (
                <p className="text-xs text-neutral-400">No orders placed.</p>
              ) : (
                <div className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
                  {userDetail.orders.map((o: any) => (
                    <div key={o.id} className="flex items-center justify-between p-3 text-xs">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                          {typeof o.product?.name === 'object'
                            ? o.product.name[locale] || o.product.name.en
                            : o.product?.name}
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {formatMoney(o.amountInPaise, { locale })}
                        </span>
                        <StatusBadge status={o.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Attempts list */}
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Assessment Attempts ({userDetail.attempts?.length || 0})
              </h4>
              {!userDetail.attempts || userDetail.attempts.length === 0 ? (
                <p className="text-xs text-neutral-400">No assessment attempts recorded.</p>
              ) : (
                <div className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
                  {userDetail.attempts.map((att: any) => (
                    <div key={att.id} className="flex items-center justify-between p-3 text-xs">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">
                          {att.product?.slug || att.productId}
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Language: {att.language} · Started: {new Date(att.startedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={att.status} />
                        <Link href={`/${locale}/admin/attempts/${att.id}`}>
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            Responses
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(statusTargetUser)}
        onClose={() => setStatusTargetUser(null)}
        onConfirm={handleConfirmToggleStatus}
        title={statusTargetUser?.isActive ? 'Deactivate User Account?' : 'Activate User Account?'}
        description={`Are you sure you want to ${
          statusTargetUser?.isActive ? 'deactivate' : 'activate'
        } ${statusTargetUser?.name} (${statusTargetUser?.email})?`}
        confirmLabel={statusTargetUser?.isActive ? 'Deactivate' : 'Activate'}
        variant={statusTargetUser?.isActive ? 'danger' : 'primary'}
        isLoading={updateStatusMutation.isPending}
      />
    </div>
  );
}

