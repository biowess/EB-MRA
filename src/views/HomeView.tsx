// ─────────────────────────────────────────────────────────────
// HomeView — landing page / entry point
//
// Displays the EB-MRA introduction and CTA to start the assessment.
// Links to /assessment to begin the AssessmentRunner flow.
//
// Uses framer-motion for staggered entrance animations:
//   • Eyebrow, title, subtitle, CTA cascade in
//   • Feature cards stagger with a slight delay
// ─────────────────────────────────────────────────────────────

import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageShell from '../components/layout/PageShell'
import styles from './HomeView.module.css'

const FEATURES = [
  {
    id: 'feature-domains',
    title: '8 Clinical Domains',
    desc: 'Covers analytical reasoning, evidence literacy, ambiguity tolerance, ethics, and more.',
  },
  {
    id: 'feature-questions',
    title: '104 Calibrated Items',
    desc: 'Likert-scale and scenario-based questions validated for medical education contexts.',
  },
  {
    id: 'feature-report',
    title: 'Personalised Report',
    desc: 'Receive band-level domain scores, interaction patterns, and a profile archetype.',
  },
  {
    id: 'feature-private',
    title: 'Fully Private',
    desc: 'Nothing leaves your browser. Results are cached locally and never transmitted.',
  },
]

// ── Animation variants ─────────────────────────────────────

const heroContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.10,
      delayChildren: 0.05,
    },
  },
}

const heroItem = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

const featureContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.45, // wait for hero to finish
    },
  },
}

const featureItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export default function HomeView() {
  return (
    <PageShell>
      <motion.div
        className={styles.root}
        variants={heroContainer}
        initial="hidden"
        animate="show"
      >
        <motion.p
          className={styles.eyebrow}
          aria-label="Tool identifier"
          variants={heroItem}
        >
          EB-MRA · v1.0 · 2026
        </motion.p>

        <motion.h1 className={styles.title} variants={heroItem}>
          Evidence-Based Medical Readiness Assessment
        </motion.h1>

        <motion.p className={styles.subtitle} variants={heroItem}>
          A self-reflection tool for medical students and clinicians. Understand
          where you stand across eight EBM-readiness domains and receive a
          detailed, personalised report.
        </motion.p>

        <motion.p className={styles.disclaimer} variants={heroItem}>
          This is an unvalidated self-reflection tool built for fun and peer discussion — not a validated psychometric instrument, and not for admissions, hiring, or clinical/diagnostic use.
        </motion.p>

        <motion.div variants={heroItem}>
          <Link
            to="/assessment"
            className={styles.cta}
            id="home-start-cta"
            aria-label="Begin the EBM Readiness Assessment"
          >
            Begin Assessment
            <span className={styles.ctaArrow} aria-hidden="true">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 7h12M8 2l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </motion.div>

        <motion.div
          className={styles.divider}
          aria-hidden="true"
          variants={heroItem}
        />

        <motion.div
          className={styles.featureGrid}
          role="list"
          aria-label="Key features"
          variants={featureContainer}
          initial="hidden"
          animate="show"
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.id}
              id={f.id}
              className={styles.featureCard}
              role="listitem"
              variants={featureItem}
            >
              <p className={styles.featureTitle}>{f.title}</p>
              <p className={styles.featureDesc}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </PageShell>
  )
}
