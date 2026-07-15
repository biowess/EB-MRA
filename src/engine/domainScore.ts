import type { AnswerValue } from "../types/answers.ts"
import type { DomainId } from "../types/domain.ts"
import type { Question } from "../types/question.ts"
import { DOMAINS } from "../data/loadDomains.ts"
import { QUESTIONS, WEIGHTS } from "../data/loadQuestions.ts"
import { contributionScore } from "./contribution.ts"

export interface DomainScore {
  domain: DomainId
  raw_weighted_score: number | null
  normalized_score: number | null
  flags: string[]
  insufficient_data: boolean
}

export interface ValidationDetail {
  pair: [string, string]
  consistent: boolean
  discrepancy: number
}

export interface StraightLineDetail {
  items: string[]
  value: AnswerValue
  length: number
}

export interface InteractionFlag {
  rule: string
  triggered: boolean
  detail: string
}

export interface ScoringResult {
  safety_gate_triggered: boolean
  safety_gate_details: { main_item: string; supporting_items: { id: string; contribution_score: number; flagged: boolean }[] }
  domain_scores: DomainScore[]
  overall_confidence: number
  interaction_flags: InteractionFlag[]
  validation_checks: {
    straight_line: StraightLineDetail[]
    consistency: ValidationDetail[]
    contradictions: string[]
  }
  sd_index: number
  suppress_profile_assignment: boolean
  incomplete: boolean
}

// ── Spec §5.0 pipeline ordering ──────────────────────────────
// Domains presented in fixed presentation order (Part 2, Part 3 §5.7)
const DOMAIN_ID_ORDER: DomainId[] = [
  "SAR", "ELCA", "IHOR", "AMB", "ECPC", "ERP", "CSR", "RST",
]

// ── Consistency pairs (rules.json §9.4, 10 pairs per §5.6) ───
// Must match rules.json consistency_pairs exactly.
const CONSISTENCY_PAIRS: [string, string][] = [
  ["SAR-C01", "SAR-C05"],
  ["SAR-A01", "SAR-A02"],
  ["IHOR-C01", "IHOR-C05"],
  ["IHOR-A01", "IHOR-A02"],
  ["ECPC-A01", "ECPC-A02"],
  ["CSR-A01", "CSR-A02"],
  ["AMB-A01", "AMB-A02"],
  ["ELCA-A01", "ELCA-A02"],
  ["ERP-A01", "ERP-A02"],
  ["RST-A01", "RST-A02"],
]

const STRAIGHT_LINE_WINDOW = 10

// ── SD-detector items (§5.9) ─────────────────────────────────
// ERP-A03 weighted 1.5; all others 1.0
const SD_INDEX_ITEMS: { id: string; weight: number }[] = [
  { id: "SAR-A03",  weight: 1.0 },
  { id: "ELCA-A03", weight: 1.0 },
  { id: "IHOR-A03", weight: 1.0 },
  { id: "AMB-A03",  weight: 1.0 },
  { id: "ECPC-A03", weight: 1.0 },
  { id: "ERP-A03",  weight: 1.5 },
  { id: "CSR-A03",  weight: 1.0 },
  { id: "RST-A03",  weight: 1.0 },
]

// ── Safety gate satellite items (§4.5, §5.12) ────────────────
const SAFETY_GATE_SATELLITE_ITEMS = ["RST-C03", "RST-C05", "RST-C08"]

const questionMap = new Map<string, Question>(QUESTIONS.map(q => [q.id, q]))

// ── LIKERT5 item IDs in fixed presentation order (§5.7) ──────
function getPresentationOrderedLIKERT5Ids(): string[] {
  const ids: string[] = []
  for (const domainId of DOMAIN_ID_ORDER) {
    const domain = DOMAINS.find(d => d.id === domainId)!
    for (const itemId of domain.item_ids) {
      const q = questionMap.get(itemId)
      if (q && q.response_type === "LIKERT5") {
        ids.push(itemId)
      }
    }
  }
  return ids
}

