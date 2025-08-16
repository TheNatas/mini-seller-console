import type { Lead } from '../../features/leads/types/lead';
import type { ApiResponse } from '../types/api';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random failures (1 in 10 chance)
const shouldSimulateFailure = () => Math.random() < 0.1;

export const leadService = {
  async updateLead(lead: Lead): Promise<ApiResponse<Lead>> {
    // Simulate API call delay (500-2000ms)
    const delayTime = Math.random() * 1500 + 500;
    await delay(delayTime);
    
    // Simulate random failures
    if (shouldSimulateFailure()) {
      return {
        data: lead,
        success: false,
        error: 'Failed to update lead. Please try again.',
      };
    }
    
    // Simulate successful update
    return {
      data: lead,
      success: true,
    };
  },

  async deleteLead(leadId: number): Promise<ApiResponse<number>> {
    const delayTime = Math.random() * 1000 + 300;
    await delay(delayTime);
    
    if (shouldSimulateFailure()) {
      return {
        data: leadId,
        success: false,
        error: 'Failed to delete lead. Please try again.',
      };
    }
    
    return {
      data: leadId,
      success: true,
    };
  },

  async createLead(lead: Omit<Lead, 'id'>): Promise<ApiResponse<Lead>> {
    const delayTime = Math.random() * 1000 + 500;
    await delay(delayTime);
    
    if (shouldSimulateFailure()) {
      return {
        data: { ...lead, id: Date.now() },
        success: false,
        error: 'Failed to create lead. Please try again.',
      };
    }
    
    return {
      data: { ...lead, id: Date.now() },
      success: true,
    };
  },
};
