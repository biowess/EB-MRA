import { useReducer, useMemo } from "react"
import { QUESTIONS } from "../data/loadQuestions.ts"
import type { AnswerValue } from "../types/answers.ts"

export interface AssessmentState {
  currentQuestionIndex: number
  answers: Record<string, AnswerValue>
  item_timestamps: Record<string, string>
  consent: boolean
  ageConfirmed: boolean
}

type AssessmentAction =
  | { type: "SET_CONSENT"; payload: boolean }
  | { type: "SET_AGE_CONFIRMED"; payload: boolean }
  | { type: "ANSWER_QUESTION"; payload: { id: string; value: AnswerValue; timestamp: string } }
  | { type: "GO_NEXT" }
  | { type: "GO_BACK" }
  | { type: "RESET" }

const initialState: AssessmentState = {
  currentQuestionIndex: 0,
  answers: {},
  item_timestamps: {},
  consent: false,
  ageConfirmed: false,
}

function assessmentReducer(state: AssessmentState, action: AssessmentAction): AssessmentState {
  switch (action.type) {
    case "SET_CONSENT":
      return { ...state, consent: action.payload }
    case "SET_AGE_CONFIRMED":
      return { ...state, ageConfirmed: action.payload }
    case "ANSWER_QUESTION":
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.id]: action.payload.value,
        },
        item_timestamps: {
          ...state.item_timestamps,
          [action.payload.id]: action.payload.timestamp,
        },
      }
    case "GO_NEXT":
      return {
        ...state,
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, QUESTIONS.length - 1),
      }
    case "GO_BACK":
      return {
        ...state,
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
      }
    case "RESET":
      return initialState
    default:
      return state
  }
}

export function useAssessment() {
  const [state, dispatch] = useReducer(assessmentReducer, initialState)

  const orderedQuestionIds = useMemo(() => QUESTIONS.map(q => q.id), [])

  const progress = useMemo(() => {
    if (orderedQuestionIds.length === 0) return 0
    const answeredCount = Object.keys(state.answers).length
    return answeredCount / orderedQuestionIds.length
  }, [state.answers, orderedQuestionIds])

  const isComplete = useMemo(() => {
    if (orderedQuestionIds.length === 0) return false
    return orderedQuestionIds.every(id => state.answers[id] !== undefined)
  }, [state.answers, orderedQuestionIds])

  const setConsent = (val: boolean) => {
    dispatch({ type: "SET_CONSENT", payload: val })
  }

  const setAgeConfirmed = (val: boolean) => {
    dispatch({ type: "SET_AGE_CONFIRMED", payload: val })
  }

  const answerQuestion = (id: string, value: AnswerValue) => {
    dispatch({
      type: "ANSWER_QUESTION",
      payload: {
        id,
        value,
        timestamp: new Date().toISOString(),
      },
    })
  }

  const goNext = () => {
    dispatch({ type: "GO_NEXT" })
  }

  const goBack = () => {
    dispatch({ type: "GO_BACK" })
  }

  const reset = () => {
    dispatch({ type: "RESET" })
  }

  return {
    currentQuestionIndex: state.currentQuestionIndex,
    orderedQuestionIds,
    answers: state.answers,
    item_timestamps: state.item_timestamps,
    consent: state.consent,
    ageConfirmed: state.ageConfirmed,
    consent_confirmed: state.consent,
    age_bracket_confirmed_16_plus: state.ageConfirmed,
    progress,
    isComplete,
    setConsent,
    setAgeConfirmed,
    answerQuestion,
    goNext,
    goBack,
    reset,
  }
}
