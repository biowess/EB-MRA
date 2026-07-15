import type { Question, WeightEntry, Weights } from "../types/question.ts"
import type { DomainId } from "../types/domain.ts"
import raw from "./questions.json"
import wRaw from "./weights.json"

const REQUIRED_QUESTION_FIELDS: (keyof Question)[] = [
  "id",
  "domain",
  "item_type",
  "text",
  "purpose",
  "construct_measured",
  "response_type",
  "options",
  "reverse_scored",
  "item_weight",
  "difficulty_estimate",
  "discrimination_estimate",
  "estimate_status",
  "potential_bias",
  "expected_interpretation",
]

const VALID_ITEM_TYPES = new Set(["core", "auxiliary", "scenario", "auxiliary_sd_detector"])
const VALID_RESPONSE_TYPES = new Set(["LIKERT5", "SINGLE_SELECT"])
const VALID_DOMAINS = new Set<DomainId>(["SAR", "ELCA", "IHOR", "AMB", "ECPC", "ERP", "CSR", "RST"])

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

function validateOption(raw: unknown, index: number, questionId: string) {
  if (!isRecord(raw)) {
    throw new Error(`Question "${questionId}", option[${index}]: expected object`)
  }
  const value = raw.value
  const label = validateString(raw.label as string, "label", `Question "${questionId}", option[${index}]`)
  const score = raw.score

  if (typeof value === "number") {
    return { value, label }
  }
  if (typeof value === "string") {
    if (typeof score !== "number") {
      throw new Error(`Question "${questionId}", option[${index}]: SINGLE_SELECT option must have numeric score`)
    }
    return { value, label, score }
  }
  throw new Error(`Question "${questionId}", option[${index}]: unexpected value type ${typeof value}`)
}

function validateSecondaryDomain(raw: Record<string, unknown>, questionId: string): { domain: DomainId; loading: number } {
  const domain = validateString(raw.domain, "domain", `Question "${questionId}".secondary_domain`)
  if (!VALID_DOMAINS.has(domain as DomainId)) {
    throw new Error(`Question "${questionId}".secondary_domain: invalid domain "${domain}"`)
  }
  const loading = validateNumber(raw.loading, "loading", `Question "${questionId}".secondary_domain`)
  return { domain: domain as DomainId, loading }
}

function validateQuestion(raw: unknown, index: number): Question {
  if (!isRecord(raw)) {
    throw new Error(`questions[${index}]: expected object, got ${typeof raw}`)
  }

  for (const field of REQUIRED_QUESTION_FIELDS) {
    if (raw[field] === undefined || raw[field] === null) {
      throw new Error(
        `Question at index ${index} (id="${raw.id as string}"): missing required field "${field}"`,
      )
    }
  }

  const id = validateString(raw.id, "id", `questions[${index}]`)
  const domain = validateString(raw.domain, "domain", `questions[${index}]`)

  if (!VALID_DOMAINS.has(domain as DomainId)) {
    throw new Error(`Question "${id}": invalid domain "${domain}"`)
  }

  const itemType = validateString(raw.item_type, "item_type", `questions[${index}]`)
  if (!VALID_ITEM_TYPES.has(itemType)) {
    throw new Error(`Question "${id}": invalid item_type "${itemType}"`)
  }

  const responseType = validateString(raw.response_type, "response_type", `questions[${index}]`)
  if (!VALID_RESPONSE_TYPES.has(responseType)) {
    throw new Error(`Question "${id}": invalid response_type "${responseType}"`)
  }

  const rawOptions = raw.options
  if (!Array.isArray(rawOptions)) {
    throw new Error(`Question "${id}": "options" must be an array`)
  }
  const options = rawOptions.map((o: unknown, i: number) => validateOption(o, i, id))

  const developerNotes = raw.developer_notes
  const secondaryDomain = raw.secondary_domain

  const scoredTowardDomain = raw.scored_toward_domain
  const scoredTowardSdIndex = raw.scored_toward_sd_index
  const sdIndexWeight = raw.sd_index_weight

  return {
    id,
    domain: domain as DomainId,
    item_type: itemType as Question["item_type"],
    text: validateString(raw.text, "text", `Question "${id}"`),
    purpose: validateString(raw.purpose, "purpose", `Question "${id}"`),
    construct_measured: validateString(raw.construct_measured, "construct_measured", `Question "${id}"`),
    response_type: responseType as Question["response_type"],
    options,
    reverse_scored: validateBoolean(raw.reverse_scored, "reverse_scored", `Question "${id}"`),
    item_weight: validateNumber(raw.item_weight, "item_weight", `Question "${id}"`),
    difficulty_estimate: validateNumber(raw.difficulty_estimate, "difficulty_estimate", `Question "${id}"`),
    discrimination_estimate: validateNumber(raw.discrimination_estimate, "discrimination_estimate", `Question "${id}"`),
    estimate_status: validateString(raw.estimate_status, "estimate_status", `Question "${id}"`),
    potential_bias: validateString(raw.potential_bias, "potential_bias", `Question "${id}"`),
    expected_interpretation: validateString(raw.expected_interpretation, "expected_interpretation", `Question "${id}"`),
    developer_notes: developerNotes === null ? null : validateString(developerNotes as string, "developer_notes", `Question "${id}"`),
    ...(scoredTowardDomain !== undefined ? { scored_toward_domain: validateBoolean(scoredTowardDomain, "scored_toward_domain", `Question "${id}"`) } : {}),
    ...(scoredTowardSdIndex !== undefined ? { scored_toward_sd_index: validateBoolean(scoredTowardSdIndex, "scored_toward_sd_index", `Question "${id}"`) } : {}),
    ...(sdIndexWeight !== undefined ? { sd_index_weight: validateNumber(sdIndexWeight as number, "sd_index_weight", `Question "${id}"`) } : {}),
    secondary_domain: secondaryDomain === null
      ? null
      : validateSecondaryDomain(secondaryDomain as Record<string, unknown>, id),
  }
}

