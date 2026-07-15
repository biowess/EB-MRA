// ─────────────────────────────────────────────────────────────
// FaqView — Frequently Asked Questions
//
// Questions written from the perspective of a first-time user:
//   • What is this tool / who is it for?
//   • How does the assessment work?
//   • Scoring, results, interpreting domains
//   • Privacy / data storage
//   • Technical / browser requirements
//   • Research / citation
//
// Accordion pattern: CSS grid-template-rows trick for smooth
// expand/collapse without JS height measurement.
// ─────────────────────────────────────────────────────────────
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import styles from './FaqView.module.css'

// ── Types ─────────────────────────────────────────────────────

interface FaqItem {
  id: string
  question: string
  answer: React.ReactNode
}

interface FaqCategory {
  id: string
  label: string
  items: FaqItem[]
}

// ── FAQ data ──────────────────────────────────────────────────

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'about',
    label: 'About the Assessment',
    items: [
      {
        id: 'what-is-ebmra',
        question: 'What exactly is EB-MRA?',
        answer: (
          <>
            <p>
              EB-MRA stands for <strong>Evidence Based Medicine Readiness Assessment</strong>. It is a
              self-administered psychometric instrument designed to help clinicians, medical students,
              and health professionals gauge their current level of EBM competency across several
              core domains.
            </p>
            <p>
              Unlike a quiz with right-or-wrong answers, EB-MRA asks you to rate your own confidence
              and frequency of practice across skills like critically appraising research, applying
              statistics at the bedside, and integrating patient values — then produces a scored
              profile you can use for reflection and learning.
            </p>
          </>
        ),
      },
      {
        id: 'who-is-it-for',
        question: 'Who should use this tool?',
        answer: (
          <>
            <p>
              EB-MRA is designed for:
            </p>
            <p>
              <strong>Clinicians</strong> wanting a structured self-audit of their EBM practice.{' '}
              <strong>Medical students and residents</strong> building evidence appraisal skills and
              wanting a baseline.{' '}
              <strong>Educators and curriculum designers</strong> seeking a diagnostic snapshot of
              learner readiness before or after teaching interventions.
            </p>
            <p>
              The tool is <em>not</em> directed at the general public — the items assume familiarity
              with clinical research, statistics, and healthcare decision-making.
            </p>
          </>
        ),
      },
      {
        id: 'validated',
        question: 'Has this assessment been formally validated?',
        answer: (
          <p>
            EB-MRA is a <strong>research-stage instrument</strong>. It has not yet undergone full
            psychometric validation in a large clinical population. You should treat your results as
            a reflective learning aid, not a certified credential or clinical benchmark. The
            methodology underpinning the domain structure is documented in the accompanying
            methodology paper on ResearchGate (link in the footer).
          </p>
        ),
      },
      {
        id: 'diagnosis',
        question: 'Can I use this to make clinical decisions?',
        answer: (
          <p>
            <strong>No.</strong> EB-MRA is a self-assessment and educational tool only. It does not
            constitute a diagnostic instrument, clinical decision support, or medical advice.
            Results must not be used to guide patient care, professional credentialing, or
            certification decisions. See our full disclaimer in the footer.
          </p>
        ),
      },
    ],
  },
  {
    id: 'assessment',
    label: 'Taking the Assessment',
    items: [
      {
        id: 'how-long',
        question: 'How long does the assessment take?',
        answer: (
          <p>
            Most users complete EB-MRA in <strong>10–20 minutes</strong>. The time varies depending
            on how carefully you reflect on each item. There is no time limit — you are encouraged to
            read each question carefully before responding.
          </p>
        ),
      },
      {
        id: 'consent',
        question: 'Why is there a consent screen before I start?',
        answer: (
          <p>
            Because EB-MRA is a research-stage instrument, we ask for your informed consent before
            you begin. The consent screen outlines the educational nature of the tool, the absence of
            data collection, and the limitations of the results. You must acknowledge this before
            proceeding — this is standard practice for psychometric research instruments.
          </p>
        ),
      },
      {
        id: 'save-progress',
        question: 'Can I save my progress and come back later?',
        answer: (
          <p>
            Not currently. The assessment is designed to be completed in a single sitting.
            If you close the browser tab, your in-progress responses will be lost.
            Once you <em>complete</em> the assessment, your final scored result is saved to your
            browser's <code>localStorage</code>, so you can revisit it via the{' '}
            <strong>Last Result</strong> link in the navigation — even after closing the tab.
          </p>
        ),
      },
      {
        id: 'retake',
        question: 'Can I retake the assessment?',
        answer: (
          <p>
            Yes — you can start a new assessment at any time by clicking <strong>Start Assessment</strong>{' '}
            on the home page. Completing a new assessment overwrites your previously saved result.
            This makes it useful as a longitudinal tracking tool: take it at the start of a training
            programme, then retake it at the end to see how your profile has changed.
          </p>
        ),
      },
      {
        id: 'response-scale',
        question: 'What do the response options mean?',
        answer: (
          <p>
            Each item uses a <strong>Likert-style rating scale</strong>. Depending on the item type,
            you may be rating your level of <em>confidence</em> in a skill, the <em>frequency</em>{' '}
            with which you apply it in practice, or your level of <em>agreement</em> with a statement.
            The scale and anchors are shown clearly on each question page. Read the prompt carefully —
            the dimension being rated changes across item sets.
          </p>
        ),
      },
    ],
  },
  {
    id: 'scoring',
    label: 'Scores & Results',
    items: [
      {
        id: 'how-scored',
        question: 'How is my score calculated?',
        answer: (
          <>
            <p>
              Items are grouped into <strong>thematic domains</strong> (e.g., Critical Appraisal,
              Statistical Literacy, Clinical Application). Within each domain, your raw Likert
              responses are averaged to produce a domain score. An overall composite score is then
              derived from the domain averages.
            </p>
            <p>
              All scoring happens entirely in your browser — nothing is sent to a server. See the
              methodology paper for full scoring algorithms.
            </p>
          </>
        ),
      },
      {
        id: 'score-ranges',
        question: 'What do the score bands mean?',
        answer: (
          <>
            <p>
              Your overall and per-domain scores are reported on a 1–5 scale. The approximate
              interpretive bands are:
            </p>
            <table className={styles.scoreTable} aria-label="Score interpretation bands">
              <thead>
                <tr>
                  <th scope="col">Score</th>
                  <th scope="col">Indicative level</th>
                  <th scope="col">Typical profile</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>4.5 – 5.0</strong></td>
                  <td>Advanced</td>
                  <td>Highly confident, frequent practitioner of EBM skills</td>
                </tr>
                <tr>
                  <td><strong>3.5 – 4.4</strong></td>
                  <td>Proficient</td>
                  <td>Solid foundational competency; some gaps in advanced skills</td>
                </tr>
                <tr>
                  <td><strong>2.5 – 3.4</strong></td>
                  <td>Developing</td>
                  <td>Emerging competency; regular practice recommended</td>
                </tr>
                <tr>
                  <td><strong>1.0 – 2.4</strong></td>
                  <td>Foundational</td>
                  <td>Early stage; structured EBM training is advised</td>
                </tr>
              </tbody>
            </table>
            <p style={{ marginTop: 'var(--space-4)' }}>
              These bands are <em>indicative only</em> and have not been norm-referenced against a
              validated clinical population.
            </p>
          </>
        ),
      },
      {
        id: 'domain-scores',
        question: 'My overall score looks good but one domain is low — should I worry?',
        answer: (
          <p>
            Domain-level variation is expected and is actually one of the most useful aspects of
            EB-MRA. A lower score in, say, <em>Statistical Literacy</em> while scoring high in{' '}
            <em>Clinical Application</em> pinpoints exactly where to focus your continuing
            professional development. Use the domain radar chart on your results page to identify
            your specific learning priorities.
          </p>
        ),
      },
      {
        id: 'share-results',
        question: 'Can I share or export my results?',
        answer: (
          <p>
            Your results page is designed to be <strong>printable</strong> — use your browser's
            built-in print function (<kbd>Ctrl+P</kbd> / <kbd>⌘+P</kbd>) to save a PDF copy.
            There is currently no built-in share or export button. Your results are not linked to
            any account or email address, so they cannot be retrieved from a server.
          </p>
        ),
      },
    ],
  },
  {
    id: 'privacy',
    label: 'Privacy & Data',
    items: [
      {
        id: 'data-collected',
        question: 'What data does EB-MRA collect?',
        answer: (
          <p>
            <strong>None.</strong> EB-MRA collects no personal data whatsoever. There are no
            analytics trackers, no cookies, and no user accounts. Your responses are processed
            entirely within your browser and are never transmitted to any server. See our full{' '}
            <Link to="/privacy">Privacy Policy</Link> for details.
          </p>
        ),
      },
      {
        id: 'localstorage',
        question: 'What is stored in my browser?',
        answer: (
          <p>
            If you complete an assessment, your <em>scored result</em> (domain scores and composite
            score — not individual item responses) is saved to your browser's{' '}
            <code>localStorage</code> under the key <code>ebmra_last_result</code>. This data never
            leaves your device. You can delete it at any time through your browser's developer tools
            (<kbd>F12</kbd> → Application → Local Storage) or by clearing site data in your browser
            settings.
          </p>
        ),
      },
      {
        id: 'anonymous',
        question: 'Is the assessment anonymous?',
        answer: (
          <p>
            Completely. EB-MRA has no login, no registration, and no mechanism to link your
            responses to your identity. Not even the developer can see your responses.
          </p>
        ),
      },
    ],
  },
  {
    id: 'technical',
    label: 'Technical',
    items: [
      {
        id: 'browser-support',
        question: 'Which browsers does EB-MRA support?',
        answer: (
          <p>
            EB-MRA is tested on the latest stable versions of <strong>Chrome</strong>,{' '}
            <strong>Firefox</strong>, <strong>Safari</strong>, and <strong>Edge</strong>. It requires
            JavaScript to be enabled. Internet Explorer is not supported.
          </p>
        ),
      },
      {
        id: 'mobile',
        question: 'Can I take the assessment on my phone?',
        answer: (
          <p>
            Yes — EB-MRA is fully responsive. The layout adapts to mobile and tablet screen sizes.
            That said, for a comfortable reading experience with longer question stems, a tablet or
            desktop is recommended.
          </p>
        ),
      },
      {
        id: 'offline',
        question: 'Does it work offline?',
        answer: (
          <p>
            EB-MRA is a static single-page application. Once the page is loaded in your browser,
            the assessment itself runs entirely client-side. If you lose your internet connection
            mid-assessment, you can still complete and submit your responses — though page
            navigation may require a connection to the hosting server.
          </p>
        ),
      },
      {
        id: 'open-source',
        question: 'Is the source code available?',
        answer: (
          <p>
            Yes. EB-MRA is released under a custom source-available license. You can browse the
            source code on GitHub (link in the footer). You may read and study the code; however,
            commercial use, redistribution, and derivative instruments require written permission
            from the author. See the <Link to="/license">License</Link> page for the full terms.
          </p>
        ),
      },
    ],
  },
]

