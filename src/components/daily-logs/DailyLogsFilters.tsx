import { useState } from "react";
import { Search, Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

interface DailyLogsFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
}

export function DailyLogsFilters({
  searchValue,
  onSearchChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: DailyLogsFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-4">
      {/* Main search bar */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes and todos..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-from">From Date</Label>
                <Input
                  id="date-from"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => onDateFromChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-to">To Date</Label>
                <Input
                  id="date-to"
                  type="date"
                  value={dateTo}
                  onChange={(e) => onDateToChange(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}