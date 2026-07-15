import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useAssessment } from "./useAssessment.ts"

describe("useAssessment", () => {
  it("initializes state correctly", () => {
    const { result } = renderHook(() => useAssessment())
    expect(result.current.currentQuestionIndex).toBe(0)
    expect(result.current.answers).toEqual({})
    expect(result.current.item_timestamps).toEqual({})
    expect(result.current.consent).toBe(false)
    expect(result.current.ageConfirmed).toBe(false)
    expect(result.current.progress).toBe(0)
    expect(result.current.isComplete).toBe(false)
  })

  it("handles consent and age confirmation", () => {
    const { result } = renderHook(() => useAssessment())
    
    act(() => {
      result.current.setConsent(true)
    })
    expect(result.current.consent).toBe(true)
    expect(result.current.consent_confirmed).toBe(true)

    act(() => {
      result.current.setAgeConfirmed(true)
    })
    expect(result.current.ageConfirmed).toBe(true)
    expect(result.current.age_bracket_confirmed_16_plus).toBe(true)
  })

  it("simulates answering the first 5 questions, updating progress and answers", () => {
    const { result } = renderHook(() => useAssessment())
    const ids = result.current.orderedQuestionIds
    expect(ids.length).toBeGreaterThanOrEqual(5)

    const first5 = ids.slice(0, 5)

    first5.forEach((id, idx) => {
      act(() => {
        result.current.answerQuestion(id, 4)
      })

      const expectedProgress = (idx + 1) / ids.length
      expect(result.current.progress).toBeCloseTo(expectedProgress, 5)
      expect(result.current.answers[id]).toBe(4)
      expect(result.current.item_timestamps[id]).toBeDefined()
      expect(Date.parse(result.current.item_timestamps[id])).not.toBeNaN()
    })

    expect(Object.keys(result.current.answers).length).toBe(5)
  })

  it("handles navigation: goNext and goBack", () => {
    const { result } = renderHook(() => useAssessment())
    expect(result.current.currentQuestionIndex).toBe(0)

    act(() => {
      result.current.goNext()
    })
    expect(result.current.currentQuestionIndex).toBe(1)

    act(() => {
      result.current.goBack()
    })
    expect(result.current.currentQuestionIndex).toBe(0)
  })
})