// ── Accordion item ─────────────────────────────────────────────

function AccordionItem({ item, isOpen, onToggle }: {
  item: FaqItem
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className={styles.item}>
      <button
        id={`faq-btn-${item.id}`}
        className={styles.question}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
        onClick={onToggle}
      >
        <span>{item.question}</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        id={`faq-answer-${item.id}`}
        className={`${styles.answerWrapper} ${isOpen ? styles.answerWrapperOpen : ''}`}
        role="region"
        aria-labelledby={`faq-btn-${item.id}`}
      >
        <div className={styles.answerInner}>
          <div className={styles.answer}>
            {item.answer}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Component ──────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
}

export default function FaqView() {
  // Track which items are open; key = item id
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  function toggleItem(id: string) {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <main className={styles.page} id="main-content">
        <div className={styles.container}>

          {/* ── Header ──────────────────────────────────────── */}
          <motion.header
            className={styles.header}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className={styles.eyebrow}>Support</span>
            <h1 className={styles.title}>Frequently Asked Questions</h1>
            <p className={styles.meta}>
              Common questions about EB-MRA — the assessment, scoring, data privacy, and more.
            </p>
          </motion.header>

          {/* ── Intro callout ────────────────────────────────── */}
          <motion.div
            className={styles.callout}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <p>
              Can't find what you're looking for? Open an issue on{' '}
              <a
                href="https://github.com/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>{' '}
              and we'll get back to you. You can also read the full{' '}
              <Link to="/documentation">Documentation</Link> for a deeper dive into methodology
              and scoring.
            </p>
          </motion.div>

          {/* ── Accordion categories ─────────────────────────── */}
          {FAQ_CATEGORIES.map((category, catIndex) => (
            <motion.section
              key={category.id}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={catIndex + 1}
              aria-labelledby={`cat-${category.id}`}
            >
              <p
                id={`cat-${category.id}`}
                className={styles.categoryHeading}
              >
                {category.label}
              </p>

              <div>
                {category.items.map((item) => (
                  <AccordionItem
                    key={item.id}
                    item={item}
                    isOpen={!!openItems[item.id]}
                    onToggle={() => toggleItem(item.id)}
                  />
                ))}
              </div>
            </motion.section>
          ))}

          <hr className={styles.divider} />

          {/* ── CTA block ────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.4 }}
          >
            <div className={styles.ctaBlock}>
              <h2>Ready to take the assessment?</h2>
              <p>
                EB-MRA takes 10–20 minutes and runs entirely in your browser — no account needed,
                no data collected.
              </p>
              <Link to="/assessment" className={styles.ctaBtn} id="faq-cta-start" aria-label="Begin the Medical Readiness Assessment">
                Start Assessment
                <span className={styles.ctaBtnArrow} aria-hidden="true">
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
            </div>
          </motion.div>

          {/* ── Back link ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.4 }}
            style={{ marginTop: 'var(--space-8)' }}
          >
            <Link to="/" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-ink-faint)' }}>
              ← Back to home
            </Link>
          </motion.div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
