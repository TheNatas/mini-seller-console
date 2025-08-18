import { useState, useMemo } from 'react';
import type { Opportunity, OpportunityStats, CreateOpportunityData } from '../types/opportunity';
import { opportunityService } from '../../../services/api/opportunityService';

export const useOpportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  // Calculate statistics
  const stats = useMemo((): OpportunityStats => {
    const total = opportunities.length;
    const byStage = opportunities.reduce(
      (acc, opp) => {
        acc[opp.stage]++;
        return acc;
      },
      {
        'Prospecting': 0,
        'Qualification': 0,
        'Proposal': 0,
        'Negotiation': 0,
        'Closed Won': 0,
        'Closed Lost': 0,
      }
    );
    const totalValue = opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0);

    return {
      total,
      byStage,
      totalValue,
    };
  }, [opportunities]);

  // Create opportunity with optimistic updates
  const createOpportunity = (data: CreateOpportunityData & { leadId: number }, onSuccess?: () => void, onError?: (error: string) => void) => {
    const newOpportunity: Opportunity = {
      id: Date.now(), // Temporary ID
      ...data,
      createdAt: new Date(),
    };

    // Optimistic update
    setOpportunities(prev => [newOpportunity, ...prev]);

    // Fire and forget - API call happens in background
    opportunityService.createOpportunity(data).then(response => {
      if (!response.success) {
        // Rollback on failure
        setOpportunities(prev => prev.filter(opp => opp.id !== newOpportunity.id));
        onError?.(response.error || 'Failed to create opportunity');
      } else {
        // Update with real ID from server
        setOpportunities(prev => 
          prev.map(opp => opp.id === newOpportunity.id ? response.data : opp)
        );
        onSuccess?.();
      }
    }).catch(error => {
      // Rollback on error
      setOpportunities(prev => prev.filter(opp => opp.id !== newOpportunity.id));
      console.error('Opportunity creation error:', error);
      onError?.('Network error occurred');
    });
  };

  return {
    opportunities,
    stats,
    createOpportunity,
  };
};
