import type {
  ValidationConfig,
  StructuralRules,
  RandomAnsweringConfig,
  ResponseTimeConfig,
  StraightLineConfig,
  ErrorCodes,
} from "../types/validation.ts"
import raw from "./validation.json"

const REQUIRED_TOP_LEVEL: (keyof ValidationConfig)[] = [
  "schema_version",
  "structural_rules",
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

function validateStructuralRules(raw: unknown): StructuralRules {
  if (!isRecord(raw)) {
    throw new Error("structural_rules: expected object")
  }
  return {
    reject_unknown_question_ids: validateBoolean(raw.reject_unknown_question_ids, "reject_unknown_question_ids", "structural_rules"),
    reject_out_of_range_values: validateBoolean(raw.reject_out_of_range_values, "reject_out_of_range_values", "structural_rules"),
    reject_invalid_timestamp_order: validateBoolean(raw.reject_invalid_timestamp_order, "reject_invalid_timestamp_order", "structural_rules"),
    require_consent_confirmed: validateBoolean(raw.require_consent_confirmed, "require_consent_confirmed", "structural_rules"),
    require_age_bracket_confirmed: validateBoolean(raw.require_age_bracket_confirmed, "require_age_bracket_confirmed", "structural_rules"),
    reject_duplicate_completed_session: validateBoolean(raw.reject_duplicate_completed_session, "reject_duplicate_completed_session", "structural_rules"),
  }
}

function validateRandomAnswering(raw: unknown): RandomAnsweringConfig {
  if (!isRecord(raw)) {
    throw new Error("random_answering: expected object")
  }
  return {
    variance_threshold: validateNumber(raw.variance_threshold, "variance_threshold", "random_answering"),
    min_items_required: validateNumber(raw.min_items_required, "min_items_required", "random_answering"),
  }
}

function validateResponseTime(raw: unknown): ResponseTimeConfig {
  if (!isRecord(raw)) {
    throw new Error("response_time: expected object")
  }
  return {
    enabled_if_item_timestamps_present: validateBoolean(raw.enabled_if_item_timestamps_present, "enabled_if_item_timestamps_present", "response_time"),
    total_time_floor_minutes: validateNumber(raw.total_time_floor_minutes, "total_time_floor_minutes", "response_time"),
    per_item_floor_seconds: validateNumber(raw.per_item_floor_seconds, "per_item_floor_seconds", "response_time"),
    per_item_floor_count_threshold: validateNumber(raw.per_item_floor_count_threshold, "per_item_floor_count_threshold", "response_time"),
  }
}

function validateStraightLine(raw: unknown): StraightLineConfig {
  if (!isRecord(raw)) {
    throw new Error("straight_line: expected object")
  }
  return {
    window_size: validateNumber(raw.window_size, "window_size", "straight_line"),
    applies_to: validateString(raw.applies_to, "applies_to", "straight_line"),
  }
}

function validateErrorCodes(raw: unknown): ErrorCodes {
  if (!isRecord(raw)) {
    throw new Error("error_codes: expected object")
  }
  const codes: Record<string, string> = {}
  for (const [key, value] of Object.entries(raw)) {
    codes[key] = validateString(value, key, "error_codes")
  }
  return codes as unknown as ErrorCodes
}

function loadValidationConfig(): ValidationConfig {
  if (!isRecord(raw)) {
    throw new Error("validation.json: root must be an object")
  }

  for (const field of REQUIRED_TOP_LEVEL) {
    if (raw[field] === undefined || raw[field] === null) {
      throw new Error(`validation.json: missing required top-level key "${field}"`)
    }
  }

  const rawCollapseGroup = raw.confidence_penalty_collapse_group
  if (!Array.isArray(rawCollapseGroup)) {
    throw new Error('validation.json: "confidence_penalty_collapse_group" must be an array')
  }

  return {
    schema_version: validateString(raw.schema_version, "schema_version", "validation.json"),
    structural_rules: validateStructuralRules(raw.structural_rules),
    random_answering: validateRandomAnswering(raw.random_answering),
    response_time: validateResponseTime(raw.response_time),
    straight_line: validateStraightLine(raw.straight_line),
    confidence_penalty_collapse_group: rawCollapseGroup.map((v: unknown, i: number) => {
      if (typeof v !== "string") throw new Error(`validation.json: confidence_penalty_collapse_group[${i}] must be a string`)
      return v
    }),
    confidence_penalty_collapse_group_delta: validateNumber(
      raw.confidence_penalty_collapse_group_delta,
      "confidence_penalty_collapse_group_delta",
      "validation.json",
    ),
    error_codes: validateErrorCodes(raw.error_codes),
  }
}

export const VALIDATION_CONFIG: ValidationConfig = loadValidationConfig()
