import { useState, useEffect } from 'react';
import type { Lead, LeadStatus } from '../types/lead';

interface UseLeadEditProps {
  lead: Lead;
  onSave: (updatedLead: Lead) => void;
  onCancel: () => void;
}

export const useLeadEdit = ({ lead, onSave, onCancel }: UseLeadEditProps) => {
  const [formData, setFormData] = useState<Partial<Lead>>({
    email: lead.email,
    status: lead.status,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFormData({
      email: lead.email,
      status: lead.status,
    });
    setErrors({});
    setIsDirty(false);
  }, [lead]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof Lead, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const updatedLead: Lead = {
      ...lead,
      email: formData.email!,
      status: formData.status!,
    };

    onSave(updatedLead);
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const statusOptions = [
    { value: 'New', label: 'New' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Lost', label: 'Lost' },
  ];

  const hasErrors = Object.values(errors).filter(Boolean).length > 0;

  return {
    formData,
    errors,
    isDirty,
    hasErrors,
    statusOptions,
    handleInputChange,
    handleSave,
    handleCancel,
  };
};
