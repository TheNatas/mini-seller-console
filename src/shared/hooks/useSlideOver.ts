import { useState } from 'react';
import type { Lead } from '../types/lead';

export const useSlideOver = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openSlideOver = (lead: Lead) => {
    setSelectedLead(lead);
    setIsOpen(true);
  };

  const closeSlideOver = () => {
    setIsOpen(false);
    setSelectedLead(null);
  };

  return {
    selectedLead,
    isOpen,
    openSlideOver,
    closeSlideOver,
  };
};
