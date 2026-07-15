// ─────────────────────────────────────────────────────────────
// AssessmentRunner — full question-by-question flow
//
// Phases:
//   1. CONSENT  — ConsentGate; Begin fires onProceed → advances phase
//   2. QUESTIONS — sequential, one at a time; LikertQuestion or
//                  ScenarioQuestion depending on response_type;
//                  ProgressTracker in the shell header; answering a
//                  question auto-advances; all 104 questions sourced
//                  from QUESTIONS (loadQuestions.ts) — no inline data.
//   3. COMPLETE — quiet "ready to see results" state; report not
//                 rendered here (reserved for a future view).
//
// Orchestration is delegated entirely to useAssessment().
// All question data comes from QUESTIONS via the hook (not re-imported).
//
// Design constraints (tokens.css "luxurious, calm" system):
//   • Serif body / heading fonts via CSS custom properties
//   • Muted accent on progress bar only
//   • No Tailwind utility classes
//   • 300ms deliberate transitions
// ─────────────────────────────────────────────────────────────

import { useState, useMemo, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import AnimatedPage from '../components/layout/AnimatedPage'
import { useAssessment } from '../hooks/useAssessment'
import { QUESTIONS } from '../data/loadQuestions'
import ConsentGate from '../components/gates/ConsentGate'
import ProgressTracker from '../components/layout/ProgressTracker'
import PageShell from '../components/layout/PageShell'
import LikertQuestion from '../components/question/LikertQuestion'
import ScenarioQuestion from '../components/question/ScenarioQuestion'
import type { AnswerValue } from '../types/answers'
import { useScoringResult } from '../hooks/useScoringResult'
import SafetyResourcesScreen from './SafetyResourcesScreen'
import ReportView from './ReportView'
import { LAST_RESULT_STORAGE_KEY } from '../components/layout/TopNav'
import styles from './AssessmentRunner.module.css'

const DOMAIN_NUMERALS: Record<string, string> = {
  SAR: 'I', ELCA: 'II', IHOR: 'III', AMB: 'IV', ECPC: 'V', ERP: 'VI', CSR: 'VII', RST: 'VIII'
}

const QUESTION_LABELS = QUESTIONS.map((q, idx) => {
  let count = 1;
  for (let i = 0; i < idx; i++) {
    if (QUESTIONS[i].domain === q.domain) count++;
  }
  return `${DOMAIN_NUMERALS[q.domain] || '?'}.${count}`;
});

// ── Phase discriminant ───────────────────────────────────────

type Phase = 'consent' | 'questions' | 'complete'

// ── Component ────────────────────────────────────────────────

export default function AssessmentRunner() {
  const [phase, setPhase] = useState<Phase>('consent')

  const [toastError, setToastError] = useState<string | null>(null)
  const [isToastClosing, setIsToastClosing] = useState(false)
  const navigate = useNavigate()
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    setIsToastClosing(false)
    setToastError(msg)
    
    toastTimeoutRef.current = setTimeout(() => {
      setIsToastClosing(true)
    }, 3700)
  }

  const hideToast = () => {
    if (toastError && !isToastClosing) {
      setIsToastClosing(true)
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    }
  }

  const {
    currentQuestionIndex,
    answers,
    item_timestamps,
    consent_confirmed,
    age_bracket_confirmed_16_plus,
    progress,
    isComplete,
    setConsent,
    setAgeConfirmed,
    answerQuestion,
    goNext,
    goBack,
    reset,
  } = useAssessment()

  // Clear toast and scroll to top on navigation
  useEffect(() => {
    hideToast()
    window.scrollTo(0, 0)
  }, [currentQuestionIndex])

  // ── Keyboard Navigation ──────────────────────────────────────
  useEffect(() => {
    if (phase !== 'questions') return

    const question = QUESTIONS[currentQuestionIndex]
    if (!question) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.altKey || e.metaKey) return

      const key = e.key.toUpperCase()

      // Next / Previous
      if (key === 'N' && currentQuestionIndex < QUESTIONS.length - 1) {
        goNext()
      } else if (key === 'P' && currentQuestionIndex > 0) {
        goBack()
      }

      // Options
      if (question.response_type === 'LIKERT5') {
        const num = parseInt(e.key, 10)
        if (!isNaN(num) && num >= 1 && num <= 5) {
          answerQuestion(question.id, num)
          if (toastError) hideToast()
        }
      } else if (question.response_type === 'SINGLE_SELECT') {
        if (['A', 'B', 'C', 'D'].includes(key)) {
          const idx = ['A', 'B', 'C', 'D'].indexOf(key)
          const opts = question.options as { value: any }[]
          if (opts && opts[idx]) {
            answerQuestion(question.id, opts[idx].value)
            if (toastError) hideToast()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phase, currentQuestionIndex, answers, goNext, goBack, answerQuestion, toastError])

  // ── Handlers ──────────────────────────────────────────────

  function handleConsentProceed() {
    setConsent(true)
    setAgeConfirmed(true)
    setPhase('questions')
  }

  function handleAnswer(id: string, value: AnswerValue) {
    answerQuestion(id, value)
    if (toastError) hideToast()
  }

  function handleSubmit() {
    setPhase('complete')
  }

  function handleBackToHome() {
    reset()
    setPhase('consent')
  }

  // ── Completion guard ──────────────────────────────────────
  // The user explicitly transitions to complete phase via handleSubmit.
  const effectivePhase: Phase = phase

  // ── Hook: Scoring ─────────────────────────────────────────
  const submission = useMemo(() => ({
    answers,
    item_timestamps,
    consent_confirmed,
    age_bracket_confirmed_16_plus,
    completed_at: effectivePhase === 'complete' ? new Date().toISOString() : undefined,
  }), [answers, item_timestamps, consent_confirmed, age_bracket_confirmed_16_plus, effectivePhase])

  const { scoringResult, profileResult, isReady } = useScoringResult(submission)

  // ── Persist result to localStorage ────────────────────────
  useEffect(() => {
    if (
      effectivePhase === 'complete' &&
      isReady &&
      scoringResult &&
      profileResult &&
      !scoringResult.safety_gate_triggered
    ) {
      try {
        const payload = JSON.stringify({
          scoringResult,
          profileResult,
          savedAt: new Date().toISOString(),
        })
        localStorage.setItem(LAST_RESULT_STORAGE_KEY, payload)
        // Notify other tabs / TopNav listeners
        window.dispatchEvent(new Event('storage'))
      } catch {
        // Quota exceeded or private browsing — silently ignore
      }
    }
  }, [effectivePhase, isReady, scoringResult, profileResult])

  // ── Render ────────────────────────────────────────────────

  let content;

  if (effectivePhase === 'consent') {
    content = (
      <AnimatedPage key="consent">
        <ConsentGate onProceed={handleConsentProceed} />
      </AnimatedPage>
    )
  } else if (effectivePhase === 'complete') {
    // Safety gate takes priority — render crisis resources immediately.
    if (isReady && scoringResult?.safety_gate_triggered) {
      content = (
        <AnimatedPage key="complete-safety">
          <SafetyResourcesScreen
            onReturnHome={() => navigate('/')}
          />
        </AnimatedPage>
      )
    }
    // Incomplete takes priority over full report if >25% missing
    else if (isReady && scoringResult?.incomplete) {
      content = (
        <AnimatedPage key="complete-incomplete">
          <PageShell
            label="Evidence Based Medicine Readiness Assessment"
            progress={100}
          >
            <div
              className={styles.completeScreen}
              id="assessment-incomplete"
              data-testid="assessment-incomplete"
              role="status"
              aria-live="polite"
            >
              <h1 className={styles.completeHeading}>
                Assessment incomplete
              </h1>
              <p className={styles.completeBody}>
                Your responses were too incomplete to generate a reliable report.
                Would you like to continue where you left off?
              </p>
              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
                <button
                  className={styles.submitButton}
                  onClick={() => setPhase('questions')}
                >
                  Continue Assessment
                </button>
              </div>
            </div>
          </PageShell>
        </AnimatedPage>
      )
    }
    // Scoring ready and no safety gate → render the full report.
    else if (isReady && scoringResult && profileResult) {
      content = (
        <AnimatedPage key="complete-report">
          <PageShell
            label="Evidence Based Medicine Readiness Assessment"
            progress={100}
          >
            <ReportView
              scoringResult={scoringResult}
              profileResult={profileResult}
            />
          </PageShell>
        </AnimatedPage>
      )
    }
    // Scoring still computing (useMemo hasn't resolved yet) → quiet
    // placeholder so the user sees immediate feedback after the last answer.
    else {
      content = (
        <AnimatedPage key="complete-loading">
          <PageShell
            label="Evidence Based Medicine Readiness Assessment"
            progress={100}
          >
            <div
              className={styles.completeScreen}
              id="assessment-complete"
              data-testid="assessment-complete"
              role="status"
              aria-live="polite"
            >
              <h1 className={styles.completeHeading}>
                Assessment complete
              </h1>
              <p className={styles.completeBody}>
                Thank you for completing the Evidence Based Medicine Readiness Assessment.
                Preparing your results…
              </p>
            </div>
          </PageShell>
        </AnimatedPage>
      )
    }
  } else {
    // ── Render: QUESTIONS ─────────────────────────────────────
    const question = QUESTIONS[currentQuestionIndex]

    // Guard: should never be undefined during the question phase,
    // but TypeScript and defensive coding both appreciate this.
    if (!question) {
      content = null
    } else {
      const answeredCount = Object.keys(answers).length
      const totalCount = QUESTIONS.length
      const currentValue = answers[question.id]

      // Navigation progress: 0% at Q1, 100% at last question
      const navProgress = totalCount > 1
        ? Math.round((currentQuestionIndex / (totalCount - 1)) * 100)
        : 0

      content = (
        <AnimatedPage key="questions">
          <PageShell
            label="Evidence Based Medicine Readiness Assessment"
            progress={navProgress}
            onBack={handleBackToHome}
            bottomNav={
              <div className={styles.navigationRow}>
                <div className={styles.navigationInner}>
                  <button
                    className={styles.navButton}
                    onClick={goBack}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous <span className={styles.keyHint}>[P]</span>
                  </button>
                  {currentQuestionIndex < totalCount - 1 ? (
                    <button
                      className={styles.navButton}
                      onClick={goNext}
                    >
                      Next <span className={styles.keyHint}>[N]</span>
                    </button>
                  ) : (
                    <button
                      className={styles.submitButton}
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            }
          >
            {/* ── Progress tracker (thin accent bar) ──────────── */}
            <ProgressTracker
              current={answeredCount}
              total={totalCount}
            />

              {/* ── Question counter ──────────────────────────── */}
              <p
                className={styles.questionCounter}
                aria-label={`Question ${QUESTION_LABELS[currentQuestionIndex]}`}
                data-testid="question-counter"
              >
                <span className={styles.counterCurrent}>
                  {QUESTION_LABELS[currentQuestionIndex]}
                </span>
              </p>

              {/* ── Question body ─────────────────────────────── */}
              <div
                key={question.id}
                className={styles.questionArea}
                data-testid="question-area"
                data-question-id={question.id}
                data-question-type={question.response_type}
              >
                {question.response_type === 'LIKERT5' ? (
                  <LikertQuestion
                    question={question}
                    value={currentValue}
                    onAnswer={(v) => handleAnswer(question.id, v)}
                  />
                ) : (
                  <ScenarioQuestion
                    question={question}
                    value={currentValue}
                    onAnswer={(v) => handleAnswer(question.id, v)}
                  />
                )}
              </div>
          </PageShell>
        </AnimatedPage>
      )
    }
  }

  return (
    <>
      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        {content}
      </AnimatePresence>

      {/* ── Toast Error ─────────────────────────────── */}
      {toastError && typeof document !== 'undefined' && createPortal(
        <div 
          className={`${styles.toastError} ${isToastClosing ? styles.toastFadeOut : ''}`} 
          role="alert"
          onAnimationEnd={() => {
            if (isToastClosing) {
              setToastError(null)
              setIsToastClosing(false)
            }
          }}
        >
          {toastError}
        </div>,
        document.body
      )}
    </>
  )
}
