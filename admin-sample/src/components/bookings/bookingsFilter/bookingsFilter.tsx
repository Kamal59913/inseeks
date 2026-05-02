import { useMemo } from "react";
import { X } from "lucide-react";
import { useGetFreelancers } from "@/hooks/queries/freelancers/useGetFreelancers";
import SingleSelectDropdown from "../../ui/dropdown/SingleSelectController";
import DatePicker from "@shared/common/components/ui/form/date-picker/date-picker-input.js";
import { SimpleSearch } from "@/components/ui/search/simpleSearch";
import Button from "@shared/common/components/ui/button/Button.js";
import { ToastService } from "@/utils/toastService";
// import Tooltip from "@/components/ui/tooltip/tooltip";
import bookingsService from "@/api/services/bookingsService";
import { useServiceCategories } from "@/hooks/queries/serviceCategories/useServiceCategories";
// import { useGetServiceProducts } from "@/hooks/queries/serviceCategories/useServiceProducts";

interface BookingsFilterProps {
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  isMultiLine?: boolean;
}

export interface FilterState {
  search?: string;
  status: string;
  from_date: string;
  to_date: string;
  freelancer_uuid: string;
  service: string;
  product_service_uuid?: string;
  sort_by?: string;
  sort_order?: string;
}

const BookingsFilter: React.FC<
  BookingsFilterProps & { filters: FilterState }
