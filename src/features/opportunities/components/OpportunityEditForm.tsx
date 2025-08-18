import React, { useState, useEffect } from 'react';
import type { Opportunity, OpportunityStage } from '../types/opportunity';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';

interface OpportunityEditFormProps {
  opportunity: Opportunity;
  onSubmit: (data: Opportunity) => void;
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

export const OpportunityEditForm: React.FC<OpportunityEditFormProps> = ({
  opportunity,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Opportunity>({ ...opportunity });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [amountDisplay, setAmountDisplay] = useState<string>('');

  // Initialize amount display when component mounts or opportunity changes
  useEffect(() => {
    if (opportunity.amount) {
      setAmountDisplay(formatCurrency(opportunity.amount));
    } else {
      setAmountDisplay('');
    }
    setFormData({ ...opportunity });
  }, [opportunity]);

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
    if (!value || value.trim() === '') return undefined;
    
    // Remove currency symbol, commas, and spaces
    const cleanValue = value.replace(/[$,\s]/g, '');
    const num = parseFloat(cleanValue);
    
    return isNaN(num) ? undefined : num;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmountDisplay(value);
    
    // Parse the amount and update form data
    const parsedAmount = parseCurrency(value);
    setFormData(prev => ({
      ...prev,
      amount: parsedAmount,
    }));
    
    // Clear amount error if it was set
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const handleAmountBlur = () => {
    // Format the display value when user leaves the field
    if (formData.amount) {
      setAmountDisplay(formatCurrency(formData.amount));
    }
  };

  const handleInputChange = (field: keyof Opportunity, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSelectChange = (field: keyof Opportunity, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Opportunity name is required';
    }

    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }

    if (formData.amount !== undefined && formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Edit Opportunity
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Opportunity Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e)}
            error={errors.name}
            placeholder="Enter opportunity name"
            required
          />
        </div>

        <div>
          <Input
            label="Account Name"
            value={formData.accountName}
            onChange={(e) => handleInputChange('accountName', e)}
            error={errors.accountName}
            placeholder="Enter account name"
            required
          />
        </div>

        <div>
          <Select
            label="Stage"
            value={formData.stage}
            onChange={(value) => handleSelectChange('stage', value)}
            options={OPPORTUNITY_STAGES.map(stage => ({
              value: stage,
              label: stage,
            }))}
            required
          />
        </div>

        <div>
          <Input
            label="Amount"
            value={amountDisplay}
            onChange={handleAmountChange}
            onBlur={handleAmountBlur}
            error={errors.amount}
            placeholder="$0.00"
            type="text"
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter amount in USD (e.g., $10,000 or 10000)
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Updating...' : 'Update Opportunity'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
