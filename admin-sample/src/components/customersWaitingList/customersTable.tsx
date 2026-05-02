import {
  DataTable,
  Column,
} from "@shared/common/components/data-table/DataTable.tsx";
import { formatDate } from "../../utils/formateDate";
import { useGetCustomersWaitingList } from "@/hooks/queries/customersWaitingList/useGetCustomers";
import { useNavigate } from "react-router";
import { ActionIcons } from "../action/action";
import { useModalData } from "@/redux/hooks/useModal";
import commonUserService from "@/api/services/commonUserService";
import { ToastService } from "@/utils/toastService";
import { queryClient } from "@/utils/queryClient";

interface CustomersTableProps {
  title: string;
  filters?: any;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  limit: number;
}

const CustomersTable: React.FC<CustomersTableProps> = ({
  currentPage,
  setCurrentPage,
  limit,
  filters,
}) => {
  const { data: localData, isPending } = useGetCustomersWaitingList(
    {
      page: currentPage,
      limit,
    },
    filters
  );
  const navigate = useNavigate();
  const { open, close } = useModalData();

  const deleteCustomer = async (uuid: string) => {
    try {
      const response = await commonUserService.deleteUserById(uuid);
      if (response.status === 200) {
        ToastService.success(
          response.data?.message || "Customer deleted successfully"
        );
        await queryClient.invalidateQueries({
          queryKey: ["get-waiting-list-customers"],
        });
        close();
      } else {
        ToastService.error(
          response.data?.message || "Failed to delete customer"
        );
      }
    } catch (error: any) {
      ToastService.error("An error occurred while deleting the customer");
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
      header: "First name",
      accessor: (user) => user?.first_name || "NA",
      headerClassName:
        "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "Last name",
      accessor: (user) => user?.last_name || "NA",
      headerClassName:
        "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "Email",
      accessor: (user) => user?.email || "NA",
      headerClassName:
        "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "Phone",
      accessor: (user) => user?.phone || "NA",
      headerClassName:
        "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    // {
    //   header: "Status",
    //   accessor: (user) => (
    //     <Badge
    //       size="sm"
    //       color={user?.status === "active" ? "success" : "error"}
    //     >
    //       {user?.status}
    //     </Badge>
    //   ),
    //   headerClassName:
    //     "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
    // },

    // {
    //   header: "Platform Fee",
    //   accessor: (user) =>
    //     user?.platform_fee !== null ? `${user.platform_fee}%` : "Not Set",
    //   headerClassName:
    //     "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
    //   cellClassName:
    //     "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    // },

    {
      header: "Created At",
      accessor: (user) =>
        formatDate(user?.created_at, { format: "dayFirst" }) || "NA",
      headerClassName:
        "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },
    {
      header: "Action",
      accessor: (user) => (
        <div className="flex gap-2">
          <ActionIcons
            onView={() => navigate(`/waiting-list-customers/${user.uuid}`)}
            onDelete={() => {
              open("delete-action", {
                description: "Are you sure you want to delete this customer?",
                action: () => deleteCustomer(user.uuid),
              });
            }}
            title="Customer Details"
          />
        </div>
      ),
      headerClassName:
        "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
      disableRowClick: true, // IMPORTANT: This prevents row click on the Action column
    },

    // {
    //   header: "Action",
    //   accessor: (user) => (
    // <div className="flex gap-2 items-center">
    //       <Switch
    //         name="status"
    //         value={user.status === "active"}
    //         onChange={(checked) => handleSwitchToggle(user, checked)}
    //       />
    //     </div>
    //   ),
    //   headerClassName:
    //     "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
    //   cellClassName:
    //     "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    // },
  ];

  const tableData = Array.isArray(localData?.data?.data?.users)
    ? localData.data.data.users
    : [];

  console.log("here is the thing", localData?.data?.data);
  return (
    <DataTable
      data={tableData}
      columns={columns}
      isLoading={isPending}
      emptyMessage="No customers found."
      pagination={{
        totalPages: localData?.data?.data?.totalPages || localData?.data?.data?.total_pages || 0,
        currentPage,
        onPageChange: setCurrentPage,
      }}
      currentPage={currentPage}
      limit={limit}
      onRowClick={(user) => navigate(`/waiting-list-customers/${user.uuid}`)} // Add this line
      minWidth="1000px"
    />
  );
};

export default CustomersTable;
