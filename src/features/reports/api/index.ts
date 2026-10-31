import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import {
  ReportItem,
  DownloadReportResponse,
  PaginatedReportsResponse,
} from '../types';

export function useReport(
  reportId: string,
  options?: {
    enabled?: boolean;
    refetchInterval?: number | false | ((query: any) => number | false);
  }
) {
  return useQuery<ReportItem>({
    queryKey: ['report', reportId],
    queryFn: async () => {
      const response = await api.get<{ report: ReportItem }>(`/reports/${reportId}`);
      return response.report;
    },
    enabled: options?.enabled !== undefined ? options.enabled : Boolean(reportId),
    refetchInterval: options?.refetchInterval,
  });
}

export function useReports(params: { page?: number; limit?: number } = {}) {
  const { page = 1, limit = 10 } = params;

  return useQuery<PaginatedReportsResponse>({
    queryKey: ['reports', { page, limit }],
    queryFn: async () => {
      const response = await api.get<PaginatedReportsResponse>('/reports', {
        params: { page, limit },
      });
      return response;
    },
  });
}

export function useDownloadReport() {
  return useMutation({
    mutationFn: async (reportId: string) => {
      const response = await api.get<DownloadReportResponse>(`/reports/${reportId}/download`);
      return response;
    },
  });
}

