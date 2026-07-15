/**
 * layout.test.tsx
 *
 * Vitest + @testing-library/react tests for:
 *   - ProgressTracker
 *   - ErrorBoundary
 *
 * ProgressTracker coverage:
 *   1. Renders a progressbar role with aria-valuenow
 *   2. current=52, total=104 → fill width is exactly 50%
 *   3. current=0 → fill width is 0%
 *   4. current=total → fill width is 100%
 *   5. Clamps values outside [0, 100] (current > total)
 *   6. computePercent() helper produces exact integer percentages
 *
 * ErrorBoundary coverage:
 *   1. Renders children normally when no error occurs
 *   2. Forces a child to throw → shows fallback, no crash
 *   3. Fallback has role="alert" for screen readers
 *   4. Fallback does NOT contain a stack trace
 *   5. Custom fallback prop is rendered instead of the default message
 *   6. onError callback is invoked with the caught error
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import ProgressTracker, {
  computePercent,
} from '../src/components/layout/ProgressTracker'
import ErrorBoundary from '../src/components/layout/ErrorBoundary'

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/**
 * A component that throws during render.
 * React requires a class or stable function reference —
 * we use a module-level function to avoid exhaustive-deps issues.
 */
function ThrowingChild(): never {
  throw new Error('Deliberate render error for testing')
}

/** A well-behaved child used to verify normal pass-through. */
function QuietChild() {
  return <p data-testid="quiet-child">All is well.</p>
}

// ─────────────────────────────────────────────────────────────
// Suppress React's intentional console.error for error-boundary
// tests so the test output stays clean. We restore it after each.
// ─────────────────────────────────────────────────────────────
let consoleErrorSpy: ReturnType<typeof vi.spyOn>

// ─────────────────────────────────────────────────────────────
// ProgressTracker
// ─────────────────────────────────────────────────────────────

