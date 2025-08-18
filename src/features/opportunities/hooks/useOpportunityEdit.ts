import { useState } from 'react';
import type { Opportunity } from '../types/opportunity';
import { opportunityService } from '../services';

interface UseOpportunityEditReturn {
  isEditing: boolean;
  editingOpportunity: Opportunity | null;
  isLoading: boolean;
  startEdit: (opportunity: Opportunity) => void;
  cancelEdit: () => void;
  updateOpportunity: (updatedOpportunity: Opportunity) => Promise<{ success: boolean; error?: string }>;
}

export const useOpportunityEdit = (
  onOpportunityUpdated: (opportunity: Opportunity) => void
): UseOpportunityEditReturn => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startEdit = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingOpportunity(null);
  };

  const updateOpportunity = async (updatedOpportunity: Opportunity): Promise<{ success: boolean; error?: string }> => {
    if (!editingOpportunity) {
      return { success: false, error: 'No opportunity selected for editing' };
    }

    setIsLoading(true);

    try {
      // Optimistically update the opportunity
      onOpportunityUpdated(updatedOpportunity);
      setIsEditing(false);
      setEditingOpportunity(null);

      // Call the service
      const result = await opportunityService.updateOpportunity(updatedOpportunity);

      if (result.success) {
        // Service call succeeded, keep the optimistic update
        return { success: true };
      } else {
        // Service call failed, rollback the optimistic update
        onOpportunityUpdated(editingOpportunity);
        setIsEditing(true);
        setEditingOpportunity(editingOpportunity);
        return { success: false, error: result.error || 'Failed to update opportunity' };
      }
    } catch (error) {
      // Rollback optimistic update on unexpected error
      onOpportunityUpdated(editingOpportunity);
      setIsEditing(true);
      setEditingOpportunity(editingOpportunity);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update opportunity' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isEditing,
    editingOpportunity,
    isLoading,
    startEdit,
    cancelEdit,
    updateOpportunity,
  };
};
