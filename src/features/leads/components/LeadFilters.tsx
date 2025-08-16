import React from 'react';
import type { LeadFilters as LeadFiltersType, LeadStatus } from "../types/lead";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Button } from "../../../components/ui/Button";

interface LeadFiltersProps {
  filters: LeadFiltersType;
  availableStatuses: LeadStatus[];
  onFiltersChange: (filters: Partial<LeadFiltersType>) => void;
  onReset: () => void;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  filters,
  availableStatuses,
  onFiltersChange,
  onReset,
}) => {
  const sortOptions = [
    { value: 'score', label: 'Score' },
    { value: 'name', label: 'Name' },
    { value: 'company', label: 'Company' },
  ];

  const statusOptions = [
    { value: 'All', label: 'All Statuses' },
    ...availableStatuses.map(status => ({ value: status, label: status })),
  ];

  const orderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          label="Search"
          placeholder="Search by name or company..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
        />

        <Select
          label="Status"
          options={statusOptions}
          value={filters.status}
          onChange={(value) => onFiltersChange({ status: value as LeadStatus | 'All' })}
        />

        <Select
          label="Sort By"
          options={sortOptions}
          value={filters.sortBy}
          onChange={(value) => onFiltersChange({ sortBy: value as 'score' | 'name' | 'company' })}
        />

        <Select
          label="Order"
          options={orderOptions}
          value={filters.sortOrder}
          onChange={(value) => onFiltersChange({ sortOrder: value as 'asc' | 'desc' })}
        />
      </div>
    </div>
  );
};
