import type { DomainId, ProfileAssignmentResult } from "../types/profileAssignment.ts"
import profilesData from "../data/profiles.json"
import thresholdsData from "../data/tier_thresholds.json"

const DOMAINS: DomainId[] = ["SAR", "ELCA", "IHOR", "AMB", "ECPC", "ERP", "CSR", "RST"]

interface Profile {
  id: string
  priority_order: number
  name: string
  required_tiers: { domain: string; tier: string }[]
  excluded_if: { domain: string; tier: string }[][]
  description: string
  detail_fields_source: string
  special_rule: string | null
}

function getTier(score: number): string {
  if (score >= thresholdsData.high_min) {
    return "High"
  } else if (score < thresholdsData.moderate_min) {
    return "Low"
  } else {
    return "Moderate"
  }
}

export function assignProfile(
  domainScores: Record<DomainId, number>,
  unknownDomains: DomainId[]
): ProfileAssignmentResult {
  // Map each domain to its tier
  const tiers = {} as Record<DomainId, string>
  for (const d of DOMAINS) {
    if (unknownDomains.includes(d) || domainScores[d] === undefined || Number.isNaN(domainScores[d])) {
      tiers[d] = "UNKNOWN"
    } else {
      tiers[d] = getTier(domainScores[d])
    }
  }

  const unknownCount = DOMAINS.filter(d => tiers[d] === "UNKNOWN").length
  const highCount = DOMAINS.filter(d => tiers[d] === "High").length
  const lowCount = DOMAINS.filter(d => tiers[d] === "Low").length

  const isBalancedGeneralist = highCount <= 1 && lowCount <= 1 && unknownCount === 0

  const candidates: { profile: Profile; fitScore: number }[] = []

  const profiles = profilesData.profiles as Profile[]

  for (const profile of profiles) {
    if (profile.id === "PROF-21") {
      if (isBalancedGeneralist) {
        candidates.push({ profile, fitScore: 8 })
      }
      continue
    }

    if (profile.id === "PROF-23") {
      const csrScore = domainScores["CSR"] ?? 0
      if (csrScore >= 90) {
        candidates.push({ profile, fitScore: 1 })
      }
      continue
    }

    // Check excluded conditions
    let excluded = false
    for (const group of profile.excluded_if) {
      if (group.length === 0) continue
      let groupSatisfied = true
      for (const cond of group) {
        if (tiers[cond.domain as DomainId] !== cond.tier) {
          groupSatisfied = false
          break
        }
      }
      if (groupSatisfied) {
        excluded = true
        break
      }
    }
    if (excluded) {
      continue
    }

    // Reject profile if any required domain is marked UNKNOWN
    let hasUnknownRequired = false
    for (const cond of profile.required_tiers) {
      if (tiers[cond.domain as DomainId] === "UNKNOWN") {
        hasUnknownRequired = true
        break
      }
    }
    if (hasUnknownRequired) {
      continue
    }

    // Calculate matched required domains
    let matchedCount = 0
    for (const cond of profile.required_tiers) {
      const currentTier = tiers[cond.domain as DomainId]
      const allowedTiers = cond.tier.split("|")
      if (allowedTiers.includes(currentTier)) {
        matchedCount++
      }
    }

    if (matchedCount === profile.required_tiers.length) {
      candidates.push({ profile, fitScore: matchedCount })
    }
  }

  if (candidates.length === 0) {
    if (unknownCount === 0) {
      return {
        assigned_profile: "PROF-21",
        fitScore: 8,
        profileFitConfidence: "No dominant pattern (this is itself the finding)",
      }
    } else {
      return {
        assigned_profile: null,
        fitScore: 0,
        profileFitConfidence: null,
      }
    }
  }

  // Sort candidates by fitScore DESC, then priority_order ASC
  candidates.sort((a, b) => {
    if (b.fitScore !== a.fitScore) {
      return b.fitScore - a.fitScore
    }
    return a.profile.priority_order - b.profile.priority_order
  })

  const selectedCandidate = candidates[0]
  const assigned_profile = selectedCandidate.profile.id
  const fitScore = selectedCandidate.fitScore

  // Calculate profileFitConfidence
  let profileFitConfidence = ""
  if (assigned_profile === "PROF-21") {
    profileFitConfidence = "No dominant pattern (this is itself the finding)"
  } else if (fitScore >= 3) {
    profileFitConfidence = "Strong pattern match"
  } else if (fitScore === 2) {
    profileFitConfidence = "Moderate pattern match"
  } else {
    profileFitConfidence = "Partial pattern match"
  }

  return {
    assigned_profile,
    fitScore,
    profileFitConfidence,
  }
}
