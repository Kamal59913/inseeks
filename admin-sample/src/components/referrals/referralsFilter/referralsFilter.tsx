import { X } from "lucide-react";
import { SimpleSearch } from "@/components/ui/search/simpleSearch";
import SingleSelectDropdown from "@/components/ui/dropdown/SingleSelectController";

interface ReferralsFilterProps {
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  isMultiLine?: boolean;
}

export interface FilterState {
  search?: string;
  sort_by?: string;
  sort_order?: string;
}
const ReferralsFilter: React.FC<
  ReferralsFilterProps & { filters: FilterState }
> = ({ onFilterChange, onClearFilters, filters, isMultiLine = false }) => {

  const handleClearFilters = () => {
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  const handleSearch = async (query: string) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    if (query.trim()) {
      return [{ searchTerm: query }];
    }
    return [];
  };


  const handleSearchFound = (data: any) => {
    if (data && data.length > 0) {
      onFilterChange({ ...filters, search: data[0].searchTerm });
    }
  };
  const handleSearchClear = () => {
    // Clear the search filter
    onFilterChange({ ...filters, search: "" });
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };
  return (
    <div
      className={`flex flex-col gap-2 ${
        isMultiLine ? "w-full px-[5px]" : "ml-auto lg:max-w-[85%] md:max-w-full"
      }`}
    >
      <div
        className={
          isMultiLine
            ? "grid grid-cols-12 gap-x-2 gap-y-2 items-end"
            : "flex flex-wrap gap-4 justify-end items-end"
        }
      >
        {/* SEARCH FILTER */}
        <div className={isMultiLine ? "col-span-12 md:col-span-6 lg:col-span-3" : ""}>
          <label className="block text-[10px] font-medium uppercase tracking-wider mb-1">
            Search
          </label>
          <SimpleSearch
            placeholder="Search referrals..."
            fetchData={handleSearch}
            onDataFound={handleSearchFound}
            onDataClear={handleSearchClear}
            getErrorMessage={({ searchedValue }) =>
              `No results found for "${searchedValue}"`
            }
            initialValue={filters.search || ""}
          />
        </div>
       {/* SORT BY FILTER */}
        <div className={isMultiLine ? "col-span-12 md:col-span-6 lg:col-span-3" : ""}>
          <label className="block text-[10px] font-medium uppercase tracking-wider mb-1">
            Sort By
          </label>
          <SingleSelectDropdown
            title="Sort By"
            options={[
              { value: "first_name", label: "First Name" },
              { value: "created_at", label: "Created At" },
            ]}
            value={filters.sort_by || ""}
            onChange={(value) => handleFilterChange("sort_by", value)}
            placeholder="Select Sort Field"
            showSearch={false}
          />
        </div>
        {/* SORT ORDER FILTER */}
        <div className={isMultiLine ? "col-span-12 md:col-span-6 lg:col-span-3" : ""}>
          <label className="block text-[10px] font-medium uppercase tracking-wider mb-1">
            Sort Order
          </label>
          <SingleSelectDropdown
            title="Sort Order"
            options={[
              { value: "ASC", label: "Ascending" },
              { value: "DESC", label: "Descending" },
            ]}
            value={filters.sort_order || ""}
            onChange={(value) => handleFilterChange("sort_order", value as 'ASC' | 'DESC')}
            placeholder="Select Order"
            showSearch={false}
          />
        </div>
      </div>
      {hasActiveFilters && (
        <div className="flex justify-start">
          <button
            onClick={handleClearFilters}
            className="text-xs text-black hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ReferralsFilter;
