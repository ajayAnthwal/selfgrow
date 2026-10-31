'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Plus, Edit, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/features/admin/components/PageHeader';
import { DataTable, ColumnDef } from '@/features/admin/components/DataTable';
import { LocalizedTextField, LocalizedValue } from '@/features/admin/components/LocalizedTextField';
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Badge } from '@/components/ui/Badge';
import {
  useAdminProducts,
  useAdminAssessments,
  useAdminTemplates,
  useCreateProduct,
  useUpdateProduct,
  useToggleProductActive,
  AdminProductItem,
} from '@/features/admin/api/adminApi';
import { rupeesToPaise, paiseToRupees } from '@/lib/utils/money';
import { formatMoney } from '@/lib/utils/formatMoney';

export default function AdminProductsPage() {
  const t = useTranslations('admin.products');
  const locale = useLocale();

  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProductItem | null>(null);

  // Form State
  const [slug, setSlug] = useState('');
  const [name, setName] = useState<LocalizedValue>({ en: '', hi: '' });
  const [description, setDescription] = useState<LocalizedValue>({ en: '', hi: '' });
  const [rupeesInput, setRupeesInput] = useState<number | ''>(499);
  const [assessmentId, setAssessmentId] = useState('');
  const [reportTemplateId, setReportTemplateId] = useState('');
  const [autoRelease, setAutoRelease] = useState(false);

  // Price Change Confirmation Modal
  const [isPriceConfirmOpen, setIsPriceConfirmOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<any>(null);

  const { data, isLoading, isError, refetch } = useAdminProducts({ page, limit: 10 });
  const { data: assessmentsData } = useAdminAssessments({ page: 1, limit: 50 });
  const { data: templatesData } = useAdminTemplates({ page: 1, limit: 50 });

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const toggleActiveMutation = useToggleProductActive();

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setSlug('');
    setName({ en: '', hi: '' });
    setDescription({ en: '', hi: '' });
    setRupeesInput(499);
    setAssessmentId(assessmentsData?.items?.[0]?.id || '');
    setReportTemplateId(templatesData?.items?.[0]?.id || '');
    setAutoRelease(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: AdminProductItem) => {
    setEditingProduct(product);
    setSlug(product.slug);
    setName(typeof product.name === 'object' ? product.name : { en: product.name, hi: '' });
    setDescription(
      typeof product.description === 'object'
        ? product.description
        : { en: product.description, hi: '' }
    );
    setRupeesInput(paiseToRupees(product.priceInPaise));
    setAssessmentId(product.assessmentId);
    setReportTemplateId(product.reportTemplateId);
    setAutoRelease(product.autoRelease);
    setIsModalOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.en.trim() || !slug.trim()) return;

    const priceInPaise = rupeesToPaise(rupeesInput === '' ? 0 : rupeesInput);

    const payload = {
      slug: slug.trim(),
      name,
      description,
      priceInPaise,
      assessmentId,
      reportTemplateId,
      autoRelease,
    };

    // If editing and price changed, show price change confirmation dialog
    if (editingProduct && editingProduct.priceInPaise !== priceInPaise) {
      setPendingPayload(payload);
      setIsPriceConfirmOpen(true);
      return;
    }

    if (editingProduct) {
      await updateProductMutation.mutateAsync({
        id: editingProduct.id,
        data: payload,
      });
    } else {
      await createProductMutation.mutateAsync(payload);
    }

    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleConfirmPriceChange = async () => {
    if (!editingProduct || !pendingPayload) return;
    await updateProductMutation.mutateAsync({
      id: editingProduct.id,
      data: pendingPayload,
    });
    setIsPriceConfirmOpen(false);
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const columns: ColumnDef<AdminProductItem>[] = [
    {
      id: 'name',
      header: 'Product Name',
      cell: (item) => (
        <div>
          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
            {typeof item.name === 'object'
              ? item.name[locale as 'en' | 'hi'] || item.name.en
              : item.name}
          </p>
          <p className="text-[11px] font-mono text-neutral-500">{item.slug}</p>
        </div>
      ),
    },
    {
      id: 'price',
      header: 'Price',
      cell: (item) => (
        <span className="font-semibold text-neutral-900 dark:text-neutral-100">
          {formatMoney(item.priceInPaise, { locale })}
        </span>
      ),
    },
    {
      id: 'autoRelease',
      header: 'Auto-Release',
      cell: (item) => (
        <Badge variant={item.autoRelease ? 'success' : 'neutral'} size="sm">
          {item.autoRelease ? 'Instant Release' : 'Manual Review'}
        </Badge>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (item) => (
        <Badge variant={item.isActive ? 'success' : 'neutral'} size="sm">
          {item.isActive ? 'Active' : 'Draft'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (item) => (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleOpenEdit(item)}
            className="h-7 px-2 text-xs"
          >
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => toggleActiveMutation.mutate(item.id)}
            className="h-7 px-2 text-xs text-neutral-500"
            title="Toggle Active State"
          >
            {item.isActive ? (
              <ToggleRight className="h-4 w-4 text-emerald-600" />
            ) : (
              <ToggleLeft className="h-4 w-4 text-neutral-400" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description="Configure diagnostic packages, pricing in rupees (stored in paise), linked benchmarks, and auto-release rules."
        actions={
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Create Product
          </Button>
        }
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

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Create Product'}
        size="lg"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
              Slug <span className="text-red-500">*</span>
            </label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. cognitive-aptitude-pro"
              disabled={Boolean(editingProduct)}
              required
            />
          </div>

          <LocalizedTextField
            label="Product Name"
            value={name}
            onChange={setName}
            required
          />

          <LocalizedTextField
            label="Product Description"
            value={description}
            onChange={setDescription}
            multiline
            rows={2}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                {t('priceInRupees')} <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                step="0.01"
                value={rupeesInput}
                onChange={(e) =>
                  setRupeesInput(e.target.value === '' ? '' : Number(e.target.value))
                }
                placeholder="499 (0 for Free)"
                required
              />
              <p className="text-[11px] text-neutral-400">
                Stored as {rupeesToPaise(rupeesInput === '' ? 0 : rupeesInput)} paise.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                {t('linkedAssessment')}
              </label>
              <Select
                value={assessmentId}
                onChange={(e) => setAssessmentId(e.target.value)}
                options={
                  assessmentsData?.items?.map((a) => ({
                    label: typeof a.title === 'object' ? a.title.en : a.title,
                    value: a.id,
                  })) || []
                }
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
              {t('linkedTemplate')}
            </label>
            <Select
              value={reportTemplateId}
              onChange={(e) => setReportTemplateId(e.target.value)}
              options={
                templatesData?.items?.map((tmpl) => ({
                  label: `${tmpl.name} (v${tmpl.version})`,
                  value: tmpl.id,
                })) || []
              }
            />
          </div>

          <div className="pt-2">
            <Checkbox
              id="autoReleaseToggle"
              label={t('autoRelease')}
              checked={autoRelease}
              onChange={(e) => setAutoRelease(e.target.checked)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createProductMutation.isPending || updateProductMutation.isPending}
            >
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Price Change Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isPriceConfirmOpen}
        onClose={() => setIsPriceConfirmOpen(false)}
        onConfirm={handleConfirmPriceChange}
        title="Confirm Price Change"
        description="Changing the product price impacts future customer checkouts. Existing submitted attempts will retain current pricing."
        confirmLabel="Update Price"
        variant="primary"
        isLoading={updateProductMutation.isPending}
      />
    </div>
  );
}

