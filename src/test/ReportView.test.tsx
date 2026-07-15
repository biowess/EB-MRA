/**
 * ReportView.test.tsx
 *
 * Vitest + @testing-library/react tests that verify ReportView renders
 * correctly using the worked-example data from:
 *
 *   • ScoringResult: Part 3 §5.14 (domain scores consistent with §8.5 inputs)
 *   • ProfileResult: Part 5 §8.5 (SAR=78, ELCA=72 → PROF-01 "Analytical Scientist")
 *
 * Assertions:
 *   1. SAR "Established" band text appears in the rendered output
 *      (SAR=78 → band "Strong" per 75-100 boundary; see below)
 *      NB: SAR=78 → band Strong (≥75). "Established" comes from ELCA=72 which
 *      sits in 50-74 range. Both are asserted below with their actual bands.
 *   2. PROF-01 name "Analytical Scientist" appears in the rendered output.
 *   3. Footer notices appear prominently at the top AND bottom.
 *   4. "Not enough data" fallback renders when profile is null.
 *   5. Interaction flag blocks render when triggered.
 *
 * Note on §5.14 / §8.5 mapping:
 *   The spec §8.5 worked example uses:
 *     SAR=78  → band Strong  (75–100)
 *     ELCA=72 → band Established (50–74)
 *   Both "Strong" (for SAR) and "Established" (for ELCA) text appears in the
 *   output, satisfying the requirement to assert both band labels.
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ReportView from '../views/ReportView'
import type { ScoringResult } from '../engine/domainScore'
import type { ProfileAssignmentResult } from '../types/profileAssignment'

// ── Worked-example data (Part 3 §5.14 / Part 5 §8.5) ─────────

/**
 * Domain scores from the §8.5 worked example.
 * SAR=78, ELCA=72, IHOR=45, AMB=30, ECPC=55, ERP=68, CSR=60, RST=58
 *
 * Band mapping (Part 3 §5.3: low ≤ score < high, top band inclusive):
 *   SAR=78   → Strong     (≥75)
 *   ELCA=72  → Established (50–74)
 *   IHOR=45  → Developing  (25–49)
 *   AMB=30   → Developing  (25–49)
 *   ECPC=55  → Established (50–74)
 *   ERP=68   → Established (50–74)
 *   CSR=60   → Established (50–74)
 *   RST=58   → Established (50–74)
 */
const workedExampleScoringResult: ScoringResult = {
  safety_gate_triggered: false,
  safety_gate_details: {
    main_item: 'RST-S02',
    supporting_items: [],
  },
  domain_scores: [
    { domain: 'SAR',  raw_weighted_score: 4.12, normalized_score: 78, flags: [], insufficient_data: false },
    { domain: 'ELCA', raw_weighted_score: 3.88, normalized_score: 72, flags: [], insufficient_data: false },
    { domain: 'IHOR', raw_weighted_score: 2.80, normalized_score: 45, flags: [], insufficient_data: false },
    { domain: 'AMB',  raw_weighted_score: 2.20, normalized_score: 30, flags: [], insufficient_data: false },
    { domain: 'ECPC', raw_weighted_score: 3.20, normalized_score: 55, flags: [], insufficient_data: false },
    { domain: 'ERP',  raw_weighted_score: 3.72, normalized_score: 68, flags: [], insufficient_data: false },
    { domain: 'CSR',  raw_weighted_score: 3.40, normalized_score: 60, flags: [], insufficient_data: false },
    { domain: 'RST',  raw_weighted_score: 3.32, normalized_score: 58, flags: [], insufficient_data: false },
  ],
  overall_confidence: 100,
  interaction_flags: [],
  validation_checks: {
    straight_line: [],
    consistency: [],
    contradictions: [],
  },
  sd_index: 0,
  suppress_profile_assignment: false,
  incomplete: false,
}

/**
 * ProfileResult from §8.5: PROF-01 "Analytical Scientist", fitScore=2,
 * profileFitConfidence="Moderate pattern match"
 */
const workedExampleProfileResult: ProfileAssignmentResult = {
  assigned_profile: 'PROF-01',
  fitScore: 2,
  profileFitConfidence: 'Moderate pattern match',
}

// ── Tests ─────────────────────────────────────────────────────

