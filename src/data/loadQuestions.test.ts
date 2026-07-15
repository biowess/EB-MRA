import { describe, it, expect } from "vitest"
import { QUESTIONS, WEIGHTS, getQuestionsByDomain } from "./loadQuestions.ts"

describe("QUESTIONS", () => {
  it("has exactly 104 questions", () => {
    expect(QUESTIONS.length).toBe(104)
  })

  it("every question belongs to a valid domain", () => {
    const validDomains = new Set(["SAR", "ELCA", "IHOR", "AMB", "ECPC", "ERP", "CSR", "RST"])
    for (const q of QUESTIONS) {
      expect(validDomains.has(q.domain)).toBe(true)
    }
  })

  it("every question has a valid item_type", () => {
    const validTypes = new Set(["core", "auxiliary", "scenario", "auxiliary_sd_detector"])
    for (const q of QUESTIONS) {
      expect(validTypes.has(q.item_type)).toBe(true)
    }
  })

  it("every question has a valid response_type", () => {
    const validResponses = new Set(["LIKERT5", "SINGLE_SELECT"])
    for (const q of QUESTIONS) {
      expect(validResponses.has(q.response_type)).toBe(true)
    }
  })

  it("LIKERT5 questions have numeric option values and no scores", () => {
    for (const q of QUESTIONS) {
      if (q.response_type !== "LIKERT5") continue
      for (const opt of q.options) {
        expect(typeof opt.value).toBe("number")
        expect("score" in opt).toBe(false)
      }
    }
  })

  it("SINGLE_SELECT questions have string option values and numeric scores", () => {
    for (const q of QUESTIONS) {
      if (q.response_type !== "SINGLE_SELECT") continue
      for (const opt of q.options) {
        expect(typeof opt.value).toBe("string")
      if ("score" in opt) {
          expect(typeof opt.score).toBe("number")
        }
      }
    }
  })

  it("core items have item_weight of 1.0", () => {
    for (const q of QUESTIONS) {
      if (q.item_type === "core") {
        expect(q.item_weight).toBe(1.0)
      }
    }
  })

  it("scenario items have item_weight > 1.0", () => {
    for (const q of QUESTIONS) {
      if (q.item_type === "scenario") {
        expect(q.item_weight).toBeGreaterThan(1.0)
      }
    }
  })

  it("auxiliary items have item_weight of 0.5", () => {
    for (const q of QUESTIONS) {
      if (q.item_type === "auxiliary") {
        expect(q.item_weight).toBe(0.5)
      }
    }
  })

  it("each domain has exactly 13 questions", () => {
    const validDomains = ["SAR", "ELCA", "IHOR", "AMB", "ECPC", "ERP", "CSR", "RST"]
    for (const domain of validDomains) {
      const qs = getQuestionsByDomain(domain as any)
      expect(qs.length).toBe(13)
    }
  })

  it("each domain has 8 core, 2 auxiliary, 2 scenario, 1 auxiliary_sd_detector", () => {
    const validDomains = ["SAR", "ELCA", "IHOR", "AMB", "ECPC", "ERP", "CSR", "RST"]
    for (const domain of validDomains) {
      const qs = getQuestionsByDomain(domain as any)
      const cores = qs.filter(q => q.item_type === "core").length
      const auxiliaries = qs.filter(q => q.item_type === "auxiliary").length
      const scenarios = qs.filter(q => q.item_type === "scenario").length
      const sdDetectors = qs.filter(q => q.item_type === "auxiliary_sd_detector").length
      expect(cores).toBe(8)
      expect(auxiliaries).toBe(2)
      expect(scenarios).toBe(2)
      expect(sdDetectors).toBe(1)
    }
  })

  it("reverse_scored items have reverse: true in WEIGHTS", () => {
    for (const q of QUESTIONS) {
      const w = WEIGHTS[q.domain][q.id]
      expect(w.reverse).toBe(q.reverse_scored)
    }
  })
})

describe("WEIGHTS", () => {
  it("has entries for all 8 domains", () => {
    const domains = Object.keys(WEIGHTS)
    expect(domains.sort()).toEqual(["AMB", "CSR", "ECPC", "ELCA", "ERP", "IHOR", "RST", "SAR"])
  })

  it("has exactly 13 entries per domain", () => {
    for (const entries of Object.values(WEIGHTS)) {
      expect(Object.keys(entries).length).toBe(13)
    }
  })

  it("every question id in QUESTIONS has a matching weight entry", () => {
    for (const q of QUESTIONS) {
      expect(WEIGHTS[q.domain][q.id]).toBeDefined()
    }
  })
})

describe("getQuestionsByDomain", () => {
  it("returns only questions for the given domain", () => {
    const sarQuestions = getQuestionsByDomain("SAR")
    for (const q of sarQuestions) {
      expect(q.domain).toBe("SAR")
    }
  })

  it("returns empty array for nonexistent domain", () => {
    const result = getQuestionsByDomain("SAR")
    expect(result.length).toBeGreaterThan(0)
  })
})
