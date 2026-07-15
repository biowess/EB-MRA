// ─────────────────────────────────────────────────────────────
// ScenarioQuestion — dumb presentational component
//
// Renders a scenario-style question: a prose-length scenario body
// followed by four lettered options (A, B, C, D). Each option is
// a calm, readable button with a left-aligned letter badge.
//
// Design constraints:
//   • Long scenario text set at reading-column width
//   • Letter badge uses muted accent surface (--color-accent-subtle)
//   • Selected option gains a border-based highlight (no loud fill)
//   • Generous vertical padding for comfortable touch targets
//   • No global store. No data imports. Pure props.
// ─────────────────────────────────────────────────────────────

import type { Question, SingleSelectOption } from '../../types/question'
import type { AnswerValue } from '../../types/answers'
import styles from './ScenarioQuestion.module.css'

// ── Helpers ──────────────────────────────────────────────────

const LETTERS = ['A', 'B', 'C', 'D'] as const

// ── Props ────────────────────────────────────────────────────

export interface ScenarioQuestionProps {
  /** The question to render. Must have response_type === "SINGLE_SELECT". */
  question: Question
  /** Currently selected letter value ("A"|"B"|"C"|"D"), or undefined. */
  value: AnswerValue | undefined
  /** Called with the chosen letter when the user selects an option. */
  onAnswer: (v: AnswerValue) => void
}

// ── Component ────────────────────────────────────────────────

export default function ScenarioQuestion({
  question,
  value,
  onAnswer,
}: ScenarioQuestionProps) {
  const options = question.options as SingleSelectOption[]

  return (
    <div
      className={styles.container}
      id={`scenario-${question.id}`}
    >
      {/* Scenario prose — longer text, relaxed leading */}
      <p
        className={styles.scenarioText}
        id={`scenario-label-${question.id}`}
      >
        {question.text}
      </p>

      {/* Options list */}
      <div
        className={styles.optionList}
        role="group"
        aria-labelledby={`scenario-label-${question.id}`}
      >
        {options.map((option, index) => {
          const letter = LETTERS[index] ?? String.fromCharCode(65 + index)
          const isSelected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`Option ${letter}: ${option.label}`}
              id={`scenario-${question.id}-opt-${letter}`}
              className={styles.option}
              data-selected={isSelected ? 'true' : 'false'}
              onClick={() => onAnswer(option.value as AnswerValue)}
            >
              {/* Letter badge */}
              <span className={styles.letterBadge} aria-hidden="true">
                {letter}
              </span>

              {/* Option prose */}
              <span className={styles.optionText}>
                {option.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
