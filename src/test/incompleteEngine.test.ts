import { describe, it, expect } from 'vitest'
import { computeDomainScore } from '../engine/domainScore'
import { QUESTIONS } from '../data/loadQuestions'
import type { AnswerValue } from '../types/answers'

describe('Incomplete submissions (Tier 2/3)', () => {
  it('returns a normal report with insufficient_data domains when 20 items are missing', () => {
    const answers: Record<string, AnswerValue> = {}
    
    // Fill all but 20 questions
    // Make sure we miss items across domains so some get insufficient_data
    for (let i = 0; i < QUESTIONS.length - 20; i++) {
      const q = QUESTIONS[i]
      answers[q.id] = q.response_type === 'LIKERT5' ? 3 : 'A'
    }

    const result = computeDomainScore(answers)

    expect(result.incomplete).toBe(false)
    
    // Some domains should be insufficient data (since we missed the last 20 questions)
    const insufficientDomains = result.domain_scores.filter(ds => ds.insufficient_data)
    expect(insufficientDomains.length).toBeGreaterThan(0)
  })

  it('returns incomplete=true when 30+ items are missing', () => {
    const answers: Record<string, AnswerValue> = {}
    
    // Fill all but 30 questions
    for (let i = 0; i < QUESTIONS.length - 30; i++) {
      const q = QUESTIONS[i]
      answers[q.id] = q.response_type === 'LIKERT5' ? 3 : 'A'
    }

    const result = computeDomainScore(answers)

    // >25% missing of 104 is >26 missing.
    // 30 missing means it should trigger incomplete = true.
    expect(result.incomplete).toBe(true)
  })
})
