import type { Opportunity, CreateOpportunityData } from '../../features/opportunities/types/opportunity';
import type { ApiResponse } from '../types/api';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random failures (1 in 10 chance)
const shouldSimulateFailure = () => Math.random() < 0.1;

export const opportunityService = {
  async createOpportunity(data: CreateOpportunityData & { leadId: number }): Promise<ApiResponse<Opportunity>> {
    // Simulate API call delay (300-1000ms)
    const delayTime = Math.random() * 700 + 300;
    await delay(delayTime);
    
    // Simulate random failures
    if (shouldSimulateFailure()) {
      return {
        data: {
          id: Date.now(),
          ...data,
          createdAt: new Date(),
        },
        success: false,
        error: 'Failed to create opportunity. Please try again.',
      };
    }
    
    // Simulate successful creation
    return {
      data: {
        id: Date.now(),
        ...data,
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
    const delayTime = Math.random() * 800 + 200;
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
};
