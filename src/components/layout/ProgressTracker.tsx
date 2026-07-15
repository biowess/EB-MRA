// ─────────────────────────────────────────────────────────────
// ProgressTracker
//
// A minimal, calm progress indicator — a single thin filled line.
// Intentionally *not* a busy stepper: no numbers, no labels,
// just a quiet accent-coloured bar that advances in silence.
//
// Props
//   current  — items completed (non-negative integer)
//   total    — total items (positive integer, must be ≥ current)
//
// The rendered fill equals Math.round((current / total) * 100) %
// and is clamped to [0, 100] to guard against bad inputs.
//
// All styling comes from the shared design tokens (tokens.css).
// No Tailwind utilities; no inline magic numbers.
// ─────────────────────────────────────────────────────────────

import styles from './ProgressTracker.module.css'

export interface ProgressTrackerProps {
  /** Number of steps completed. */
  current: number
  /** Total number of steps. Must be a positive integer. */
  total: number
  /** Optional accessible label override (defaults to "Assessment progress"). */
  label?: string
}

/**
 * Returns the fill percentage clamped to [0, 100].
 * Exported for unit-test convenience.
 */
export function computePercent(current: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(100, Math.max(0, Math.round((current / total) * 100)))
}

export default function ProgressTracker({
  current,
  total,
  label = 'Assessment progress',
}: ProgressTrackerProps) {
  const percent = computePercent(current, total)
  const segments = 8

  return (
    <div
      className={styles.trackContainer}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      data-testid="progress-tracker"
    >
      {Array.from({ length: segments }).map((_, i) => {
        const partStart = (i / segments) * 100;
        const partEnd = ((i + 1) / segments) * 100;
        let fillPercent = 0;
        
        if (percent >= partEnd) {
          fillPercent = 100;
        } else if (percent > partStart) {
          fillPercent = ((percent - partStart) / (partEnd - partStart)) * 100;
        }

        return (
          <div key={i} className={styles.track}>
            <div
              className={styles.fill}
              style={{ width: `${fillPercent}%` }}
              data-testid={`progress-fill-${i}`}
            />
          </div>
        )
      })}
    </div>
  )
}
