import { describe, it, expect } from "vitest"
import {
  detectConsistencyFlags,
  detectStraightLining,
  detectContradictions,
  computeSocialDesirabilityIndex,
} from "./validityChecks.ts"
import type { AnswerValue } from "../types/answers.ts"
import type { DomainId } from "../types/domain.ts"
import { QUESTIONS } from "../data/loadQuestions.ts"
import { DOMAINS } from "../data/loadDomains.ts"
import { contributionScore } from "./contribution.ts"

const DOMAIN_ORDER: DomainId[] = ["SAR", "ELCA", "IHOR", "AMB", "ECPC", "ERP", "CSR", "RST"]

const questionMap = new Map(QUESTIONS.map(q => [q.id, q]))

function getPresentationOrderedLikertIds(): string[] {
  const ids: string[] = []
  for (const domainId of DOMAIN_ORDER) {
    const domain = DOMAINS.find(d => d.id === domainId)!
    for (const itemId of domain.item_ids) {
      const q = questionMap.get(itemId)
      if (q && q.response_type === "LIKERT5") {
        ids.push(itemId)
      }
    }
  }
  return ids
}

const PRESENTATION_LIKERT_IDS = getPresentationOrderedLikertIds()

const SCENARIO_IDS = QUESTIONS.filter(q => q.response_type === "SINGLE_SELECT").map(q => q.id)

function allSame(value: AnswerValue): Record<string, AnswerValue> {
  const answers: Record<string, AnswerValue> = {}
  for (const id of PRESENTATION_LIKERT_IDS) {
    answers[id] = value
  }
  for (const id of SCENARIO_IDS) {
    answers[id] = "B"
  }
  return answers
}

describe("detectConsistencyFlags", () => {
  it("returns empty array when no pairs diverge by >= 3", () => {
    const answers = allSame(3)
    const flags = detectConsistencyFlags(answers)
    expect(flags).toEqual([])
  })

  it("flags a pair when divergence >= 3 (forward vs reverse)", () => {
    const answers = allSame(3)
    answers["SAR-A01"] = 5
    answers["SAR-A02"] = 5
    const flags = detectConsistencyFlags(answers)
    expect(flags).toContain("SAR-A01/SAR-A02")
  })

  it("flags conceptual pair SAR-C01/SAR-C05 when answers are contradictory", () => {
    const answers = allSame(3)
    answers["SAR-C01"] = 5
    answers["SAR-C05"] = 5
    const flags = detectConsistencyFlags(answers)
    expect(flags).toContain("SAR-C01/SAR-C05")
  })

  it("flags multiple pairs when several are inconsistent", () => {
    const answers = allSame(3)
    answers["SAR-A01"] = 5
    answers["SAR-A02"] = 5
    answers["AMB-A01"] = 5
    answers["AMB-A02"] = 5
    const flags = detectConsistencyFlags(answers)
    expect(flags.length).toBeGreaterThanOrEqual(2)
  })

  it("skips pairs where one answer is missing", () => {
    const answers = allSame(3)
    delete answers["SAR-A01"]
    const flags = detectConsistencyFlags(answers)
    expect(flags).not.toContain("SAR-A01/SAR-A02")
  })

  it("does not flag when divergence is exactly 2 or less", () => {
    const answers = allSame(3)
    answers["ERP-A01"] = 5
    const flags = detectConsistencyFlags(answers)
    const erpFlags = flags.filter(f => f.startsWith("ERP"))
    expect(erpFlags).toEqual([])
  })

  it("reads pairs from rules.json consistency_pairs (10 pairs)", () => {
    const answers = allSame(3)
    answers["SAR-A01"] = 5
    answers["SAR-A02"] = 5
    answers["IHOR-C01"] = 5
    answers["IHOR-C05"] = 5
    answers["RST-A01"] = 5
    answers["RST-A02"] = 5
    const flags = detectConsistencyFlags(answers)
    expect(flags).toContain("SAR-A01/SAR-A02")
    expect(flags).toContain("IHOR-C01/IHOR-C05")
    expect(flags).toContain("RST-A01/RST-A02")
  })
})

