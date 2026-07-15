import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useScoringResult } from "../src/hooks/useScoringResult";
import { AssessmentSubmission } from "../src/types/answers";

describe("useScoringResult", () => {
  it("should return nulls if not ready", () => {
    const mockSubmission: AssessmentSubmission = {
      respondent_id: "test-user",
      session_id: "session-1",
      started_at: new Date().toISOString(),
      consent_confirmed: false,
      age_bracket_confirmed_16_plus: false,
      answers: {},
    };

    const { result } = renderHook(() => useScoringResult(mockSubmission));

    expect(result.current.isReady).toBe(false);
    expect(result.current.scoringResult).toBeNull();
    expect(result.current.profileResult).toBeNull();
  });

  it("should compute results when ready and maintain referential stability", () => {
    const mockSubmission: AssessmentSubmission = {
      respondent_id: "test-user",
      session_id: "session-1",
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      consent_confirmed: true,
      age_bracket_confirmed_16_plus: true,
      answers: {
        "SAR-A01": 5,
        "ELCA-A01": 5,
        "IHOR-A01": 5,
        "AMB-A01": 5,
        "ECPC-A01": 5,
        "ERP-A01": 5,
        "SAR-C01": 5,
        "ELCA-C01": 5,
        "IHOR-C01": 5,
        "ECPC-C01": 5,
      },
    };

    const { result, rerender } = renderHook(
      ({ submission }) => useScoringResult(submission),
      { initialProps: { submission: mockSubmission } }
    );

    expect(result.current.isReady).toBe(true);
    expect(result.current.scoringResult).not.toBeNull();
    expect(result.current.profileResult).not.toBeNull();

    const initialScoringResult = result.current.scoringResult;
    const initialProfileResult = result.current.profileResult;

    // Rerender with the exact same object reference
    rerender({ submission: mockSubmission });

    expect(Object.is(result.current.scoringResult, initialScoringResult)).toBe(true);
    expect(Object.is(result.current.profileResult, initialProfileResult)).toBe(true);
  });
});
