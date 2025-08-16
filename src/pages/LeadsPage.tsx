import React from 'react';
import { useLeads } from '../features/leads/hooks/useLeads';
import { useToast } from '../shared/hooks/useToast';
import { useSlideOver } from '../shared/hooks/useSlideOver';
import { LeadStats } from '../features/leads/components/LeadStats';
import { LeadFilters } from '../features/leads/components/LeadFilters';
import { LeadTable } from '../features/leads/components/LeadTable';
import { SlideOver } from '../components/ui/SlideOver';
import { LeadEditForm } from '../features/leads/components/LeadEditForm';
import { Toast } from '../components/ui/Toast';
import type { Lead } from '../features/leads/types/lead';

export const LeadsPage: React.FC = () => {
  const {
    leads,
    filters,
    stats,
    availableStatuses,
    updateFilters,
    resetFilters,
    updateLead,
  } = useLeads();

  const { toast, showToast, hideToast } = useToast();
  const { selectedLead, isOpen, openSlideOver, closeSlideOver } = useSlideOver();

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
        <LeadTable leads={leads} onLeadClick={handleLeadClick} />

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
