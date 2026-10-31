import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { DetailedAttempt } from '../types';

export interface StartAttemptPayload {
  productId: string;
  language?: 'EN' | 'HI';
}

export function useStartAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: StartAttemptPayload) => {
      const response = await api.post<{ attempt: DetailedAttempt }>('/attempts', payload);
      return response.attempt;
    },
    onSuccess: (attempt) => {
      queryClient.setQueryData(['attempt', attempt.id], attempt);
      queryClient.invalidateQueries({ queryKey: ['attempt', attempt.id] });
    },
  });
}

