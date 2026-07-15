// ─────────────────────────────────────────────────────────────
// Footer — multi-column site footer for EBM-RA
//
// Sections:
//   Brand col  — logo, tagline, copyright
//   Product    — ResearchGate methodology paper, Documentation, FAQ
//   Resources  — GitHub Repo, Issues
//   Legal      — License, Privacy Policy, source-available badge,
//                stack info
//
// Bottom band  — disclaimer
// Bottom bar   — tagline + version
// ─────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

// ── External-link arrow icon ──────────────────────────────────
function ExternalIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className={styles.footer} aria-label="Site footer">

      {/* ── Main link grid ───────────────────────────────────── */}
      <div className={styles.footerMain}>

        {/* Brand column */}
        <div className={styles.brandCol}>
          <Link to="/" className={styles.brandName} aria-label="EB-MRA">
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
          </Link>

          <p className={styles.copyright}>
            © 2026 Mohammed W. Hammami. All rights reserved.
          </p>
        </div>

        {/* Product column */}
        <nav className={styles.linkCol} aria-label="Product links">
          <span className={styles.colHeading}>Product</span>
          <a
            href="https://www.researchgate.net/publication/409965326_The_Evidence-Based_Medicine_Readiness_Assessment_EB-MRA_Development_Scoring_Architecture_and_a_Roadmap_for_Empirical_Validation_of_a_Self-Report_Instrument_for_Premedical_and_Early_Medical_Trainees"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Methodology Paper <ExternalIcon />
          </a>
          <Link to="/documentation" className={styles.footerLink}>
            Documentation
          </Link>
          <Link to="/faq" className={styles.footerLink}>
            FAQ
          </Link>
        </nav>

        {/* Resources column */}
        <nav className={styles.linkCol} aria-label="Resource links">
          <span className={styles.colHeading}>Resources</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            GitHub Repository <ExternalIcon />
          </a>
          <a
            href="https://github.com/issues"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            Issues <ExternalIcon />
          </a>
        </nav>

        {/* Legal column */}
        <nav className={styles.linkCol} aria-label="Legal links">
          <span className={styles.colHeading}>Legal</span>
          <Link to="/license" className={styles.footerLink}>
            License
          </Link>
          <Link to="/privacy" className={styles.footerLink}>
            Privacy Policy
          </Link>

          <a href="/license" className={styles.badge}>
            Source-Available
          </a>

          <p className={styles.stackInfo}>
            Built with React · Vite · TypeScript · Framer Motion
          </p>
        </nav>

      </div>

      {/* ── Disclaimer band ──────────────────────────────────── */}
      <div className={styles.disclaimerBand} role="note">
        <div className={styles.disclaimerInner}>
          <p className={styles.disclaimer}>
            <strong>Research Tool Disclaimer:</strong>{' '}
            EB-MRA is a self-assessment instrument intended for educational and research purposes only.
            It has not been formally validated in a clinical population and does not constitute a
            diagnostic tool, clinical decision support, or medical advice. Results should not be used
            to guide patient care, certification, or professional credentialing decisions.
            The instrument is provided "as is" and the author makes no warranties regarding its
            accuracy, completeness, or suitability for any particular purpose.
          </p>
        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────── */}
      <div className={styles.footerBottom}>
        <span className={styles.bottomTagline}>
          Rigorous. Reflective. Evidence-grounded.
        </span>
        <span className={styles.bottomVersion}>EB-MRA v1.0.0</span>
      </div>

    </footer>
  )
}
