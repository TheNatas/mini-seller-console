import { useState, useMemo, useEffect } from 'react';
import type { Lead, LeadFilters, LeadStats, LeadStatus } from '../types/lead';
import { leadService } from '../../../services';
import leadsData from "../../../../leads.json";

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filters, setFilters] = useState<LeadFilters>({
    search: '',
    status: 'All',
    sortBy: 'score',
    sortOrder: 'desc',
  });

  // Load leads data on mount
  useEffect(() => {
    setLeads(leadsData as Lead[]);
  }, []);

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    let filtered = [...leads];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.company.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status !== 'All') {
      filtered = filtered.filter((lead) => lead.status === filters.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (filters.sortBy) {
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'company':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        default:
          aValue = a.score;
          bValue = b.score;
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [leads, filters]);

  // Calculate statistics
  const stats = useMemo((): LeadStats => {
    const total = leads.length;
    const byStatus = leads.reduce(
      (acc, lead) => {
        acc[lead.status]++;
        return acc;
      },
      { New: 0, Contacted: 0, Qualified: 0, Lost: 0 } as Record<LeadStatus, number>
    );
    const averageScore = total > 0 ? leads.reduce((sum, lead) => sum + lead.score, 0) / total : 0;

    return {
      total,
      byStatus,
      averageScore: Math.round(averageScore),
    };
  }, [leads]);

  // Get unique statuses for filter options
  const availableStatuses = useMemo(() => {
    const statuses = new Set<LeadStatus>();
    leads.forEach((lead) => statuses.add(lead.status));
    return Array.from(statuses).sort();
  }, [leads]);

  const updateFilters = (newFilters: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      sortBy: 'score',
      sortOrder: 'desc',
    });
  };

  // Optimistic update with rollback
  const updateLead = (updatedLead: Lead, onSuccess?: () => void, onError?: (error: string) => void) => {
    const originalLead = leads.find(lead => lead.id === updatedLead.id);
    
    if (!originalLead) {
      onError?.('Lead not found');
      return;
    }

    // Optimistic update - happens immediately
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead.id === updatedLead.id ? updatedLead : lead
      )
    );

    // Fire and forget - API call happens in background
    leadService.updateLead(updatedLead).then(response => {
      if (!response.success) {
        // Rollback on failure
        setLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead.id === updatedLead.id ? originalLead : lead
          )
        );
        onError?.(response.error || 'Failed to update lead');
      } else {
        onSuccess?.();
      }
    }).catch(error => {
      // Rollback on error
      setLeads((prevLeads) =>
        prevLeads.map((lead) =>
          lead.id === updatedLead.id ? originalLead : lead
        )
      );
      console.error('Lead update error:', error);
      onError?.('Network error occurred');
    });
  };

  // Remove lead when converted to opportunity
  const removeLead = (leadId: number) => {
    setLeads((prevLeads) => prevLeads.filter(lead => lead.id !== leadId));
  };

  // Restore lead if conversion fails
  const restoreLead = (lead: Lead) => {
    setLeads((prevLeads) => [...prevLeads, lead]);
  };

  return {
    leads: filteredLeads,
    allLeads: leads,
    filters,
    stats,
    availableStatuses,
    updateFilters,
    resetFilters,
    updateLead,
    removeLead,
    restoreLead,
  };
};
