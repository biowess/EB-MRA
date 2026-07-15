export interface TierThresholds {
  high_min: number
  moderate_min: number
  moderate_max: number
  low_max: number
}

export interface DomainTier {
  domain: string
  tier: string
}

export interface Profile {
  id: string
  priority_order: number
  name: string
  required_tiers: DomainTier[]
  excluded_if: DomainTier[]
  description: string
  detail_fields_source: string
  special_rule: string | null
}

export interface Fallback {
  no_match_profile: string
  requires_unknown_count_zero: boolean
}

export interface ProfileSet {
  tier_thresholds: TierThresholds
  profiles: Profile[]
  fallback: Fallback
}
