'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import {
  Plus,
  Edit,
  ArrowUp,
  ArrowDown,
  Trash2,
  AlertTriangle,
  FileQuestion,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { PageHeader } from '@/features/admin/components/PageHeader';
import { DataTable, ColumnDef } from '@/features/admin/components/DataTable';
import { LocalizedTextField, LocalizedValue } from '@/features/admin/components/LocalizedTextField';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import {
  useAdminAssessments,
  useAdminAssessment,
  useCreateAssessment,
  useUpdateAssessment,
  useToggleAssessmentActive,
  useCreateQuestion,
  useReorderQuestions,
  useUpdateQuestion,
  useDeactivateQuestion,
  AdminAssessmentItem,
} from '@/features/admin/api/adminApi';

export default function AdminAssessmentsPage() {
  const t = useTranslations('admin.assessments');
  const locale = useLocale();

  const [page, setPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);

  // Assessment Form State
  const [formSlug, setFormSlug] = useState('');
  const [formKind, setFormKind] = useState('OBJECTIVE');
  const [formTitle, setFormTitle] = useState<LocalizedValue>({ en: '', hi: '' });
  const [formDesc, setFormDesc] = useState<LocalizedValue>({ en: '', hi: '' });
  const [formTimeLimit, setFormTimeLimit] = useState<number | ''>(1800);

  // Question Form State (for adding a question)
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [qText, setQText] = useState<LocalizedValue>({ en: '', hi: '' });
  const [qType, setQType] = useState('SINGLE_CHOICE');
  const [qSection, setQSection] = useState('General');
  const [qDimension, setQDimension] = useState('');
  const [qOptions, setQOptions] = useState<
    Array<{ id: string; label: LocalizedValue; score: number }>
  >([
    { id: '1', label: { en: 'Option A', hi: 'विकल्प A' }, score: 1 },
    { id: '2', label: { en: 'Option B', hi: 'विकल्प B' }, score: 0 },
  ]);

  const { data, isLoading, isError, refetch } = useAdminAssessments({ page, limit: 10 });

  const { data: assessmentDetail, isLoading: isLoadingDetail } = useAdminAssessment(
    selectedAssessmentId || ''
  );

  const createAssessmentMutation = useCreateAssessment();
  const updateAssessmentMutation = useUpdateAssessment();
  const toggleActiveMutation = useToggleAssessmentActive();

  const createQuestionMutation = useCreateQuestion(selectedAssessmentId || '');
  const reorderQuestionsMutation = useReorderQuestions(selectedAssessmentId || '');
  const updateQuestionMutation = useUpdateQuestion(selectedAssessmentId || '');
  const deactivateQuestionMutation = useDeactivateQuestion(selectedAssessmentId || '');

  const handleOpenCreate = () => {
    setFormSlug('');
    setFormKind('OBJECTIVE');
    setFormTitle({ en: '', hi: '' });
    setFormDesc({ en: '', hi: '' });
    setFormTimeLimit(1800);
    setIsCreateModalOpen(true);
  };

  const handleSaveAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.en.trim() || !formSlug.trim()) return;

    await createAssessmentMutation.mutateAsync({
      slug: formSlug.trim(),
      kind: formKind,
      title: formTitle,
      description: formDesc,
      timeLimitSeconds: formTimeLimit ? Number(formTimeLimit) : null,
    });
    setIsCreateModalOpen(false);
  };

  const handleAddOption = () => {
    setQOptions([
      ...qOptions,
      {
        id: String(Date.now()),
        label: { en: '', hi: '' },
        score: 0,
      },
    ]);
  };

  const handleRemoveOption = (idx: number) => {
    setQOptions(qOptions.filter((_, i) => i !== idx));
  };

  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssessmentId || !qText.en.trim()) return;

    const payload = {
      text: qText,
      type: qType,
      section: qSection.trim() || 'General',
      dimension: qDimension.trim() || undefined,
      options:
        qType === 'TEXT'
          ? []
          : qOptions.map((opt) => ({
              label: opt.label,
              score: Number(opt.score),
            })),
    };

    if (editingQuestionId) {
      await updateQuestionMutation.mutateAsync({
        id: editingQuestionId,
        data: payload,
      });
    } else {
      await createQuestionMutation.mutateAsync(payload);
    }

    setIsQuestionModalOpen(false);
    setEditingQuestionId(null);
  };

  const handleMoveQuestion = async (idx: number, direction: 'up' | 'down') => {
    if (!assessmentDetail?.questions) return;
    const questions = [...assessmentDetail.questions];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= questions.length) return;

    // Swap
    const temp = questions[idx];
    questions[idx] = questions[targetIdx];
    questions[targetIdx] = temp;

    const questionOrders = questions.map((q, i) => ({
      id: q.id,
      order: i + 1,
    }));

    await reorderQuestionsMutation.mutateAsync(questionOrders);
  };

  const columns: ColumnDef<AdminAssessmentItem>[] = [
    {
      id: 'title',
      header: 'Benchmark Title',
      cell: (item) => (
        <div>
          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
            {typeof item.title === 'object'
              ? item.title[locale as 'en' | 'hi'] || item.title.en
              : item.title}
          </p>
          <p className="text-[11px] font-mono text-neutral-500">{item.slug}</p>
        </div>
      ),
    },
    {
      id: 'kind',
      header: 'Kind',
      cell: (item) => <Badge variant="neutral" size="sm">{item.kind}</Badge>,
    },
    {
      id: 'version',
      header: 'Version',
      cell: (item) => (
        <span className="font-mono text-xs font-semibold">v{item.version}</span>
      ),
    },
    {
      id: 'timeLimit',
      header: 'Time Limit',
      cell: (item) => (
        <span className="text-xs text-neutral-600 dark:text-neutral-400">
          {item.timeLimitSeconds ? `${Math.round(item.timeLimitSeconds / 60)} mins` : 'Untimed'}
        </span>
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
            onClick={() => setSelectedAssessmentId(item.id)}
            className="h-7 px-2 text-xs"
          >
            <Edit className="mr-1 h-3 w-3" />
            Questions & Edit
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

  const hasExistingAttempts = (assessmentDetail?._count?.attempts ?? 0) > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description="Design cognitive frameworks, maintain question banks, and configure assessment schema."
        actions={
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Create Assessment
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

      {/* Assessment Question & Version Editor Modal */}
      <Modal
        isOpen={Boolean(selectedAssessmentId)}
        onClose={() => setSelectedAssessmentId(null)}
        title={
          assessmentDetail
            ? `Assessment: ${
                typeof assessmentDetail.title === 'object'
                  ? assessmentDetail.title.en
                  : assessmentDetail.title
              } (v${assessmentDetail.version})`
            : 'Assessment Details'
        }
        size="xl"
      >
        {isLoadingDetail || !assessmentDetail ? (
          <div className="flex h-48 items-center justify-center">
            <Spinner size="md" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Version Notice Warning Banner */}
            {hasExistingAttempts && (
              <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600" />
                <p className="text-xs leading-relaxed">{t('newVersionNotice')}</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Question Bank ({assessmentDetail.questions?.length || 0})
                </h4>
                <p className="text-xs text-neutral-500">
                  Ordered sequential questions with localized options and scoring values.
                </p>
              </div>

              <Button
                type="button"
                size="sm"
                variant="primary"
                onClick={() => {
                  setEditingQuestionId(null);
                  setQText({ en: '', hi: '' });
                  setQType('SINGLE_CHOICE');
                  setQSection('General');
                  setQDimension('');
                  setQOptions([
                    { id: '1', label: { en: 'Option A', hi: 'विकल्प A' }, score: 1 },
                    { id: '2', label: { en: 'Option B', hi: 'विकल्प B' }, score: 0 },
                  ]);
                  setIsQuestionModalOpen(true);
                }}
                className="text-xs"
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                {t('addQuestion')}
              </Button>
            </div>

            {/* Questions List */}
            {!assessmentDetail.questions || assessmentDetail.questions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-neutral-300 p-8 text-center text-xs text-neutral-400 dark:border-neutral-700">
                No questions created yet. Click Add Question to build the test framework.
              </div>
            ) : (
              <div className="space-y-2.5">
                {assessmentDetail.questions.map((q: any, idx: number) => (
                  <div
                    key={q.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-neutral-200 bg-white p-3.5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                        {q.order ?? idx + 1}
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                            {q.type}
                          </span>
                          <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                            {q.section || 'General'}
                          </span>
                          {q.dimension && (
                            <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                              Dim: {q.dimension}
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                          {typeof q.text === 'object' ? q.text.en : q.text}
                        </p>
                        {typeof q.text === 'object' && q.text.hi && (
                          <p className="text-xs text-neutral-500">{q.text.hi}</p>
                        )}

                        {q.options && q.options.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {q.options.map((opt: any, oi: number) => (
                              <span
                                key={oi}
                                className="rounded bg-neutral-50 px-2 py-0.5 text-[11px] text-neutral-700 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700"
                              >
                                {typeof opt.label === 'object' ? opt.label.en : opt.label} ({opt.score} pts)
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Controls & Actions */}
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMoveQuestion(idx, 'up')}
                        disabled={idx === 0}
                        className="h-7 w-7 p-0"
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMoveQuestion(idx, 'down')}
                        disabled={!assessmentDetail.questions || idx === assessmentDetail.questions.length - 1}
                        className="h-7 w-7 p-0"
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingQuestionId(q.id);
                          setQText(
                            typeof q.text === 'object' ? q.text : { en: q.text, hi: '' }
                          );
                          setQType(q.type);
                          setQSection(q.section || 'General');
                          setQDimension(q.dimension || '');
                          setQOptions(
                            (q.options || []).map((o: any, i: number) => ({
                              id: String(i),
                              label:
                                typeof o.label === 'object'
                                  ? o.label
                                  : { en: o.label, hi: '' },
                              score: o.score ?? 0,
                            }))
                          );
                          setIsQuestionModalOpen(true);
                        }}
                        className="h-7 w-7 p-0 text-neutral-500 hover:text-neutral-900"
                        title="Edit Question"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => deactivateQuestionMutation.mutate(q.id)}
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                        title="Deactivate Question"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create Assessment Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Assessment Benchmark"
        size="lg"
      >
        <form onSubmit={handleSaveAssessment} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                Slug <span className="text-red-500">*</span>
              </label>
              <Input
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                placeholder="e.g. cognitive-aptitude-v1"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                Kind
              </label>
              <Select
                value={formKind}
                onChange={(e) => setFormKind(e.target.value)}
                options={[
                  { label: 'OBJECTIVE', value: 'OBJECTIVE' },
                  { label: 'SUBJECTIVE', value: 'SUBJECTIVE' },
                  { label: 'MIXED', value: 'MIXED' },
                ]}
              />
            </div>
          </div>

          <LocalizedTextField
            label="Assessment Title"
            value={formTitle}
            onChange={setFormTitle}
            required
          />

          <LocalizedTextField
            label="Assessment Description"
            value={formDesc}
            onChange={setFormDesc}
            multiline
            rows={2}
          />

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
              Time Limit (in seconds)
            </label>
            <Input
              type="number"
              value={formTimeLimit}
              onChange={(e) =>
                setFormTimeLimit(e.target.value ? Number(e.target.value) : '')
              }
              placeholder="1800 (30 minutes) or leave empty for untimed"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createAssessmentMutation.isPending}
            >
              Create Assessment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add / Edit Question Modal */}
      <Modal
        isOpen={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        title={editingQuestionId ? 'Edit Question' : 'Add New Question'}
        size="lg"
      >
        <form onSubmit={handleSaveQuestion} className="space-y-4">
          <LocalizedTextField
            label="Question Text"
            value={qText}
            onChange={setQText}
            multiline
            rows={2}
            required
          />

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                Type
              </label>
              <Select
                value={qType}
                onChange={(e) => setQType(e.target.value)}
                options={[
                  { label: 'SINGLE_CHOICE', value: 'SINGLE_CHOICE' },
                  { label: 'MULTI_CHOICE', value: 'MULTI_CHOICE' },
                  { label: 'TEXT', value: 'TEXT' },
                ]}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                Section
              </label>
              <Input
                value={qSection}
                onChange={(e) => setQSection(e.target.value)}
                placeholder="e.g. Logical Reasoning"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                Dimension
              </label>
              <Input
                value={qDimension}
                onChange={(e) => setQDimension(e.target.value)}
                placeholder="e.g. Critical Thinking"
              />
            </div>
          </div>

          {/* Options Editor */}
          {qType !== 'TEXT' && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Options & Scores
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddOption}
                  className="h-7 text-xs"
                >
                  <Plus className="mr-1 h-3 w-3" /> Add Option
                </Button>
              </div>

              <div className="space-y-3">
                {qOptions.map((opt, i) => (
                  <div
                    key={opt.id || i}
                    className="flex items-start gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-2.5 dark:border-neutral-800 dark:bg-neutral-900/40"
                  >
                    <div className="flex-1">
                      <LocalizedTextField
                        label={`Option ${i + 1}`}
                        value={opt.label}
                        onChange={(lbl) => {
                          const updated = [...qOptions];
                          updated[i].label = lbl;
                          setQOptions(updated);
                        }}
                      />
                    </div>
                    <div className="w-20 space-y-1">
                      <span className="text-[11px] font-semibold text-neutral-500">Score</span>
                      <Input
                        type="number"
                        value={opt.score}
                        onChange={(e) => {
                          const updated = [...qOptions];
                          updated[i].score = Number(e.target.value);
                          setQOptions(updated);
                        }}
                        className="h-9 text-xs"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOption(i)}
                      className="mt-6 h-8 w-8 p-0 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsQuestionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createQuestionMutation.isPending || updateQuestionMutation.isPending}
            >
              Save Question
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
