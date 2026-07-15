// ─────────────────────────────────────────────────────────────
// NotFoundView — 404 page for unmatched routes
// ─────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom'
import PageShell from '../components/layout/PageShell'

export default function NotFoundView() {
  return (
    <PageShell label="404" title="Page Not Found">
      <p style={{ color: 'var(--color-ink-muted)', marginBottom: 'var(--space-6)' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        id="not-found-home-link"
        aria-label="Return to home page"
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
          padding: 'var(--space-3) var(--space-6)',
        }}
      >
        ← Return Home
      </Link>
    </PageShell>
  )
}
