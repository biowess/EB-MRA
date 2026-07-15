import { describe, it, expect } from "vitest"
import { DOMAINS } from "./loadDomains.ts"

describe("DOMAINS", () => {
  it("has exactly 8 domains", () => {
    expect(DOMAINS.length).toBe(8)
  })

  it("every domain has exactly 4 bands", () => {
    for (const domain of DOMAINS) {
      expect(domain.bands.length).toBe(4)
    }
  })
})
