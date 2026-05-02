import { X } from "lucide-react";
import { SimpleSearch } from "@/components/ui/search/simpleSearch";
import SingleSelectDropdown from "@/components/ui/dropdown/SingleSelectController";
import Button from "@shared/common/components/ui/button/Button.js";
import { ToastService } from "@/utils/toastService";
import freelancersApplicationService from "@/api/services/freelancersApplicationService";
import { useModalData } from "@/redux/hooks/useModal";

interface FreelancerApplicationsFilterProps {
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export interface FilterState {
  search?: string;
  sort_by?: string;
  sort_order?: string;
}
const FreelancerApplicationsFilter: React.FC<
  FreelancerApplicationsFilterProps & { filters: FilterState }
> = ({ onFilterChange, onClearFilters, filters }) => {
  const { open } = useModalData();

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

  const handleExportCSV = async () => {
    const response =
      await freelancersApplicationService.exportFreelancerApplications(filters);

    if (response.status == 200) {
      const fileData = response?.data?.data;

      if (!fileData?.download_url) {
        throw new Error("Download URL not found");
      }

      const link = document.createElement("a");
      link.href = fileData.download_url;
      link.download = fileData.filename || "customers-export.csv";
      link.target = "_blank";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      ToastService.success(
        `${response?.data?.message || "CSV export started"}`,
      );
    } else {
      ToastService.error(`${response?.data?.message || "Export failed"}`);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full px-[2px] md:px-[5px]">
      <div className="flex flex-wrap items-end gap-4 w-full">
        {/* SEARCH FILTER */}
        <div className="flex-[2] min-w-[280px]">
          <label className="block text-[10px] font-medium uppercase tracking-wider mb-1">
            Search
          </label>
          <SimpleSearch
            placeholder="Search applications..."
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
        <div className="flex-1 min-w-[160px]">
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
        <div className="flex-1 min-w-[140px]">
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
            onChange={(value) =>
              handleFilterChange("sort_order", value as "ASC" | "DESC")
            }
            placeholder="Select Order"
            showSearch={false}
          />
        </div>

        {/* CSV ACTIONS */}
        <div className="flex-1 min-w-[260px]">
          <div className="flex gap-3 items-end w-full">
            <div className="flex-1">
              <label className="block text-[10px] font-medium uppercase tracking-wider mb-1">
                CSV Export
              </label>
              <Button onClick={handleExportCSV} size="sm" className="w-full px-4 h-[38px]">
                Export
              </Button>
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-medium uppercase tracking-wider mb-1">
                CSV Import
              </label>
              <Button
                onClick={() => open("import-freelancers")}
                size="sm"
                className="w-full px-4 h-[38px]"
                variant="dark"
              >
                Import
              </Button>
            </div>
          </div>
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

export default FreelancerApplicationsFilter;
