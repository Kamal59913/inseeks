import PageMeta from "../common/PageMeta";
import ModuleHeader from "../common/ModuleHeader";
import { HEADER_CONFIG } from "../../config/headerName";
import FreelancersTable from "./freelancersTable";
import { useSearchParams } from "react-router-dom";
import FreelancersFilter from "./freelancersFilter/freelancersFilter";

const FreelancersModule: React.FC = () => {
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
        title={`Explore Freelancer Management Directory ${HEADER_CONFIG.NAME}`}
        description="Browse and manage the comprehensive list of service categories within the Empera system."
      />
      <ModuleHeader
        pageTitle="Freelancers List"
        is_reverse={true}
        isMultiLine={true}
        destination_path="freelancers"
        footerContent={
            <FreelancersFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isMultiLine={true}
            />
        }
      />
      <div className="space-y-6">
        <FreelancersTable
          title={"Freelancer Management"}
          filters={filters}
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          limit={limit}
        />
      </div>
    </>
  );
};

export default FreelancersModule;
