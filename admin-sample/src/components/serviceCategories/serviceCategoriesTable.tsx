import { useNavigate } from "react-router";
import {
  DataTable,
  Column,
} from "@shared/common/components/data-table/DataTable.tsx";
import { ActionIcons } from "../action/action";
import { formatDate } from "../../utils/formateDate";
import { useServiceCategories } from "@/hooks/queries/serviceCategories/useServiceCategories";
import { useModalData } from "@/redux/hooks/useModal";
import serviceCategoryService from "@/api/services/serviceCategoryService";
import { ToastService } from "@/utils/toastService";
import { queryClient } from "@/utils/queryClient";

interface ClassTableProps {
  title: string;
  filters?: any;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  limit: number;
}

const ServiceCategoriesTable: React.FC<ClassTableProps> = ({
  currentPage,
  setCurrentPage,
  limit,
  filters,
}) => {
  const { data: localData, isPending } = useServiceCategories(
    {
      page: currentPage,
      limit,
    },
    filters,
  );

  const { open, close } = useModalData();
  const navigate = useNavigate();

  const deleteServiceCategories = async (_id: string) => {
    const response =
      await serviceCategoryService.deleteServiceCategoryById(_id);

    if (response.status === 200) {
      ToastService.success(
        `${response?.data?.message || "Service Category Deleted Successfully"}`,
        "delete-service-category",
      );

      await queryClient.invalidateQueries({
        queryKey: ["get-service-categories"],
      });

      close();
    } else {
      ToastService.success(
        `${response?.data?.message || "Failed Deleting Service Category"}`,
        "delete-service-category-fail",
      );
    }
  };

  const columns: Column<any>[] = [
    {
      header: "#",
      accessor: (_, index) => index + 1,
      headerClassName:
        "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },
    {
      header: "Name",
      accessor: (service_category) => service_category?.name || "NA",
      headerClassName:
        "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },
    {
      header: "Description",
      accessor: (service_category) => service_category?.description || 1,
      headerClassName:
        "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 pr-10 py-3 max-w-[40vh] text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "Created At",
      accessor: (service_category) =>
        formatDate(service_category?.createdAt, { format: "dayFirst" }) || "NA",
      headerClassName:
        "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },
    {
      header: "Action",
      accessor: (service_category) => (
        <div className="flex gap-2 items-center">
          <ActionIcons
            onEdit={() =>
              navigate(`edit-service-category/${service_category.id}`)
            }
            onDelete={() => {
              open("delete-action", {
                description:
                  "Are you sure you want to delete this service category? All related data associated with this category will be deleted as well.",
                action: () => {
                  deleteServiceCategories(service_category?.id);
                },
              });
            }}
            title="Category"
          />
        </div>
      ),
      headerClassName:
        "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
      disableRowClick: true, // IMPORTANT: This prevents row click on the Action column
    },
  ];

  const tableData = Array.isArray(localData?.data?.data?.categories)
    ? localData.data.data?.categories
    : [];

  return (
    <DataTable
      data={tableData}
      columns={columns}
      isLoading={isPending}
      emptyMessage="No service categories found."
      pagination={{
        totalPages: localData?.data?.data?.totalPages || 0,
        currentPage,
        onPageChange: setCurrentPage,
      }}
      currentPage={currentPage}
      limit={limit}
      onRowClick={(service_category) =>
        navigate(`edit-service-category/${service_category.id}`)
      } // Add this line
      minWidth="1000px"
    />
  );
};

export default ServiceCategoriesTable;
