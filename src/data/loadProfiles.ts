import type { ProfileSet, Profile, DomainTier, TierThresholds, Fallback } from "../types/profiles.ts"
import raw from "./profiles.json"

const REQUIRED_TOP_LEVEL: (keyof ProfileSet)[] = [
  "tier_thresholds",
  "profiles",
]

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

function validateString(value: unknown, field: string, context: string): string {
  if (typeof value !== "string") {
    throw new Error(`${context}: expected string for "${field}", got ${typeof value}`)
  }
  return value
}

function validateNumber(value: unknown, field: string, context: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw new Error(`${context}: expected number for "${field}", got ${typeof value}`)
  }
  return value
}

function validateBoolean(value: unknown, field: string, context: string): boolean {
  if (typeof value !== "boolean") {
    throw new Error(`${context}: expected boolean for "${field}", got ${typeof value}`)
  }
  return value
}

function validateDomainTier(raw: unknown, index: number, profileId: string): DomainTier {
  if (!isRecord(raw)) {
    throw new Error(`Profile "${profileId}", domain_tier[${index}]: expected object`)
  }
  return {
    domain: validateString(raw.domain, "domain", `Profile "${profileId}", domain_tier[${index}]`),
    tier: validateString(raw.tier, "tier", `Profile "${profileId}", domain_tier[${index}]`),
  }
}

function validateProfile(raw: unknown, index: number): Profile {
  if (!isRecord(raw)) {
    throw new Error(`profiles[${index}]: expected object`)
  }
  const id = validateString(raw.id, "id", `profiles[${index}]`)
  const rawRequired = raw.required_tiers
  if (!Array.isArray(rawRequired)) {
    throw new Error(`Profile "${id}": "required_tiers" must be an array`)
  }
  const rawExcluded = raw.excluded_if
  if (!Array.isArray(rawExcluded)) {
    throw new Error(`Profile "${id}": "excluded_if" must be an array`)
  }
  const specialRule = raw.special_rule
  return {
    id,
    priority_order: validateNumber(raw.priority_order, "priority_order", `Profile "${id}"`),
    name: validateString(raw.name, "name", `Profile "${id}"`),
    required_tiers: rawRequired.map((t: unknown, i: number) => validateDomainTier(t, i, id)),
    excluded_if: rawExcluded.map((group: unknown, i: number) => {
      if (!Array.isArray(group)) {
        throw new Error(`Profile "${id}": "excluded_if[${i}]" must be an array`)
      }
      return group.map((t: unknown, j: number) => validateDomainTier(t, j, id))
    }),
    description: validateString(raw.description, "description", `Profile "${id}"`),
    detail_fields_source: validateString(raw.detail_fields_source, "detail_fields_source", `Profile "${id}"`),
    special_rule: specialRule === null ? null : validateString(specialRule as string, "special_rule", `Profile "${id}"`),
  }
}

function validateTierThresholds(raw: unknown): TierThresholds {
  if (!isRecord(raw)) {
    throw new Error("tier_thresholds: expected object")
  }
  return {
    high_min: validateNumber(raw.high_min, "high_min", "tier_thresholds"),
    moderate_min: validateNumber(raw.moderate_min, "moderate_min", "tier_thresholds"),
    moderate_max: validateNumber(raw.moderate_max, "moderate_max", "tier_thresholds"),
    low_max: validateNumber(raw.low_max, "low_max", "tier_thresholds"),
  }
}

function validateFallback(raw: unknown): Fallback {
  if (!isRecord(raw)) {
    throw new Error("fallback: expected object")
  }
  return {
    no_match_profile: validateString(raw.no_match_profile, "no_match_profile", "fallback"),
    requires_unknown_count_zero: validateBoolean(raw.requires_unknown_count_zero, "requires_unknown_count_zero", "fallback"),
  }
}

function loadProfiles(): ProfileSet {
  if (!isRecord(raw)) {
    throw new Error("profiles.json: root must be an object")
  }

  for (const field of REQUIRED_TOP_LEVEL) {
    if (raw[field] === undefined || raw[field] === null) {
      throw new Error(`profiles.json: missing required top-level key "${field}"`)
    }
  }

  const rawProfiles = raw.profiles
  if (!Array.isArray(rawProfiles)) {
    throw new Error('profiles.json: "profiles" must be an array')
  }

  return {
    tier_thresholds: validateTierThresholds(raw.tier_thresholds),
    profiles: rawProfiles.map((p: unknown, i: number) => validateProfile(p, i)),
    fallback: validateFallback(raw.fallback),
  }
}

export const PROFILES: ProfileSet = loadProfiles()
