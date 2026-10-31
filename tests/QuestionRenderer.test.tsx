import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import messages from '../src/messages/en.json';
import { QuestionRenderer } from '../src/features/assessment/components/QuestionRenderer';
import { AssessmentQuestion } from '../src/features/assessment/types';

function renderWithIntl(component: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
}

describe('QuestionRenderer', () => {
  it('renders SINGLE_CHOICE question and emits selected option', () => {
    const singleChoiceQuestion: AssessmentQuestion = {
      id: 'q_1',
      order: 1,
      section: 'Analytical',
      type: 'SINGLE_CHOICE',
      text: 'Which data structure offers O(1) lookup?',
      isRequired: true,
      options: [
        { id: 'opt_1', order: 1, label: 'Hash Table' },
        { id: 'opt_2', order: 2, label: 'Linked List' },
      ],
    };

    const handleChange = vi.fn();

    renderWithIntl(
      <QuestionRenderer
        question={singleChoiceQuestion}
        questionNumber={1}
        value={null}
        onChange={handleChange}
      />
    );

    expect(screen.getByText('Which data structure offers O(1) lookup?')).toBeDefined();
    expect(screen.getByText('Hash Table')).toBeDefined();
    expect(screen.getByText('Linked List')).toBeDefined();

    // Select 'Hash Table'
    fireEvent.click(screen.getByText('Hash Table'));
    expect(handleChange).toHaveBeenCalledWith({
      selectedOptionIds: ['opt_1'],
      textAnswer: undefined,
    });
  });

  it('renders MULTI_CHOICE question and toggles multiple options', () => {
    const multiChoiceQuestion: AssessmentQuestion = {
      id: 'q_2',
      order: 2,
      section: null,
      type: 'MULTI_CHOICE',
      text: 'Select all prime numbers below',
      isRequired: false,
      options: [
        { id: 'opt_2', order: 1, label: '2' },
        { id: 'opt_3', order: 2, label: '3' },
        { id: 'opt_4', order: 3, label: '4' },
      ],
    };

    const handleChange = vi.fn();

    // Already has '2' selected
    renderWithIntl(
      <QuestionRenderer
        question={multiChoiceQuestion}
        questionNumber={2}
        value={{ questionId: 'q_2', selectedOptionIds: ['opt_2'], textAnswer: null }}
        onChange={handleChange}
      />
    );

    // Toggle '3' on
    fireEvent.click(screen.getByText('3'));
    expect(handleChange).toHaveBeenCalledWith({
      selectedOptionIds: ['opt_2', 'opt_3'],
      textAnswer: undefined,
    });

    // Toggle '2' off
    fireEvent.click(screen.getByText('2'));
    expect(handleChange).toHaveBeenCalledWith({
      selectedOptionIds: [],
      textAnswer: undefined,
    });
  });

  it('renders TEXT question and emits live character input', () => {
    const textQuestion: AssessmentQuestion = {
      id: 'q_3',
      order: 3,
      section: 'Written Analysis',
      type: 'TEXT',
      text: 'Explain the difference between optimistic and pessimistic locking.',
      isRequired: true,
      maxLength: 500,
      options: [],
    };

    const handleChange = vi.fn();

    renderWithIntl(
      <QuestionRenderer
        question={textQuestion}
        questionNumber={3}
        value={{ questionId: 'q_3', selectedOptionIds: [], textAnswer: 'Initial text' }}
        onChange={handleChange}
      />
    );

    const textarea = screen.getByPlaceholderText('Type your response here...') as HTMLTextAreaElement;
    expect(textarea.value).toBe('Initial text');

    fireEvent.change(textarea, { target: { value: 'New detailed answer' } });
    expect(handleChange).toHaveBeenCalledWith({
      selectedOptionIds: [],
      textAnswer: 'New detailed answer',
    });
  });
});

