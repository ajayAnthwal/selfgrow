export type QuestionType = 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'TEXT';

export interface QuestionOption {
  id: string;
  order: number;
  label: string;
}

export interface AssessmentQuestion {
  id: string;
  order: number;
  section: string | null;
  type: QuestionType;
  text: string;
  isRequired: boolean;
  maxLength?: number;
  options: QuestionOption[];
}

export interface SavedResponse {
  questionId: string;
  selectedOptionIds: string[];
  textAnswer: string | null;
  answeredAt?: string;
}

export type AttemptStatus = 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED';

export interface DetailedAttempt {
  id: string;
  productId: string;
  assessmentId: string;
  status: AttemptStatus;
  language: 'EN' | 'HI';
  startedAt: string;
  expiresAt: string | null;
  remainingTimeSeconds: number | null;
  submittedAt: string | null;
  questions: AssessmentQuestion[];
  savedResponses: SavedResponse[];
  scoreSummary?: any;
}

export interface AnswerItem {
  questionId: string;
  selectedOptionIds?: string[];
  textAnswer?: string;
  timeTakenMs?: number;
}

export type SaveStatus = 'saved' | 'saving' | 'offline' | 'error';

