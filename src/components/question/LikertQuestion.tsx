// ─────────────────────────────────────────────────────────────
// LikertQuestion — dumb presentational component
//
// Renders a 5-point Likert question as quiet, serif-styled
// radio-like option buttons. No global store. No data imports.
// All data flows through props.
//
// Design constraints (from tokens.css "luxurious, calm" system):
//   • Serif body font (--font-body)
//   • Generous tap targets (min 44×44px per WCAG 2.5.5)
//   • Muted accent used only on the selected/focus state
//   • Border-based "elevation" — no heavy drop shadows
//   • Slow, deliberate hover transition (300ms)
//   • Labels are readable plain English — no "Strongly Agree" jargon
//     made prominent; the label stays secondary, the number is the anchor
// ─────────────────────────────────────────────────────────────

import type { Question, LikertOption } from '../../types/question'
import type { AnswerValue } from '../../types/answers'
import styles from './LikertQuestion.module.css'

// ── Props ────────────────────────────────────────────────────

export interface LikertQuestionProps {
  /** The question to render. Must have response_type === "LIKERT5". */
  question: Question
  /** Currently selected value, or undefined if unanswered. */
  value: AnswerValue | undefined
  /** Called with the chosen numeric value when the user selects an option. */
  onAnswer: (v: AnswerValue) => void
}

// ── Component ────────────────────────────────────────────────

export default function LikertQuestion({
  question,
  value,
  onAnswer,
}: LikertQuestionProps) {
  const options = question.options as LikertOption[]

  return (
    <div
      className={styles.fieldset}
      id={`likert-${question.id}`}
      role="group"
      aria-labelledby={`likert-legend-${question.id}`}
    >
      {/* Question text */}
      <div
        className={styles.legend}
        id={`likert-legend-${question.id}`}
      >
        {question.text}
      </div>

      {/* Option row */}
      <div className={styles.optionRow} role="group">
        {options.map((option) => {
          const isSelected = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${option.value} — ${option.label}`}
              id={`likert-${question.id}-opt-${option.value}`}
              className={styles.option}
              data-selected={isSelected ? 'true' : 'false'}
              onClick={() => onAnswer(option.value as AnswerValue)}
            >
              {/* Numeral — the visual anchor */}
              <span className={styles.numeral} aria-hidden="true">
                {option.value}
              </span>

              {/* Label — quiet, secondary */}
              <span className={styles.optionLabel}>
                {option.label}
              </span>
            </button>
          )
        })}
      </div>

      {/* Pole labels (1 = left pole, 5 = right pole) */}
      {options.length >= 2 && (
        <div className={styles.poles} aria-hidden="true">
          <span className={styles.poleText}>{options[0].label}</span>
          <span className={styles.poleText}>{options[options.length - 1].label}</span>
        </div>
      )}
    </div>
  )
}
