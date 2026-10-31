'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';

// ==================== DASHBOARD ====================
export interface DashboardSummaryResponse {
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    paidOrders: number;
    failedOrders: number;
    freeReports: number;
    paidReports: number;
    newUsers: number;
    pendingReviewReports: number;
    failedReports: number;
  };
  revenueTrend: Array<{ date: string; amount: number }>;
  userTrend: Array<{ date: string; count: number }>;
  revenueByProduct: Array<{
    productId: string;
    title: string;
    revenue: number;
    orderCount: number;
  }>;
}

export function useAdminDashboard(params: { from?: string; to?: string }) {
  return useQuery<DashboardSummaryResponse>({
    queryKey: ['admin', 'dashboard', params],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (params.from) q.set('from', params.from);
      if (params.to) q.set('to', params.to);
      return api.get<DashboardSummaryResponse>(`/admin/dashboard/summary?${q.toString()}`);
    },
    refetchInterval: (query) => {
      // Pause refetching when window/tab is hidden
      if (typeof document !== 'undefined' && document.hidden) return false;
      return 30000;
    },
    refetchIntervalInBackground: false,
  });
}

// ==================== ORDERS ====================
export interface AdminOrderListItem {
  id: string;
  userId: string;
  productId: string;
  attemptId: string;
  amountInPaise: number;
  currency: string;
  status: 'CREATED' | 'PAID' | 'FAILED' | 'REFUNDED';
  razorpayOrderId: string | null;
  createdAt: string;
  paidAt: string | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
  product: {
    id: string;
    name: any;
    slug: string;
  };
  report?: {
    id: string;
    status: string;
  } | null;
}

export interface AdminOrdersResponse {
  items: AdminOrderListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useAdminOrders(params: {
  page?: number;
  limit?: number;
  status?: string;
  productId?: string;
  search?: string;
  from?: string;
  to?: string;
}) {
  return useQuery<AdminOrdersResponse>({
    queryKey: ['admin', 'orders', params],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (params.page) q.set('page', String(params.page));
      if (params.limit) q.set('limit', String(params.limit));
      if (params.status) q.set('status', params.status);
      if (params.productId) q.set('productId', params.productId);
      if (params.search) q.set('search', params.search);
      if (params.from) q.set('from', params.from);
      if (params.to) q.set('to', params.to);
      return api.get<AdminOrdersResponse>(`/admin/orders?${q.toString()}`);
    },
  });
}

export interface AdminOrderDetail extends AdminOrderListItem {
  payments: Array<{
    id: string;
    razorpayPaymentId: string;
    amountInPaise: number;
    status: string;
    method: string | null;
    failureReason: string | null;
    createdAt: string;
  }>;
}

export function useAdminOrder(id: string) {
  return useQuery<AdminOrderDetail>({
    queryKey: ['admin', 'orders', id],
    queryFn: async () => {
      return api.get<AdminOrderDetail>(`/admin/orders/${id}`);
    },
    enabled: Boolean(id),
  });
}

// ==================== USERS ====================
export interface AdminUserListItem {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  preferredLanguage: 'EN' | 'HI';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    orders: number;
    attempts: number;
  };
}

export interface AdminUsersResponse {
  items: AdminUserListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useAdminUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: string;
}) {
  return useQuery<AdminUsersResponse>({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (params.page) q.set('page', String(params.page));
      if (params.limit) q.set('limit', String(params.limit));
      if (params.search) q.set('search', params.search);
      if (params.role) q.set('role', params.role);
      if (params.isActive !== undefined && params.isActive !== '') q.set('isActive', params.isActive);
      return api.get<AdminUsersResponse>(`/admin/users?${q.toString()}`);
    },
  });
}

export interface AdminUserDetail extends AdminUserListItem {
  orders: any[];
  attempts: any[];
}

export function useAdminUser(id: string) {
  return useQuery<AdminUserDetail>({
    queryKey: ['admin', 'users', id],
    queryFn: async () => {
      return api.get<AdminUserDetail>(`/admin/users/${id}`);
    },
    enabled: Boolean(id),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return api.patch<{ user: AdminUserListItem }>(`/admin/users/${id}/status`, { isActive });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', variables.id] });
    },
  });
}

// ==================== ATTEMPTS ====================
export interface AdminAttemptListItem {
  id: string;
  userId: string;
  productId: string;
  assessmentId: string;
  assessmentVersion: number;
  language: 'EN' | 'HI';
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED';
  startedAt: string;
  expiresAt: string | null;
  submittedAt: string | null;
  scoreSummary: any;
  user: {
    id: string;
    name: string;
    email: string;
  };
  product: {
    id: string;
    name: any;
    slug: string;
  };
  assessment?: {
    id: string;
    title: any;
  };
}

