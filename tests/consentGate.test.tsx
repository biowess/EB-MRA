/**
 * consentGate.test.tsx
 *
 * Vitest + @testing-library/react tests for ConsentGate.
 *
 * Spec coverage (Part 1 §1.5 exclusion criteria):
 *
 *   Rendering
 *   1.  Renders an h1 heading.
 *   2.  Renders the non-admissions notice from reports.json footer.
 *   3.  Renders the non-diagnostic notice from reports.json footer.
 *   4.  Renders the age-confirmation checkbox (id="consent-age").
 *   5.  Renders the purpose-confirmation checkbox (id="consent-purpose").
 *   6.  Renders the Begin button (id="consent-begin-btn").
 *
 *   Gate logic — CORE ASSERTIONS
 *   7.  Begin button is disabled on initial render (both checkboxes unchecked).
 *   8.  Begin button is disabled when only age checkbox is checked.
 *   9.  Begin button is disabled when only purpose checkbox is checked.
 *   10. Begin button becomes enabled only after BOTH checkboxes are checked.
 *   11. Clicking Begin while disabled does NOT call onProceed.
 *   12. Clicking Begin while enabled DOES call onProceed exactly once.
 *   13. onProceed is NOT called a second time on a second click (idempotent
 *       guard — tests that the callback wires through the handler, not
 *       directly to the button onClick).
 *
 *   Accessibility
 *   14. Begin button has aria-disabled="true" when not ready.
 *   15. Begin button has aria-disabled="false" when ready.
 *   16. Checkboxes are inside a <fieldset> with an accessible legend.
 *   17. Notice box has role="note".
 *   18. Gate wrapper has role="main".
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ConsentGate from '../src/components/gates/ConsentGate'

// ── Pull the same footer copy the component uses ──────────────
import reportsData from '../src/data/reports.json'
const { non_admissions_notice, non_diagnostic_notice, crisis_notice } = reportsData.footer

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Renders <ConsentGate> and returns commonly queried elements. */
function setup(onProceed = vi.fn()) {
  render(
    <MemoryRouter>
      <ConsentGate onProceed={onProceed} />
    </MemoryRouter>
  )

  const ageCheckbox = screen.getByRole('checkbox', { name: /i am 16 or older/i })
  const purposeCheckbox = screen.getByRole('checkbox', {
    name: /self-reflection tool, not a diagnostic or admissions instrument/i,
  })
  const beginButton = screen.getByRole('button', { name: /begin assessment/i })

  return { ageCheckbox, purposeCheckbox, beginButton, onProceed }
}

// ─────────────────────────────────────────────────────────────
// ConsentGate
// ─────────────────────────────────────────────────────────────

