export interface InteractionRuleCondition {
  domain: string
  op: string
  value: number
}

export interface InteractionRule {
  id: string
  conditions: InteractionRuleCondition[]
  effect: string
  report_block?: string
  target?: string
  delta?: number
}

export interface ConfidenceModifierGlobal {
  id: string
  condition: string
  delta?: number
  delta_per_unit?: number
}

export interface SafetyGate {
  trigger_item: string
  trigger_value: number
  supporting_items: string[]
  supporting_threshold_contribution_score: number
  supporting_min_count: number
}

export interface RuleSet {
  schema_version: string
  interaction_rules: InteractionRule[]
  evaluation_order: string[]
  confidence_modifiers_global: ConfidenceModifierGlobal[]
  consistency_pairs: [string, string][]
  safety_gate: SafetyGate
}
