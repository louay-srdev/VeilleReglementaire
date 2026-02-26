// Shared interfaces for both backend and mobile
// Backend re-exports these from src/shared/types.ts

export type RegulatoryType = 'LOI' | 'DECRET';

export type ComplianceState = 'YES' | 'NO' | 'IN_PROGRESS';

export interface Ministry {
  id: number;
  name: string;
  logoUrl: string;
}

export interface RegulatoryText {
  id: number;
  title: string;
  type: RegulatoryType;
  publicationDate: string;
  pdfUrl: string;
  ministryId: number;
}

export interface Requirement {
  id: number;
  summary: string;
  applicableRequirements: string;
  regulatoryTextId: number;
}

export interface ComplianceStatus {
  id: number;
  status: ComplianceState;
  clientId: number;
  requirementId: number;
}

export interface ActionPlan {
  id: number;
  actionDescription: string;
  pilot: string;
  plannedDeadline: string;
  realDeadline?: string | null;
  effectivenessMeasure?: string | null;
  clientId: number;
  requirementId: number;
}

export interface LoginResponse {
  access_token: string;
  client: {
    id: number;
    name: string;
    email: string;
  };
}

