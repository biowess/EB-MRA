import type { DomainId } from "./domain.ts"

export type { DomainId }

export interface ProfileAssignmentResult {
  assigned_profile: string | null;
  fitScore: number;
  profileFitConfidence: string | null;
}
