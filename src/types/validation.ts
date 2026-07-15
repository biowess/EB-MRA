export interface StructuralRules {
  reject_unknown_question_ids: boolean
  reject_out_of_range_values: boolean
  reject_invalid_timestamp_order: boolean
  require_consent_confirmed: boolean
  require_age_bracket_confirmed: boolean
  reject_duplicate_completed_session: boolean
}

export interface RandomAnsweringConfig {
  variance_threshold: number
  min_items_required: number
}

export interface ResponseTimeConfig {
  enabled_if_item_timestamps_present: boolean
  total_time_floor_minutes: number
  per_item_floor_seconds: number
  per_item_floor_count_threshold: number
}

export interface StraightLineConfig {
  window_size: number
  applies_to: string
}

export interface ErrorCodes {
  ERR_UNKNOWN_QUESTION_ID: string
  ERR_INVALID_RESPONSE_VALUE: string
  ERR_INVALID_TIMESTAMP_ORDER: string
  ERR_CONSENT_REQUIRED: string
  ERR_AGE_REQUIREMENT_NOT_MET: string
  ERR_DUPLICATE_SESSION: string
}

export interface ValidationConfig {
  schema_version: string
  structural_rules: StructuralRules
  random_answering: RandomAnsweringConfig
  response_time: ResponseTimeConfig
  straight_line: StraightLineConfig
  confidence_penalty_collapse_group: string[]
  confidence_penalty_collapse_group_delta: number
  error_codes: ErrorCodes
}