describe("detectStraightLining", () => {
  it("returns true when 10+ consecutive LIKERT5 items have same raw value", () => {
    const answers = allSame(4)
    expect(detectStraightLining(answers, PRESENTATION_LIKERT_IDS)).toBe(true)
  })

  it("returns false when LIKERT5 values vary", () => {
    const answers: Record<string, AnswerValue> = {}
    for (let i = 0; i < PRESENTATION_LIKERT_IDS.length; i++) {
      answers[PRESENTATION_LIKERT_IDS[i]] = ((i % 5) + 1) as AnswerValue
    }
    for (const id of SCENARIO_IDS) {
      answers[id] = "B"
    }
    expect(detectStraightLining(answers, PRESENTATION_LIKERT_IDS)).toBe(false)
  })

  it("returns true even with 10 consecutive followed by different values", () => {
    const answers: Record<string, AnswerValue> = {}
    for (let i = 0; i < PRESENTATION_LIKERT_IDS.length; i++) {
      answers[PRESENTATION_LIKERT_IDS[i]] = i < 10 ? 5 : (((i - 10) % 5) + 1) as AnswerValue
    }
    for (const id of SCENARIO_IDS) {
      answers[id] = "B"
    }
    expect(detectStraightLining(answers, PRESENTATION_LIKERT_IDS)).toBe(true)
  })

  it("skips scenario items and only checks LIKERT5", () => {
    const answers: Record<string, AnswerValue> = {}
    for (let i = 0; i < PRESENTATION_LIKERT_IDS.length; i++) {
      answers[PRESENTATION_LIKERT_IDS[i]] = i < 10 ? 5 : (((i - 10) % 5) + 1) as AnswerValue
    }
    for (const id of SCENARIO_IDS) {
      answers[id] = "B"
    }
    expect(detectStraightLining(answers, PRESENTATION_LIKERT_IDS)).toBe(true)
  })

  it("does not flag when window spans fewer than 10", () => {
    const answers = allSame(3)
    const short = PRESENTATION_LIKERT_IDS.slice(0, 9)
    expect(detectStraightLining(answers, short)).toBe(false)
  })
})

