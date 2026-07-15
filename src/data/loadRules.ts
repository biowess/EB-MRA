import type { RuleSet, InteractionRule, InteractionRuleCondition, ConfidenceModifierGlobal, SafetyGate } from "../types/rules.ts"
import raw from "./rules.json"

const REQUIRED_TOP_LEVEL: (keyof RuleSet)[] = [
  "schema_version",
  "interaction_rules",
  "evaluation_order",
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

function validateCondition(raw: unknown, index: number, ruleId: string): InteractionRuleCondition {
  if (!isRecord(raw)) {
    throw new Error(`Rule "${ruleId}", condition[${index}]: expected object`)
  }
  return {
    domain: validateString(raw.domain, "domain", `Rule "${ruleId}", condition[${index}]`),
    op: validateString(raw.op, "op", `Rule "${ruleId}", condition[${index}]`),
    value: validateNumber(raw.value, "value", `Rule "${ruleId}", condition[${index}]`),
  }
}

function validateInteractionRule(raw: unknown, index: number): InteractionRule {
  if (!isRecord(raw)) {
    throw new Error(`interaction_rules[${index}]: expected object`)
  }
  const id = validateString(raw.id, "id", `interaction_rules[${index}]`)
  const rawConditions = raw.conditions
  if (!Array.isArray(rawConditions)) {
    throw new Error(`Rule "${id}": "conditions" must be an array`)
  }
  const conditions = rawConditions.map((c: unknown, i: number) => validateCondition(c, i, id))
  const reportBlock = raw.report_block
  const target = raw.target
  const delta = raw.delta
  return {
    id,
    conditions,
    effect: validateString(raw.effect, "effect", `Rule "${id}"`),
    ...(reportBlock !== undefined ? { report_block: validateString(reportBlock as string, "report_block", `Rule "${id}"`) } : {}),
    ...(target !== undefined ? { target: validateString(target as string, "target", `Rule "${id}"`) } : {}),
    ...(delta !== undefined ? { delta: validateNumber(delta, "delta", `Rule "${id}"`) } : {}),
  }
}

function validateConfidenceModifier(raw: unknown, index: number): ConfidenceModifierGlobal {
  if (!isRecord(raw)) {
    throw new Error(`confidence_modifiers_global[${index}]: expected object`)
  }
  const delta = raw.delta
  const deltaPerUnit = raw.delta_per_unit
  return {
    id: validateString(raw.id, "id", `confidence_modifiers_global[${index}]`),
    condition: validateString(raw.condition, "condition", `confidence_modifiers_global[${index}]`),
    ...(delta !== undefined ? { delta: validateNumber(delta, "delta", `confidence_modifiers_global[${index}]`) } : {}),
    ...(deltaPerUnit !== undefined ? { delta_per_unit: validateNumber(deltaPerUnit, "delta_per_unit", `confidence_modifiers_global[${index}]`) } : {}),
  }
}

function validateSafetyGate(raw: unknown): SafetyGate {
  if (!isRecord(raw)) {
    throw new Error("safety_gate: expected object")
  }
  const supportingItems = raw.supporting_items
  if (!Array.isArray(supportingItems)) {
    throw new Error("safety_gate.supporting_items: must be an array")
  }
  return {
    trigger_item: validateString(raw.trigger_item, "trigger_item", "safety_gate"),
    trigger_value: validateNumber(raw.trigger_value, "trigger_value", "safety_gate"),
    supporting_items: supportingItems.map((v: unknown, i: number) => {
      if (typeof v !== "string") throw new Error(`safety_gate.supporting_items[${i}]: expected string`)
      return v
    }),
    supporting_threshold_contribution_score: validateNumber(
      raw.supporting_threshold_contribution_score,
      "supporting_threshold_contribution_score",
      "safety_gate",
    ),
    supporting_min_count: validateNumber(raw.supporting_min_count, "supporting_min_count", "safety_gate"),
  }
}

function loadRules(): RuleSet {
  if (!isRecord(raw)) {
    throw new Error("rules.json: root must be an object")
  }

  for (const field of REQUIRED_TOP_LEVEL) {
    if (raw[field] === undefined || raw[field] === null) {
      throw new Error(`rules.json: missing required top-level key "${field}"`)
    }
  }

  const rawRules = raw.interaction_rules
  if (!Array.isArray(rawRules)) {
    throw new Error('rules.json: "interaction_rules" must be an array')
  }

  const rawEvalOrder = raw.evaluation_order
  if (!Array.isArray(rawEvalOrder)) {
    throw new Error('rules.json: "evaluation_order" must be an array')
  }

  const rawConfMods = raw.confidence_modifiers_global
  if (!Array.isArray(rawConfMods)) {
    throw new Error('rules.json: "confidence_modifiers_global" must be an array')
  }

  const rawConsistencyPairs = raw.consistency_pairs
  if (!Array.isArray(rawConsistencyPairs)) {
    throw new Error('rules.json: "consistency_pairs" must be an array')
  }

  return {
    schema_version: validateString(raw.schema_version, "schema_version", "rules.json"),
    interaction_rules: rawRules.map((r: unknown, i: number) => validateInteractionRule(r, i)),
    evaluation_order: rawEvalOrder.map((v: unknown, i: number) => {
      if (typeof v !== "string") throw new Error(`rules.json: evaluation_order[${i}] must be a string`)
      return v
    }),
    confidence_modifiers_global: rawConfMods.map((m: unknown, i: number) => validateConfidenceModifier(m, i)),
    consistency_pairs: rawConsistencyPairs.map((pair: unknown, i: number) => {
      if (!Array.isArray(pair) || pair.length !== 2) {
        throw new Error(`rules.json: consistency_pairs[${i}] must be a 2-element array`)
      }
      if (typeof pair[0] !== "string" || typeof pair[1] !== "string") {
        throw new Error(`rules.json: consistency_pairs[${i}] elements must be strings`)
      }
      return [pair[0], pair[1]] as [string, string]
    }),
    safety_gate: validateSafetyGate(raw.safety_gate),
  }
}

export const RULES: RuleSet = loadRules()
