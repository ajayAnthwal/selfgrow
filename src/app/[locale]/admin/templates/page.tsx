'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, History, Eye, Copy, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { PageHeader } from '@/features/admin/components/PageHeader';
import { DataTable, ColumnDef } from '@/features/admin/components/DataTable';
import { JsonViewer } from '@/features/admin/components/JsonViewer';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import {
  useAdminTemplates,
  useAdminTemplate,
  useCreateTemplate,
  useCreateTemplateVersion,
  useToggleTemplateActive,
  useAdminAssessments,
  AdminTemplateItem,
} from '@/features/admin/api/adminApi';

const DEFAULT_OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    strengths: { type: 'array', items: { type: 'string' } },
    recommendations: { type: 'array', items: { type: 'string' } },
  },
  required: ['summary', 'strengths', 'recommendations'],
};

export default function AdminTemplatesPage() {
  const t = useTranslations('admin');

  const [page, setPage] = useState(1);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [assessmentId, setAssessmentId] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(
    'You are an expert psychometrician and AI talent evaluator. Generate a rigorous, constructive cognitive assessment diagnostic.'
  );
  const [userPromptTemplate, setUserPromptTemplate] = useState(
    'Candidate: {{candidateName}}\nLanguage: {{language}}\nScores: {{scoreSummary}}\nResponses: {{responses}}'
  );
  const [outputSchemaStr, setOutputSchemaStr] = useState(
    JSON.stringify(DEFAULT_OUTPUT_SCHEMA, null, 2)
  );
  const [jsonError, setJsonError] = useState('');

  const { data, isLoading, isError, refetch } = useAdminTemplates({ page, limit: 10 });
  const { data: assessmentsData } = useAdminAssessments({ page: 1, limit: 50 });
  const { data: templateDetail, isLoading: isLoadingDetail } = useAdminTemplate(
    selectedTemplateId || ''
  );

  const createTemplateMutation = useCreateTemplate();
  const createVersionMutation = useCreateTemplateVersion();
  const toggleActiveMutation = useToggleTemplateActive();

  const placeholderPills = [
    '{{candidateName}}',
    '{{scoreSummary}}',
    '{{responses}}',
    '{{language}}',
    '{{productName}}',
  ];

  const handleInsertPlaceholder = (placeholder: string) => {
    setUserPromptTemplate((prev) => `${prev} ${placeholder}`);
  };

  const validateJson = (str: string): boolean => {
    try {
      JSON.parse(str);
      setJsonError('');
      return true;
    } catch (err: any) {
      setJsonError(`Invalid JSON: ${err.message}`);
      return false;
    }
  };

  const handleOpenNewVersion = (tmpl: AdminTemplateItem) => {
    setSelectedTemplateId(tmpl.id);
    setName(tmpl.name);
    setAssessmentId(tmpl.assessmentId);
    setSystemPrompt(tmpl.systemPrompt);
    setUserPromptTemplate(tmpl.userPromptTemplate);
    setOutputSchemaStr(JSON.stringify(tmpl.outputSchema, null, 2));
    setJsonError('');
    setIsVersionModalOpen(true);
  };

  const handleCreateNewVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplateId || !validateJson(outputSchemaStr)) return;

    await createVersionMutation.mutateAsync({
      id: selectedTemplateId,
      data: {
        systemPrompt,
        userPromptTemplate,
        outputSchema: JSON.parse(outputSchemaStr),
        layout: templateDetail?.layout || {},
      },
    });

    setIsVersionModalOpen(false);
  };

  const handleCreateInitialTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !validateJson(outputSchemaStr)) return;

    await createTemplateMutation.mutateAsync({
      name: name.trim(),
      assessmentId: assessmentId || assessmentsData?.items?.[0]?.id,
      systemPrompt,
      userPromptTemplate,
      outputSchema: JSON.parse(outputSchemaStr),
      layout: { header: 'Standard Diagnostic Report', footer: 'Confidential' },
    });

    setIsCreateModalOpen(false);
  };

  const columns: ColumnDef<AdminTemplateItem>[] = [
    {
      id: 'name',
      header: 'Template Name',
      cell: (item) => (
        <div>
          <p className="font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</p>
          <p className="text-[11px] font-mono text-neutral-500">ID: {item.id.slice(0, 8)}...</p>
        </div>
      ),
    },
    {
      id: 'version',
      header: 'Version',
      cell: (item) => (
        <span className="font-mono text-xs font-semibold">v{item.version}</span>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (item) => (
        <Badge variant={item.isActive ? 'success' : 'neutral'} size="sm">
          {item.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      id: 'updatedAt',
      header: 'Last Updated',
      cell: (item) => (
        <span className="text-xs text-neutral-500">
          {new Date(item.updatedAt).toLocaleDateString()}
        </span>
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
            onClick={() => handleOpenNewVersion(item)}
            className="h-7 px-2 text-xs"
          >
            <History className="mr-1 h-3 w-3" />
            New Version
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setSelectedTemplateId(item.id)}
            className="h-7 px-2 text-xs text-neutral-500"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => toggleActiveMutation.mutate(item.id)}
            className="h-7 px-2 text-xs text-neutral-500"
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
        title="Report Templates & AI Prompts"
        description="Version-controlled LLM prompt templates and output schemas. Existing versions are immutable to guarantee historic reproducibility."
        actions={
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => {
              setName('');
              setAssessmentId(assessmentsData?.items?.[0]?.id || '');
              setOutputSchemaStr(JSON.stringify(DEFAULT_OUTPUT_SCHEMA, null, 2));
              setJsonError('');
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Create Template
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

      {/* Inspect Template Modal */}
      <Modal
        isOpen={Boolean(selectedTemplateId) && !isVersionModalOpen}
        onClose={() => setSelectedTemplateId(null)}
        title={templateDetail ? `${templateDetail.name} (v${templateDetail.version})` : 'Template'}
        size="lg"
      >
        {isLoadingDetail || !templateDetail ? (
          <div className="flex h-48 items-center justify-center">
            <Spinner size="md" />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase text-neutral-500">System Prompt</p>
              <div className="mt-1 rounded-md bg-neutral-50 p-3 text-xs text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                {templateDetail.systemPrompt}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-neutral-500">User Prompt Template</p>
              <div className="mt-1 rounded-md bg-neutral-50 p-3 font-mono text-xs text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
                {templateDetail.userPromptTemplate}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase text-neutral-500">Output JSON Schema</p>
              <div className="mt-1">
                <JsonViewer data={templateDetail.outputSchema} />
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create New Version Modal */}
      <Modal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        title={`Create New Version for ${name}`}
        size="xl"
      >
        <form onSubmit={handleCreateNewVersion} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
              System Prompt
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-neutral-300 p-2.5 text-xs font-mono dark:border-neutral-700 dark:bg-neutral-900"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                User Prompt Template
              </label>
              <span className="text-[11px] text-neutral-400">Click placeholder to insert:</span>
            </div>

            <div className="flex flex-wrap gap-1 pb-1">
              {placeholderPills.map((pill) => (
                <button
                  type="button"
                  key={pill}
                  onClick={() => handleInsertPlaceholder(pill)}
                  className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[11px] text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  {pill}
                </button>
              ))}
            </div>

            <textarea
              value={userPromptTemplate}
              onChange={(e) => setUserPromptTemplate(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-neutral-300 p-2.5 text-xs font-mono dark:border-neutral-700 dark:bg-neutral-900"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                Structured Output Schema (JSON Schema)
              </label>
              {jsonError && (
                <span className="text-xs font-medium text-red-500">{jsonError}</span>
              )}
            </div>
            <textarea
              value={outputSchemaStr}
              onChange={(e) => {
                setOutputSchemaStr(e.target.value);
                validateJson(e.target.value);
              }}
              rows={7}
              className={`w-full rounded-md border p-2.5 text-xs font-mono dark:bg-neutral-900 ${
                jsonError ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
              }`}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsVersionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={Boolean(jsonError)}
              isLoading={createVersionMutation.isPending}
            >
              Publish New Version
            </Button>
          </div>
        </form>
      </Modal>

      {/* Create Initial Template Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Report Template"
        size="xl"
      >
        <form onSubmit={handleCreateInitialTemplate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                Template Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cognitive Diagnostic Executive"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                Linked Assessment
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
              System Prompt
            </label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-neutral-300 p-2.5 text-xs font-mono dark:border-neutral-700 dark:bg-neutral-900"
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
                User Prompt Template
              </label>
              <span className="text-[11px] text-neutral-400">Click placeholder to insert:</span>
            </div>
            <div className="flex flex-wrap gap-1 pb-1">
              {placeholderPills.map((pill) => (
                <button
                  type="button"
                  key={pill}
                  onClick={() => handleInsertPlaceholder(pill)}
                  className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-[11px] text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  {pill}
                </button>
              ))}
            </div>
            <textarea
              value={userPromptTemplate}
              onChange={(e) => setUserPromptTemplate(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-neutral-300 p-2.5 text-xs font-mono dark:border-neutral-700 dark:bg-neutral-900"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-neutral-700 dark:text-neutral-300">
              Output Schema (JSON)
            </label>
            <textarea
              value={outputSchemaStr}
              onChange={(e) => {
                setOutputSchemaStr(e.target.value);
                validateJson(e.target.value);
              }}
              rows={6}
              className={`w-full rounded-md border p-2.5 text-xs font-mono dark:bg-neutral-900 ${
                jsonError ? 'border-red-500' : 'border-neutral-300 dark:border-neutral-700'
              }`}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
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
              disabled={Boolean(jsonError)}
              isLoading={createTemplateMutation.isPending}
            >
              Create Template
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

