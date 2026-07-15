import type { ReportSet, DomainFragmentLevel, InteractionBlock, SafetyGateBlock, Footer } from "../types/reports.ts"
import raw from "./reports.json"

const REQUIRED_TOP_LEVEL: (keyof ReportSet)[] = [
  "domain_fragments",
  "interaction_blocks",
  "footer",
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

function validateDomainFragmentLevel(raw: unknown, level: string, domain: string): DomainFragmentLevel {
  if (!isRecord(raw)) {
    throw new Error(`domain_fragments["${domain}"]["${level}"]: expected object`)
  }
  const rawResources = raw.resources
  if (!Array.isArray(rawResources)) {
    throw new Error(`domain_fragments["${domain}"]["${level}"]: "resources" must be an array`)
  }
  return {
    id: validateString(raw.id, "id", `domain_fragments["${domain}"]["${level}"]`),
    interpretation: validateString(raw.interpretation, "interpretation", `domain_fragments["${domain}"]["${level}"]`),
    strength: validateString(raw.strength, "strength", `domain_fragments["${domain}"]["${level}"]`),
    growth: validateString(raw.growth, "growth", `domain_fragments["${domain}"]["${level}"]`),
    study_advice: validateString(raw.study_advice, "study_advice", `domain_fragments["${domain}"]["${level}"]`),
    wellbeing_advice: validateString(raw.wellbeing_advice, "wellbeing_advice", `domain_fragments["${domain}"]["${level}"]`),
    medical_practice_relevance: validateString(raw.medical_practice_relevance, "medical_practice_relevance", `domain_fragments["${domain}"]["${level}"]`),
    warning: validateString(raw.warning, "warning", `domain_fragments["${domain}"]["${level}"]`),
    resources: rawResources.map((r: unknown, i: number) => {
      if (typeof r !== "string") throw new Error(`domain_fragments["${domain}"]["${level}"].resources[${i}]: expected string`)
      return r
    }),
  }
}

function validateInteractionBlock(raw: unknown, key: string): InteractionBlock {
  if (!isRecord(raw)) {
    throw new Error(`interaction_blocks["${key}"]: expected object`)
  }
  return {
    id: validateString(raw.id, "id", `interaction_blocks["${key}"]`),
    text: validateString(raw.text, "text", `interaction_blocks["${key}"]`),
  }
}

function validateSafetyGate(raw: unknown): SafetyGateBlock {
  if (!isRecord(raw)) {
    throw new Error("safety_gate: expected object")
  }
  const rawResources = raw.resources
  if (!Array.isArray(rawResources)) {
    throw new Error('safety_gate: "resources" must be an array')
  }
  return {
    message: validateString(raw.message, "message", "safety_gate"),
    resources: rawResources.map((r: unknown, i: number) => {
      if (!isRecord(r)) throw new Error(`safety_gate.resources[${i}]: expected object`)
      return {
        name: validateString(r.name, "name", `safety_gate.resources[${i}]`),
        detail: validateString(r.detail, "detail", `safety_gate.resources[${i}]`),
      }
    }),
    note: validateString(raw.note, "note", "safety_gate"),
  }
}

function validateFooter(raw: unknown): Footer {
  if (!isRecord(raw)) {
    throw new Error("footer: expected object")
  }
  return {
    non_admissions_notice: validateString(raw.non_admissions_notice, "non_admissions_notice", "footer"),
    non_diagnostic_notice: validateString(raw.non_diagnostic_notice, "non_diagnostic_notice", "footer"),
  }
}

function loadReports(): ReportSet {
  if (!isRecord(raw)) {
    throw new Error("reports.json: root must be an object")
  }

  for (const field of REQUIRED_TOP_LEVEL) {
    if (raw[field] === undefined || raw[field] === null) {
      throw new Error(`reports.json: missing required top-level key "${field}"`)
    }
  }

  const rawDomainFragments = raw.domain_fragments
  if (!isRecord(rawDomainFragments)) {
    throw new Error('reports.json: "domain_fragments" must be an object')
  }

  const rawInteractionBlocks = raw.interaction_blocks
  if (!isRecord(rawInteractionBlocks)) {
    throw new Error('reports.json: "interaction_blocks" must be an object')
  }

  const domainFragments: Record<string, Record<string, DomainFragmentLevel>> = {}
  for (const [domain, levels] of Object.entries(rawDomainFragments)) {
    if (!isRecord(levels)) {
      throw new Error(`domain_fragments["${domain}"]: expected object`)
    }
    const levelsObj: Record<string, DomainFragmentLevel> = {}
    for (const [level, data] of Object.entries(levels)) {
      levelsObj[level] = validateDomainFragmentLevel(data, level, domain)
    }
    domainFragments[domain] = levelsObj
  }

  const interactionBlocks: Record<string, InteractionBlock> = {}
  for (const [key, data] of Object.entries(rawInteractionBlocks)) {
    interactionBlocks[key] = validateInteractionBlock(data, key)
  }

  return {
    domain_fragments: domainFragments,
    interaction_blocks: interactionBlocks,
    safety_gate: validateSafetyGate(raw.safety_gate),
    footer: validateFooter(raw.footer),
  }
}

export const REPORTS: ReportSet = loadReports()
