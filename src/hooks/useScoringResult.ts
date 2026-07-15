import { useMemo } from "react";
import type { AnswerValue } from "../types/answers";
import { computeDomainScore } from "../engine/domainScore";
import type { ScoringResult } from "../engine/domainScore";
import { assignProfile } from "../engine/profileAssignment";
import type { ProfileAssignmentResult, DomainId } from "../types/profileAssignment";

// ── Minimal input type ────────────────────────────────────────
// AssessmentRunner builds this from useAssessment state; it does not
// carry respondent_id / session_id / started_at because those are not
// needed by the scoring/profile pipeline.

export interface ScoringInput {
  answers: Record<string, AnswerValue>;
  item_timestamps?: Record<string, string>;
  consent_confirmed: boolean;
  age_bracket_confirmed_16_plus: boolean;
  completed_at?: string | null;
}

export interface ScoringHookResult {
  scoringResult: ScoringResult | null;
  profileResult: ProfileAssignmentResult | null;
  isReady: boolean;
}

export function useScoringResult(submission: ScoringInput): ScoringHookResult {
  return useMemo(() => {
    const isReady =
      submission.consent_confirmed === true &&
      submission.age_bracket_confirmed_16_plus === true &&
      !!submission.completed_at;

    if (!isReady) {
      return {
        scoringResult: null,
        profileResult: null,
        isReady: false,
      };
    }

    const scoringResult = computeDomainScore(submission.answers);

    const domainScores = {} as Record<DomainId, number>;
    const unknownDomains: DomainId[] = [];

    for (const ds of scoringResult.domain_scores) {
      if (ds.normalized_score !== null && !ds.insufficient_data) {
        domainScores[ds.domain] = ds.normalized_score;
      } else {
        unknownDomains.push(ds.domain);
      }
    }

    let profileResult: ProfileAssignmentResult | null = null;
    // Suppress profile assignment when:
    //   (a) engine signals SD_index >= 5.5 (§5.9), OR
    //   (b) safety gate was triggered — the pipeline halts entirely (§5.12)
    if (!scoringResult.suppress_profile_assignment && !scoringResult.safety_gate_triggered) {
      profileResult = assignProfile(domainScores, unknownDomains);
    } else {
      profileResult = {
        assigned_profile: null,
        fitScore: 0,
        profileFitConfidence: null,
      };
    }

    return {
      scoringResult,
      profileResult,
      isReady: true,
    };
  }, [submission]);
}
