import {
  DataTable,
  Column,
} from "@shared/common/components/data-table/DataTable.tsx";
import { formatDate } from "../../utils/formateDate";
import { useGetFreelancers } from "@/hooks/queries/freelancers/useGetFreelancers";
import Badge from "../ui/badge/Badge";
import { ActionIcons } from "../action/action";
import { useNavigate } from "react-router";
import { EditIcon } from "@/icons";
import { ToastService } from "@/utils/toastService";
import { useModalData } from "@/redux/hooks/useModal";
import Switch from "@shared/common/components/ui/form/switch/Switch.js";
import freelancersService from "@/api/services/freelancersService";
import commonUserService from "@/api/services/commonUserService";
import { queryClient } from "@/utils/queryClient";
interface FreelancersTableProps {
  title: string;
  filters?: any;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  limit: number;
}

const FreelancersTable: React.FC<FreelancersTableProps> = ({
  currentPage,
  setCurrentPage,
  limit,
  filters,
}) => {
  const { data: localData, isPending } = useGetFreelancers(
    {
      page: currentPage,
      limit,
    },
    filters,
  );
  const navigate = useNavigate();
  const { open, close } = useModalData();
  const unsuspendFreelancer = async (user: any) => {
    try {
      const response = await freelancersService.unsuspendFreelancer(user.uuid);

      if (response.status === 200) {
        ToastService.success(
          response.data?.message || "User activated successfully",
        );
      } else {
        ToastService.error(response.data?.message || "Failed to activate user");
      }
    } catch (error: any) {
      console.error("Unsuspend user error:", error);
      if (error?.response?.status !== 401) {
        ToastService.error("An error occurred while activating the user");
      }
    }
  };

  const suspendFreelancer = async (freelancer: any) => {
    try {
      const response = await freelancersService.suspendFreelancer(
        freelancer.uuid,
      );

      if (response.status === 200) {
        ToastService.success(
          response.data?.message || "Freelancer suspended successfully",
        );
      } else {
        ToastService.error(
          response.data?.message || "Failed to suspend freelancer",
        );
      }
    } catch (error: any) {
      console.error("Suspend freelancer error:", error);
      if (error?.response?.status !== 401) {
        ToastService.error("An error occurred while suspending the freelancer");
      }
    }
  };

  const deleteFreelancer = async (uuid: string) => {
    try {
      const response = await commonUserService.deleteUserById(uuid);
      if (response.status === 200) {
        ToastService.success(
          response.data?.message || "Freelancer deleted successfully",
        );
        await queryClient.invalidateQueries({ queryKey: ["get-freelancers"] });
        await queryClient.invalidateQueries({
          queryKey: ["get-freelancer-applications"],
        });

        close();
      } else {
        ToastService.error(
          response.data?.message || "Failed to delete freelancer",
        );
      }
    } catch (error: any) {
      ToastService.error("An error occurred while deleting the freelancer");
    }
  };

  const handleSwitchToggle = (freelancer: any, newChecked: boolean) => {
    if (newChecked) {
      // UNSUSPEND
      open("user-status-modal", {
        title: "Are you sure you want to activate this freelancer?",
        description: "This freelancer will regain access immediately.",
        type: "approve",
        action: async () => {
          await unsuspendFreelancer(freelancer);
          close();
        },
      });
    } else {
      // SUSPEND
      open("user-status-modal", {
        title: "Are you sure you want to suspend this freelancer?",
        description: "The freelancer will lose access immediately.",
        type: "decline",
        action: async () => {
          await suspendFreelancer(freelancer);
          close();
        },
      });
    }
  };

  const columns: Column<any>[] = [
    {
      header: "#",
      accessor: (_, index) => index + 1,
      headerClassName:
        "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 cursor-pointer",
    },
    {
      header: "First name",
      accessor: (freelancer) => freelancer?.first_name || "NA",
      headerClassName:
        "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 cursor-pointer",
    },
    {
      header: "Last name",
      accessor: (freelancer) => freelancer?.last_name || "NA",
      headerClassName:
        "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 cursor-pointer",
    },
    {
      header: "Username",
      accessor: (freelancer) => freelancer?.username || "NA",
      headerClassName:
        "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 cursor-pointer",
    },
    {
      header: "Email",
      accessor: (freelancer) => freelancer?.email || "NA",
      headerClassName:
        "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 cursor-pointer",
    },
    {
      header: "Active Status",
      accessor: (freelancer) => (
        <Badge
          size="sm"
          color={freelancer?.account_verified === true ? "success" : "error"}
        >
          {freelancer?.account_verified ? "Yes" : "No"}
        </Badge>
      ),
      headerClassName:
        "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 cursor-pointer",
    },
    {
      header: "Email Verified At",
      accessor: (freelancer) => (
        <>
          {freelancer?.email_verified_at
            ? formatDate(freelancer?.email_verified_at, { format: "dayFirst" })
            : "Not Verified"}
        </>
      ),
      headerClassName:
        "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 cursor-pointer",
    },
    {
      header: "Action",
      accessor: (freelancer) => (
        <div className="flex gap-2">
          <ActionIcons
            onView={() => navigate(`/freelancers/${freelancer.uuid}`)}
            onDelete={() => {
              open("delete-action", {
                description: "Are you sure you want to delete this freelancer?",
                action: () => deleteFreelancer(freelancer.uuid),
              });
            }}
            title="Freelancer Details"
          />
          <ActionIcons
            onPriceEdit={() =>
              navigate(`/freelancers/update-plateform-fee/${freelancer.uuid}`)
            }
            title="Plateform Fee"
            editText="Change"
          />

          <Switch
            size="sm"
            name="status"
            value={freelancer.status === "active"}
            onChange={(checked) => handleSwitchToggle(freelancer, checked)}
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

  // Ensure data is always an array
  const tableData = Array.isArray(localData?.data?.data?.freelancers)
    ? localData?.data?.data?.freelancers
    : [];

  return (
    <DataTable
      data={tableData}
      columns={columns}
      isLoading={isPending}
      emptyMessage="No freelancers found."
      pagination={{
        totalPages: localData?.data?.data?.totalPages || 0,
        currentPage,
        onPageChange: setCurrentPage,
      }}
      currentPage={currentPage}
      limit={limit}
      onRowClick={(freelancer) => navigate(`/freelancers/${freelancer.uuid}`)} // Add this line
      minWidth="1000px"
    />
  );
};

export default FreelancersTable;
