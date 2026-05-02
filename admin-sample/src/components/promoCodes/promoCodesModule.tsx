import PageMeta from "../common/PageMeta";
import ModuleHeader from "../common/ModuleHeader";
import { HEADER_CONFIG } from "../../config/headerName";
import PromoCodesTable from "./promoCodesTable";
import { useSearchParams } from "react-router-dom";

import PromoCodesFilter from "./promoCodesFilter/promoCodesFilter";

const PromoCodesModule: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

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
        title={`Explore Promo Codes Management Directory ${HEADER_CONFIG.NAME}`}
        description="Browse and manage the comprehensive list of promo codes within the Empera system."
      />
      <ModuleHeader
        pageTitle="Promo Codes Management"
        is_reverse={true}
        isMultiLine={true}
        destination_path="promo-code-management"
        footerContent={
            <PromoCodesFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              isMultiLine={true}
            />
        }
      />
      <div className="space-y-6">
        <PromoCodesTable
          title={"Promo Codes Management"}
          filters={filters}
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          limit={limit}
        />
      </div>
    </>
  );
};

export default PromoCodesModule;
