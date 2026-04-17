"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuickFiltersProps {
  nameSearch: string;
  languageSearch: string;
  regionFilter: string;
  sortOrder: string;
  regionOptions: string[];
  onNameSearchChange: (value: string) => void;
  onLanguageSearchChange: (value: string) => void;
  onRegionFilterChange: (value: string) => void;
  onSortOrderChange: (value: string) => void;
}

export function QuickFilters({
  nameSearch,
  languageSearch,
  regionFilter,
  sortOrder,
  regionOptions,
  onNameSearchChange,
  onLanguageSearchChange,
  onRegionFilterChange,
  onSortOrderChange,
}: QuickFiltersProps) {
  return (
    <Card className="geo-panel border-0 shadow-none rounded-2xl">
      <CardHeader className="pb-2 pt-6 px-7">
        <CardTitle className="geo-card-title" style={{ fontSize: "1.1rem" }}>
          Quick Filters
        </CardTitle>
        <CardDescription style={{ fontSize: "0.8rem", color: "var(--geo-muted)" }}>
          Filter and sort the displayed countries.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-7 pb-7">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="space-y-2">
            <label className="geo-label">Country Name</label>
            <Input
              value={nameSearch}
              onChange={(event) => onNameSearchChange(event.target.value)}
              placeholder="Type a country name"
              className="geo-input"
            />
          </div>

          <div className="space-y-2">
            <label className="geo-label">Language</label>
            <Input
              value={languageSearch}
              onChange={(event) => onLanguageSearchChange(event.target.value)}
              placeholder="e.g. Spanish"
              className="geo-input"
            />
          </div>

          <div className="space-y-2">
            <label className="geo-label">Region</label>
            <Select value={regionFilter} onValueChange={onRegionFilterChange}>
              <SelectTrigger className="geo-input">
                <SelectValue placeholder="Choose region" />
              </SelectTrigger>
              <SelectContent>
                {regionOptions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region === "all" ? "All Regions" : region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="geo-label">Population Sort</label>
            <Select value={sortOrder} onValueChange={onSortOrderChange}>
              <SelectTrigger className="geo-input">
                <SelectValue placeholder="Choose sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Sorting</SelectItem>
                <SelectItem value="population-desc">High to Low</SelectItem>
                <SelectItem value="population-asc">Low to High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}