import React, { useState } from 'react';
import { useLeads } from '../features/leads/hooks/useLeads';
import { useOpportunities } from '../features/opportunities/hooks/useOpportunities';
import { useToast } from '../shared/hooks/useToast';
import { useSlideOver } from '../shared/hooks/useSlideOver';
import { LeadStats } from '../features/leads/components/LeadStats';
import { LeadFilters } from '../features/leads/components/LeadFilters';
import { LeadTable } from '../features/leads/components/LeadTable';
import { OpportunityTable } from '../features/opportunities/components/OpportunityTable';
import { ConvertLeadForm } from '../features/opportunities/components/ConvertLeadForm';
import { SlideOver } from '../components/ui/SlideOver';
import { Modal } from '../components/ui/Modal';
import { LeadEditForm } from '../features/leads/components/LeadEditForm';
import { Toast } from '../components/ui/Toast';
import type { Lead } from '../features/leads/types/lead';
import type { CreateOpportunityData } from '../features/opportunities/types/opportunity';

export const LeadsPage: React.FC = () => {
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

  const { opportunities, createOpportunity } = useOpportunities();

  const { toast, showToast, hideToast } = useToast();
  const { selectedLead, isOpen, openSlideOver, closeSlideOver } = useSlideOver();
  
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leads Management</h1>
          <p className="text-gray-600">
            Manage and track your leads with advanced filtering and sorting capabilities.
          </p>
        </div>

        {/* Opportunities Table */}
        <div className="mb-8">
          <OpportunityTable opportunities={opportunities} />
        </div>

        {/* Statistics */}
        <LeadStats stats={stats} />

        {/* Filters */}
        <LeadFilters
          filters={filters}
          availableStatuses={availableStatuses}
          onFiltersChange={updateFilters}
          onReset={resetFilters}
        />

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            Showing {leads.length} of {stats.total} leads
          </div>
          {filters.search && (
            <div className="text-sm text-gray-600">
              Search results for: <span className="font-medium">"{filters.search}"</span>
            </div>
          )}
        </div>

        {/* Leads Table */}
        <LeadTable 
          leads={leads} 
          onLeadClick={handleLeadClick} 
          onConvertLead={handleConvertLead}
        />

        {/* Slide-over for editing */}
        <SlideOver
          isOpen={isOpen}
          onClose={closeSlideOver}
          title={selectedLead ? `Edit Lead - ${selectedLead.name}` : 'Edit Lead'}
        >
          {selectedLead && (
            <LeadEditForm
              lead={selectedLead}
              onSave={handleSaveLead}
              onCancel={handleCancelEdit}
            />
          )}
        </SlideOver>

        {/* Convert Lead Modal */}
        <Modal
          isOpen={isConvertModalOpen}
          onClose={handleConvertCancel}
          title="Convert Lead to Opportunity"
        >
          {leadToConvert && (
            <ConvertLeadForm
              lead={leadToConvert}
              onSubmit={handleConvertSubmit}
              onCancel={handleConvertCancel}
            />
          )}
        </Modal>

        {/* Toast notifications */}
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={hideToast}
        />
      </div>
    </div>
  );
};