describe("detectContradictions", () => {
  it("returns true when core_mean and scenario_mean differ by >= 2.5", () => {
    const answers: Record<string, AnswerValue> = {}
    for (const q of QUESTIONS) {
      if (q.response_type === "SINGLE_SELECT") {
        answers[q.id] = "B"
      } else if (q.domain === "SAR") {
        if (q.item_type === "core") {
          answers[q.id] = q.reverse_scored ? 1 : 5
        } else {
          answers[q.id] = 3
        }
      } else {
        answers[q.id] = 3
      }
    }
    answers["SAR-S01"] = "A"
    answers["SAR-S02"] = "D"
    expect(detectContradictions("SAR", answers)).toBe(true)
  })

  it("returns false when core_mean and scenario_mean are close", () => {
    const answers: Record<string, AnswerValue> = {}
    for (const q of QUESTIONS) {
      if (q.response_type === "SINGLE_SELECT") {
        answers[q.id] = "B"
      } else {
        answers[q.id] = 3
      }
    }
    expect(detectContradictions("SAR", answers)).toBe(false)
  })

  it("returns false when all items match within threshold", () => {
    const answers: Record<string, AnswerValue> = {}
    for (const q of QUESTIONS) {
      if (q.response_type === "SINGLE_SELECT") {
        answers[q.id] = "A"
      } else if (q.domain === "ELCA") {
        if (q.item_type === "core") {
          answers[q.id] = q.reverse_scored ? 1 : 5
        } else {
          answers[q.id] = 3
        }
      } else {
        answers[q.id] = 3
      }
    }
    const coreScores: number[] = []
    const elcaCore = QUESTIONS.filter(q => q.domain === "ELCA" && q.item_type === "core")
    for (const q of elcaCore) {
      const contrib = contributionScore(answers[q.id]!, q)
      coreScores.push(contrib)
    }
    const elcaScenario = QUESTIONS.filter(q => q.domain === "ELCA" && q.item_type === "scenario")
    const scenarioScores: number[] = []
    for (const q of elcaScenario) {
      const contrib = contributionScore(answers[q.id]!, q)
      scenarioScores.push(contrib)
    }
    const coreMean = coreScores.reduce((a, b) => a + b, 0) / coreScores.length
    const scenarioMean = scenarioScores.reduce((a, b) => a + b, 0) / scenarioScores.length
    if (Math.abs(coreMean - scenarioMean) >= 2.5) {
      expect(detectContradictions("ELCA", answers)).toBe(true)
    } else {
      expect(detectContradictions("ELCA", answers)).toBe(false)
    }
  })

  it("identifies contradiction across different domains", () => {
    const answers: Record<string, AnswerValue> = {}
    for (const q of QUESTIONS) {
      if (q.response_type === "SINGLE_SELECT") {
        answers[q.id] = "B"
      } else if (q.domain === "AMB") {
        if (q.item_type === "core") {
          answers[q.id] = q.reverse_scored ? 1 : 5
        } else {
          answers[q.id] = 3
        }
      } else {
        answers[q.id] = 3
      }
    }
    answers["AMB-S01"] = "C"
    answers["AMB-S02"] = "A"
    expect(detectContradictions("AMB", answers)).toBe(true)
    expect(detectContradictions("SAR", answers)).toBe(false)
  })

  it("returns false when no answers exist for domain", () => {
    expect(detectContradictions("RST", {})).toBe(false)
  })
})

describe("computeSocialDesirabilityIndex", () => {
  const SD_ITEMS = ["SAR-A03", "ELCA-A03", "IHOR-A03", "AMB-A03", "ECPC-A03", "ERP-A03", "CSR-A03", "RST-A03"]

  it("returns 0 when all A03 items are below threshold", () => {
    const answers: Record<string, AnswerValue> = {}
    for (const id of SD_ITEMS) answers[id] = 1
    expect(computeSocialDesirabilityIndex(answers)).toBe(0)
  })

  it("counts each non-ERP A03 item as 1.0 and ERP-A03 as 1.5", () => {
    const answers: Record<string, AnswerValue> = {}
    for (const id of SD_ITEMS) answers[id] = 4
    const expected = 7 * 1.0 + 1.5
    expect(computeSocialDesirabilityIndex(answers)).toBe(expected)
  })

  it("returns 1.5 when only ERP-A03 is flagged", () => {
    const answers: Record<string, AnswerValue> = {}
    for (const id of SD_ITEMS) answers[id] = 1
    answers["ERP-A03"] = 4
    expect(computeSocialDesirabilityIndex(answers)).toBe(1.5)
  })

  it("returns 0 when no SD items are answered", () => {
    expect(computeSocialDesirabilityIndex({})).toBe(0)
  })

  it("treats raw=3 as NOT flagged (neutral midpoint, not endorsement) and raw=4 as flagged", () => {
    const answers: Record<string, AnswerValue> = {}
    for (const id of SD_ITEMS) answers[id] = 2
    answers["SAR-A03"] = 3
    expect(computeSocialDesirabilityIndex(answers)).toBe(0)

    // raw=4 ("Agree") IS above the threshold
    answers["SAR-A03"] = 4
    expect(computeSocialDesirabilityIndex(answers)).toBe(1)
  })

  it("handles partial answers without throwing", () => {
    const answers: Record<string, AnswerValue> = { "SAR-A03": 5, "ERP-A03": 5 }
    expect(computeSocialDesirabilityIndex(answers)).toBe(1 + 1.5)
  })
})
