import { useState, useEffect } from "react";
import { Search, Calendar, Filter, User, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface LogFeedFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  authorFilter: string;
  onAuthorFilterChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  projectId: string;
}

export function LogFeedFilters({
  searchValue,
  onSearchChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  authorFilter,
  onAuthorFilterChange,
  typeFilter,
  onTypeFilterChange,
}: LogFeedFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      // Search is handled by parent component
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const clearFilters = () => {
    onSearchChange("");
    onAuthorFilterChange("");
    onTypeFilterChange("");
    const today = new Date().toISOString().split('T')[0];
    onDateFromChange(today);
    onDateToChange(today);
  };

  const hasActiveFilters = searchValue || authorFilter || typeFilter || 
    dateFrom !== new Date().toISOString().split('T')[0] || 
    dateTo !== new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      {/* Primary filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs, todos, content..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Advanced filters toggle */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="shrink-0">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 h-2 w-2 bg-primary rounded-full" />
              )}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </div>

      {/* Advanced filters */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
            {/* Date range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                From Date
              </label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => onDateFromChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                To Date
              </label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => onDateToChange(e.target.value)}
              />
            </div>

            {/* Author filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Author
              </label>
              <Select value={authorFilter} onValueChange={onAuthorFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All authors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All authors</SelectItem>
                  {/* TODO: Load actual project members */}
                  <SelectItem value="current">Me</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Type
              </label>
              <Select value={typeFilter} onValueChange={onTypeFilterChange}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="note">Notes</SelectItem>
                  <SelectItem value="execution_report">Execution Reports</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}