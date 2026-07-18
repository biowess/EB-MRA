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
              EB-MRA stands for <strong>Evidence-Based Medical Readiness Assessment</strong>. It is
              a 104-item self-report instrument, organized into eight domains, designed to give
              premedical students, career-changers, and early medical trainees a structured
              snapshot of self-reported dispositions relevant to readiness for medical training —
              things like analytical reasoning, intellectual humility, tolerance for ambiguity,
              empathic communication, ethical reasoning, conscientiousness, and resilience.
            </p>
            <p>
              The "evidence-based" in the name refers to how the instrument itself was built — its
              construct definitions, item design, and scoring rules are all grounded in the
              published literature (see the methodology paper, linked in the footer). It is{' '}
              <em>not</em> a test of your knowledge of evidence-based medicine or critical
              appraisal skills. Rather than right-or-wrong answers, it asks you to rate your own
              tendencies and habits of mind, then produces a scored profile meant to support
              reflection — ideally alongside an advisor or mentor.
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
              <strong>Premedical undergraduates</strong> exploring or confirming a path toward
              medicine.{' '}
              <strong>Postbaccalaureate and career-change candidates</strong> considering medicine
              as a new direction.{' '}
              <strong>Early (M1–M2) medical students</strong> reflecting on their own habits early
              in training.{' '}
              <strong>Premedical advisors and mentors</strong> using a completed report as a
              conversation-starter with an advisee.
            </p>
            <p>
              The tool is <em>not</em> intended for admissions committees, employers, residency
              programs, or anyone evaluating another person for admission, hiring, or
              credentialing — see below.
            </p>
          </>
        ),
      },
      {
        id: 'validated',
        question: 'Has this assessment been formally validated?',
        answer: (
          <p>
            No. EB-MRA is a <strong>research-stage, unvalidated instrument</strong>. No reliability
            statistics (like internal consistency) and no validity evidence yet exist for any of
            its scores. You should treat your results as a reflective, formative starting point for
            a conversation with a mentor — not a certified, predictive, or evidence-backed
            measurement of your readiness for medicine. The full validation roadmap (internal
            consistency, factor analysis, item response theory, and more) is described in the
            accompanying methodology paper (link in the footer).
          </p>
        ),
      },
      {
        id: 'diagnosis',
        question: 'Can this be used for admissions, hiring, or diagnosis?',
        answer: (
          <p>
            <strong>No.</strong> EB-MRA is a self-report reflection tool only. It is not a
            diagnostic instrument, not a mental-health screener, and not validated for use in
            admissions, hiring, or credentialing decisions of any kind. This is true both because
            no predictive-validity evidence exists yet, and as an independent ethical position the
            instrument's authors hold regardless of future validation. See our full disclaimer in
            the footer.
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
            Most users complete all 104 items in <strong>20–30 minutes</strong>. There is no time
            limit, but the instrument is designed to be completed in a single sitting rather than
            in short bursts, since attention decay over a long, interrupted session can affect
            response quality.
          </p>
        ),
      },
      {
        id: 'consent',
        question: 'Why is there a consent screen before I start?',
        answer: (
          <p>
            Because EB-MRA is a research-stage instrument, we ask for your informed consent before
            you begin. The consent screen outlines the reflective, formative nature of the tool,
            the absence of data collection, and the limitations of the results. You must
            acknowledge this before proceeding — this is standard practice for psychometric
            research instruments.
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
            Most items use a five-point <strong>agreement scale</strong>, from "Strongly Disagree"
            to "Strongly Agree." A smaller set of items are scenario-based: you'll read a short,
            realistic situation and choose the response option that best matches what you'd
            actually do. Read each item carefully — some are worded so that agreeing reflects a
            lower standing on the trait being measured, which is a deliberate design choice to
            reduce automatic, pattern-following answers.
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
              Items are grouped into <strong>eight domains</strong> (e.g., Scientific & Analytical
              Reasoning, Empathic Communication & Patient-Centeredness, Resilience & Stress
              Tolerance). Within each domain, your weighted responses are combined into a domain
              score on a 0–100 scale. A handful of items also feed validity checks — like a
              social-desirability index — rather than contributing to a domain score directly.
            </p>
            <p>
              Scoring is fully deterministic and happens entirely in your browser — nothing is
              sent to a server. See the methodology paper for the full scoring algorithm.
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
              Each of your eight domain scores is reported on a 0–100 scale. The approximate
              interpretive bands are:
            </p>
            <table className={styles.scoreTable} aria-label="Score interpretation bands">
              <thead>
                <tr>
                  <th scope="col">Score</th>
                  <th scope="col">Indicative level</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>75 – 100</strong></td>
                  <td>Strong</td>
                </tr>
                <tr>
                  <td><strong>50 – 74</strong></td>
                  <td>Established</td>
                </tr>
                <tr>
                  <td><strong>25 – 49</strong></td>
                  <td>Developing</td>
                </tr>
                <tr>
                  <td><strong>0 – 24</strong></td>
                  <td>Emerging</td>
                </tr>
              </tbody>
            </table>
            <p style={{ marginTop: 'var(--space-4)' }}>
              These bands are <em>indicative and descriptive only</em>. They have not been
              norm-referenced against a validated population, and a "Strong" score should not be
              read as a guarantee of anything about your future performance in medical training.
            </p>
          </>
        ),
      },
      {
        id: 'domain-scores',
        question: 'My overall pattern looks good but one domain is low — should I worry?',
        answer: (
          <p>
            Domain-level variation is expected, and it's actually one of the more useful things
            EB-MRA surfaces. A lower score in, say, <em>Ambiguity Tolerance</em> alongside a high
            score in <em>Analytical Reasoning</em> points to a specific, discussable growth edge
            rather than anything alarming. EB-MRA doesn't produce a single overall composite in the
            way a typical test does — instead, it's designed to be discussed domain-by-domain,
            ideally with a mentor, and summarized into one of several descriptive profiles to make
            that conversation easier.
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
            If you complete an assessment, your <em>scored result</em> (domain scores and profile
            — not individual item responses) is saved to your browser's{' '}
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
                href="https://github.com/biowess/EB-MRA/issues"
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
                EB-MRA takes 20–30 minutes and runs entirely in your browser — no account needed,
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