function contribution(rawValue: AnswerValue, questionId: string): number {
  const q = questionMap.get(questionId)
  if (!q) {
    throw new Error(`contribution: unknown question "${questionId}"`)
  }
  return contributionScore(rawValue, q)
}

// ── §5.1 / §5.2 / §5.3: Domain scoring ──────────────────────
function computeDomainScores(
  answers: Record<string, AnswerValue>,
): DomainScore[] {
  return DOMAINS.map(domain => {
    const weightMap = WEIGHTS[domain.id]
    const domainItemIds = domain.item_ids.filter(id => {
      const w = weightMap[id]
      return w && w.scored_toward_domain
    })

    const scored: { raw: number; weight: number }[] = []

    for (const itemId of domainItemIds) {
      const rawVal = answers[itemId]
      if (rawVal === undefined || rawVal === null) continue

      const weight = weightMap[itemId].weight
      const contrib = contribution(rawVal, itemId)
      scored.push({ raw: contrib, weight })
    }

    const applicableCount = domainItemIds.length
    const answeredCount = scored.length
    const missingCount = applicableCount - answeredCount

    const flags: string[] = []
    let insufficient_data = false

    if (answeredCount === 0) {
      flags.push("no_data")
      return {
        domain: domain.id,
        raw_weighted_score: null,
        normalized_score: null,
        flags,
        insufficient_data: true,
      }
    }

    // §5.5 Tier 2: ≥3 missing in domain → insufficient_data
    if (missingCount >= 3) {
      flags.push("insufficient_data")
      insufficient_data = true
    }

    const totalWeight = scored.reduce((sum, s) => sum + s.weight, 0)
    if (totalWeight === 0) {
      return {
        domain: domain.id,
        raw_weighted_score: null,
        normalized_score: null,
        flags: [...flags, "zero_weight"],
        insufficient_data: true,
      }
    }

    const weightedSum = scored.reduce((sum, s) => sum + s.raw * s.weight, 0)
    const rawWeightedMean = weightedSum / totalWeight

    // §5.3 normalization: ROUND((WeightedMean - 1) / 4 × 100, 1)
    const normalized = Math.round(((rawWeightedMean - 1) / 4) * 100 * 10) / 10
    const clamped = Math.max(0, Math.min(100, normalized))

    // §5.5 Tier 2: score suppressed for report but still computed for internal use
    if (insufficient_data) {
      return {
        domain: domain.id,
        raw_weighted_score: rawWeightedMean,
        normalized_score: null,
        flags: [...flags, "score_suppressed"],
        insufficient_data: true,
      }
    }

    return {
      domain: domain.id,
      raw_weighted_score: rawWeightedMean,
      normalized_score: clamped,
      flags,
      insufficient_data: false,
    }
  })
}

// ── §5.12: Safety gate (runs FIRST, before all other steps) ──
// Triggers when RST-S02 == option C ("3" in the safety_gate trigger_value)
// AND ≥2 of {RST-C03, RST-C05, RST-C08} have contribution_score ≤ 2.
function checkSafetyGate(
  answers: Record<string, AnswerValue>,
): ScoringResult["safety_gate_details"] | null {
  const mainRaw = answers["RST-S02"]
  if (mainRaw === undefined || mainRaw === null) return null

  // RST-S02 is a SINGLE_SELECT scenario item; option C maps to the crisis option.
  // The spec (§4.5, §5.12) says raw_value == 3, meaning the respondent selected
  // option "C" (which is mapped internally as the string "C" from our questions.json).
  if (String(mainRaw) !== "C") return null

  const supporting = SAFETY_GATE_SATELLITE_ITEMS.map(id => {
    const rawVal = answers[id]
    let contribScore: number
    let flagged = false
    if (rawVal === undefined || rawVal === null) {
      contribScore = NaN
      flagged = false
    } else {
      contribScore = contribution(rawVal, id)
      flagged = contribScore <= 2
    }
    return { id, contribution_score: contribScore, flagged }
  })

  // Only items with actual answers count toward the "2+" threshold
  const answered = supporting.filter(s => !isNaN(s.contribution_score))
  const flaggedCount = supporting.filter(s => s.flagged).length

  // Need at least 2 satellite items answered AND at least 2 flagged (≤2 contrib)
  if (answered.length < 2 || flaggedCount < 2) return null

  return { main_item: "RST-S02", supporting_items: supporting }
}