export interface AdminAttemptsResponse {
  items: AdminAttemptListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useAdminAttempts(params: {
  page?: number;
  limit?: number;
  status?: string;
  productId?: string;
  userId?: string;
}) {
  return useQuery<AdminAttemptsResponse>({
    queryKey: ['admin', 'attempts', params],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (params.page) q.set('page', String(params.page));
      if (params.limit) q.set('limit', String(params.limit));
      if (params.status) q.set('status', params.status);
      if (params.productId) q.set('productId', params.productId);
      if (params.userId) q.set('userId', params.userId);
      return api.get<AdminAttemptsResponse>(`/admin/attempts?${q.toString()}`);
    },
  });
}

export interface CandidateResponseItem {
  questionId: string;
  questionText: { en: string; hi?: string } | string;
  sectionTitle?: { en: string; hi?: string } | string;
  dimension?: string;
  questionType: string;
  selectedOptionIds: string[];
  chosenOptions?: Array<{
    id: string;
    label: { en: string; hi?: string } | string;
    score: number;
  }>;
  textAnswer?: string | null;
  timeTakenMs?: number | null;
}

export interface AdminAttemptDetail extends AdminAttemptListItem {
  responses: CandidateResponseItem[];
}

export function useAdminAttempt(id: string) {
  return useQuery<AdminAttemptDetail>({
    queryKey: ['admin', 'attempts', id],
    queryFn: async () => {
      return api.get<AdminAttemptDetail>(`/admin/attempts/${id}`);
    },
    enabled: Boolean(id),
  });
}

// ==================== ASSESSMENTS ====================
export interface AdminAssessmentItem {
  id: string;
  slug: string;
  kind: string;
  title: { en: string; hi: string };
  description: { en: string; hi: string };
  timeLimitSeconds: number | null;
  version: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  questions?: any[];
  _count?: {
    questions: number;
    attempts: number;
  };
}

export function useAdminAssessments(params?: { page?: number; limit?: number }) {
  return useQuery<{ items: AdminAssessmentItem[]; total: number }>({
    queryKey: ['admin', 'assessments', params],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (params?.page) q.set('page', String(params.page));
      if (params?.limit) q.set('limit', String(params.limit));
      return api.get<{ items: AdminAssessmentItem[]; total: number }>(
        `/admin/assessments?${q.toString()}`
      );
    },
  });
}

export function useAdminAssessment(id: string) {
  return useQuery<AdminAssessmentItem>({
    queryKey: ['admin', 'assessments', id],
    queryFn: async () => {
      return api.get<AdminAssessmentItem>(`/admin/assessments/${id}`);
    },
    enabled: Boolean(id),
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      return api.post<AdminAssessmentItem>('/admin/assessments', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'assessments'] });
    },
  });
}

export function useUpdateAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return api.patch<AdminAssessmentItem>(`/admin/assessments/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'assessments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'assessments', variables.id] });
    },
  });
}

export function useToggleAssessmentActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return api.patch<AdminAssessmentItem>(`/admin/assessments/${id}/toggle-active`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'assessments'] });
    },
  });
}

export function useCreateQuestion(assessmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      return api.post(`/admin/assessments/${assessmentId}/questions`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'assessments', assessmentId] });
    },
  });
}

export function useReorderQuestions(assessmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (questionOrders: Array<{ id: string; order: number }>) => {
      return api.patch(`/admin/assessments/${assessmentId}/questions/reorder`, {
        questionOrders,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'assessments', assessmentId] });
    },
  });
}

export function useUpdateQuestion(assessmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return api.patch(`/admin/questions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'assessments', assessmentId] });
    },
  });
}

export function useDeactivateQuestion(assessmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return api.patch(`/admin/questions/${id}/deactivate`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'assessments', assessmentId] });
    },
  });
}

// ==================== PRODUCTS ====================
export interface AdminProductItem {
  id: string;
  slug: string;
  name: { en: string; hi: string };
  description: { en: string; hi: string };
  priceInPaise: number;
  assessmentId: string;
  reportTemplateId: string;
  autoRelease: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  assessment?: {
    id: string;
    title: any;
  };
  reportTemplate?: {
    id: string;
    name: string;
  };
}

export function useAdminProducts(params?: { page?: number; limit?: number }) {
  return useQuery<{ items: AdminProductItem[]; total: number }>({
    queryKey: ['admin', 'products', params],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (params?.page) q.set('page', String(params.page));
      if (params?.limit) q.set('limit', String(params.limit));
      return api.get<{ items: AdminProductItem[]; total: number }>(`/admin/products?${q.toString()}`);
    },
  });
}

