import type { Domain, DomainBand } from "../types/domain.ts"
import raw from "./domains.json"

const REQUIRED_DOMAIN_FIELDS: (keyof Domain)[] = [
  "id",
  "name",
  "cluster",
  "weight",
  "min_score",
  "max_score",
  "bands",
  "band_boundary_rule",
  "psychological_construct",
  "medical_relevance",
  "item_ids",
]

const REQUIRED_BAND_FIELDS: (keyof DomainBand)[] = ["label", "min", "max"]

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

function validateBand(raw: unknown, index: number, domainId: string): DomainBand {
  if (!isRecord(raw)) {
    throw new Error(
      `Domain "${domainId}", band[${index}]: expected object, got ${typeof raw}`,
    )
  }
  for (const field of REQUIRED_BAND_FIELDS) {
    validateString(field, field, `Domain "${domainId}", band[${index}]`)
    if (raw[field] === undefined || raw[field] === null) {
      throw new Error(
        `Domain "${domainId}", band[${index}]: missing required field "${field}"`,
      )
    }
  }
  return {
    label: validateString(raw.label, "label", `Domain "${domainId}", band[${index}]`),
    min: validateNumber(raw.min, "min", `Domain "${domainId}", band[${index}]`),
    max: validateNumber(raw.max, "max", `Domain "${domainId}", band[${index}]`),
  }
}

function validateDomain(raw: unknown, index: number): Domain {
  if (!isRecord(raw)) {
    throw new Error(`domains[${index}]: expected object, got ${typeof raw}`)
  }

  for (const field of REQUIRED_DOMAIN_FIELDS) {
    if (raw[field] === undefined || raw[field] === null) {
      throw new Error(
        `Domain at index ${index} (id="${raw.id as string}"): missing required field "${field}"`,
      )
    }
  }

  const id = validateString(raw.id, "id", `domains[${index}]`) as Domain["id"]

  const rawBands = raw.bands
  if (!Array.isArray(rawBands)) {
    throw new Error(`Domain "${id}": "bands" must be an array, got ${typeof rawBands}`)
  }
  if (rawBands.length !== 4) {
    throw new Error(
      `Domain "${id}": expected 4 bands, got ${rawBands.length}`,
    )
  }

  const bands: [DomainBand, DomainBand, DomainBand, DomainBand] = [
    validateBand(rawBands[0], 0, id),
    validateBand(rawBands[1], 1, id),
    validateBand(rawBands[2], 2, id),
    validateBand(rawBands[3], 3, id),
  ]

  const rawSafetyFlags = raw.safety_flags
  let safetyFlags: Domain["safety_flags"] = undefined
  if (rawSafetyFlags !== undefined && rawSafetyFlags !== null) {
    if (!isRecord(rawSafetyFlags)) {
      throw new Error(
        `Domain "${id}": "safety_flags" must be an object, got ${typeof rawSafetyFlags}`,
      )
    }
    safetyFlags = {
      has_safety_gate_item: !!rawSafetyFlags.has_safety_gate_item,
      safety_gate_item_id: validateString(
        rawSafetyFlags.safety_gate_item_id,
        "safety_gate_item_id",
        `Domain "${id}"`,
      ),
    }
  }

  return {
    id,
    name: validateString(raw.name, "name", `domains[${index}]`),
    cluster: validateString(raw.cluster, "cluster", `domains[${index}]`),
    weight: validateNumber(raw.weight, "weight", `domains[${index}]`),
    min_score: validateNumber(raw.min_score, "min_score", `domains[${index}]`),
    max_score: validateNumber(raw.max_score, "max_score", `domains[${index}]`),
    bands,
    band_boundary_rule: validateString(
      raw.band_boundary_rule,
      "band_boundary_rule",
      `domains[${index}]`,
    ),
    psychological_construct: validateString(
      raw.psychological_construct,
      "psychological_construct",
      `domains[${index}]`,
    ),
    medical_relevance: validateString(
      raw.medical_relevance,
      "medical_relevance",
      `domains[${index}]`,
    ),
    safety_flags: safetyFlags,
    item_ids: (() => {
      const rawItemIds = raw.item_ids
      if (!Array.isArray(rawItemIds)) {
        throw new Error(`Domain "${id}": "item_ids" must be an array`)
      }
      return rawItemIds.map((v, i) => {
        if (typeof v !== "string") {
          throw new Error(
            `Domain "${id}", item_ids[${i}]: expected string, got ${typeof v}`,
          )
        }
        return v
      })
    })(),
  }
}

function loadDomains(): Domain[] {
  if (!isRecord(raw)) {
    throw new Error("domains.json: root must be an object")
  }

  const rawDomains = raw.domains
  if (!Array.isArray(rawDomains)) {
    throw new Error("domains.json: \"domains\" must be an array")
  }

  return rawDomains.map((d, i) => validateDomain(d, i))
}

export const DOMAINS: Domain[] = loadDomains()
