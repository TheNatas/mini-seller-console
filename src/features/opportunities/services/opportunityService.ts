import type { Opportunity } from '../types/opportunity';
import type { ApiResponse } from '../../../services/types/api';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random failures (1 in 10 chance)
const shouldSimulateFailure = () => Math.random() < 0.1;

export const opportunityService = {
  async createOpportunity(opportunity: Omit<Opportunity, 'id' | 'createdAt'>): Promise<ApiResponse<Opportunity>> {
    // Simulate API call delay (500-2000ms)
    const delayTime = Math.random() * 1500 + 500;
    await delay(delayTime);
    
    // Simulate random failures
    if (shouldSimulateFailure()) {
      return {
        data: {
          ...opportunity,
          id: Date.now(),
          createdAt: new Date(),
        },
        success: false,
        error: 'Failed to create opportunity. Please try again.',
      };
    }
    
    // Simulate successful creation
    return {
      data: {
        ...opportunity,
        id: Date.now(),
        createdAt: new Date(),
      },
      success: true,
    };
  },

  async updateOpportunity(opportunity: Opportunity): Promise<ApiResponse<Opportunity>> {
    const delayTime = Math.random() * 1000 + 500;
    await delay(delayTime);
    
    if (shouldSimulateFailure()) {
      return {
        data: opportunity,
        success: false,
        error: 'Failed to update opportunity. Please try again.',
      };
    }
    
    return {
      data: opportunity,
      success: true,
    };
  },

  async deleteOpportunity(opportunityId: number): Promise<ApiResponse<number>> {
    const delayTime = Math.random() * 800 + 300;
    await delay(delayTime);
    
    if (shouldSimulateFailure()) {
      return {
        data: opportunityId,
        success: false,
        error: 'Failed to delete opportunity. Please try again.',
      };
    }
    
    return {
      data: opportunityId,
      success: true,
    };
  },

  async getById(_opportunityId: number): Promise<ApiResponse<Opportunity | null>> {
    const delayTime = Math.random() * 500 + 200;
    await delay(delayTime);
    
    if (shouldSimulateFailure()) {
      return {
        data: null,
        success: false,
        error: 'Failed to fetch opportunity. Please try again.',
      };
    }
    
    // This would normally fetch from an API
    // For now, we'll return null since we don't have a data store
    return {
      data: null,
      success: true,
    };
  },
};
