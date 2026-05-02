import PageMeta from "../common/PageMeta";
import { useSearchParams } from "react-router-dom";
import ModuleHeader from "../common/ModuleHeader";
import { HEADER_CONFIG } from "../../config/headerName";
import BookingsTable from "./bookingsTable";
import BookingsFilter from "./bookingsFilter/bookingsFilter";

const BookingsModule: React.FC = () => {


  const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "50", 10);


  const filters: any = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
    from_date: searchParams.get("from_date") || "",
    to_date: searchParams.get("to_date") || "",
    freelancer_uuid: searchParams.get("freelancer_uuid") || "",
    service: searchParams.get("service") || "",
    product_service_uuid: searchParams.get("product_service_uuid") || "",
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
        title={`Explore Booking Management Directory ${HEADER_CONFIG.NAME}`}
        description="Browse and manage the comprehensive list of service categories within the Empera system."
      />
      <ModuleHeader
        pageTitle="Bookings List"
        is_reverse={true}
        destination_path="Bookings"
        isMultiLine={true}
        footerContent={
          <div className="flex items-center gap-3">
            <BookingsFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        }
      />
      <div className="space-y-6">
        <BookingsTable
          title={"Booking Management"}
          filters={filters}
          currentPage={currentPage}
          setCurrentPage={handlePageChange}
          limit={limit}
        />
      </div>
    </>
  );
};

export default BookingsModule;