> = ({ onFilterChange, onClearFilters, filters, isMultiLine = true }) => {
  const currentPage = 1;
  const limit = 100;

  const { data: allFreelancersList } = useGetFreelancers(
    { page: currentPage, limit },
    "",
    false
  );

  const { data: allServiceCategories } = useServiceCategories(
    {
      page: 1,
      limit: 100,
    },
    {},
    false
  );

  // const { data: allServiceProducts } = useGetServiceProducts({
  //   freelancer_uuid: filters.freelancer_uuid,
  //   service: filters.service,
  // });


  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const updated = { ...filters, [key]: value };

    // Clear product service if freelancer is changed/cleared
    if (key === "freelancer_uuid" || key === "service") {
      updated.product_service_uuid = "";
    }

    onFilterChange(updated);
  };
  
  const handleClearFilters = () => {
    onClearFilters();
  };

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
  
  const hasActiveFilters = Object.values(filters).some((v) => v !== "");
  
  const freelancersOptions = useMemo(() => {
    if (!allFreelancersList?.data?.data?.freelancers) return [];
    return allFreelancersList.data.data.freelancers.map((f: any) => ({
      value: f?.uuid || "",
      label:
      `${f?.first_name || ""} ${f?.last_name || ""}`.trim() ||
      "Unknown Freelancer",
    }));
  }, [allFreelancersList]);
  
  const categoryOptions = useMemo(() => {
    if (!allServiceCategories?.data?.data?.categories) return [];
    return allServiceCategories.data.data.categories.map((f: any) => ({
      value: String(f?.id) || "",
      label: `${f?.name || ""}`.trim() || "Unknown Category",
    }));
  }, [allServiceCategories]);
  
  // const productServicesOptions = useMemo(() => {
  //   if (!allServiceProducts?.data?.data?.products) return [];
  //   return allServiceProducts.data.data.products.map((p: any) => ({
  //     value: String(p?.id) || "",
  //     label: p?.name || "Unknown Product",
  //   }));
  // }, [allServiceProducts]);
  
  const handleExportCSV = async () => {
    const response = await bookingsService.exportBookings(filters);

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
        `${response?.data?.message || "CSV export started"}`
      );
    } else {
      ToastService.error(`${response?.data?.message || "Export failed"}`);
    }
  };

  return (
    <div
      className={`flex flex-col gap-2 ${
        isMultiLine ? "w-full px-[5px]" : "ml-auto lg:max-w-[85%] md:max-w-full"
      }`}
    >
      <div className="w-full">
        <div className="grid grid-cols-12 gap-x-2 gap-y-2 items-end">
          {/* SEARCH FILTER - WIDER */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <label className="block text-[10px] font-medium  uppercase tracking-wider mb-1">
              Search
            </label>
            <SimpleSearch
              placeholder="Search bookings..."
              fetchData={handleSearch}
              onDataFound={handleSearchFound}
              onDataClear={handleSearchClear}
              getErrorMessage={({ searchedValue }) =>
                `No results found for "${searchedValue}"`
              }
              initialValue={filters.search || ""}
            />
          </div>

          {/* STATUS FILTER */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <label className="block text-[10px] font-medium  uppercase tracking-wider mb-1">
              Status
            </label>
            <SingleSelectDropdown
              title="Status"
              options={[
                { value: "pending", label: "Pending" },
                { value: "accepted", label: "Accepted" },
                { value: "rejected", label: "Rejected" },
              ]}
              value={filters.status}
              onChange={(value) => handleFilterChange("status", value)}
              placeholder="Status"
              showSearch={false}
            />
          </div>

          {/* FROM DATE FILTER */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <label className="block text-[10px] font-medium  uppercase tracking-wider mb-1">
              From Date
            </label>
            <DatePicker
              key={filters.from_date || "from-date-empty"}
              id="from_date_picker"
              placeholder="Select date"
              defaultDate={filters.from_date || undefined}
              onChange={(dates: any[]) => {
                const selected = dates?.[0];
                const formatted = selected
                  ? selected.toLocaleDateString("en-CA")
                  : "";

                // If new from_date is after current to_date, clear to_date
                if (
                  formatted &&
                  filters.to_date &&
                  formatted > filters.to_date
                ) {
                  onFilterChange({
                    ...filters,
                    from_date: formatted,
                    to_date: "",
                  });
                } else {
                  handleFilterChange("from_date", formatted);
                }
              }}
              maxDate={filters.to_date || undefined}
            />
          </div>

          {/* TO DATE FILTER */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <label className="block text-[10px] font-medium  uppercase tracking-wider mb-1">
              To Date
            </label>
            <DatePicker
              key={filters.to_date || "to-date-empty"}
              id="to_date_picker"
              placeholder="Select date"
              defaultDate={filters.to_date || undefined}
              onChange={(dates: any[]) => {
                const selected = dates?.[0];
                const formatted = selected
                  ? selected.toLocaleDateString("en-CA")
                  : "";
                handleFilterChange("to_date", formatted);
              }}
              minDate={filters.from_date || undefined}
            />
          </div>

          {/* FREELANCER FILTER */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <label className="block text-[10px] font-medium  uppercase tracking-wider mb-1">
              Service Categories
            </label>
            <SingleSelectDropdown
              title="Category"
              options={categoryOptions}
              value={filters.service}
              onChange={(value) => handleFilterChange("service", value)}
              placeholder="Select Categories"
              notFoundText="No categories found"
              showSearch={true}
            />
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <label className="block text-[10px] font-medium  uppercase tracking-wider mb-1">
              Freelancer
            </label>
            <SingleSelectDropdown
              title="Freelancer"
              options={freelancersOptions}
              value={filters.freelancer_uuid}
              onChange={(value) => handleFilterChange("freelancer_uuid", value)}
              placeholder="Select Freelancer"
              notFoundText="No freelancers found"
              showSearch={true}
            />
          </div>
          {/* <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <label className="block text-[10px] font-medium  uppercase tracking-wider mb-1">
              Product Services
            </label>
            {!filters.freelancer_uuid ? (
              <Tooltip text="Please select freelancer first">
                <div className="w-full">
                  <SingleSelectDropdown
                    title="Product Services"
                    options={productServicesOptions}
                    value={filters.product_service_uuid}
                    onChange={(value) =>
                      handleFilterChange("product_service_uuid", value)
                    }
                    placeholder="Select Service"
                    notFoundText="No services found"
                    showSearch={true}
                    disabled={true}
                  />
                </div>
              </Tooltip>
            ) : (
              <SingleSelectDropdown
                title="Product Services"
                options={productServicesOptions}
                value={filters.product_service_uuid}
                onChange={(value) =>
                  handleFilterChange("product_service_uuid", value)
                }
                placeholder="Select Service"
                notFoundText="No services found"
                showSearch={true}
                disabled={false}
              />
            )}
          </div> */}

          {/* SORT BY FILTER */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <label className="block text-[10px] font-medium  uppercase tracking-wider mb-1">
              Sort By
            </label>
            <SingleSelectDropdown
              title="Sort By"
              options={[
                { value: "customer", label: "Customer" },
                { value: "freelancer", label: "Freelancer" },
              ]}
              value={filters.sort_by || ""}
              onChange={(value) => handleFilterChange("sort_by", value)}
              placeholder="Sort By"
              showSearch={false}
            />
          </div>

          {/* SORT ORDER FILTER */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <label className="block text-[10px] font-medium  uppercase tracking-wider mb-1">
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
              placeholder="Order"
              showSearch={false}
            />
          </div>

          {/* EXPORT BUTTON */}
          <div className="col-span-12 md:col-span-6 lg:col-span-3">
            <label className="block text-[10px] font-medium  uppercase tracking-wider mb-1">
              CSV Export
            </label>
            <div>
              <Button onClick={handleExportCSV} size="sm" className="px-8">
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-end pr-1">
          <button
            onClick={handleClearFilters}
            className="text-[10px] text-blue-600 hover:text-blue-800 transition-colors font-semibold uppercase tracking-tighter flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingsFilter;