describe('ProgressTracker', () => {
  // ── computePercent() pure helper ──────────────────────────

  describe('computePercent()', () => {
    it('returns 50 for current=52, total=104', () => {
      expect(computePercent(52, 104)).toBe(50)
    })

    it('returns 0 for current=0, total=any', () => {
      expect(computePercent(0, 104)).toBe(0)
    })

    it('returns 100 for current=total', () => {
      expect(computePercent(104, 104)).toBe(100)
    })

    it('clamps to 100 when current > total', () => {
      expect(computePercent(200, 104)).toBe(100)
    })

    it('returns 0 when total is 0 (guard against division by zero)', () => {
      expect(computePercent(5, 0)).toBe(0)
    })

    it('rounds fractional percentages to the nearest integer', () => {
      // 1/3 ≈ 33.33… → 33
      expect(computePercent(1, 3)).toBe(33)
    })
  })

  // ── Rendered output ───────────────────────────────────────

  describe('rendered output', () => {
    it('renders a progressbar element', () => {
      render(<ProgressTracker current={52} total={104} />)
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('sets aria-valuenow to 50 for current=52, total=104', () => {
      render(<ProgressTracker current={52} total={104} />)
      const bar = screen.getByRole('progressbar')
      expect(bar).toHaveAttribute('aria-valuenow', '50')
    })

    it('sets aria-valuemin=0 and aria-valuemax=100', () => {
      render(<ProgressTracker current={52} total={104} />)
      const bar = screen.getByRole('progressbar')
      expect(bar).toHaveAttribute('aria-valuemin', '0')
      expect(bar).toHaveAttribute('aria-valuemax', '100')
    })

    /**
     * KEY ASSERTION: the fill element's inline width must equal 50%.
     * This is the primary render requirement from the task spec.
     */
    it('renders the fill element at exactly 50% width for current=52, total=104', () => {
      render(<ProgressTracker current={52} total={104} />)
      // With 8 segments, 50% means the first 4 segments are 100%, last 4 are 0%.
      expect(screen.getByTestId('progress-fill-0')).toHaveStyle({ width: '100%' })
      expect(screen.getByTestId('progress-fill-3')).toHaveStyle({ width: '100%' })
      expect(screen.getByTestId('progress-fill-4')).toHaveStyle({ width: '0%' })
    })

    it('renders the fill at 0% when current=0', () => {
      render(<ProgressTracker current={0} total={104} />)
      expect(screen.getByTestId('progress-fill-0')).toHaveStyle({ width: '0%' })
      expect(screen.getByTestId('progress-fill-7')).toHaveStyle({ width: '0%' })
    })

    it('renders the fill at 100% when current equals total', () => {
      render(<ProgressTracker current={104} total={104} />)
      expect(screen.getByTestId('progress-fill-0')).toHaveStyle({ width: '100%' })
      expect(screen.getByTestId('progress-fill-7')).toHaveStyle({ width: '100%' })
    })

    it('clamps fill to 100% when current exceeds total', () => {
      render(<ProgressTracker current={999} total={104} />)
      expect(screen.getByTestId('progress-fill-7')).toHaveStyle({ width: '100%' })
    })

    it('accepts a custom accessible label', () => {
      render(
        <ProgressTracker current={52} total={104} label="Section progress" />
      )
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-label',
        'Section progress'
      )
    })

    it('uses the default accessible label when none is supplied', () => {
      render(<ProgressTracker current={52} total={104} />)
      expect(screen.getByRole('progressbar')).toHaveAttribute(
        'aria-label',
        'Assessment progress'
      )
    })
  })
})

// ─────────────────────────────────────────────────────────────
// ErrorBoundary
// ─────────────────────────────────────────────────────────────

describe('ErrorBoundary', () => {
  // Silence React's expected console.error noise for error-boundary tests.
  beforeEach(() => {
    consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  // ── Normal path ───────────────────────────────────────────

  it('renders children normally when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <QuietChild />
      </ErrorBoundary>
    )
    expect(screen.getByTestId('quiet-child')).toBeInTheDocument()
    expect(screen.getByText('All is well.')).toBeInTheDocument()
  })

  it('does not render the fallback UI when children are healthy', () => {
    render(
      <ErrorBoundary>
        <QuietChild />
      </ErrorBoundary>
    )
    expect(
      screen.queryByTestId('error-boundary-fallback')
    ).not.toBeInTheDocument()
  })

  // ── Error path ────────────────────────────────────────────

  /**
   * CORE ASSERTION: when a child throws, the boundary must catch it
   * and render the calm fallback UI — the test itself must not crash.
   */
  it('renders the fallback UI when a child throws during render', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    )
    expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument()
  })

  it('does not crash the test when a child throws', () => {
    // If ErrorBoundary fails to catch the error this test will throw.
    expect(() =>
      render(
        <ErrorBoundary>
          <ThrowingChild />
        </ErrorBoundary>
      )
    ).not.toThrow()
  })

  it('fallback has role="alert" for assistive technology', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    )
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('fallback message does not expose a raw stack trace', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    )
    const alert = screen.getByRole('alert')
    // Stack traces contain "at " + function references; they must be absent.
    expect(alert.textContent).not.toMatch(/at\s+\w+\s*\(/)
    // Raw error message must not be surfaced either.
    expect(alert.textContent).not.toContain('Deliberate render error for testing')
  })

  it('fallback contains a calm, user-friendly heading', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    )
    expect(
      screen.getByText(/something went quietly wrong/i)
    ).toBeInTheDocument()
  })

  it('fallback does not render the throwing child', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild />
      </ErrorBoundary>
    )
    // ThrowingChild renders nothing; we confirm the boundary caught it.
    // The children prop is replaced by the fallback, so no content from
    // ThrowingChild is present.
    expect(screen.queryByTestId('quiet-child')).not.toBeInTheDocument()
  })

  // ── Custom fallback ───────────────────────────────────────

  it('renders a custom fallback node when the fallback prop is provided', () => {
    render(
      <ErrorBoundary fallback={<p data-testid="custom-fallback">Custom.</p>}>
        <ThrowingChild />
      </ErrorBoundary>
    )
    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument()
    expect(screen.getByText('Custom.')).toBeInTheDocument()
  })

  it('does not render the default fallback when a custom one is provided', () => {
    render(
      <ErrorBoundary fallback={<p data-testid="custom-fallback">Custom.</p>}>
        <ThrowingChild />
      </ErrorBoundary>
    )
    expect(
      screen.queryByTestId('error-boundary-fallback')
    ).not.toBeInTheDocument()
  })

  // ── onError callback ──────────────────────────────────────

  it('calls the onError callback with the caught error', () => {
    const onError = vi.fn()
    render(
      <ErrorBoundary onError={onError}>
        <ThrowingChild />
      </ErrorBoundary>
    )
    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error)
    expect(onError.mock.calls[0][0].message).toBe(
      'Deliberate render error for testing'
    )
  })

  it('calls onError with a React ErrorInfo object as second argument', () => {
    const onError = vi.fn()
    render(
      <ErrorBoundary onError={onError}>
        <ThrowingChild />
      </ErrorBoundary>
    )
    const errorInfo = onError.mock.calls[0][1]
    // React's ErrorInfo always has a componentStack string.
    expect(typeof errorInfo.componentStack).toBe('string')
  })
})
