// ─────────────────────────────────────────────────────────────
// ErrorBoundary
//
// A class-based React error boundary (getDerivedStateFromError /
// componentDidCatch) that catches render-phase errors thrown by
// any child subtree and replaces them with a calm, serif fallback
// message — never a raw stack trace or technical detail.
//
// Design constraints (from the EBMRA "luxurious, calm" language):
//   • Fallback uses the heading serif font (--font-heading)
//   • Palette: parchment background, ink text, muted-accent border
//   • No icons, no bright colours, no alarming language
//   • Errors are recorded in componentDidCatch for logging hooks
//
// Usage:
//   <ErrorBoundary>
//     <MyFeature />
//   </ErrorBoundary>
//
//   <ErrorBoundary fallback={<p>Custom message.</p>}>
//     <MyFeature />
//   </ErrorBoundary>
// ─────────────────────────────────────────────────────────────

import { Component, type ReactNode } from 'react'
import styles from './ErrorBoundary.module.css'

// ── Types ─────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: ReactNode

  /**
   * Optional custom fallback UI.
   * When omitted the built-in calm serif message is shown.
   */
  fallback?: ReactNode

  /**
   * Optional callback invoked when an error is caught.
   * Receives the error and the React error info object.
   * Use this to wire up an external error-logging service.
   */
  onError?: (error: Error, info: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  /** True once a child render has thrown. */
  hasError: boolean
}

// ── Component ─────────────────────────────────────────────────

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  // ── Lifecycle ──────────────────────────────────────────────

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    // Flip to error state on the next render cycle.
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // Fire the optional consumer callback (e.g. Sentry, LogRocket).
    this.props.onError?.(error, info)
    // Deliberately suppressed from console in production; in dev Vite
    // will already surface the error overlay independently.
  }

  // ── Reset ──────────────────────────────────────────────────

  /** Call this to let a parent component offer a "try again" flow. */
  reset(): void {
    this.setState({ hasError: false })
  }

  // ── Render ─────────────────────────────────────────────────

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback takes precedence when provided.
      if (this.props.fallback !== undefined) {
        return this.props.fallback
      }

      // Default: calm, serif fallback — no technical language.
      return (
        <div
          className={styles.fallback}
          role="alert"
          aria-live="assertive"
          data-testid="error-boundary-fallback"
        >
          <p className={styles.heading}>Something went quietly wrong.</p>
          <p className={styles.body}>
            This section could not be displayed. Please refresh the page or
            return to the beginning. If the problem persists, contact support.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
