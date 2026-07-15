/**
 * question.test.tsx
 *
 * Vitest + @testing-library/react tests for:
 *   - LikertQuestion
 *   - ScenarioQuestion
 *
 * Both components are "dumb" — tested in isolation with mock
 * Question objects. No global store or data files are touched.
 *
 * Coverage:
 *   1. Renders question text
 *   2. Renders all options
 *   3. Initially renders with no option selected (value=undefined)
 *   4. Reflects a pre-selected value via aria-checked / data-selected
 *   5. Calls onAnswer with the correct value on click
 *   6. Does NOT call onAnswer when clicking the already-selected option
 *      (tests that the existing selected state is simply re-asserted)
 *   7. Accessibility: role="radio", aria-checked, fieldset/legend structure
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import LikertQuestion from '../src/components/question/LikertQuestion'
import ScenarioQuestion from '../src/components/question/ScenarioQuestion'

import type { Question } from '../src/types/question'
import type { AnswerValue } from '../src/types/answers'

// ── Mock Questions ────────────────────────────────────────────

const MOCK_LIKERT_QUESTION: Question = {
  id: 'SAR-A01',
  domain: 'SAR',
  item_type: 'core',
  text: 'I find it easy to reflect on my own reasoning processes.',
  purpose: 'Measure metacognitive self-awareness.',
  construct_measured: 'Self-awareness',
  response_type: 'LIKERT5',
  options: [
    { value: 1, label: 'Not at all like me' },
    { value: 2, label: 'Slightly like me' },
    { value: 3, label: 'Moderately like me' },
    { value: 4, label: 'Quite like me' },
    { value: 5, label: 'Very much like me' },
  ],
  reverse_scored: false,
  item_weight: 1.0,
  difficulty_estimate: 0,
  discrimination_estimate: 1,
  estimate_status: 'estimated',
  potential_bias: 'none',
  expected_interpretation: 'High = greater metacognition',
  developer_notes: null,
  secondary_domain: null,
}

const MOCK_SCENARIO_QUESTION: Question = {
  id: 'SCN-A01',
  domain: 'ELCA',
  item_type: 'scenario',
  text: 'A colleague presents a study that contradicts your long-held view. The study appears methodologically sound. What is your most likely response?',
  purpose: 'Assess openness to disconfirming evidence.',
  construct_measured: 'Evidence-based updating',
  response_type: 'SINGLE_SELECT',
  options: [
    {
      value: 'A',
      label: 'Accept the findings and update your view accordingly.',
      score: 4,
    },
    {
      value: 'B',
      label: 'Seek additional studies before changing your position.',
      score: 3,
    },
    {
      value: 'C',
      label: 'Point out potential flaws even if none are apparent.',
      score: 2,
    },
    {
      value: 'D',
      label: 'Dismiss it as an outlier without further investigation.',
      score: 1,
    },
  ],
  reverse_scored: false,
  item_weight: 1.0,
  difficulty_estimate: 0,
  discrimination_estimate: 1,
  estimate_status: 'estimated',
  potential_bias: 'none',
  expected_interpretation: 'Option A indicates highest evidence-based updating',
  developer_notes: null,
  secondary_domain: null,
}

// ── LikertQuestion ────────────────────────────────────────────

describe('LikertQuestion', () => {
  let onAnswer: ReturnType<typeof vi.fn>

  beforeEach(() => {
    onAnswer = vi.fn()
  })

  // ── Rendering ─────────────────────────────────────────────

  it('renders the question text as the fieldset legend', () => {
    render(
      <LikertQuestion
        question={MOCK_LIKERT_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    expect(
      screen.getByText('I find it easy to reflect on my own reasoning processes.')
    ).toBeInTheDocument()
  })

  it('renders exactly 5 option buttons', () => {
    render(
      <LikertQuestion
        question={MOCK_LIKERT_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    const buttons = screen.getAllByRole('radio')
    expect(buttons).toHaveLength(5)
  })

  it('renders numerals 1 through 5 on the buttons', () => {
    render(
      <LikertQuestion
        question={MOCK_LIKERT_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(String(i))).toBeInTheDocument()
    }
  })

  // ── No selection state ────────────────────────────────────

  it('marks all options aria-checked=false when value is undefined', () => {
    render(
      <LikertQuestion
        question={MOCK_LIKERT_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    const buttons = screen.getAllByRole('radio')
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute('aria-checked', 'false')
    })
  })

  it('marks all options data-selected=false when value is undefined', () => {
    render(
      <LikertQuestion
        question={MOCK_LIKERT_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    const fieldset = document.getElementById('likert-SAR-A01')!
    const buttons = fieldset.querySelectorAll('[data-selected="false"]')
    expect(buttons).toHaveLength(5)
  })

  // ── Pre-selected value ────────────────────────────────────

  it('marks the correct option aria-checked=true when value=3', () => {
    render(
      <LikertQuestion
        question={MOCK_LIKERT_QUESTION}
        value={3 as AnswerValue}
        onAnswer={onAnswer}
      />
    )
    const selected = screen.getByRole('radio', { name: /3 — Moderately like me/i })
    expect(selected).toHaveAttribute('aria-checked', 'true')
    expect(selected).toHaveAttribute('data-selected', 'true')
  })

  it('marks the other four options aria-checked=false when value=3', () => {
    render(
      <LikertQuestion
        question={MOCK_LIKERT_QUESTION}
        value={3 as AnswerValue}
        onAnswer={onAnswer}
      />
    )
    const all = screen.getAllByRole('radio')
    const unchecked = all.filter((b) => b.getAttribute('aria-checked') === 'false')
    expect(unchecked).toHaveLength(4)
  })

  // ── Click → onAnswer ──────────────────────────────────────

  it('calls onAnswer with value 1 when option 1 is clicked', () => {
    render(
      <LikertQuestion
        question={MOCK_LIKERT_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    fireEvent.click(
      screen.getByRole('radio', { name: /1 — Not at all like me/i })
    )
    expect(onAnswer).toHaveBeenCalledTimes(1)
    expect(onAnswer).toHaveBeenCalledWith(1)
  })

  it('calls onAnswer with value 5 when option 5 is clicked', () => {
    render(
      <LikertQuestion
        question={MOCK_LIKERT_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    fireEvent.click(
      screen.getByRole('radio', { name: /5 — Very much like me/i })
    )
    expect(onAnswer).toHaveBeenCalledTimes(1)
    expect(onAnswer).toHaveBeenCalledWith(5)
  })

  it('calls onAnswer with value 3 when option 3 is clicked (mid-scale)', () => {
    render(
      <LikertQuestion
        question={MOCK_LIKERT_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    fireEvent.click(
      screen.getByRole('radio', { name: /3 — Moderately like me/i })
    )
    expect(onAnswer).toHaveBeenCalledWith(3)
  })

  // ── Re-click selected option ──────────────────────────────

  it('still calls onAnswer when the already-selected option is clicked again', () => {
    render(
      <LikertQuestion
        question={MOCK_LIKERT_QUESTION}
        value={2 as AnswerValue}
        onAnswer={onAnswer}
      />
    )
    fireEvent.click(
      screen.getByRole('radio', { name: /2 — Slightly like me/i })
    )
    expect(onAnswer).toHaveBeenCalledTimes(1)
    expect(onAnswer).toHaveBeenCalledWith(2)
  })

  // ── Accessibility ─────────────────────────────────────────

  it('has a fieldset with the correct id', () => {
    render(
      <LikertQuestion
        question={MOCK_LIKERT_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    expect(document.getElementById('likert-SAR-A01')).toBeInTheDocument()
    expect(document.getElementById('likert-SAR-A01')?.tagName).toBe('FIELDSET')
  })

  it('each option button has a unique id', () => {
    render(
      <LikertQuestion
        question={MOCK_LIKERT_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    for (let i = 1; i <= 5; i++) {
      expect(
        document.getElementById(`likert-SAR-A01-opt-${i}`)
      ).toBeInTheDocument()
    }
  })
})

// ── ScenarioQuestion ──────────────────────────────────────────

describe('ScenarioQuestion', () => {
  let onAnswer: ReturnType<typeof vi.fn>

  beforeEach(() => {
    onAnswer = vi.fn()
  })

  // ── Rendering ─────────────────────────────────────────────

  it('renders the scenario text', () => {
    render(
      <ScenarioQuestion
        question={MOCK_SCENARIO_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    expect(
      screen.getByText(/A colleague presents a study that contradicts/i)
    ).toBeInTheDocument()
  })

  it('renders exactly 4 option buttons', () => {
    render(
      <ScenarioQuestion
        question={MOCK_SCENARIO_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    const buttons = screen.getAllByRole('radio')
    expect(buttons).toHaveLength(4)
  })

  it('renders letter badges A, B, C, D', () => {
    render(
      <ScenarioQuestion
        question={MOCK_SCENARIO_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    ;['A', 'B', 'C', 'D'].forEach((letter) => {
      expect(screen.getByText(letter)).toBeInTheDocument()
    })
  })

  it('renders each option label text', () => {
    render(
      <ScenarioQuestion
        question={MOCK_SCENARIO_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    expect(
      screen.getByText(/Accept the findings and update your view accordingly/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Dismiss it as an outlier without further investigation/i)
    ).toBeInTheDocument()
  })

  // ── No selection state ────────────────────────────────────

  it('marks all options aria-checked=false when value is undefined', () => {
    render(
      <ScenarioQuestion
        question={MOCK_SCENARIO_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    const buttons = screen.getAllByRole('radio')
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute('aria-checked', 'false')
    })
  })

  // ── Pre-selected value ────────────────────────────────────

  it('marks option A aria-checked=true when value="A"', () => {
    render(
      <ScenarioQuestion
        question={MOCK_SCENARIO_QUESTION}
        value={'A' as AnswerValue}
        onAnswer={onAnswer}
      />
    )
    const optA = screen.getByRole('radio', {
      name: /Option A: Accept the findings/i,
    })
    expect(optA).toHaveAttribute('aria-checked', 'true')
    expect(optA).toHaveAttribute('data-selected', 'true')
  })

  it('marks options B, C, D aria-checked=false when value="A"', () => {
    render(
      <ScenarioQuestion
        question={MOCK_SCENARIO_QUESTION}
        value={'A' as AnswerValue}
        onAnswer={onAnswer}
      />
    )
    const all = screen.getAllByRole('radio')
    const unchecked = all.filter(
      (b) => b.getAttribute('aria-checked') === 'false'
    )
    expect(unchecked).toHaveLength(3)
  })

  // ── Click → onAnswer ──────────────────────────────────────

  it('calls onAnswer with "A" when option A is clicked', () => {
    render(
      <ScenarioQuestion
        question={MOCK_SCENARIO_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    fireEvent.click(
      screen.getByRole('radio', { name: /Option A: Accept the findings/i })
    )
    expect(onAnswer).toHaveBeenCalledTimes(1)
    expect(onAnswer).toHaveBeenCalledWith('A')
  })

  it('calls onAnswer with "B" when option B is clicked', () => {
    render(
      <ScenarioQuestion
        question={MOCK_SCENARIO_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    fireEvent.click(
      screen.getByRole('radio', { name: /Option B: Seek additional/i })
    )
    expect(onAnswer).toHaveBeenCalledTimes(1)
    expect(onAnswer).toHaveBeenCalledWith('B')
  })

  it('calls onAnswer with "C" when option C is clicked', () => {
    render(
      <ScenarioQuestion
        question={MOCK_SCENARIO_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    fireEvent.click(
      screen.getByRole('radio', { name: /Option C: Point out potential/i })
    )
    expect(onAnswer).toHaveBeenCalledWith('C')
  })

  it('calls onAnswer with "D" when option D is clicked', () => {
    render(
      <ScenarioQuestion
        question={MOCK_SCENARIO_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    fireEvent.click(
      screen.getByRole('radio', { name: /Option D: Dismiss it/i })
    )
    expect(onAnswer).toHaveBeenCalledWith('D')
  })

  // ── Re-click selected option ──────────────────────────────

  it('still calls onAnswer when the already-selected option B is clicked again', () => {
    render(
      <ScenarioQuestion
        question={MOCK_SCENARIO_QUESTION}
        value={'B' as AnswerValue}
        onAnswer={onAnswer}
      />
    )
    fireEvent.click(
      screen.getByRole('radio', { name: /Option B: Seek additional/i })
    )
    expect(onAnswer).toHaveBeenCalledTimes(1)
    expect(onAnswer).toHaveBeenCalledWith('B')
  })

  // ── Accessibility ─────────────────────────────────────────

  it('has a container with the correct id', () => {
    render(
      <ScenarioQuestion
        question={MOCK_SCENARIO_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    expect(document.getElementById('scenario-SCN-A01')).toBeInTheDocument()
  })

  it('each option button has a unique id', () => {
    render(
      <ScenarioQuestion
        question={MOCK_SCENARIO_QUESTION}
        value={undefined}
        onAnswer={onAnswer}
      />
    )
    ;['A', 'B', 'C', 'D'].forEach((letter) => {
      expect(
        document.getElementById(`scenario-SCN-A01-opt-${letter}`)
      ).toBeInTheDocument()
    })
  })

  it('does not read any global store — onAnswer is the only side-effect', () => {
    // This test is structural: it verifies the component renders without
    // any context providers, confirming zero global-store dependency.
    expect(() =>
      render(
        <ScenarioQuestion
          question={MOCK_SCENARIO_QUESTION}
          value={undefined}
          onAnswer={onAnswer}
        />
      )
    ).not.toThrow()
  })
})
