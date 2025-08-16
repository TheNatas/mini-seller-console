import React from 'react';
import { Lead } from '../../types/lead';
import { Badge } from '../ui/Badge';

interface LeadCardProps {
  lead: Lead;
  onClick?: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onClick }) => {
  const handleClick = () => {
    onClick?.(lead);
  };

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer
        ${onClick ? 'hover:border-blue-300' : ''}
      `}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{lead.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{lead.company}</p>
        </div>
        <Badge status={lead.status} />
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <span className="w-16 text-gray-500">Email:</span>
          <a 
            href={`mailto:${lead.email}`}
            className="text-blue-600 hover:text-blue-800 truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {lead.email}
          </a>
        </div>
        
        <div className="flex items-center">
          <span className="w-16 text-gray-500">Source:</span>
          <span>{lead.source}</span>
        </div>
        
        <div className="flex items-center">
          <span className="w-16 text-gray-500">Score:</span>
          <div className="flex items-center">
            <span className="font-medium text-gray-900 mr-2">{lead.score}</span>
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${lead.score}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
