// ─────────────────────────────────────────────────────────────
// SafetyResourcesScreen — empathetic crisis support page
//
// Triggered by the safety gate when assessment responses suggest
// significant emotional distress. Replaces the standard report
// with a carefully-worded page offering crisis resources.
//
// Theme behaviour:
//   • On mount, adds `safety-theme` class to <body>
//   • tokens.css overrides cascade pastel-blue tones through
//     every component (nav, footer, cards, borders)
//   • On unmount, removes the class → body fades back to beige
//
// Props:
//   onReturnHome       — navigates back to home
//
// All styling via SafetyResourcesScreen.module.css + design tokens.
// No Tailwind utility classes used.
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageShell from '../components/layout/PageShell'
import styles from './SafetyResourcesScreen.module.css'

// ── Props ────────────────────────────────────────────────────

interface SafetyResourcesScreenProps {
  onReturnHome: () => void
}

// ── Animation variants — gentle, not dramatic ────────────────

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
}

// ── Component ────────────────────────────────────────────────

export default function SafetyResourcesScreen({
  onReturnHome,
}: SafetyResourcesScreenProps) {

  const [accordionOpen, setAccordionOpen] = useState(false)
  const [hasContacted, setHasContacted] = useState(false)

  // ── Theme toggle ──────────────────────────────────────────
  useEffect(() => {
    document.body.classList.add('safety-theme')
    return () => {
      document.body.classList.remove('safety-theme')
    }
  }, [])

  return (
    <PageShell label="Evidence Based Medicine Readiness Assessment" progress={100}>
      <div
        className={styles.container}
        data-testid="safety-resources-screen"
        role="main"
        aria-label="Safety and wellbeing resources"
      >

        {/* ── Hero heading with heart icon ──────────────────── */}
        <motion.div
          className={styles.heroSection}
          custom={0}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className={styles.heading}>
            <svg
              className={styles.heartIcon}
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Before You Continue
          </h1>
        </motion.div>

        {/* ── Empathetic introduction ───────────────────────── */}
        <motion.div
          custom={1}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <p className={styles.leadText}>
            <strong>Thank you for taking the time to answer these questions honestly.</strong>
          </p>
          <p className={styles.bodyText}>
            Some of your responses suggest that you may be experiencing significant
            emotional distress right now.
          </p>
          <p className={styles.bodyText}>
            This assessment is designed to support self-reflection, but it{' '}
            <strong>cannot determine whether someone is in crisis or replace care
            from a qualified mental health professional.</strong>
          </p>
          <p className={styles.bodyText}>
            <strong>Your wellbeing matters more than completing this assessment.</strong>{' '}
            If you're feeling overwhelmed, hopeless, or like you might be at risk
            of harming yourself, please reach out to someone you trust or contact
            a crisis service in your area as soon as possible.
          </p>
        </motion.div>

        <hr className={styles.divider} />

        {/* ── "You don't have to go through this alone" ─────── */}
        <motion.div
          custom={2}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className={styles.sectionHeading}>
            You don't have to go through this alone
          </h2>
          <p className={styles.bodyText}>
            Even if it feels difficult right now, talking to another person can help.
          </p>
          <p className={styles.bodyTextMuted}>Consider reaching out to:</p>

          <ul className={styles.resourceList}>
            <li className={styles.resourceItem}>
              {/* People / friend icon */}
              <svg className={styles.resourceIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>A trusted friend or family member</span>
            </li>
            <li className={styles.resourceItem}>
              {/* Stethoscope / medical icon */}
              <svg className={styles.resourceIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                <circle cx="20" cy="10" r="2" />
              </svg>
              <span>Your doctor or another healthcare professional</span>
            </li>
            <li className={styles.resourceItem}>
              {/* Graduation cap / university icon */}
              <svg className={styles.resourceIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 10 3 12 0v-5" />
              </svg>
              <span>A university counselor or student wellness service</span>
            </li>
            <li className={styles.resourceItem}>
              {/* Brain / psychology icon */}
              <svg className={styles.resourceIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z" />
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z" />
              </svg>
              <span>A licensed psychologist or psychiatrist</span>
            </li>
            <li className={styles.resourceItem}>
              {/* Shield / emergency icon */}
              <svg className={styles.resourceIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
              <span>A local crisis or emergency service if you're in immediate danger</span>
            </li>
          </ul>
        </motion.div>

        <hr className={styles.divider} />

        {/* ── Tunisia-specific resources ────────────────────── */}
        <motion.div
          custom={3}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className={styles.sectionHeading}>If you're in Tunisia</h2>

          <div className={styles.emergencyCard}>
            <div className={styles.emergencyRow}>
              <div className={styles.emergencyLabel}>
                <svg className={styles.emergencyIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>Medical Emergency (SAMU):</span>
              </div>
              <a href="tel:190" className={styles.emergencyNumber}>190</a>
            </div>

            <div className={styles.emergencyRow}>
              <div className={styles.emergencyLabel}>
                <svg className={styles.emergencyIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>National psychological support line:</span>
              </div>
              <a href="tel:80105050" className={styles.emergencyNumber}>80 10 50 50</a>
            </div>
            <p className={styles.emergencyNote}>
              Ministry of Health psychological support service
            </p>
          </div>

          <p className={styles.bodyTextEmphasis}>
            If you believe you are in immediate danger of acting on suicidal
            thoughts, or cannot keep yourself safe, call <strong>190</strong> or
            go to the nearest hospital emergency department immediately.
          </p>
        </motion.div>

        <hr className={styles.divider} />

        {/* ── International resources ──────────────────────── */}
        <motion.div
          custom={4}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className={styles.sectionHeading}>International resources</h2>
          <p className={styles.bodyText}>If you're outside Tunisia:</p>

          <ul className={styles.resourceListPlain}>
            <li>Contact your local emergency medical service if you're in immediate danger.</li>
            <li>Many countries have national suicide prevention or crisis helplines.</li>
            <li>
              Search for <strong>"suicide crisis hotline [your country]"</strong> or{' '}
              <strong>"mental health crisis service [your country]"</strong> if
              you don't know the number.
            </li>
          </ul>

          <div className={styles.countryCard}>
            <h3 className={styles.countryHeading}>United States</h3>
            <div className={styles.countryRow}>
              <span className={styles.countryLabel}>988 Suicide &amp; Crisis Lifeline</span>
              <span className={styles.countryDetail}>
                Call or text <a href="tel:988" className={styles.phoneLink}>988</a>
              </span>
            </div>
            <div className={styles.countryRow}>
              <span className={styles.countryLabel}>Crisis Text Line</span>
              <span className={styles.countryDetail}>
                Text <strong>HOME</strong> to <a href="sms:741741" className={styles.phoneLink}>741741</a>
              </span>
            </div>
          </div>
        </motion.div>

        <hr className={styles.divider} />

        {/* ── Reminder ─────────────────────────────────────── */}
        <motion.div
          custom={5}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className={styles.sectionHeading}>A reminder</h2>
          <p className={styles.bodyText}>
            Needing help is not a sign of weakness.
          </p>
          <p className={styles.bodyText}>
            Many people — including medical students and healthcare professionals —
            experience periods of anxiety, depression, burnout, or emotional
            distress. Support is available, and recovery is possible.
          </p>
          <p className={styles.bodyText}>
            If you're able, consider coming back to complete this assessment after
            you've spoken with someone or when you're feeling safer.
          </p>
        </motion.div>

        <hr className={styles.divider} />

        {/* ── Action buttons ───────────────────────────────── */}
        <motion.div
          className={styles.actionsSection}
          custom={6}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          {hasContacted ? (
            <>
              <p className={styles.bodyText} style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 500 }}>
                Thank you for prioritizing your wellbeing. Please take all the time you need.
              </p>
              <Link
                to="/"
                className={styles.ghostButton}
                onClick={onReturnHome}
                id="safety-return-home"
              >
                Return to Home
              </Link>
            </>
          ) : (
            <>
              <a
                href="tel:190"
                className={styles.callButton}
                id="safety-call-190"
                aria-label="Call emergency number 190"
              >
                {/* Phone icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Call 190
              </a>

              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setHasContacted(true)}
                id="safety-contacted-someone"
              >
                I've contacted someone
              </button>

              <Link
                to="/"
                className={styles.ghostButton}
                onClick={onReturnHome}
                id="safety-return-home"
              >
                Return to Home
              </Link>
            </>
          )}
        </motion.div>

        {/* ── Accordion: Why am I seeing this? ────────────── */}
        <motion.div
          className={styles.accordionWrapper}
          custom={7}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <button
            type="button"
            className={styles.accordionTrigger}
            onClick={() => setAccordionOpen(!accordionOpen)}
            aria-expanded={accordionOpen}
            aria-controls="safety-accordion-content"
            id="safety-accordion-trigger"
          >
            <svg
              className={`${styles.accordionChevron} ${accordionOpen ? styles.accordionChevronOpen : ''}`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
            Why am I seeing this?
          </button>

          <div
            id="safety-accordion-content"
            className={`${styles.accordionContent} ${accordionOpen ? styles.accordionContentOpen : ''}`}
            role="region"
            aria-labelledby="safety-accordion-trigger"
          >
            <div className={styles.accordionInner}>
              <p>
                This assessment includes items that screen for indicators of
                significant emotional distress, including thoughts related to
                self-harm or hopelessness.
              </p>
              <p>
                Based on your responses, the assessment's safety gate has been
                activated. This means the system has paused before generating
                your report to ensure you have access to support resources first.
              </p>
              <p>
                If you've already spoken with someone, you can let us know
                using the "I've contacted someone" button above.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── Gentle disclaimer ────────────────────────────── */}
        <motion.p
          className={styles.disclaimer}
          custom={8}
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          This assessment is not a diagnostic or crisis intervention tool.
        </motion.p>

      </div>
    </PageShell>
  )
}