// ── §5.6: Consistency checks (10 pairs) ─────────────────────
function checkConsistency(
  answers: Record<string, AnswerValue>,
): ValidationDetail[] {
  return CONSISTENCY_PAIRS.map(([idA, idB]) => {
    const rawA = answers[idA]
    const rawB = answers[idB]
    if (rawA === undefined || rawA === null || rawB === undefined || rawB === null) {
      return { pair: [idA, idB], consistent: true, discrepancy: 0 }
    }
    const scoreA = contribution(rawA, idA)
    const scoreB = contribution(rawB, idB)
    const discrepancy = Math.abs(scoreA - scoreB)
    return {
      pair: [idA, idB] as [string, string],
      // §5.6: divergence ≥ 3 → INCONSISTENT
      consistent: discrepancy < 3,
      discrepancy,
    }
  })
}

// ── §5.7: Straight-line detection (LIKERT5 items only) ───────
function detectStraightLine(
  answers: Record<string, AnswerValue>,
): StraightLineDetail[] {
  const likertIds = getPresentationOrderedLIKERT5Ids()
  const results: StraightLineDetail[] = []

  for (let i = 0; i <= likertIds.length - STRAIGHT_LINE_WINDOW; i++) {
    const window = likertIds.slice(i, i + STRAIGHT_LINE_WINDOW)
    const values = window.map(id => answers[id]).filter(v => v !== undefined && v !== null) as number[]
    if (values.length < STRAIGHT_LINE_WINDOW) continue

    const first = values[0] as AnswerValue
    if (values.every(v => v === first)) {
      results.push({ items: window, value: first, length: STRAIGHT_LINE_WINDOW })
    }
  }

  return results
}

// ── §5.9: Social Desirability Index ─────────────────────────
// SD_index = count(*-A03 where raw ≥ 4) × 1.0 + (ERP-A03 flagged ? 1.5 : 0)
// Note: ERP-A03 contributes 1.5 instead of 1.0 (weighted separately).
function computeSDIndex(answers: Record<string, AnswerValue>): number {
  let total = 0
  for (const item of SD_INDEX_ITEMS) {
    const raw = answers[item.id]
    if (raw === undefined || raw === null) continue
    const numeric = Number(raw)
    if (!isNaN(numeric) && numeric >= 4) {
      total += item.weight
    }
  }
  return total
}

// ── §5.5 Tier 3: overall missing count ───────────────────────
function countOverallMissing(answers: Record<string, AnswerValue>): number {
  const allIds = QUESTIONS.map(q => q.id)
  return allIds.filter(id => answers[id] === undefined || answers[id] === null).length
}

// ── §5.10: Confidence calculation ────────────────────────────
// Spec formula (exact):
//   BaseConfidence = 100
//   −20 if SD_index ≥ 3             (CM-01)
//   −10 if missing_data_rate > 10%  (CM-02)
//   −25 if any STRAIGHT_LINE flag   (CM-03)
//   −5 × min(ConsistencyFlagCount, 4) (capped at −20 from consistency)
//   Clamp to [0, 100]
function computeConfidence(
  answers: Record<string, AnswerValue>,
  straightLine: StraightLineDetail[],
  consistency: ValidationDetail[],
  sdIndex: number,
): number {
  let confidence = 100

  // CM-01: SD index
  if (sdIndex >= 3) {
    confidence -= 20
  }

  // CM-02: missing data rate > 10%
  const totalQuestions = QUESTIONS.length
  const missingCount = countOverallMissing(answers)
  const missingPct = missingCount / totalQuestions
  if (missingPct > 0.10) {
    confidence -= 10
  }

  // CM-03: straight-line detection → −25
  if (straightLine.length > 0) {
    confidence -= 25
  }

  // CM-consistency: −5 per inconsistent pair, capped at 4 (max −20)
  const inconsistentCount = consistency.filter(c => !c.consistent).length
  confidence -= 5 * Math.min(inconsistentCount, 4)

  return Math.max(0, Math.min(100, Math.round(confidence)))
}

