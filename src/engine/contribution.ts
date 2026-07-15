import type { AnswerValue } from "../types/answers.ts"
import type { Question } from "../types/question.ts"
import { WEIGHTS } from "../data/loadQuestions.ts"

export function contributionScore(rawValue: AnswerValue, question: Question): number {
  if (question.response_type === "SINGLE_SELECT") {
    const weightEntry = WEIGHTS[question.domain][question.id]
    const optionScores = weightEntry.option_scores
    if (!optionScores) {
      throw new Error(
        `contributionScore: question "${question.id}" is SINGLE_SELECT but has no option_scores in weights.json`,
      )
    }
    const score = optionScores[rawValue as string]
    if (score === undefined) {
      throw new Error(
        `contributionScore: option "${rawValue}" not found in option_scores for question "${question.id}"`,
      )
    }
    return score
  }

  const numeric = rawValue as number
  if (question.reverse_scored) {
    return 6 - numeric
  }
  return numeric
}
