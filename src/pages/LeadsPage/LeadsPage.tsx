import React from 'react';
import { useLeadsPage } from './hooks';
import { LeadStats } from '../../features/leads/components/LeadStats';
import { LeadFilters } from '../../features/leads/components/LeadFilters';
import { LeadTable } from '../../features/leads/components/LeadTable';
import { OpportunityTable } from '../../features/opportunities/components/OpportunityTable';
import { ConvertLeadForm } from '../../features/opportunities/components/ConvertLeadForm';
import { SlideOver } from '../../components/ui/SlideOver';
import { Modal } from '../../components/ui/Modal';
import { LeadEditForm } from '../../features/leads/components/LeadEditForm';
import { Toast } from '../../components/ui/Toast';

export const LeadsPage: React.FC = () => {
  const {
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
    
    // Toast handlers
    hideToast,
  } = useLeadsPage();

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