function validateWeightEntry(raw: unknown, questionId: string): WeightEntry {
  if (!isRecord(raw)) {
    throw new Error(`Weight "${questionId}": expected object`)
  }
  const weight = validateNumber(raw.weight, "weight", `Weight "${questionId}"`)
  const reverse = validateBoolean(raw.reverse, "reverse", `Weight "${questionId}"`)
  const scoredTowardDomain = validateBoolean(raw.scored_toward_domain, "scored_toward_domain", `Weight "${questionId}"`)
  const scoredTowardSdIndex = raw.scored_toward_sd_index
  const optionScores = raw.option_scores

  let validatedOptionScores: Record<string, number> | undefined
  if (optionScores !== undefined) {
    if (!isRecord(optionScores)) {
      throw new Error(`Weight "${questionId}": "option_scores" must be an object`)
    }
    validatedOptionScores = {} as Record<string, number>
    for (const [key, value] of Object.entries(optionScores)) {
      if (typeof value !== "number") {
        throw new Error(`Weight "${questionId}", option_scores["${key}"]: expected number, got ${typeof value}`)
      }
      validatedOptionScores[key] = value
    }
  }

  return {
    weight,
    reverse,
    scored_toward_domain: scoredTowardDomain,
    ...(scoredTowardSdIndex !== undefined ? { scored_toward_sd_index: validateBoolean(scoredTowardSdIndex, "scored_toward_sd_index", `Weight "${questionId}"`) } : {}),
    ...(validatedOptionScores !== undefined ? { option_scores: validatedOptionScores } : {}),
  }
}

function loadQuestions(): Question[] {
  if (!isRecord(raw)) {
    throw new Error("questions.json: root must be an object")
  }

  const rawQuestions = raw.questions
  if (!Array.isArray(rawQuestions)) {
    throw new Error("questions.json: \"questions\" must be an array")
  }

  return rawQuestions.map((q: unknown, i: number) => validateQuestion(q, i))
}

function loadWeights(): Weights {
  if (!isRecord(wRaw)) {
    throw new Error("weights.json: root must be an object")
  }

  const weights = {} as Weights

  for (const [domainKey, domainWeights] of Object.entries(wRaw)) {
    if (!VALID_DOMAINS.has(domainKey as DomainId)) {
      throw new Error(`weights.json: invalid domain "${domainKey}"`)
    }

    if (!isRecord(domainWeights)) {
      throw new Error(`weights.json["${domainKey}"]: expected object`)
    }

    const entries = {} as Record<string, WeightEntry>
    for (const [questionId, weightEntry] of Object.entries(domainWeights)) {
      entries[questionId] = validateWeightEntry(weightEntry, questionId)
    }
    weights[domainKey as DomainId] = entries
  }

  return weights
}

function crossValidate(questions: Question[], weights: Weights): void {
  const weightIds = new Set<string>()
  for (const entries of Object.values(weights)) {
    for (const id of Object.keys(entries)) {
      weightIds.add(id)
    }
  }

  const questionIds = new Set(questions.map(q => q.id))

  for (const qId of questionIds) {
    if (!weightIds.has(qId)) {
      throw new Error(`Cross-validation: question "${qId}" has no matching entry in weights.json`)
    }
  }

  for (const wId of weightIds) {
    if (!questionIds.has(wId)) {
      throw new Error(`Cross-validation: weight "${wId}" has no matching question in questions.json`)
    }
  }

  for (const question of questions) {
    const weightEntry = weights[question.domain][question.id]

    if (weightEntry.weight !== question.item_weight) {
      throw new Error(
        `Cross-validation: Question "${question.id}" has item_weight=${question.item_weight} but weights.json has weight=${weightEntry.weight}`,
      )
    }

    if (weightEntry.reverse !== question.reverse_scored) {
      throw new Error(
        `Cross-validation: Question "${question.id}" has reverse_scored=${question.reverse_scored} but weights.json has reverse=${weightEntry.reverse}`,
      )
    }

    if (weightEntry.scored_toward_domain === false && question.scored_toward_domain === false) {
      continue
    }

    const scoredSdInQuestion = question.scored_toward_sd_index === true
    const scoredSdInWeight = weightEntry.scored_toward_sd_index === true
    if (scoredSdInQuestion !== scoredSdInWeight) {
      throw new Error(
        `Cross-validation: Question "${question.id}" scored_toward_sd_index mismatch (question=${scoredSdInQuestion}, weight=${scoredSdInWeight})`,
      )
    }
  }
}

const QUESTIONS: Question[] = loadQuestions()
const WEIGHTS: Weights = loadWeights()

crossValidate(QUESTIONS, WEIGHTS)

function getQuestionsByDomain(domain: DomainId): Question[] {
  return QUESTIONS.filter(q => q.domain === domain)
}

export { QUESTIONS, WEIGHTS, getQuestionsByDomain }
export type { Question, WeightEntry, Weights }
