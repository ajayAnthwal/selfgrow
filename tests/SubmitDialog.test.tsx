import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../src/messages/en.json';
import { SubmitDialog } from '../src/features/assessment/components/SubmitDialog';
import { AssessmentQuestion, SavedResponse } from '../src/features/assessment/types';

function renderWithIntl(component: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
}

describe('SubmitDialog', () => {
  const sampleQuestions: AssessmentQuestion[] = [
    {
      id: 'q_1',
      order: 1,
      section: null,
      type: 'SINGLE_CHOICE',
      text: 'Question 1 (Required)',
      isRequired: true,
      options: [{ id: 'opt_1', order: 1, label: 'A' }],
    },
    {
      id: 'q_2',
      order: 2,
      section: null,
      type: 'SINGLE_CHOICE',
      text: 'Question 2 (Optional)',
      isRequired: false,
      options: [{ id: 'opt_2', order: 1, label: 'B' }],
    },
    {
      id: 'q_3',
      order: 3,
      section: null,
      type: 'TEXT',
      text: 'Question 3 (Required)',
      isRequired: true,
      options: [],
    },
  ];

  it('lists missing required questions and disables confirm submit', () => {
    // Only optional question 2 is answered
    const responsesMap = new Map<string, SavedResponse>([
      ['q_2', { questionId: 'q_2', selectedOptionIds: ['opt_2'], textAnswer: null }],
    ]);

    const handleConfirm = vi.fn();
    const handleJump = vi.fn();

    renderWithIntl(
      <SubmitDialog
        isOpen={true}
        onClose={vi.fn()}
        questions={sampleQuestions}
        savedResponses={responsesMap}
        onConfirmSubmit={handleConfirm}
        onJumpToQuestion={handleJump}
        isSubmitting={false}
      />
    );

    // Should indicate missing required questions
    expect(screen.getByText(/The following required question\(s\) have not been answered/i)).toBeDefined();
    expect(screen.getByText(/#1: Question 1 \(Required\)/i)).toBeDefined();
    expect(screen.getByText(/#3: Question 3 \(Required\)/i)).toBeDefined();

    // Confirm button must be disabled
    const submitBtn = screen.getByRole('button', { name: /Confirm & Submit/i });
    expect(submitBtn).toBeDefined();
    expect((submitBtn as HTMLButtonElement).disabled).toBe(true);

    // Clicking jump link invokes jump handler with question index 0
    fireEvent.click(screen.getByText(/#1: Question 1 \(Required\)/i));
    expect(handleJump).toHaveBeenCalledWith(0);
  });

  it('enables submit when all required questions are answered', () => {
    // Both required questions q_1 and q_3 are answered
    const responsesMap = new Map<string, SavedResponse>([
      ['q_1', { questionId: 'q_1', selectedOptionIds: ['opt_1'], textAnswer: null }],
      ['q_3', { questionId: 'q_3', selectedOptionIds: [], textAnswer: 'My essay answer' }],
    ]);

    const handleConfirm = vi.fn();

    renderWithIntl(
      <SubmitDialog
        isOpen={true}
        onClose={vi.fn()}
        questions={sampleQuestions}
        savedResponses={responsesMap}
        onConfirmSubmit={handleConfirm}
        onJumpToQuestion={vi.fn()}
        isSubmitting={false}
      />
    );

    const submitBtn = screen.getByRole('button', { name: /Confirm & Submit/i });
    expect((submitBtn as HTMLButtonElement).disabled).toBe(false);

    fireEvent.click(submitBtn);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });

  it('prevents double submit while isSubmitting is true', () => {
    const responsesMap = new Map<string, SavedResponse>([
      ['q_1', { questionId: 'q_1', selectedOptionIds: ['opt_1'], textAnswer: null }],
      ['q_3', { questionId: 'q_3', selectedOptionIds: [], textAnswer: 'Done' }],
    ]);

    const handleConfirm = vi.fn();

    renderWithIntl(
      <SubmitDialog
        isOpen={true}
        onClose={vi.fn()}
        questions={sampleQuestions}
        savedResponses={responsesMap}
        onConfirmSubmit={handleConfirm}
        onJumpToQuestion={vi.fn()}
        isSubmitting={true}
      />
    );

    // Button shows submitting label and is disabled
    const submitBtn = screen.getByRole('button', { name: /Submitting.../i });
    expect((submitBtn as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(submitBtn);
    expect(handleConfirm).not.toHaveBeenCalled();
  });
});