export function useAdminProduct(id: string) {
  return useQuery<AdminProductItem>({
    queryKey: ['admin', 'products', id],
    queryFn: async () => {
      return api.get<AdminProductItem>(`/admin/products/${id}`);
    },
    enabled: Boolean(id),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      return api.post<AdminProductItem>('/admin/products', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return api.patch<AdminProductItem>(`/admin/products/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'products', variables.id] });
    },
  });
}

export function useToggleProductActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return api.patch<AdminProductItem>(`/admin/products/${id}/toggle-active`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

// ==================== REPORT TEMPLATES ====================
export interface AdminTemplateItem {
  id: string;
  name: string;
  assessmentId: string;
  version: number;
  isActive: boolean;
  systemPrompt: string;
  userPromptTemplate: string;
  outputSchema: any;
  layout: any;
  createdAt: string;
  updatedAt: string;
}

export function useAdminTemplates(params?: { page?: number; limit?: number }) {
  return useQuery<{ items: AdminTemplateItem[]; total: number }>({
    queryKey: ['admin', 'templates', params],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (params?.page) q.set('page', String(params.page));
      if (params?.limit) q.set('limit', String(params.limit));
      return api.get<{ items: AdminTemplateItem[]; total: number }>(
        `/admin/report-templates?${q.toString()}`
      );
    },
  });
}

export function useAdminTemplate(id: string) {
  return useQuery<AdminTemplateItem>({
    queryKey: ['admin', 'templates', id],
    queryFn: async () => {
      return api.get<AdminTemplateItem>(`/admin/report-templates/${id}`);
    },
    enabled: Boolean(id),
  });
}

export function useCreateTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      return api.post<AdminTemplateItem>('/admin/report-templates', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] });
    },
  });
}

export function useCreateTemplateVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return api.post<AdminTemplateItem>(`/admin/report-templates/${id}/versions`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] });
    },
  });
}

export function useToggleTemplateActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return api.patch<AdminTemplateItem>(`/admin/report-templates/${id}/toggle-active`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'templates'] });
    },
  });
}

// ==================== REPORTS REVIEW WORKFLOW ====================
export interface AdminReportListItem {
  id: string;
  orderId: string;
  status: 'QUEUED' | 'GENERATING' | 'GENERATED' | 'PENDING_REVIEW' | 'RELEASED' | 'REJECTED' | 'FAILED';
  version: number;
  pdfUrl?: string | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
  order?: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
    product: {
      id: string;
      name: any;
    };
    attemptId: string;
  };
}

export interface AdminReportsResponse {
  items: AdminReportListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useAdminReports(params: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  return useQuery<AdminReportsResponse>({
    queryKey: ['admin', 'reports', params],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (params.page) q.set('page', String(params.page));
      if (params.limit) q.set('limit', String(params.limit));
      if (params.status && params.status !== 'ALL') q.set('status', params.status);
      return api.get<AdminReportsResponse>(`/admin/reports?${q.toString()}`);
    },
  });
}

export interface ReportRevision {
  id: string;
  version: number;
  content: any;
  editedBy: string;
  reason?: string | null;
  createdAt: string;
}

export interface AdminReportDetail extends AdminReportListItem {
  content: any;
  revisions: ReportRevision[];
  template?: {
    id: string;
    outputSchema: any;
  };
}

export function useAdminReport(id: string) {
  return useQuery<AdminReportDetail>({
    queryKey: ['admin', 'reports', id],
    queryFn: async () => {
      return api.get<AdminReportDetail>(`/admin/reports/${id}`);
    },
    enabled: Boolean(id),
  });
}

export function useUpdateReportContent(reportId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ content, reason }: { content: any; reason?: string }) => {
      return api.patch(`/admin/reports/${reportId}/content`, { content, reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports', reportId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
  });
}

export function useReleaseReport(reportId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      return api.post(`/admin/reports/${reportId}/release`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports', reportId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
  });
}

export function useRegenerateReport(reportId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reason }: { reason: string }) => {
      return api.post(`/admin/reports/${reportId}/regenerate`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports', reportId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
  });
}

export function useRejectReport(reportId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ reason }: { reason: string }) => {
      return api.post(`/admin/reports/${reportId}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports', reportId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
  });
}

// ==================== AUDIT LOGS ====================
export interface AuditLogItem {
  id: string;
  actorId: string | null;
  actorEmail?: string | null;
  entityType: string;
  entityId: string;
  action: string;
  before: any;
  after: any;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export function useAdminAuditLogs(params: {
  page?: number;
  limit?: number;
  actorId?: string;
  entityType?: string;
  action?: string;
  from?: string;
  to?: string;
}) {
  return useQuery<{ items: AuditLogItem[]; total: number; page: number; totalPages: number }>({
    queryKey: ['admin', 'audit-logs', params],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (params.page) q.set('page', String(params.page));
      if (params.limit) q.set('limit', String(params.limit));
      if (params.actorId) q.set('actorId', params.actorId);
      if (params.entityType) q.set('entityType', params.entityType);
      if (params.action) q.set('action', params.action);
      if (params.from) q.set('from', params.from);
      if (params.to) q.set('to', params.to);
      return api.get(`/admin/audit-logs?${q.toString()}`);
    },
  });
}

// ==================== SYSTEM STATUS ====================
export interface SystemStatusResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  queue: {
    backlog: number;
    failedJobs: number;
    lastSuccessfulReportAt: string | null;
  };
  database: {
    connected: boolean;
    poolStatus: string;
  };
  aiProvider: {
    healthy: boolean;
    model: string;
  };
}

export function useAdminSystemStatus() {
  return useQuery<SystemStatusResponse>({
    queryKey: ['admin', 'system-status'],
    queryFn: async () => {
      return api.get<SystemStatusResponse>('/admin/system/status');
    },
    refetchInterval: 15000,
  });
}

