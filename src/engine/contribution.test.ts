import { describe, it, expect } from "vitest"
import { contributionScore } from "./contribution.ts"
import { QUESTIONS, WEIGHTS } from "../data/loadQuestions.ts"

describe("contributionScore", () => {
  it("returns raw value as-is for forward LIKERT5 item", () => {
    const q = QUESTIONS.find(q => q.id === "SAR-C01")!
    expect(contributionScore(4, q)).toBe(4)
  })

  it("returns reversed value (6 - raw) for reverse-scored LIKERT5 item", () => {
    const q = QUESTIONS.find(q => q.id === "SAR-C05")!
    expect(contributionScore(4, q)).toBe(2)
  })

  it("looks up option score from weights.json for SINGLE_SELECT scenario item", () => {
    const q = QUESTIONS.find(q => q.id === "SAR-S01")!
    const expected = WEIGHTS["SAR"]["SAR-S01"].option_scores!["B"]
    expect(contributionScore("B", q)).toBe(expected)
  })
})
