// ─────────────────────────────────────────────────────────────
// TopNav — persistent top navigation bar
//
// Features:
//   • Desktop: brand left, nav links right
//   • Mobile: brand left, hamburger right → drawer menu
//   • Active link highlighted via React Router's NavLink
//   • "Results" link shows toast if no cached test found
//   • Keyboard accessible (tab order, focus rings, Escape to close)
//   • All styling via TopNav.module.css (design tokens, no Tailwind)
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import styles from './TopNav.module.css'

// ── Constants ─────────────────────────────────────────────────

export const LAST_RESULT_STORAGE_KEY = 'ebmra_last_result'

// ── Toast sub-component ───────────────────────────────────────
// Inline, lightweight — avoids re-implementing the toast from AssessmentRunner

interface NavToastProps {
  message: string
  onDismiss: () => void
}

function NavToast({ message, onDismiss }: NavToastProps) {
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Start exit animation after 3.7 seconds, then fully unmount at 4.0 seconds
    const leaveTimer = setTimeout(() => setIsLeaving(true), 3700)
    const dismissTimer = setTimeout(onDismiss, 4000)

    return () => {
      clearTimeout(leaveTimer)
      clearTimeout(dismissTimer)
    }
  }, [onDismiss])

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`${styles.toast} ${isLeaving ? styles.toastLeaving : ''}`}
    >
      {message}
    </div>
  )
}

// ── Nav items ─────────────────────────────────────────────────

interface NavItem {
  id: string
  label: string
  to: string
  hasResultDot?: boolean
}

// ── Component ─────────────────────────────────────────────────

