import PageMeta from "../common/PageMeta";

import { useSearchParams } from "react-router-dom";
import ModuleHeader from "../common/ModuleHeader";
import { HEADER_CONFIG } from "../../config/headerName";
import CustomersTable from "./customersTable";
import CustomersFilter from "./customersFilter/waitingCustomersFilter";

const WaitCustomersListModule: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);


  const filters = {
    search: searchParams.get("search") || "",
    sort_by: searchParams.get("sort_by") || "",
    sort_order: searchParams.get("sort_order") || "",
  };

  const handleFilterChange = (newFilters: any) => {
    const params = new URLSearchParams(searchParams);
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) {
        params.set(key, newFilters[key]);
      } else {
        params.delete(key);
      }
    });
    // Reset to page 1 when filtering
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };

  return (
    <>
      <PageMeta
        title={`Explore Customer Waiting List Directory ${HEADER_CONFIG.NAME}`}
        description="Browse and manage the comprehensive list of waiting customers within the Empera system."
      />
      <ModuleHeader
        pageTitle="Customers Waiting List"
        is_reverse={true}
        isMultiLine={true}
        destination_path="waiting-list-customers"
       footerContent={
            <CustomersFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isMultiLine={true}
            />
        }
      />
      <div className="space-y-6">
        <CustomersTable
          title={"Customer Management"}
          filters={filters}
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          limit={limit}
        />
      </div>
    </>
  );
};

export default WaitCustomersListModule;