// ── §4.3 / §5.11: Interaction rules ─────────────────────────
// All 8 rules evaluated against FINAL domain scores (normalized 0–100).
// Fixed evaluation order: AR-03, AR-03b, IH-01, CR-02, EC-01, CM-04, PC-01, OA-01
// CM-04 is a confidence-modifier, not a report flag — included in the list
// but marked as non-report so the report engine can distinguish them.
function evaluateInteractionRules(
  domainScores: DomainScore[],
): InteractionFlag[] {
  const flags: InteractionFlag[] = []
  const scoreMap = new Map(domainScores.map(d => [d.domain, d.normalized_score]))

  const get = (id: DomainId): number | null => scoreMap.get(id) ?? null

  const SAR  = get("SAR")
  const ELCA = get("ELCA")
  const IHOR = get("IHOR")
  const AMB  = get("AMB")
  const ECPC = get("ECPC")
  const ERP  = get("ERP")
  const CSR  = get("CSR")
  const RST  = get("RST")

  // AR-03: SAR ≥ 70 AND AMB ≤ 40
  if (SAR !== null && AMB !== null && SAR >= 70 && AMB <= 40) {
    flags.push({ rule: "AR-03", triggered: true, detail: `SAR=${SAR} ≥ 70 AND AMB=${AMB} ≤ 40` })
  }

  // AR-03b: AMB ≤ 40 AND CSR ≥ 70
  if (AMB !== null && CSR !== null && AMB <= 40 && CSR >= 70) {
    flags.push({ rule: "AR-03b", triggered: true, detail: `AMB=${AMB} ≤ 40 AND CSR=${CSR} ≥ 70` })
  }

  // IH-01: SAR ≥ 70 AND IHOR ≤ 40
  if (SAR !== null && IHOR !== null && SAR >= 70 && IHOR <= 40) {
    flags.push({ rule: "IH-01", triggered: true, detail: `SAR=${SAR} ≥ 70 AND IHOR=${IHOR} ≤ 40` })
  }

  // CR-02: CSR ≥ 80 AND RST ≤ 40
  if (CSR !== null && RST !== null && CSR >= 80 && RST <= 40) {
    flags.push({ rule: "CR-02", triggered: true, detail: `CSR=${CSR} ≥ 80 AND RST=${RST} ≤ 40` })
  }

  // EC-01: SAR ≥ 70 AND ECPC ≤ 40
  if (SAR !== null && ECPC !== null && SAR >= 70 && ECPC <= 40) {
    flags.push({ rule: "EC-01", triggered: true, detail: `SAR=${SAR} ≥ 70 AND ECPC=${ECPC} ≤ 40` })
  }

  // CM-04: RST ≤ 40 AND ERP ≥ 80 → confidence modifier only (ERP confidence −15)
  // Included in interaction_flags with a distinct marker so the report layer
  // can apply the ERP-specific confidence reduction without surfacing a report block.
  if (RST !== null && ERP !== null && RST <= 40 && ERP >= 80) {
    flags.push({ rule: "CM-04", triggered: true, detail: `RST=${RST} ≤ 40 AND ERP=${ERP} ≥ 80 — ERP confidence reduced by 15` })
  }

  // PC-01: CSR ≥ 90 — standalone perfectionism note (§4.3)
  if (CSR !== null && CSR >= 90) {
    flags.push({ rule: "PC-01", triggered: true, detail: `CSR=${CSR} ≥ 90` })
  }

  // OA-01: SAR ≥ 90 — standalone over-analysis note (§4.3)
  if (SAR !== null && SAR >= 90) {
    flags.push({ rule: "OA-01", triggered: true, detail: `SAR=${SAR} ≥ 90` })
  }

  // Unused variable suppression for completeness:
  void ELCA

  return flags
}

