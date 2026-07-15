import type { ReactNode } from 'react'
import Footer from './Footer'
import styles from './PageShell.module.css'

// ─────────────────────────────────────────────────────────────
// PageShell — reading-column layout wrapper
//
// Establishes the "luxurious, calm" visual language:
//   • Max 680px reading column, centred with generous padding
//   • Serif body and heading fonts via CSS custom properties
//   • Muted accent used sparingly (progress indicators only)
//   • Slow, deliberate transitions (300–400ms)
//   • Border-based elevation only — no heavy box-shadows
//
// All styling references design tokens from tokens.css.
// No Tailwind utility classes are used in this component.
// ─────────────────────────────────────────────────────────────

interface PageShellProps {
  /** Page content */
  children: ReactNode

  /**
   * Optional title shown above the content area.
   * Rendered as an <h1> using the heading serif font.
   */
  title?: string

  /**
   * Optional eyebrow label shown above the title.
   * Small-caps, muted ink.
   */
  label?: string

  /**
   * Optional progress value 0–100.
   * When provided, renders the accent-coloured progress bar —
   * the *only* place the accent colour appears in PageShell.
   */
  progress?: number

  /**
   * Optional total number of steps for the step-dot indicator.
   * Requires `progress` to be set.
   */
  totalSteps?: number

  /**
   * Current active step (1-indexed). Used with `totalSteps`.
   */
  currentStep?: number

  /**
   * Optional callback to render a back arrow in the header.
   */
  onBack?: () => void

  /**
   * Optional fixed/sticky navigation bar rendered directly above the footer.
   */
  bottomNav?: ReactNode
}

export default function PageShell({
  children,
  title,
  label,
  progress,
  totalSteps,
  currentStep,
  onBack,
  bottomNav,
}: PageShellProps) {
  const clampedProgress =
    progress !== undefined ? Math.min(100, Math.max(0, progress)) : undefined

  return (
    <div className={styles.shell} id="page-shell">
      {/* ── Top navigation bar has been moved to App.tsx ── */}

      {/* ── Progress bar (accent colour — used here only) ─── */}
      {clampedProgress !== undefined && (
        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Assessment progress"
        >
          <div
            className={styles.progressFill}
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
      )}

      {/* ── Reading column ─────────────────────────────────── */}
      <main className={styles.column} id="main-content">

        {/* Optional header: eyebrow + title */}
        {(label || title || onBack) && (
          <header className={styles.pageHeader}>
            <div className={styles.headerTitleRow}>
              {onBack && (
                <button className={styles.backButton} onClick={onBack} aria-label="Go back">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
              )}
              <div className={styles.headerTextGroup}>
                {label && (
                  <span className={styles.label} aria-label={label}>
                    {label}
                  </span>
                )}
                {title && (
                  <h1 className={styles.title}>{title}</h1>
                )}
              </div>
            </div>

            {/* Step dots (accent on active dot) */}
            {totalSteps && totalSteps > 1 && (
              <div className={styles.stepDots} aria-hidden="true">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <span
                    key={i}
                    className={styles.stepDot}
                    data-active={currentStep === i + 1 ? 'true' : 'false'}
                  />
                ))}
              </div>
            )}

            <hr className={styles.divider} />
          </header>
        )}

        {/* Page content */}
        <div className={styles.content}>
          {children}
        </div>
      </main>

      {/* Sticky/Fixed bottom navigation if provided */}
      {bottomNav}

      {/* Footer */}
      <Footer />
    </div>
  )
}
