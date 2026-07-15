/**
 * AssessmentRunner.integration.test.tsx
 *
 * Full end-to-end integration test for AssessmentRunner.
 * Simulates a complete run: consent → all 104 questions → completion.
 *
 * Strategy:
 *  1. Render <AssessmentRunner />.
 *  2. Tick both consent checkboxes.
 *  3. Click "Begin assessment".
 *  4. For each of the 104 questions in sequence, simulate selecting the
 *     first available option (first Likert button or first Scenario button).
 *     Selecting an option auto-advances via handleAnswer → goNext.
 *  5. Assert the completion screen is visible.
 *
 * The test reads question data from the same QUESTIONS export used by
 * the component — no inline data duplication.
 *
 * @testing-library/react + Vitest (jsdom environment).
 * This test exercises real state transitions; it may take a few seconds
 * to simulate all 104 interactions.
 */

import { render, screen, within, waitFor } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import AssessmentRunner from '../src/views/AssessmentRunner'
import { QUESTIONS } from '../src/data/loadQuestions'

// ── Helpers ──────────────────────────────────────────────────

/**
 * Clicks the first selectable answer button for the currently-rendered
 * question. For LIKERT5 questions the first option button carries
 * role="radio". For SINGLE_SELECT (scenario) questions it is also
 * role="radio". In both cases we query by role inside the active
 * question area.
 */
function answerCurrentQuestion() {
  // The question area wraps the active question.
  const questionArea = screen.getByTestId('question-area')
  // Both LikertQuestion and ScenarioQuestion render option buttons with
  // role="radio".
  const radioButtons = within(questionArea).getAllByRole('radio')
  if (radioButtons.length === 0) {
    throw new Error('No radio buttons found in the current question area')
  }
  fireEvent.click(radioButtons[0])
}

// ─────────────────────────────────────────────────────────────
// Integration test
// ─────────────────────────────────────────────────────────────

describe('AssessmentRunner integration', () => {
  it('transitions consent → questions → complete after answering all 104 questions', async () => {
    render(<AssessmentRunner />)

    // ── Step 1: Consent gate is shown first ─────────────────

    // The consent gate wraps everything in role="main" per spec.
    expect(screen.getByRole('main')).toBeInTheDocument()

    const ageCheckbox = screen.getByRole('checkbox', {
      name: /i am 16 or older/i,
    })
    const purposeCheckbox = screen.getByRole('checkbox', {
      name: /self-reflection tool, not a diagnostic or admissions instrument/i,
    })
    const beginButton = screen.getByRole('button', {
      name: /begin assessment/i,
    })

    // Gate: button disabled before consent
    expect(beginButton).toBeDisabled()

    // ── Step 2: Check both consent boxes ────────────────────

    fireEvent.click(ageCheckbox)
    fireEvent.click(purposeCheckbox)
    expect(beginButton).not.toBeDisabled()

    // ── Step 3: Begin the assessment ────────────────────────

    fireEvent.click(beginButton)

    // Consent gate should be gone; first question should be visible.
    expect(screen.queryByRole('button', { name: /begin assessment/i })).toBeNull()
    expect(screen.getByTestId('question-area')).toBeInTheDocument()

    // ── Step 4: Answer all 104 questions ────────────────────

    // The number of questions is determined by loadQuestions.ts — we
    // assert the count here to make the test self-documenting.
    expect(QUESTIONS.length).toBe(104)

    const DOMAIN_NUMERALS: Record<string, string> = {
      SAR: 'I', ELCA: 'II', IHOR: 'III', AMB: 'IV', ECPC: 'V', ERP: 'VI', CSR: 'VII', RST: 'VIII'
    }
    const QUESTION_LABELS = QUESTIONS.map((q, idx) => {
      let count = 1;
      for (let i = 0; i < idx; i++) {
        if (QUESTIONS[i].domain === q.domain) count++;
      }
      return `${DOMAIN_NUMERALS[q.domain] || '?'}.${count}`;
    });

    for (let i = 0; i < QUESTIONS.length; i++) {
      // Confirm the question counter reflects the current position.
      const counter = screen.getByTestId('question-counter')
      expect(counter).toHaveAttribute(
        'aria-label',
        `Question ${QUESTION_LABELS[i]}`,
      )

      // Answer the question (clicks the first option).
      answerCurrentQuestion()

      if (i < QUESTIONS.length - 1) {
        fireEvent.click(screen.getByRole('button', { name: /next/i }))
      } else {
        fireEvent.click(screen.getByRole('button', { name: /submit/i }))
      }
    }

    // ── Step 5: Assert completion state ─────────────────────

    // The question area must be gone.
    expect(screen.queryByTestId('question-area')).toBeNull()
    expect(screen.queryByTestId('question-counter')).toBeNull()

    // After answering all 104 questions the scoring pipeline runs
    // synchronously (useMemo) and AssessmentRunner renders ReportView.
    await waitFor(() => {
      expect(screen.getByTestId('report-view')).toBeInTheDocument()
    })

    // The report must contain the canonical heading.
    expect(
      screen.getByRole('heading', { level: 1, name: /your medical readiness report/i }),
    ).toBeInTheDocument()

    // Domain scores section must be present.
    expect(screen.getByTestId('domains-section')).toBeInTheDocument()

    // Profile summary must be rendered.
    expect(screen.getByTestId('profile-summary')).toBeInTheDocument()
  }, 10000)
})
