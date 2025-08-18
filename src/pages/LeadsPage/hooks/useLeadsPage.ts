import { useState } from 'react';
import { useLeads } from '../../../features/leads/hooks/useLeads';
import { useOpportunities } from '../../../features/opportunities/hooks/useOpportunities';
import { useOpportunityEdit } from '../../../features/opportunities/hooks/useOpportunityEdit';
import { useToast } from '../../../shared/hooks/useToast';
import { useSlideOver } from '../../../shared/hooks/useSlideOver';
import type { Lead } from '../../../features/leads/types/lead';
import type { CreateOpportunityData, Opportunity } from '../../../features/opportunities/types/opportunity';

export const useLeadsPage = () => {
  const {
    leads,
    filters,
    stats,
    availableStatuses,
    updateFilters,
    resetFilters,
    updateLead,
    removeLead,
    restoreLead,
  } = useLeads();

  const { opportunities, createOpportunity, updateOpportunity } = useOpportunities();

  const {
    isEditing: isEditingOpportunity,
    editingOpportunity,
    isLoading: isOpportunityLoading,
    startEdit: startEditOpportunity,
    cancelEdit: cancelEditOpportunity,
    updateOpportunity: submitOpportunityUpdate,
  } = useOpportunityEdit(updateOpportunity);

  const { toast, showToast, hideToast } = useToast();
  const { selectedLead, isOpen, openSlideOver, closeSlideOver } = useSlideOver();
  
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);

  // Lead editing handlers
  const handleLeadClick = (lead: Lead) => {
    openSlideOver(lead);
  };

  const handleSaveLead = (updatedLead: Lead) => {
    // Close immediately since we're doing optimistic updates
    closeSlideOver();
    
    updateLead(
      updatedLead,
      // Success callback
      () => {
        showToast('Lead updated successfully!', 'success');
      },
      // Error callback
      (error: string) => {
        showToast(error, 'error');
      }
    );
  };

  const handleCancelEdit = () => {
    closeSlideOver();
  };

  // Lead conversion handlers
  const handleConvertLead = (lead: Lead) => {
    setLeadToConvert(lead);
    setIsConvertModalOpen(true);
  };

  const handleConvertSubmit = (data: CreateOpportunityData) => {
    if (!leadToConvert) return;

    // Optimistically remove the lead immediately
    removeLead(leadToConvert.id);
    setIsConvertModalOpen(false);
    
    // Store lead data in case we need to restore it
    const leadToRestore = leadToConvert;
    setLeadToConvert(null);

    createOpportunity(
      { ...data, leadId: leadToRestore.id },
      // Success callback
      () => {
        showToast('Lead converted to opportunity successfully!', 'success');
      },
      // Error callback - restore the lead
      (error: string) => {
        // Restore the lead if opportunity creation failed
        restoreLead(leadToRestore);
        showToast(error, 'error');
      }
    );
  };

  const handleConvertCancel = () => {
    setIsConvertModalOpen(false);
    setLeadToConvert(null);
  };

  // Opportunity editing handlers
  const handleOpportunityClick = (opportunity: Opportunity) => {
    startEditOpportunity(opportunity);
  };

  const handleOpportunityUpdate = async (updatedOpportunity: Opportunity) => {
    const result = await submitOpportunityUpdate(updatedOpportunity);
    
    if (result.success) {
      showToast('Opportunity updated successfully!', 'success');
    } else {
      showToast(result.error || 'Failed to update opportunity', 'error');
    }
  };

  const handleOpportunityEditCancel = () => {
    cancelEditOpportunity();
  };

  return {
    // Data
    leads,
    opportunities,
    filters,
    stats,
    availableStatuses,
    toast,
    
    // Lead editing state
    selectedLead,
    isOpen,
    
    // Convert modal state
    isConvertModalOpen,
    leadToConvert,
    
    // Opportunity editing state
    isEditingOpportunity,
    editingOpportunity,
    isOpportunityLoading,
    
    // Filter handlers
    updateFilters,
    resetFilters,
    
    // Lead editing handlers
    handleLeadClick,
    handleSaveLead,
    handleCancelEdit,
    closeSlideOver,
    
    // Conversion handlers
    handleConvertLead,
    handleConvertSubmit,
    handleConvertCancel,
    
    // Opportunity editing handlers
    handleOpportunityClick,
    handleOpportunityUpdate,
    handleOpportunityEditCancel,
    
    // Toast handlers
    hideToast,
  };
};
