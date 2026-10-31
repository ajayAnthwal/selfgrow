import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { DetailedAttempt } from '../types';

export function useAttempt(attemptId: string) {
  return useQuery<DetailedAttempt>({
    queryKey: ['attempt', attemptId],
    queryFn: async () => {
      const response = await api.get<{ attempt: DetailedAttempt }>(`/attempts/${attemptId}`);
      return response.attempt;
    },
    enabled: Boolean(attemptId),
    refetchOnWindowFocus: true, // Re-sync on focus as required in specification
    refetchOnReconnect: true,
    staleTime: 10 * 1000,
  });
}

