import { describe, it, expect } from "vitest"
import type { AnswerValue, AssessmentSubmission } from "../types/answers.ts"

describe("AssessmentSubmission type", () => {
  it("accepts a minimal valid submission", () => {
    const submission: AssessmentSubmission = {
      respondent_id: "resp-001",
      session_id: "sess-abc",
      started_at: "2026-07-13T10:00:00Z",
      consent_confirmed: true,
      age_bracket_confirmed_16_plus: true,
      answers: { q1: 5 as AnswerValue, q2: "B" as AnswerValue },
    }
    expect(submission.respondent_id).toBe("resp-001")
  })

  it("rejects a submission missing consent_confirmed", () => {
    // @ts-expect-error - consent_confirmed is required
    const _bad: AssessmentSubmission = {
      respondent_id: "resp-002",
      session_id: "sess-xyz",
      started_at: "2026-07-13T11:00:00Z",
      age_bracket_confirmed_16_plus: true,
      answers: { q1: 3 as AnswerValue },
    }
  })
})
