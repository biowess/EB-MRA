export type AnswerValue = 1 | 2 | 3 | 4 | 5 | "A" | "B" | "C" | "D"

export interface AssessmentSubmission {
  respondent_id: string
  session_id: string
  started_at: string
  completed_at?: string | null
  consent_confirmed: boolean
  age_bracket_confirmed_16_plus: boolean
  answers: Record<string, AnswerValue>
  item_timestamps?: Record<string, string>
}