describe('ReportView', () => {
  it('renders without crashing with worked-example data', () => {
    render(
      <ReportView
        scoringResult={workedExampleScoringResult}
        profileResult={workedExampleProfileResult}
      />
    )
    expect(document.getElementById('report-view')).not.toBeNull()
  })

  it('renders "Strong" band label for SAR domain (score 78, ≥75)', () => {
    render(
      <ReportView
        scoringResult={workedExampleScoringResult}
        profileResult={workedExampleProfileResult}
      />
    )
    // The SAR band chip should display "Strong"
    const sarBandLabel = document.querySelector('[data-testid="band-label-SAR"]')
    expect(sarBandLabel).not.toBeNull()
    expect(sarBandLabel?.textContent).toBe('Strong')
  })

  it('renders "Established" band label for ELCA domain (score 72, 50–74)', () => {
    render(
      <ReportView
        scoringResult={workedExampleScoringResult}
        profileResult={workedExampleProfileResult}
      />
    )
    // The ELCA band chip should display "Established"
    const elcaBandLabel = document.querySelector('[data-testid="band-label-ELCA"]')
    expect(elcaBandLabel).not.toBeNull()
    expect(elcaBandLabel?.textContent).toBe('Established')
  })

  it('renders reports.json interpretation text for SAR Strong band', () => {
    render(
      <ReportView
        scoringResult={workedExampleScoringResult}
        profileResult={workedExampleProfileResult}
      />
    )
    // The SAR Strong fragment interpretation from reports.json
    expect(screen.getByText(/strong.*consistent.*deliberate.*evidence-based reasoning/i)).toBeInTheDocument()
  })

  it('renders PROF-01 name "Analytical Scientist" in the profile summary', () => {
    render(
      <ReportView
        scoringResult={workedExampleScoringResult}
        profileResult={workedExampleProfileResult}
      />
    )
    const profileName = document.querySelector('[data-testid="profile-name"]')
    expect(profileName).not.toBeNull()
    expect(profileName?.textContent).toBe('Analytical Scientist')
  })

  it('renders footer notices at the top (id="top-notices")', () => {
    render(
      <ReportView
        scoringResult={workedExampleScoringResult}
        profileResult={workedExampleProfileResult}
      />
    )
    const topNotices = document.getElementById('top-notices')
    expect(topNotices).not.toBeNull()
    // Non-admissions notice text
    expect(topNotices?.textContent).toMatch(/not.*validated.*admissions/i)
  })

  it('renders footer notices at the bottom (id="bottom-notices")', () => {
    render(
      <ReportView
        scoringResult={workedExampleScoringResult}
        profileResult={workedExampleProfileResult}
      />
    )
    const bottomNotices = document.getElementById('bottom-notices')
    expect(bottomNotices).not.toBeNull()
    expect(bottomNotices?.textContent).toMatch(/not.*diagnose/i)
  })

  it('renders top notices BEFORE domain section in DOM order', () => {
    render(
      <ReportView
        scoringResult={workedExampleScoringResult}
        profileResult={workedExampleProfileResult}
      />
    )
    const root = document.getElementById('report-view')!
    const children = Array.from(root.children)
    const topNoticesIdx = children.findIndex((el) => el.id === 'top-notices')
    const domainsIdx = children.findIndex((el) =>
      el.getAttribute('data-testid') === 'domains-section'
    )
    expect(topNoticesIdx).toBeLessThan(domainsIdx)
  })

  it('renders all 8 domain cards', () => {
    render(
      <ReportView
        scoringResult={workedExampleScoringResult}
        profileResult={workedExampleProfileResult}
      />
    )
    const domainIds = ['SAR', 'ELCA', 'IHOR', 'AMB', 'ECPC', 'ERP', 'CSR', 'RST']
    for (const id of domainIds) {
      const card = document.querySelector(`[data-testid="domain-card-${id}"]`)
      expect(card).not.toBeNull()
    }
  })

  it('renders estimate caption for domain cards', () => {
    render(
      <ReportView
        scoringResult={workedExampleScoringResult}
        profileResult={workedExampleProfileResult}
      />
    )
    const captions = screen.getAllByText(/Estimate only — bands are provisional/i)
    // 8 domain cards total
    expect(captions.length).toBe(8)
  })

  it('renders profile summary section', () => {
    render(
      <ReportView
        scoringResult={workedExampleScoringResult}
        profileResult={workedExampleProfileResult}
      />
    )
    const summary = document.querySelector('[data-testid="profile-summary"]')
    expect(summary).not.toBeNull()
  })

  it('renders PROF-01 confidence "Moderate pattern match"', () => {
    render(
      <ReportView
        scoringResult={workedExampleScoringResult}
        profileResult={workedExampleProfileResult}
      />
    )
    expect(screen.getByText('Moderate pattern match')).toBeInTheDocument()
  })

  it('renders no-profile fallback message when assigned_profile is null (§8.4)', () => {
    const noProfileResult: ProfileAssignmentResult = {
      assigned_profile: null,
      fitScore: 0,
      profileFitConfidence: null,
    }
    render(
      <ReportView
        scoringResult={workedExampleScoringResult}
        profileResult={noProfileResult}
      />
    )
    const noMsg = document.querySelector('[data-testid="no-profile-message"]')
    expect(noMsg).not.toBeNull()
    expect(noMsg?.textContent).toMatch(/not enough data for a profile summary/i)
    // Profile name should NOT appear
    expect(document.querySelector('[data-testid="profile-name"]')).toBeNull()
  })

  it('does not render interactions section when no flags are triggered', () => {
    render(
      <ReportView
        scoringResult={workedExampleScoringResult}
        profileResult={workedExampleProfileResult}
      />
    )
    // No interaction flags in the worked example
    expect(document.querySelector('[data-testid="interactions-section"]')).toBeNull()
  })

  it('renders interaction block when AR-03 flag is triggered', () => {
    const scoringWithFlag: ScoringResult = {
      ...workedExampleScoringResult,
      interaction_flags: [
        { rule: 'AR-03', triggered: true, detail: 'test trigger' },
      ],
    }
    render(
      <ReportView
        scoringResult={scoringWithFlag}
        profileResult={workedExampleProfileResult}
      />
    )
    const interactionsSection = document.querySelector('[data-testid="interactions-section"]')
    expect(interactionsSection).not.toBeNull()
    const block = document.querySelector('[data-testid="interaction-block-AR-03"]')
    expect(block).not.toBeNull()
    // Text comes from reports.json interaction_blocks["AR-03"]
    expect(block?.textContent).toMatch(/wanting certainty before acting/i)
  })

  it('renders insufficient data card for a domain with insufficient_data=true', () => {
    const scoringWithInsufficient: ScoringResult = {
      ...workedExampleScoringResult,
      domain_scores: workedExampleScoringResult.domain_scores.map((ds) =>
        ds.domain === 'AMB'
          ? { ...ds, normalized_score: null, insufficient_data: true }
          : ds
      ),
    }
    render(
      <ReportView
        scoringResult={scoringWithInsufficient}
        profileResult={workedExampleProfileResult}
      />
    )
    const ambCard = document.querySelector('[data-testid="domain-card-AMB"]')
    expect(ambCard).not.toBeNull()
    // Should not render a band chip for this domain
    expect(document.querySelector('[data-testid="band-label-AMB"]')).toBeNull()
  })

  it('renders "VeryStrong" band for CSR domain (score 92, ≥90)', () => {
    const scoringWithCSRVeryStrong: ScoringResult = {
      ...workedExampleScoringResult,
      domain_scores: workedExampleScoringResult.domain_scores.map((ds) =>
        ds.domain === 'CSR' ? { ...ds, normalized_score: 92 } : ds
      ),
    }
    render(
      <ReportView
        scoringResult={scoringWithCSRVeryStrong}
        profileResult={workedExampleProfileResult}
      />
    )
    const csrBandLabel = document.querySelector('[data-testid="band-label-CSR"]')
    expect(csrBandLabel).not.toBeNull()
    expect(csrBandLabel?.textContent).toBe('VeryStrong')
  })

  it('renders "Strong" band for CSR domain (score 80, 75-89)', () => {
    const scoringWithCSRStrong: ScoringResult = {
      ...workedExampleScoringResult,
      domain_scores: workedExampleScoringResult.domain_scores.map((ds) =>
        ds.domain === 'CSR' ? { ...ds, normalized_score: 80 } : ds
      ),
    }
    render(
      <ReportView
        scoringResult={scoringWithCSRStrong}
        profileResult={workedExampleProfileResult}
      />
    )
    const csrBandLabel = document.querySelector('[data-testid="band-label-CSR"]')
    expect(csrBandLabel).not.toBeNull()
    expect(csrBandLabel?.textContent).toBe('Strong')
  })
})
