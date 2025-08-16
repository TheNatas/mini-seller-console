import React from 'react';
import type { Lead, LeadStatus } from "../types/lead";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { useLeadEdit } from "../hooks/useLeadEdit";

interface LeadEditFormProps {
  lead: Lead;
  onSave: (updatedLead: Lead) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const LeadEditForm: React.FC<LeadEditFormProps> = ({ 
  lead, 
  onSave, 
  onCancel, 
  isLoading = false 
}) => {
  const {
    formData,
    errors,
    isDirty,
    hasErrors,
    statusOptions,
    handleInputChange,
    handleSave,
    handleCancel,
  } = useLeadEdit({ lead, onSave, onCancel });

  return (
    <div className="space-y-6">
      {/* Lead Info Display */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Lead Information</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="text-sm text-gray-900">{lead.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company</label>
            <p className="text-sm text-gray-900">{lead.company}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Source</label>
            <p className="text-sm text-gray-900">{lead.source}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Score</label>
            <div className="flex items-center mt-1">
              <span className="text-sm font-medium text-gray-900 mr-2">{lead.score}</span>
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${lead.score}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editable Fields */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Edit Lead</h3>
        
        <Input
          label="Email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          placeholder="Enter email address"
        />

        <Select
          label="Status"
          options={statusOptions}
          value={formData.status || ''}
          onChange={(value) => handleInputChange('status', value as LeadStatus)}
          error={errors.status}
        />

        {/* Current Status Preview */}
        {formData.status && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
            <Badge status={formData.status as LeadStatus} />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isLoading || !isDirty}
          className="flex-1"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>

      {/* Error Summary */}
      {hasErrors && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
          <ul className="text-sm text-red-700 space-y-1">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
