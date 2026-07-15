export interface DomainFragmentLevel {
  id: string
  interpretation: string
  strength: string
  growth: string
  study_advice: string
  wellbeing_advice: string
  medical_practice_relevance: string
  warning: string
  resources: string[]
}

export type DomainFragments = Record<string, Record<string, DomainFragmentLevel>>

export interface InteractionBlock {
  id: string
  text: string
}

export interface SafetyResource {
  name: string
  detail: string
}

export interface SafetyGateBlock {
  message: string
  resources: SafetyResource[]
  note: string
}

export interface Footer {
  non_admissions_notice: string
  non_diagnostic_notice: string
}

export interface ReportSet {
  domain_fragments: DomainFragments
  interaction_blocks: Record<string, InteractionBlock>
  safety_gate: SafetyGateBlock
  footer: Footer
}