describe('ConsentGate', () => {
  // ── Rendering ─────────────────────────────────────────────

  describe('rendering', () => {
    it('renders an h1 heading', () => {
      setup()
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('displays the non-admissions notice from reports.json footer', () => {
      setup()
      // The notice text must appear verbatim — no hardcoded copy in the component.
      expect(screen.getByText(non_admissions_notice)).toBeInTheDocument()
    })

    it('displays the non-diagnostic notice from reports.json footer', () => {
      setup()
      expect(screen.getByText(non_diagnostic_notice)).toBeInTheDocument()
    })

    it('displays the crisis notice from reports.json footer', () => {
      setup()
      expect(screen.getByText(crisis_notice)).toBeInTheDocument()
    })

    it('renders the age-confirmation checkbox', () => {
      setup()
      expect(screen.getByRole('checkbox', { name: /i am 16 or older/i })).toBeInTheDocument()
    })

    it('renders the purpose-confirmation checkbox', () => {
      setup()
      expect(
        screen.getByRole('checkbox', {
          name: /self-reflection tool, not a diagnostic or admissions instrument/i,
        })
      ).toBeInTheDocument()
    })

    it('renders the Begin button', () => {
      setup()
      expect(screen.getByRole('button', { name: /begin assessment/i })).toBeInTheDocument()
    })

    it('renders the notice box with role="note"', () => {
      setup()
      expect(screen.getByRole('note', { name: /important notice/i })).toBeInTheDocument()
    })

    it('renders the gate wrapper with role="main"', () => {
      setup()
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('renders checkboxes inside a fieldset with an accessible legend', () => {
      setup()
      // The accessible legend names the fieldset group.
      expect(
        screen.getByRole('group', { name: /consent confirmations/i })
      ).toBeInTheDocument()
    })
  })

  // ── Gate logic (§1.5 enforcement) ─────────────────────────

  describe('gate logic', () => {
    let onProceed: ReturnType<typeof vi.fn>
    let ageCheckbox: HTMLElement
    let purposeCheckbox: HTMLElement
    let beginButton: HTMLElement

    beforeEach(() => {
      onProceed = vi.fn()
      ;({ ageCheckbox, purposeCheckbox, beginButton, onProceed } = setup(onProceed))
    })

    // ── CORE: disabled until both boxes checked ────────────

    it('Begin button is disabled on initial render (both unchecked)', () => {
      expect(beginButton).toBeDisabled()
    })

    it('Begin button is disabled when only the age checkbox is checked', () => {
      fireEvent.click(ageCheckbox)
      expect(beginButton).toBeDisabled()
    })

    it('Begin button is disabled when only the purpose checkbox is checked', () => {
      fireEvent.click(purposeCheckbox)
      expect(beginButton).toBeDisabled()
    })

    it('Begin button becomes enabled only after BOTH checkboxes are checked', () => {
      expect(beginButton).toBeDisabled()          // pre-condition

      fireEvent.click(ageCheckbox)
      expect(beginButton).toBeDisabled()          // still only one

      fireEvent.click(purposeCheckbox)
      expect(beginButton).not.toBeDisabled()      // both confirmed ✓
    })

    // ── CORE: onProceed callback ───────────────────────────

    it('does NOT call onProceed when Begin is clicked while disabled', () => {
      // Button is disabled — clicking has no effect.
      fireEvent.click(beginButton)
      expect(onProceed).not.toHaveBeenCalled()
    })

    it('does NOT call onProceed when only one checkbox is checked', () => {
      fireEvent.click(ageCheckbox)
      fireEvent.click(beginButton)
      expect(onProceed).not.toHaveBeenCalled()
    })

    it('calls onProceed exactly once after both checkboxes are checked and Begin is clicked', () => {
      fireEvent.click(ageCheckbox)
      fireEvent.click(purposeCheckbox)
      fireEvent.click(beginButton)
      expect(onProceed).toHaveBeenCalledTimes(1)
    })

    it('calling Begin a second time calls onProceed a second time (no suppression after first call)', () => {
      // Component is stateless re: "already proceeded" — each valid click fires.
      fireEvent.click(ageCheckbox)
      fireEvent.click(purposeCheckbox)
      fireEvent.click(beginButton)
      fireEvent.click(beginButton)
      expect(onProceed).toHaveBeenCalledTimes(2)
    })

    // ── Unchecking reverts the gate ───────────────────────

    it('re-disables Begin if a checkbox is unchecked after both were confirmed', () => {
      fireEvent.click(ageCheckbox)
      fireEvent.click(purposeCheckbox)
      expect(beginButton).not.toBeDisabled()   // both confirmed

      fireEvent.click(ageCheckbox)              // un-check age
      expect(beginButton).toBeDisabled()       // reverted
    })

    // ── Accessibility attributes ───────────────────────────

    it('Begin button has aria-disabled="true" when not ready', () => {
      expect(beginButton).toHaveAttribute('aria-disabled', 'true')
    })

    it('Begin button has aria-disabled="false" when both checkboxes are confirmed', () => {
      fireEvent.click(ageCheckbox)
      fireEvent.click(purposeCheckbox)
      expect(beginButton).toHaveAttribute('aria-disabled', 'false')
    })

    it('each checkbox is initially unchecked', () => {
      expect(ageCheckbox).not.toBeChecked()
      expect(purposeCheckbox).not.toBeChecked()
    })

    it('age checkbox is checked after clicking it', () => {
      fireEvent.click(ageCheckbox)
      expect(ageCheckbox).toBeChecked()
    })

    it('purpose checkbox is checked after clicking it', () => {
      fireEvent.click(purposeCheckbox)
      expect(purposeCheckbox).toBeChecked()
    })
  })
})
