export interface Opportunity {
  id: number;
  name: string;
  stage: OpportunityStage;
  amount?: number;
  accountName: string;
  leadId: number; // Reference to the original lead
  createdAt: Date;
}

export type OpportunityStage = 
  | 'Prospecting'
  | 'Qualification'
  | 'Proposal'
  | 'Negotiation'
  | 'Closed Won'
  | 'Closed Lost';

export interface OpportunityStats {
  total: number;
  byStage: Record<OpportunityStage, number>;
  totalValue: number;
}

export interface CreateOpportunityData {
  name: string;
  stage: OpportunityStage;
  amount?: number;
  accountName: string;
}
