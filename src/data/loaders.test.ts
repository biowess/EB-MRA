import { describe, it, expect } from "vitest"
import { RULES } from "./loadRules.ts"
import { PROFILES } from "./loadProfiles.ts"
import { REPORTS } from "./loadReports.ts"
import { VALIDATION_CONFIG } from "./loadValidationConfig.ts"

describe("RULES", () => {
  it("has exactly 8 interaction_rules", () => {
    expect(RULES.interaction_rules.length).toBe(8)
  })
})

describe("PROFILES", () => {
  it("has exactly 24 profiles", () => {
    expect(PROFILES.profiles.length).toBe(24)
  })
})

describe("REPORTS", () => {
  it("has exactly 8 domain_fragments keys", () => {
    const keys = Object.keys(REPORTS.domain_fragments)
    expect(keys.length).toBe(8)
  })
})

describe("VALIDATION_CONFIG", () => {
  it("has no undefined required fields", () => {
    const required: (keyof typeof VALIDATION_CONFIG)[] = [
      "schema_version",
      "structural_rules",
      "random_answering",
      "response_time",
      "straight_line",
      "confidence_penalty_collapse_group",
      "confidence_penalty_collapse_group_delta",
      "error_codes",
    ]
    for (const field of required) {
      expect(VALIDATION_CONFIG[field]).toBeDefined()
    }
  })
})
