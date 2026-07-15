import type { AnswerValue } from "../types/answers.ts"
import type { DomainId } from "../types/domain.ts"
import type { Question } from "../types/question.ts"
import { RULES } from "../data/loadRules.ts"
import { QUESTIONS } from "../data/loadQuestions.ts"
import { contributionScore } from "./contribution.ts"

const questionMap = new Map<string, Question>(QUESTIONS.map(q => [q.id, q]))

const SD_ITEM_IDS: string[] = [
  "SAR-A03", "ELCA-A03", "IHOR-A03", "AMB-A03",
  "ECPC-A03", "ERP-A03", "CSR-A03", "RST-A03",
]

export function detectConsistencyFlags(answers: Record<string, AnswerValue>): string[] {
  const flags: string[] = []
  for (const [idA, idB] of RULES.consistency_pairs) {
    const rawA = answers[idA]
    const rawB = answers[idB]
    if (rawA === undefined || rawA === null || rawB === undefined || rawB === null) continue

    const qA = questionMap.get(idA)
    const qB = questionMap.get(idB)
    if (!qA || !qB) continue

    const scoreA = contributionScore(rawA, qA)
    const scoreB = contributionScore(rawB, qB)
    const divergence = Math.abs(scoreA - scoreB)

    if (divergence >= 3) {
      flags.push(`${idA}/${idB}`)
    }
  }
  return flags
}

export function detectStraightLining(
  answers: Record<string, AnswerValue>,
  orderedQuestionIds: string[],
): boolean {
  const likertIds = orderedQuestionIds.filter(id => {
    const q = questionMap.get(id)
    return q && q.response_type === "LIKERT5"
  })

  for (let i = 0; i <= likertIds.length - 10; i++) {
    const window = likertIds.slice(i, i + 10)
    const values = window
      .map(id => answers[id])
      .filter(v => v !== undefined && v !== null) as number[]

    if (values.length < 10) continue

    const first = values[0]
    if (values.every(v => v === first)) {
      return true
    }
  }
  return false
}

export function detectContradictions(
  domainId: DomainId,
  answers: Record<string, AnswerValue>,
): boolean {
  const domainQuestions = QUESTIONS.filter(q => q.domain === domainId)

  const coreItems = domainQuestions.filter(q => q.item_type === "core")
  const scenarioItems = domainQuestions.filter(q => q.item_type === "scenario")

  const coreScores: number[] = []
  for (const q of coreItems) {
    const raw = answers[q.id]
    if (raw !== undefined && raw !== null) {
      coreScores.push(contributionScore(raw, q))
    }
  }

  const scenarioScores: number[] = []
  for (const q of scenarioItems) {
    const raw = answers[q.id]
    if (raw !== undefined && raw !== null) {
      scenarioScores.push(contributionScore(raw, q))
    }
  }

  if (coreScores.length === 0 || scenarioScores.length === 0) return false

  const coreMean = coreScores.reduce((s, v) => s + v, 0) / coreScores.length
  const scenarioMean = scenarioScores.reduce((s, v) => s + v, 0) / scenarioScores.length

  return Math.abs(coreMean - scenarioMean) >= 2.5
}

export function computeSocialDesirabilityIndex(answers: Record<string, AnswerValue>): number {
  let index = 0
  for (const id of SD_ITEM_IDS) {
    const raw = answers[id]
    if (raw === undefined || raw === null) continue
    const numeric = Number(raw)
    if (!isNaN(numeric) && numeric >= 4) {
      index += id === "ERP-A03" ? 1.5 : 1
    }
  }
  return index
}
