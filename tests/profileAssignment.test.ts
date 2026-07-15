import { describe, it, expect } from "vitest"
import { assignProfile } from "../src/engine/profileAssignment.ts"

describe("Profile Assignment Engine", () => {
  it("reproduces the exact worked example from ebmraspec.md Part 5 §8.5", () => {
    const scores = {
      SAR: 78,
      ELCA: 72,
      IHOR: 45,
      AMB: 30,
      ECPC: 55,
      ERP: 68,
      CSR: 60,
      RST: 58,
    }
    const unknownDomains = []

    const result = assignProfile(scores, unknownDomains)

    expect(result.assigned_profile).toBe("PROF-01")
    expect(result.fitScore).toBe(2)
    expect(result.profileFitConfidence).toBe("Moderate pattern match")
  })

  it("handles fallback to PROF-21 when no specific profile matches and unknownCount is 0", () => {
    // If all scores are in the moderate range (35-64), highCount=0, lowCount=0, unknownCount=0
    // It should match PROF-21 via candidates or fallback
    const scores = {
      SAR: 50,
      ELCA: 50,
      IHOR: 50,
      AMB: 50,
      ECPC: 50,
      ERP: 50,
      CSR: 50,
      RST: 50,
    }
    const result = assignProfile(scores, [])
    expect(result.assigned_profile).toBe("PROF-21")
    expect(result.fitScore).toBe(8)
    expect(result.profileFitConfidence).toBe("No dominant pattern (this is itself the finding)")
  })

  it("returns null when no candidate matches and unknownCount > 0", () => {
    const scores = {
      SAR: 50,
      ELCA: 50,
      IHOR: 50,
      AMB: 50,
      ECPC: 50,
      ERP: 50,
      CSR: 50,
      RST: 50,
    }
    // With unknown domains, it cannot assign PROF-21
    const result = assignProfile(scores, ["SAR"])
    expect(result.assigned_profile).toBeNull()
    expect(result.fitScore).toBe(0)
    expect(result.profileFitConfidence).toBeNull()
  })

  it("assigns PROF-23 when CSR raw score is >= 90", () => {
    const scores = {
      SAR: 50,
      ELCA: 50,
      IHOR: 50,
      AMB: 50,
      ECPC: 50,
      ERP: 50,
      CSR: 95,
      RST: 50,
    }
    // We add an unknown domain to prevent PROF-21 (Balanced Generalist) from matching
    const result = assignProfile(scores, ["SAR"])
    expect(result.assigned_profile).toBe("PROF-23")
    expect(result.fitScore).toBe(1)
    expect(result.profileFitConfidence).toBe("Partial pattern match")
  })

  it("respects exclusions, e.g. PROF-01 excluded if ECPC is Low (< 35)", () => {
    const scores = {
      SAR: 78,
      ELCA: 72,
      IHOR: 45,
      AMB: 50,
      ECPC: 30, // Low, excludes PROF-01
      ERP: 68,
      CSR: 60,
      RST: 58,
    }
    const result = assignProfile(scores, [])
    // PROF-01 requires SAR=High, ELCA=High, but is excluded if ECPC=Low.
    // If PROF-01 is excluded, it falls back to something else or PROF-21
    expect(result.assigned_profile).not.toBe("PROF-01")
  })

  it("does not exclude PROF-22 when only one of the grouped conditions is met (AND-group logic)", () => {
    // For PROF-22: required_tiers = { ELCA: Low }, { CSR: Moderate|High }
    // excluded_if = [ [ { SAR: Low }, { IHOR: Low } ] ] -> excluded only if BOTH SAR=Low AND IHOR=Low
    const scores = {
      SAR: 30, // Low
      ELCA: 30, // Low (Required)
      IHOR: 50, // Moderate (Not Low, so the group condition is broken)
      AMB: 50,
      ECPC: 50,
      ERP: 50,
      CSR: 50, // Moderate (Required)
      RST: 50,
    }
    const result = assignProfile(scores, [])
    expect(result.assigned_profile).toBe("PROF-22")
  })

  it("assigns PROF-05 with fitScore=3 when CSR=High, SAR=High, and AMB=Low, but fails if AMB is Moderate or High", () => {
    // 1. Full Match
    const matchScores = {
      SAR: 75, // High
      ELCA: 50,
      IHOR: 50,
      AMB: 30, // Low (Required)
      ECPC: 50,
      ERP: 50,
      CSR: 75, // High (Required)
      RST: 50,
    }
    const matchResult = assignProfile(matchScores, [])
    expect(matchResult.assigned_profile).toBe("PROF-05")
    expect(matchResult.fitScore).toBe(3)
    expect(matchResult.profileFitConfidence).toBe("Strong pattern match")

    // 2. AMB = Moderate (Should NOT match PROF-05)
    const modAmbScores = {
      ...matchScores,
      AMB: 50, // Moderate
    }
    const modAmbResult = assignProfile(modAmbScores, [])
    expect(modAmbResult.assigned_profile).not.toBe("PROF-05")

    // 3. AMB = High (Should NOT match PROF-05)
    const highAmbScores = {
      ...matchScores,
      AMB: 75, // High
    }
    const highAmbResult = assignProfile(highAmbScores, [])
    expect(highAmbResult.assigned_profile).not.toBe("PROF-05")
  })
})
