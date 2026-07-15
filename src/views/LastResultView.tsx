// ─────────────────────────────────────────────────────────────
// LastResultView — displays the cached assessment result
//
// Reads the last saved result from localStorage (ebmra_last_result).
// If no result exists, shows a prompt to take the assessment.
// If a result exists, renders ReportView with the stored data.
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'
import ReportView from './ReportView'
import { LAST_RESULT_STORAGE_KEY } from '../components/layout/TopNav'
import type { ScoringResult } from '../engine/domainScore'
import type { ProfileAssignmentResult } from '../types/profileAssignment'

interface CachedResult {
  scoringResult: ScoringResult
  profileResult: ProfileAssignmentResult
  savedAt: string
}

export default function LastResultView() {
  const [cached, setCached] = useState<CachedResult | null | 'loading'>('loading')

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAST_RESULT_STORAGE_KEY)
      if (!raw) {
        setCached(null)
        return
      }
      const parsed = JSON.parse(raw) as CachedResult
      setCached(parsed)
    } catch {
      setCached(null)
    }
  }, [])

  // Still loading from storage
  if (cached === 'loading') {
    return (
      <PageShell label="Results">
        <p style={{ color: 'var(--color-ink-muted)', fontStyle: 'italic' }}>
          Loading your last result…
        </p>
      </PageShell>
    )
  }

  // No result cached
  if (cached === null) {
    return (
      <PageShell label="Results" title="No Result Found">
        <p style={{ color: 'var(--color-ink-muted)', marginBottom: 'var(--space-6)' }}>
          You haven't completed the assessment yet. Your results will appear
          here once you finish and they'll be cached in your browser.
        </p>
        <Link
          to="/assessment"
          id="results-start-cta"
          aria-label="Begin the EBM Readiness Assessment"
          style={{
            display: 'inline-flex',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
            color: 'var(--color-ink)',
            textDecoration: 'none',
            border: '1px solid var(--color-border-dark)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3) var(--space-8)',
            boxShadow: 'var(--elevation-2)',
            transition: 'background-color var(--transition-base)',
          }}
        >
          Begin Assessment
        </Link>
      </PageShell>
    )
  }

  // Render cached report
  const formattedDate = new Date(cached.savedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <PageShell
      label={`Last taken: ${formattedDate}`}
      progress={100}
    >
      <ReportView
        scoringResult={cached.scoringResult}
        profileResult={cached.profileResult}
      />
    </PageShell>
  )
}
