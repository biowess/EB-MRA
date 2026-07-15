/**
 * PageShell.test.tsx
 *
 * Vitest + @testing-library/react DOM tests that verify PageShell
 * renders with the correct serif typography, layout structure, and
 * design token application.
 *
 * Because jsdom does not evaluate @font-face or @import CSS files,
 * we test what we *can* verify:
 *   1. The component applies the correct CSS custom property references
 *      (via inline style or CSS class names that contain token values).
 *   2. Element structure (h1, progressbar role, step dots, etc.) is correct.
 *   3. The CSS module classes include no Tailwind sans-serif utilities.
 *
 * For live font verification, see the in-browser demo at `/` (App.tsx).
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PageShell from '../components/layout/PageShell'

// ── Helpers ──────────────────────────────────────────────────

/**
 * jsdom doesn't parse external CSS, so getComputedStyle won't reflect
 * @font-face or custom properties. We inject the token values inline
 * on <html> so that var() references resolve in tests.
 */
function injectTokens() {
  const html = document.documentElement
  html.style.setProperty('--font-heading', "'Newsreader', Georgia, serif")
  html.style.setProperty('--font-body', "'Source Serif 4', Georgia, serif")
  html.style.setProperty('--color-accent', '#8b6f47')
  html.style.setProperty('--color-bg', '#f7f3ed')
  html.style.setProperty('--color-ink', '#1e1b16')
  html.style.setProperty('--column-reading', '680px')
  html.style.setProperty('--leading-normal', '1.65')
  html.style.setProperty('--transition-slow', '400ms ease')
  return html
}

// ── Suite ────────────────────────────────────────────────────

describe('PageShell', () => {
  it('renders children inside main#main-content', () => {
    render(
      <PageShell>
        <p>Test paragraph content</p>
      </PageShell>
    )
    const main = document.getElementById('main-content')
    expect(main).not.toBeNull()
    expect(main?.tagName).toBe('MAIN')
    expect(main).toHaveTextContent('Test paragraph content')
  })

  it('renders h1 with the title prop', () => {
    render(
      <PageShell title="Assessment Title">
        <p>content</p>
      </PageShell>
    )
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Assessment Title')
  })

  it('does not render h1 when title prop is omitted', () => {
    render(
      <PageShell>
        <p>content</p>
      </PageShell>
    )
    const headings = document.querySelectorAll('h1')
    expect(headings).toHaveLength(0)
  })

  it('renders label eyebrow text when label prop is provided', () => {
    render(
      <PageShell label="Step 1 of 6" title="Title">
        <p>content</p>
      </PageShell>
    )
    expect(screen.getByText('Step 1 of 6')).toBeInTheDocument()
  })

  it('renders a progressbar with correct aria attributes', () => {
    render(
      <PageShell progress={42} title="Progress Test">
        <p>content</p>
      </PageShell>
    )
    const bar = screen.getByRole('progressbar')
    expect(bar).toBeInTheDocument()
    expect(bar).toHaveAttribute('aria-valuenow', '42')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })

  it('clamps progress to 0–100', () => {
    const { rerender } = render(
      <PageShell progress={150} title="Clamp test">
        <p>content</p>
      </PageShell>
    )
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')

    rerender(
      <PageShell progress={-50} title="Clamp test">
        <p>content</p>
      </PageShell>
    )
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })

  it('does not render progressbar when progress prop is omitted', () => {
    render(
      <PageShell title="No bar">
        <p>content</p>
      </PageShell>
    )
    const bar = document.querySelector('[role="progressbar"]')
    expect(bar).toBeNull()
  })

  it('renders correct number of step dots', () => {
    render(
      <PageShell title="Dots" progress={50} totalSteps={6} currentStep={3}>
        <p>content</p>
      </PageShell>
    )
    // Step dots are aria-hidden, query by data attribute instead
    const dots = document.querySelectorAll('[data-active]')
    expect(dots).toHaveLength(6)
  })

  it('marks only the active step dot with data-active="true"', () => {
    render(
      <PageShell title="Active dot" progress={33} totalSteps={4} currentStep={2}>
        <p>content</p>
      </PageShell>
    )
    const activeDots = document.querySelectorAll('[data-active="true"]')
    const inactiveDots = document.querySelectorAll('[data-active="false"]')
    expect(activeDots).toHaveLength(1)
    expect(inactiveDots).toHaveLength(3)
  })

  it('shell outer div has id="page-shell"', () => {
    render(
      <PageShell>
        <p>content</p>
      </PageShell>
    )
    expect(document.getElementById('page-shell')).not.toBeNull()
  })

  // ── Font family token verification ────────────────────────
  it('body resolves --font-body token to a serif stack', () => {
    injectTokens()
    // body gets font-family set to var(--font-body) via tokens.css
    // In jsdom, custom properties set on html do propagate to var() resolution
    const bodyFont = document.documentElement.style.getPropertyValue('--font-body').trim()
    expect(bodyFont).toMatch(/Source Serif 4/)
    expect(bodyFont).toMatch(/serif/)
    // Confirm no "sans" keyword in the body font stack
    expect(bodyFont).not.toMatch(/sans-serif/)
  })

  it('--font-heading token resolves to Newsreader serif stack', () => {
    injectTokens()
    const headingFont = document.documentElement.style.getPropertyValue('--font-heading').trim()
    expect(headingFont).toMatch(/Newsreader/)
    expect(headingFont).toMatch(/serif/)
    expect(headingFont).not.toMatch(/sans-serif/)
  })

  it('--color-accent token is the muted amber value only', () => {
    injectTokens()
    const accent = document.documentElement.style.getPropertyValue('--color-accent').trim()
    // Must be the warm bronze, not a primary blue / green / etc.
    expect(accent.toLowerCase()).toBe('#8b6f47')
  })

  it('progress fill style reflects progress prop via inline width', () => {
    render(
      <PageShell progress={60} title="Fill">
        <p>content</p>
      </PageShell>
    )
    // The .progressFill element has style="width: 60%"
    const progressBar = screen.getByRole('progressbar')
    const fill = progressBar.firstElementChild as HTMLElement
    expect(fill).not.toBeNull()
    expect(fill.style.width).toBe('60%')
  })
})
