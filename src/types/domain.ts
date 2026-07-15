export interface DomainBand {
  label: string
  min: number
  max: number
}

export type DomainId =
  | "SAR"
  | "ELCA"
  | "IHOR"
  | "AMB"
  | "ECPC"
  | "ERP"
  | "CSR"
  | "RST"

export interface Domain {
  id: DomainId
  name: string
  cluster: string
  weight: number
  min_score: number
  max_score: number
  bands: [DomainBand, DomainBand, DomainBand, DomainBand]
  band_boundary_rule: string
  psychological_construct: string
  medical_relevance: string
  safety_flags?: {
    has_safety_gate_item: boolean
    safety_gate_item_id: string
  }
  item_ids: string[]
}
