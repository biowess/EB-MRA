import type { DomainId } from "./domain.ts"

export type ItemType = "core" | "auxiliary" | "scenario" | "auxiliary_sd_detector"

export type ResponseType = "LIKERT5" | "SINGLE_SELECT"

export interface LikertOption {
  value: number
  label: string
}

export interface SingleSelectOption {
  value: string
  label: string
  score: number
}

export type QuestionOption = LikertOption | SingleSelectOption

export interface Question {
  id: string
  domain: DomainId
  item_type: ItemType
  text: string
  purpose: string
  construct_measured: string
  response_type: ResponseType
  options: QuestionOption[]
  reverse_scored: boolean
  item_weight: number
  difficulty_estimate: number
  discrimination_estimate: number
  estimate_status: string
  potential_bias: string
  expected_interpretation: string
  developer_notes: string | null
  scored_toward_domain?: boolean
  scored_toward_sd_index?: boolean
  sd_index_weight?: number
  secondary_domain: { domain: DomainId; loading: number } | null
}

export interface WeightEntry {
  weight: number
  reverse: boolean
  scored_toward_domain: boolean
  scored_toward_sd_index?: boolean
  option_scores?: Record<string, number>
}

export type Weights = Record<DomainId, Record<string, WeightEntry>>
