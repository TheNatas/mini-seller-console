import React from 'react';
import type { LeadStats as LeadStatsType } from "../types/lead";

interface LeadStatsProps {
  stats: LeadStatsType;
}

export const LeadStats: React.FC<LeadStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Leads',
      value: stats.total,
      color: 'bg-blue-500',
      icon: '👥',
    },
    {
      title: 'New',
      value: stats.byStatus.New,
      color: 'bg-blue-500',
      icon: '🆕',
    },
    {
      title: 'Contacted',
      value: stats.byStatus.Contacted,
      color: 'bg-yellow-500',
      icon: '📞',
    },
    {
      title: 'Qualified',
      value: stats.byStatus.Qualified,
      color: 'bg-green-500',
      icon: '✅',
    },
    {
      title: 'Lost',
      value: stats.byStatus.Lost,
      color: 'bg-red-500',
      icon: '❌',
    },
    {
      title: 'Avg Score',
      value: stats.averageScore,
      color: 'bg-purple-500',
      icon: '📊',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statCards.map((card) => (
        <div key={card.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className={`${card.color} text-white rounded-lg p-2 mr-3`}>
              <span className="text-lg">{card.icon}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
