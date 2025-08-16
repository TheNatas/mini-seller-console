export interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: LeadStatus;
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';

export interface LeadFilters {
  search: string;
  status: LeadStatus | 'All';
  sortBy: 'score' | 'name' | 'company';
  sortOrder: 'asc' | 'desc';
}

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  averageScore: number;
}
