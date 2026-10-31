import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { AttemptStatus } from '../types';

export interface SubmitAttemptResponse {
  id: string;
  status: AttemptStatus;
  submittedAt: string;
  scoreSummary?: any;
}

export function useSubmitAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attemptId: string) => {
      const response = await api.post<SubmitAttemptResponse>(`/attempts/${attemptId}/submit`);
      return response;
    },
    onSuccess: (data, attemptId) => {
      queryClient.invalidateQueries({ queryKey: ['attempt', attemptId] });
    },
  });
}

