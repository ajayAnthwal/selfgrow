import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { AnswerItem } from '../types';

export interface SaveAnswersPayload {
  attemptId: string;
  answers: AnswerItem[];
}

export function useSaveAnswers() {
  return useMutation({
    mutationFn: async ({ attemptId, answers }: SaveAnswersPayload) => {
      const response = await api.put<{ savedCount: number }>(`/attempts/${attemptId}/answers`, {
        answers,
      });
      return response;
    },
  });
}