// ── §5.9: Profile suppression ────────────────────────────────
// Spec §5.9: suppress profile assignment when SD_index ≥ 5.5.
// Also suppress on safety gate (safety gate is handled separately at
// the hook level — here we only implement the SD-index condition).
function shouldSuppressProfile(sdIndex: number): boolean {
  return sdIndex >= 5.5
}

// ── §5.8: Contradiction detection ────────────────────────────
// |CoreMean(D) − ScenarioMean(D)| ≥ 2.5 → DOMAIN_CONTRADICTION(D)
function detectContradictions(
  answers: Record<string, AnswerValue>,
  domainScores: DomainScore[],
): string[] {
  const contradictions: string[] = []

  for (const ds of domainScores) {
    const domainId = ds.domain
    const domainQuestions = QUESTIONS.filter(q => q.domain === domainId)

    const coreItems    = domainQuestions.filter(q => q.item_type === "core")
    const scenarioItems = domainQuestions.filter(q => q.item_type === "scenario")

    const coreScores: number[] = []
    for (const q of coreItems) {
      const raw = answers[q.id]
      if (raw !== undefined && raw !== null) {
        coreScores.push(contribution(raw, q.id))
      }
    }

    const scenarioScores: number[] = []
    for (const q of scenarioItems) {
      const raw = answers[q.id]
      if (raw !== undefined && raw !== null) {
        scenarioScores.push(contribution(raw, q.id))
      }
    }

    if (coreScores.length === 0 || scenarioScores.length === 0) continue

    const coreMean     = coreScores.reduce((s, v) => s + v, 0) / coreScores.length
    const scenarioMean = scenarioScores.reduce((s, v) => s + v, 0) / scenarioScores.length

    if (Math.abs(coreMean - scenarioMean) >= 2.5) {
      contradictions.push(domainId)
    }
  }

  return contradictions
}

// ── Main export: full pipeline (§5.0 / §5.13) ────────────────
export function computeDomainScore(
  answers: Record<string, AnswerValue>,
): ScoringResult {
  // Step 2: Safety gate — runs FIRST, before everything else (§5.12)
  const safetyGateDetails = checkSafetyGate(answers)
  const safetyGateTriggered = safetyGateDetails !== null

  // Steps 3–6: contribution scores, missing-data handling, per-domain scoring, normalization
  const domainScores = computeDomainScores(answers)

  // Step 7a: Consistency checks (§5.6)
  const consistency = checkConsistency(answers)

  // Step 7b: Straight-lining (§5.7)
  const straightLine = detectStraightLine(answers)

  // Step 7c: Contradiction detection (§5.8) — domain-level, does not affect scores
  const contradictions = detectContradictions(answers, domainScores)

  // Step 7d: Social Desirability Index (§5.9)
  const sdIndex = computeSDIndex(answers)

  // Step 8: Confidence rating (§5.10)
  const overallConfidence = computeConfidence(answers, straightLine, consistency, sdIndex)

  // Step 9: Interaction rules evaluated against final domain scores (§5.11, §4.3)
  const interactionFlags = evaluateInteractionRules(domainScores)

  // Step 10: Profile suppression — only triggered by SD_index ≥ 5.5 (§5.9)
  const suppressProfileAssignment = shouldSuppressProfile(sdIndex)

  // §5.5 Tier 3: incomplete assessment
  const incomplete = countOverallMissing(answers) / QUESTIONS.length > 0.25

  return {
    safety_gate_triggered: safetyGateTriggered,
    safety_gate_details: safetyGateDetails ?? {
      main_item: "RST-S02",
      supporting_items: [],
    },
    domain_scores: domainScores,
    overall_confidence: overallConfidence,
    interaction_flags: interactionFlags,
    validation_checks: {
      straight_line: straightLine,
      consistency,
      contradictions,
    },
    sd_index: sdIndex,
    suppress_profile_assignment: suppressProfileAssignment,
    incomplete,
  }
}
