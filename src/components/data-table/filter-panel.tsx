"use client";

import { MultiSelectFilter } from "@/components/data-table/multi-select-filter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

interface FilterConfig {
  key: string;
  title: string;
  options: { label: string; value: string }[];
}

interface FilterPanelProps {
  filters: FilterConfig[];
  onApplyFilters: (filters: Record<string, string[]>) => void;
  onResetFilters: () => void;
}

export function FilterPanel({
  filters,
  onApplyFilters,
  onResetFilters,
}: FilterPanelProps) {
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >(filters.reduce((acc, filter) => ({ ...acc, [filter.key]: [] }), {}));

  const handleFilterChange = (key: string, selected: string[]) => {
    setSelectedFilters((prev) => ({ ...prev, [key]: selected }));
  };

  const handleApply = () => {
    onApplyFilters(selectedFilters);
  };

  const handleReset = () => {
    const resetFilters = filters.reduce(
      (acc, filter) => ({ ...acc, [filter.key]: [] }),
      {},
    );
    setSelectedFilters(resetFilters);
    onResetFilters();
  };

  const hasActiveFilters = Object.values(selectedFilters).some(
    (filterValues) => filterValues.length > 0,
  );

  return (
    <Card className="m-0 w-full max-w-md border-none p-0 shadow-none">
      <CardHeader className="p-0">
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-0">
        {filters.map((filter) => (
          <MultiSelectFilter
            key={filter.key}
            title={filter.title}
            options={filter.options}
            selected={selectedFilters[filter.key] ?? []}
            onChange={(selected) => handleFilterChange(filter.key, selected)}
          />
        ))}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" onClick={handleReset} className="flex-1">
          Reset
        </Button>
        <Button
          onClick={handleApply}
          className="flex-1"
          disabled={!hasActiveFilters}
        >
          Apply filters
        </Button>
      </CardFooter>
    </Card>
  );
}
