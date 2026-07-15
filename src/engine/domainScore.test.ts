import { describe, it, expect } from "vitest"
import { computeDomainScore } from "./domainScore.ts"
import type { AnswerValue } from "../types/answers.ts"
import { QUESTIONS } from "../data/loadQuestions.ts"
import { DOMAINS } from "../data/loadDomains.ts"

const LIKERT5_IDS = QUESTIONS.filter(q => q.response_type === "LIKERT5").map(q => q.id)
const SCENARIO_IDS = QUESTIONS.filter(q => q.response_type === "SINGLE_SELECT").map(q => q.id)

function makeAnswers(likertValue: AnswerValue, scenarioOverrides: Record<string, AnswerValue> = {}): Record<string, AnswerValue> {
  const answers: Record<string, AnswerValue> = {}
  for (const id of LIKERT5_IDS) {
    answers[id] = likertValue
  }
  for (const id of SCENARIO_IDS) {
    answers[id] = "B"
  }
  for (const [id, val] of Object.entries(scenarioOverrides)) {
    answers[id] = val
  }
  return answers
}

describe("computeDomainScore", () => {
  it("computes normalized scores for all domains with mid-range answers", () => {
    const answers = makeAnswers(3)
    const result = computeDomainScore(answers)

    expect(result.safety_gate_triggered).toBe(false)
    expect(result.incomplete).toBe(false)
    expect(result.domain_scores.length).toBe(8)

    for (const ds of result.domain_scores) {
      expect(ds.normalized_score).toBeGreaterThan(0)
      expect(ds.normalized_score).toBeLessThanOrEqual(100)
      expect(ds.raw_weighted_score).toBeGreaterThan(0)
      expect(ds.insufficient_data).toBe(false)
    }
  })

  it("computes low scores when all answers are 1", () => {
    const answers = makeAnswers(1)
    const result = computeDomainScore(answers)

    for (const ds of result.domain_scores) {
      expect(ds.normalized_score).toBeGreaterThan(0)
    }
  })

  it("computes high scores when all answers are 5 (forward) or 1 (reverse)", () => {
    const answers: Record<string, AnswerValue> = {}
    for (const q of QUESTIONS) {
      if (q.response_type === "SINGLE_SELECT") {
        answers[q.id] = "A"
      } else {
        answers[q.id] = q.reverse_scored ? 1 : 5
      }
    }
    const result = computeDomainScore(answers)

    for (const ds of result.domain_scores) {
      expect(ds.normalized_score).toBeGreaterThanOrEqual(70)
    }
  })

  it("triggers safety gate when RST-S02 is C and supporting items are low", () => {
    const answers = makeAnswers(3, {
      "RST-S02": "C",
      "RST-C03": 4,
      "RST-C05": 2,
      "RST-C08": 4,
    })
    const result = computeDomainScore(answers)

    expect(result.safety_gate_triggered).toBe(true)
    expect(result.safety_gate_details.main_item).toBe("RST-S02")
    const flagged = result.safety_gate_details.supporting_items.filter(s => s.flagged)
    expect(flagged.length).toBeGreaterThanOrEqual(2)
  })

  it("does NOT trigger safety gate when RST-S02 is C but supporting items are NOT low", () => {
    const answers = makeAnswers(3, {
      "RST-S02": "C",
      "RST-C03": 3,
      "RST-C05": 3,
      "RST-C08": 3,
    })
    const result = computeDomainScore(answers)

    expect(result.safety_gate_triggered).toBe(false)
  })

  it("sets insufficient_data when 3+ items missing in a domain", () => {
    const answers = makeAnswers(3)
    delete answers["SAR-C01"]
    delete answers["SAR-C02"]
    delete answers["SAR-C03"]

    const result = computeDomainScore(answers)
    const sar = result.domain_scores.find(d => d.domain === "SAR")!
    expect(sar.insufficient_data).toBe(true)
    expect(sar.flags).toContain("insufficient_data")
    expect(sar.normalized_score).toBeNull()
  })

  it("marks assessment incomplete when >25% of answers missing", () => {
    const answers = makeAnswers(3)
    const ids = Object.keys(answers)
    const toRemove = Math.ceil(ids.length * 0.26)
    for (let i = 0; i < toRemove; i++) {
      delete answers[ids[i]]
    }

    const result = computeDomainScore(answers)
    expect(result.incomplete).toBe(true)
  })

  it("detects straight-line responding when 10+ consecutive LIKERT5 have same value", () => {
    const answers = makeAnswers(3)
    const result = computeDomainScore(answers)

    expect(result.validation_checks.straight_line.length).toBeGreaterThan(0)
  })

  it("does NOT detect straight-line when values vary", () => {
    const answers: Record<string, AnswerValue> = {}
    for (let i = 0; i < LIKERT5_IDS.length; i++) {
      answers[LIKERT5_IDS[i]] = ((i % 5) + 1) as AnswerValue
    }
    for (const id of SCENARIO_IDS) {
      answers[id] = "B"
    }

    const result = computeDomainScore(answers)
    expect(result.validation_checks.straight_line).toEqual([])
  })

  it("flags consistency issues when aux pair responses differ significantly", () => {
    const answers = makeAnswers(3)
    answers["SAR-A01"] = 5
    answers["SAR-A02"] = 5

    const result = computeDomainScore(answers)
    const sarPair = result.validation_checks.consistency.find(
      c => c.pair[0] === "SAR-A01" && c.pair[1] === "SAR-A02",
    )
    expect(sarPair).toBeDefined()
    expect(sarPair!.consistent).toBe(false)
    expect(sarPair!.discrepancy).toBeGreaterThan(2)
  })

  it("computes SD index from A03 items with raw value >= 4", () => {
    const answers = makeAnswers(4)
    const result = computeDomainScore(answers)
    expect(result.sd_index).toBeGreaterThan(0)

    const lowAnswers = makeAnswers(1)
    const lowResult = computeDomainScore(lowAnswers)
    expect(lowResult.sd_index).toBe(0)

    // raw=3 (neutral midpoint) no longer counts as endorsement under the new threshold
    const midAnswers = makeAnswers(3)
    const midResult = computeDomainScore(midAnswers)
    expect(midResult.sd_index).toBe(0)
  })

  it("reduces confidence when missing >10% of items", () => {
    const answers = makeAnswers(3)
    const totalQuest = QUESTIONS.length
    const toRemove = Math.ceil(totalQuest * 0.11)
    const ids = Object.keys(answers)
    for (let i = 0; i < toRemove; i++) {
      delete answers[ids[i]]
    }

    const result = computeDomainScore(answers)
    expect(result.overall_confidence).toBeLessThan(100)
  })

  it("reduces confidence when straight-line detected", () => {
    const answers = makeAnswers(3)
    const result = computeDomainScore(answers)
    expect(result.validation_checks.straight_line.length).toBeGreaterThan(0)
    expect(result.overall_confidence).toBeLessThan(100)
  })

  it("reduces confidence when safety gate triggered", () => {
    const answers = makeAnswers(3, {
      "RST-S02": "C",
      "RST-C03": 4,
      "RST-C05": 2,
      "RST-C08": 4,
    })
    const result = computeDomainScore(answers)
    expect(result.overall_confidence).toBeLessThan(85)
  })

  // Per §5.9: safety gate does NOT by itself suppress profile assignment in computeDomainScore.
  // Profile suppression is only triggered by SD_index >= 5.5.
  // The useScoringResult hook handles routing away from profile assignment when safety gate fires.
  it("does NOT suppress profile assignment solely because safety gate is triggered (spec §5.9)", () => {
    const answers = makeAnswers(3, {
      "RST-S02": "C",
      "RST-C03": 4,
      "RST-C05": 2,
      "RST-C08": 4,
    })
    // makeAnswers(3) sets all A03 items to 3 (neutral midpoint), which does NOT flag SD
    // under the raw >= 4 threshold — no need to reset them.

    const result = computeDomainScore(answers)
    // Safety gate fires, but suppress_profile_assignment is driven by SD_index, not safety gate
    expect(result.safety_gate_triggered).toBe(true)
    expect(result.sd_index).toBe(0)
    expect(result.suppress_profile_assignment).toBe(false)
  })

  // Per §5.9: profile assignment suppressed only when SD_index >= 5.5.
  it("suppresses profile assignment when SD_index >= 5.5 (spec §5.9)", () => {
    // To push SD_index >= 5.5 we need raw >= 4 on enough *-A03 items.
    // ERP-A03 weight = 1.5, all others = 1.0.
    // 4 non-ERP A03 items flagged (4 × 1.0 = 4.0) + ERP-A03 flagged (1.5) = 5.5 → threshold met
    const answers = makeAnswers(1) // baseline: all A03 items at 1 (not flagged)
    // Explicitly flag 4 non-ERP A03s and ERP-A03 to reach exactly 5.5
    answers["SAR-A03"]  = 4
    answers["ELCA-A03"] = 4
    answers["IHOR-A03"] = 4
    answers["AMB-A03"]  = 4
    answers["ERP-A03"]  = 4 // weight 1.5

    const result = computeDomainScore(answers)
    expect(result.sd_index).toBeCloseTo(5.5, 5)
    expect(result.suppress_profile_assignment).toBe(true)
  })

  it("does NOT suppress profile assignment solely because domains are missing data (spec §5.9)", () => {
    const answers = makeAnswers(3)
    const domain = DOMAINS[0]
    for (const id of domain.item_ids) {
      delete answers[id]
    }
    const domain2 = DOMAINS[1]
    for (const id of domain2.item_ids) {
      delete answers[id]
    }
    // makeAnswers(3) sets all A03 items to 3 (neutral midpoint), which does NOT flag SD
    // under the raw >= 4 threshold — sd_index stays 0 without any additional overrides.

    // SD_index is 0 here (no A03 items flagged), so profile suppression should be false
    const result = computeDomainScore(answers)
    expect(result.sd_index).toBe(0)
    expect(result.suppress_profile_assignment).toBe(false)
  })

  it("handles empty answers gracefully", () => {
    const result = computeDomainScore({})

    expect(result.incomplete).toBe(true)
    expect(result.safety_gate_triggered).toBe(false)
    // SD_index is 0 on empty answers → no profile suppression per spec §5.9
    expect(result.sd_index).toBe(0)
    expect(result.suppress_profile_assignment).toBe(false)
    for (const ds of result.domain_scores) {
      expect(ds.normalized_score).toBeNull()
    }
  })

  it("computes correct score for a specific domain", () => {
    const answers = makeAnswers(3)
    const result = computeDomainScore(answers)

    const sar = result.domain_scores.find(d => d.domain === "SAR")!
    expect(sar.normalized_score).toBe(59.4)
    expect(sar.raw_weighted_score).toBeCloseTo(3.375, 2)
  })

  // Per spec §4.3: AR-03 fires when SAR >= 70 AND AMB <= 40 (domain score thresholds).
  it("flags AR-03 when SAR >= 70 AND AMB <= 40 (spec §4.3)", () => {
    const answers: Record<string, AnswerValue> = {}
    // Set all items to 3 (neutral) first
    for (const q of QUESTIONS) {
      answers[q.id] = q.response_type === "SINGLE_SELECT" ? "B" : 3
    }
    // Drive SAR very high: all SAR forward items = 5, reverse items = 1
    for (const q of QUESTIONS.filter(q => q.domain === "SAR")) {
      if (q.response_type === "SINGLE_SELECT") {
        answers[q.id] = "D" // score 5 on SAR-S01, score 1 on SAR-S02 — use D for high SAR
      } else {
        answers[q.id] = q.reverse_scored ? 1 : 5
      }
    }
    // Drive AMB very low: all AMB forward items = 1, reverse items = 5
    for (const q of QUESTIONS.filter(q => q.domain === "AMB")) {
      if (q.response_type === "SINGLE_SELECT") {
        answers[q.id] = "A" // lowest-scoring scenario option
      } else {
        answers[q.id] = q.reverse_scored ? 5 : 1
      }
    }

    const result = computeDomainScore(answers)
    const sarScore = result.domain_scores.find(d => d.domain === "SAR")!.normalized_score!
    const ambScore = result.domain_scores.find(d => d.domain === "AMB")!.normalized_score!
    expect(sarScore).toBeGreaterThanOrEqual(70)
    expect(ambScore).toBeLessThanOrEqual(40)

    const ar03 = result.interaction_flags.find(f => f.rule === "AR-03")
    expect(ar03).toBeDefined()
    expect(ar03!.triggered).toBe(true)
  })

  it("computes consistency check results for all 10 pairs", () => {
    const answers = makeAnswers(3)
    const result = computeDomainScore(answers)

    expect(result.validation_checks.consistency.length).toBe(10)
    for (const c of result.validation_checks.consistency) {
      expect(c.discrepancy).toBe(0)
      expect(c.consistent).toBe(true)
    }
  })

  it("adjusts per-domain normalized scores individually", () => {
    const answers = makeAnswers(3)
    answers["SAR-A01"] = 5

    const result = computeDomainScore(answers)
    const sar = result.domain_scores.find(d => d.domain === "SAR")!
    expect(sar.normalized_score).not.toBe(59.4)

    const elca = result.domain_scores.find(d => d.domain === "ELCA")!
    expect(elca.normalized_score).toBe(59.4)
  })

  it("sets insufficient_data for CSR and RST when their items are missing", () => {
    const answers = makeAnswers(3)
    for (const id of ["CSR-C01", "CSR-C02", "CSR-C03"]) {
      delete answers[id]
    }

    const result = computeDomainScore(answers)
    const csr = result.domain_scores.find(d => d.domain === "CSR")!
    expect(csr.flags).toContain("insufficient_data")
  })

  it("SD index respects ERP-A03 weight of 1.5", () => {
    const answers = makeAnswers(4)
    const result = computeDomainScore(answers)
    const baselineIndex = result.sd_index

    const answersLower: Record<string, AnswerValue> = {}
    for (const id of LIKERT5_IDS) answersLower[id] = 4
    for (const id of SCENARIO_IDS) answersLower[id] = "B"
    answersLower["ERP-A03"] = 1

    const resultLower = computeDomainScore(answersLower)
    const diff = baselineIndex - resultLower.sd_index
    expect(diff).toBe(1.5)
  })

  it("does not flag insufficient_data when exactly 2 items are missing in a domain", () => {
    const answers = makeAnswers(3)
    delete answers["SAR-C01"]
    delete answers["SAR-C02"]

    const result = computeDomainScore(answers)
    const sar = result.domain_scores.find(d => d.domain === "SAR")!
    expect(sar.insufficient_data).toBe(false)
    expect(sar.normalized_score).not.toBeNull()
  })
})
