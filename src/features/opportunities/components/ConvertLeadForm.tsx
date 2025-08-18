import React, { useState } from 'react';
import type { Lead } from '../../leads/types/lead';
import type { CreateOpportunityData, OpportunityStage } from '../types/opportunity';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';

interface ConvertLeadFormProps {
  lead: Lead;
  onSubmit: (data: CreateOpportunityData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const OPPORTUNITY_STAGES: OpportunityStage[] = [
  'Prospecting',
  'Qualification',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost',
];

export const ConvertLeadForm: React.FC<ConvertLeadFormProps> = ({
  lead,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateOpportunityData>({
    name: `${lead.name} - ${lead.company} Opportunity`,
    stage: 'Prospecting',
    amount: undefined,
    accountName: lead.company,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [amountDisplay, setAmountDisplay] = useState<string>('');

  // Format number as currency for display
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Parse currency string to number
  const parseCurrency = (value: string): number | undefined => {
    const cleaned = value.replace(/[$,\s]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? undefined : parsed;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Opportunity name is required';
    }

    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }

    if (formData.amount !== undefined && formData.amount < 0) {
      newErrors.amount = 'Amount must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof CreateOpportunityData, value: string | number | undefined) => {
    if (field === 'amount' && typeof value === 'string') {
      // Handle amount field specially for currency formatting
      const numericValue = parseCurrency(value);
      setFormData(prev => ({ ...prev, [field]: numericValue }));
      setAmountDisplay(value);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseCurrency(inputValue);
    
    setFormData(prev => ({ ...prev, amount: numericValue }));
    setAmountDisplay(inputValue);
    
    // Clear error when user starts typing
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const handleAmountBlur = () => {
    if (formData.amount !== undefined) {
      setAmountDisplay(formatCurrency(formData.amount));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Converting Lead:</h4>
        <p className="text-sm text-gray-600">
          <span className="font-medium">{lead.name}</span> from <span className="font-medium">{lead.company}</span>
        </p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Opportunity Name *
        </label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          placeholder="Enter opportunity name"
        />
      </div>

      <div>
        <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
          Stage *
        </label>
        <Select
          id="stage"
          value={formData.stage}
          onChange={(value) => handleInputChange('stage', value as OpportunityStage)}
          options={OPPORTUNITY_STAGES.map(stage => ({ value: stage, label: stage }))}
        />
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount (Optional)
        </label>
        <Input
          id="amount"
          type="text"
          value={amountDisplay || (formData.amount ? formatCurrency(formData.amount) : '')}
          onChange={handleAmountChange}
          onBlur={handleAmountBlur}
          error={errors.amount}
          placeholder="$0.00"
        />
      </div>

      <div>
        <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">
          Account Name *
        </label>
        <Input
          id="accountName"
          type="text"
          value={formData.accountName}
          onChange={(e) => handleInputChange('accountName', e.target.value)}
          error={errors.accountName}
          placeholder="Enter account name"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Opportunity'}
        </Button>
      </div>
    </form>
  );
};
