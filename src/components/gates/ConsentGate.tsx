// ─────────────────────────────────────────────────────────────
// ConsentGate — Part 1 §1.5 exclusion-criteria enforcement
//
// Renders a calm, serif-styled gate screen that:
//   1. Explicitly states this tool is NOT an admissions / hiring /
//      screening instrument (§1.5 ¶1)
//   2. Requires a "I am 16 or older" checkbox before proceeding (§1.5 ¶2)
//   3. Requires a "self-reflection, not diagnostic" acknowledgement
//      checkbox (§1.5 ¶1 + §1.3 non-diagnostic)
//   4. Keeps the Begin button disabled until BOTH checkboxes are checked
//   5. Calls `onProceed` only after both are confirmed
//
// Notice copy is sourced from reports.json → footer.non_admissions_notice
// and footer.non_diagnostic_notice rather than being hardcoded here.
//
// Design constraints (tokens.css "luxurious, calm" system):
//   • Serif body font (--font-body), heading font (--font-heading)
//   • Muted accent used only on focus ring and active Begin button
//   • Border-based elevation only — no heavy drop shadows
//   • Slow, deliberate transitions (300ms)
//   • No Tailwind utility classes in this file
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import Footer from '../layout/Footer'
import styles from './ConsentGate.module.css'

// Pull notice copy from the single source of truth in reports.json.
// Footer fields are guaranteed present (verified in loadReports.ts).
import reportsData from '../../data/reports.json'

// ── Type-safe footer extraction ──────────────────────────────

interface ReportsFooter {
  non_admissions_notice: string
  non_diagnostic_notice: string
  crisis_notice: string
}

const footer = reportsData.footer as ReportsFooter

// ── Props ────────────────────────────────────────────────────

export interface ConsentGateProps {
  /**
   * Called after the user has confirmed both consent checkboxes and
   * pressed Begin. The caller may use this to transition to the first
   * question screen.
   */
  onProceed: () => void
}

// ── Component ────────────────────────────────────────────────

export default function ConsentGate({ onProceed }: ConsentGateProps) {
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [purposeConfirmed, setPurposeConfirmed] = useState(false)

  const canProceed = ageConfirmed && purposeConfirmed

  function handleBegin() {
    if (!canProceed) return
    onProceed()
  }

  return (
    <div className={styles.gateContainer}>
      {/* ── Top navigation bar has been moved to App.tsx ── */}
      <div className={styles.gate} id="consent-gate" role="main">

        {/* ── Eyebrow label ──────────────────────────────────── */}
      <span className={styles.eyebrow} aria-hidden="true">
        Evidence Based Medicine Readiness Assessment
      </span>

      {/* ── Heading ───────────────────────────────────────── */}
      <h1 className={styles.heading}>
        Before you begin
      </h1>

      {/* ── Instrument description ────────────────────────── */}
      <p className={styles.intro}>
        This is a structured self-reflection and readiness-orientation
        instrument designed for premedical students, career-changers, and
        early medical trainees. It takes approximately 20–30 minutes to
        complete.
      </p>

      {/* ── Non-admissions notice (sourced from reports.json footer) ── */}
      <div className={styles.noticeBox} role="note" aria-label="Important notice">
        <div className={styles.noticeIcon} aria-hidden="true">
          {/* Simple information mark — inline SVG, no emoji */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="8.01" />
            <polyline points="11 12 12 12 12 16" />
          </svg>
        </div>
        <div className={styles.noticeContent}>
          <p className={styles.noticeText}>
            {footer.non_admissions_notice}
          </p>
          <p className={styles.noticeText}>
            {footer.non_diagnostic_notice}
          </p>
          <p className={styles.noticeText}>
            {footer.crisis_notice}
          </p>
        </div>
      </div>

      {/* ── Consent checkboxes ────────────────────────────── */}
      <fieldset className={styles.checkboxGroup} aria-label="Consent confirmations">
        <legend className={styles.checkboxLegend}>
          Please confirm both of the following before continuing:
        </legend>

        {/* Checkbox 1: age gate (§1.5 ¶2) */}
        <label
          className={styles.checkboxLabel}
          htmlFor="consent-age"
          data-checked={ageConfirmed ? 'true' : 'false'}
        >
          <input
            type="checkbox"
            id="consent-age"
            className={styles.checkbox}
            checked={ageConfirmed}
            onChange={(e) => setAgeConfirmed(e.target.checked)}
            aria-describedby="consent-age-desc"
          />
          <span className={styles.checkmark} aria-hidden="true">
            {ageConfirmed ? (
              /* Check icon */
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : null}
          </span>
          <span className={styles.checkboxText}>
            I am 16 or older.
          </span>
        </label>
        <p id="consent-age-desc" className={styles.checkboxHint}>
          This instrument uses career-stage reasoning that assumes prior
          exposure to the premedical pathway; it is not appropriate for
          respondents under 16.
        </p>

        {/* Checkbox 2: purpose acknowledgement (§1.5 ¶1 + §1.3) */}
        <label
          className={styles.checkboxLabel}
          htmlFor="consent-purpose"
          data-checked={purposeConfirmed ? 'true' : 'false'}
        >
          <input
            type="checkbox"
            id="consent-purpose"
            className={styles.checkbox}
            checked={purposeConfirmed}
            onChange={(e) => setPurposeConfirmed(e.target.checked)}
            aria-describedby="consent-purpose-desc"
          />
          <span className={styles.checkmark} aria-hidden="true">
            {purposeConfirmed ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : null}
          </span>
          <span className={styles.checkboxText}>
            I understand this is a self-reflection tool, not a diagnostic
            or admissions instrument.
          </span>
        </label>
        <p id="consent-purpose-desc" className={styles.checkboxHint}>
          Your responses will not be shared with any admissions committee,
          employer, or licensing body, and cannot be used as evidence of
          fitness for practice.
        </p>
      </fieldset>

      {/* ── Begin button ──────────────────────────────────── */}
      <div className={styles.actions}>
        <button
          type="button"
          id="consent-begin-btn"
          className={styles.beginButton}
          disabled={!canProceed}
          aria-disabled={!canProceed}
          onClick={handleBegin}
        >
          Begin assessment
        </button>

        {!canProceed && (
          <p className={styles.disabledHint} aria-live="polite">
            Please confirm both checkboxes above to continue.
          </p>
        )}
      </div>

      {/* ── Completion time note ─────────────────────────── */}
      <p className={styles.footnote}>
        Estimated time: 20–30 minutes. Your progress is not saved between
        sessions; please allow uninterrupted time to complete it.
      </p>

    </div>
    <Footer />
  </div>
  )
}