export default function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [hasLastResult, setHasLastResult] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const drawerRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  // Check localStorage for a cached result on mount & whenever storage changes
  useEffect(() => {
    const check = () => {
      const stored = localStorage.getItem(LAST_RESULT_STORAGE_KEY)
      setHasLastResult(!!stored)
    }
    check()
    window.addEventListener('storage', check)
    return () => window.removeEventListener('storage', check)
  }, [])

  // Close drawer on Escape key
  useEffect(() => {
    if (!mobileOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        hamburgerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileOpen])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Track scroll for nav shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll() // initial check
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeDrawer = useCallback(() => setMobileOpen(false), [])

  const showToast = useCallback((msg: string) => {
    setToast(msg)
  }, [])

  const handleSamePageScroll = (e: React.MouseEvent, to: string) => {
    if (location.pathname === to) {
      e.preventDefault()
      document.documentElement.style.scrollBehavior = 'auto'
      window.scrollTo(0, 0)
      requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = ''
      })
    }
  }

  function handleResultsClick(e: React.MouseEvent, to: string) {
    if (!hasLastResult) {
      e.preventDefault()
      showToast("You haven't taken a test yet — complete the assessment first.")
      closeDrawer()
    } else {
      handleSamePageScroll(e, to)
      closeDrawer()
    }
  }

  // Build nav items
  const navItems: NavItem[] = [
    { id: 'nav-home', label: 'Home', to: '/' },
    { id: 'nav-about', label: 'About', to: '/about' },
    {
      id: 'nav-results',
      label: 'Last Result',
      to: '/results',
      hasResultDot: hasLastResult,
    },
    { id: 'nav-documentation', label: 'Documentation', to: '/documentation' },
    { id: 'nav-faq', label: 'FAQ', to: '/faq' },
  ]

  // Shared link class resolver for NavLink's className prop
  const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`

  return (
    <>
      {/* ── Nav bar ─────────────────────────────────────────── */}
      <nav
        className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}
        aria-label="Main navigation"
        id="top-nav"
      >
        <div className={styles.inner}>

          {/* ── Brand ─────────────────────────────────────── */}
          <NavLink
            to="/"
            className={styles.brand}
            aria-label="EB-MRA — go to home"
            id="nav-brand"
            onClick={(e) => handleSamePageScroll(e, '/')}
          >
            <div className={styles.brandTitle} aria-hidden="true">
              <span className={styles.brandTextBold}>EB</span>
              <svg className={styles.eightDotCircle} width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="12" cy="3" r="1.5" />
                <circle cx="18.364" cy="5.636" r="1.5" />
                <circle cx="21" cy="12" r="1.5" />
                <circle cx="18.364" cy="18.364" r="1.5" />
                <circle cx="12" cy="21" r="1.5" />
                <circle cx="5.636" cy="18.364" r="1.5" />
                <circle cx="3" cy="12" r="1.5" />
                <circle cx="5.636" cy="5.636" r="1.5" />
              </svg>
              <span className={styles.brandTextLight}>MRA</span>
            </div>
          </NavLink>

          {/* ── Desktop links ─────────────────────────────── */}
          <ul
            className={styles.desktopLinks}
            role="list"
            aria-label="Site navigation"
          >
            {navItems.map((item) => {
              if (item.id === 'nav-results') {
                return (
                  <li key={item.id}>
                    <NavLink
                      id={item.id}
                      to={item.to}
                      className={desktopLinkClass}
                      onClick={(e) => handleResultsClick(e, item.to)}
                      aria-label={
                        hasLastResult
                          ? 'View your last test result'
                          : 'Last result — no test taken yet'
                      }
                    >
                      {item.hasResultDot && (
                        <span className={styles.resultsDot} aria-hidden="true" />
                      )}
                      {item.label}
                    </NavLink>
                  </li>
                )
              }
              return (
                <li key={item.id}>
                  <NavLink
                    id={item.id}
                    to={item.to}
                    className={desktopLinkClass}
                    end={item.to === '/'}
                    onClick={(e) => handleSamePageScroll(e, item.to)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              )
            })}
          </ul>

          {/* ── Hamburger (mobile) ────────────────────────── */}
          <button
            ref={hamburgerRef}
            id="nav-hamburger"
            className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-drawer"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <span className={styles.hamburgerIcon} aria-hidden="true">
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
              <span className={styles.hamburgerLine} />
            </span>
          </button>

        </div>
      </nav>

      {/* ── Mobile overlay (tap to close) ───────────────────── */}
      <div
        className={`${styles.mobileOverlay} ${mobileOpen ? styles.mobileOverlayVisible : ''}`}
        aria-hidden="true"
        onClick={closeDrawer}
      />

      {/* ── Mobile drawer ───────────────────────────────────── */}
      <div
        ref={drawerRef}
        id="mobile-drawer"
        className={`${styles.mobileDrawer} ${mobileOpen ? styles.mobileDrawerOpen : ''}`}
        role="dialog"
        aria-label="Mobile navigation menu"
        aria-modal={mobileOpen}
        hidden={!mobileOpen}
      >
        <ul className={styles.mobileLinks} role="list">
          {navItems.map((item) => {
            if (item.id === 'nav-results') {
              return (
                <li key={item.id}>
                  <NavLink
                    id={`mobile-${item.id}`}
                    to={item.to}
                    className={mobileLinkClass}
                    onClick={(e) => handleResultsClick(e, item.to)}
                    aria-label={
                      hasLastResult
                        ? 'View your last test result'
                        : 'Last result — no test taken yet'
                    }
                  >
                    {item.hasResultDot && (
                      <span className={styles.resultsDot} aria-hidden="true" />
                    )}
                    {item.label}
                  </NavLink>
                </li>
              )
            }
            return (
              <li key={item.id}>
                <NavLink
                  id={`mobile-${item.id}`}
                  to={item.to}
                  className={mobileLinkClass}
                  end={item.to === '/'}
                  onClick={(e) => {
                    handleSamePageScroll(e, item.to)
                    closeDrawer()
                  }}
                >
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>

      {/* ── Toast ───────────────────────────────────────────── */}
      {toast && (
        <NavToast
          message={toast}
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  )
}
