import {
  DataTable,
  Column,
} from "@shared/common/components/data-table/DataTable.tsx";
import { formatDate } from "../../utils/formateDate";
import { useModalData } from "@/redux/hooks/useModal";
import { ToastService } from "@/utils/toastService";
import Badge from "../ui/badge/Badge";
import { useGetFreelancerApplications } from "@/hooks/queries/freelancerApplications/useGetFreelancerApplications";
import freelancersApplicationService from "@/api/services/freelancersApplicationService";
import React from "react";
import ActionDropdown, {
  DropdownAction,
} from "../ui/action-dropdown/ActionDropDown";
import { useNavigate } from "react-router";
import { ActionIcons } from "../action/action";

interface FundProps {
  title: string;
  filters?: any;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  limit: number;
}

const FreelancerApplicationTable: React.FC<FundProps> = ({
  currentPage,
  setCurrentPage,
  limit,
  filters,
}) => {
  const { data: localData, isPending } = useGetFreelancerApplications(
    {
      page: currentPage,
      limit,
    },
    filters
  );
  const navigate = useNavigate();

  const { open, close } = useModalData();

  const handleApprove = (applicationId: string) => {
    open("complete-modal", {
      title: "Approve Application!",
      description:
        "Are you sure you want to approve this freelancer application? Once approved, the applicant will be granted access and this action cannot be reverted.",
      action: async () => {
        try {
          const response: any =
            await freelancersApplicationService.approveFreelancerApplication(
              applicationId
            );

          if (response?.status === 200 || response?.status === 201) {
            ToastService.success(
              response.data.message || "Application approved successfully",
              "approve-payment"
            );
            close();
          } else {
            ToastService.error(
              response?.response?.data?.message ||
                "Failed to approve application",
              "approve-payment-error"
            );
          }
        } catch (error) {
          ToastService.error("An error occurred", "approve-payment-error");
        }
      },
    });
  };

  // const handleReject = (applicationId: string) => {
  //   open("cancel-modal", {
  //     title: "Reject Application!",
  //     inputLabel: "Rejection Reason",
  //     inputPlaceholder: "Enter reason for rejecting this application...",
  //     confirmText: "Reject",
  //     validationRequired: true,
  //     action: async (reason: string) => {
  //       try {
  //         const response: any =
  //           await freelancersApplicationService.rejectFreelancerApplication(
  //             applicationId,
  //             { reason }
  //           );

  //         if (response?.status === 200 || response?.status === 201) {
  //           ToastService.success(
  //             response.data.message || "Application rejected successfully",
  //             "reject-payment"
  //           );
  //           close();
  //         } else {
  //           ToastService.error(
  //             response?.response?.data?.message ||
  //               "Failed to reject application",
  //             "reject-payment-error"
  //           );
  //         }
  //       } catch (error) {
  //         ToastService.error("An error occurred", "reject-payment-error");
  //       }
  //     },
  //   });
  // };

  // DELETE PROMO CODE
  // const deleteFund = async (_id: string) => {
  //   const response = await FundService.deleteFund(_id);
  //   if (response.status === 200) {
  //     ToastService.success(
  //       `${response?.data?.message || "Promo Code Deleted Successfully"}`,
  //       "delete-promo-code"
  //     );
  //     await handlePaginatedDelete(
  //       localData?.data?.data?.length || 0,
  //       currentPage,
  //       setCurrentPage,
  //       () =>
  //         queryClient.invalidateQueries({
  //           queryKey: ["get-promo-codes"],
  //         })
  //     );
  //     close();
  //   } else {
  //     ToastService.error(
  //       `${response?.data?.message || "Failed Deleting Promo Code"}`,
  //       "delete-promo-code-fail"
  //     );
  //   }
  // };

  // TABLE COLUMNS (UPDATED)
  const columns: Column<any>[] = [
    {
      header: "#",
      accessor: (_, index) => index + 1,
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "First Name",
      accessor: (freelancer_application) =>
        freelancer_application?.first_name ?? "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "Last Name",
      accessor: (freelancer_application) =>
        freelancer_application?.last_name ?? "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "Email",
      accessor: (freelancer_application) =>
        freelancer_application?.email ?? "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "Phone",
      accessor: (freelancer_application) =>
        freelancer_application?.country_code && freelancer_application?.phone
          ? `${freelancer_application.country_code} ${freelancer_application.phone}`
          : "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "Application Status",
      accessor: (freelancer_application) => {
        const status = freelancer_application?.freelancer_application_status;

        return (
          <Badge
            size="sm"
            color={
              status === "pending"
                ? "warning"
                : status === "approved"
                  ? "success"
                  : status === "rejected"
                    ? "error"
                    : "light"
            }
          >
            {status === "pending"
              ? "Pending"
              : status === "approved"
                ? "Approved"
                : status === "rejected"
                  ? "Rejected"
                  : "Unknown"}
          </Badge>
        );
      },
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 capitalize text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "Created At",
      accessor: (freelancer_application) =>
        formatDate(freelancer_application?.created_at, {
          format: "dayFirst",
        }) || "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },
    {
      header: "Actions",
      accessor: (freelancer_application, index) => {
        const adminDecision = freelancer_application?.adminDecision;
        const isReleased = adminDecision === "released";
        const isRefunded = adminDecision === "refunded";
        const allDisabled = isReleased || isRefunded;

        const totalRows = localData?.data?.data?.applications?.length || 0;
        const isLastRow = typeof index === "number" && index >= totalRows - 2;

        const actions: DropdownAction[] = [
          {
            label: isReleased ? "Approved" : "Approve",
            onClick: () => handleApprove(freelancer_application?.uuid),
            icon: (
              <svg
                className="mr-2 h-4 w-4 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ),
          }
          // {
          //   label: isRefunded ? "Rejected" : "Reject",
          //   onClick: () => handleReject(freelancer_application?.uuid),
          //   icon: (
          //     <svg
          //       className="mr-2 h-4 w-4 text-red-600"
          //       fill="none"
          //       stroke="currentColor"
          //       strokeWidth="2"
          //       viewBox="0 0 24 24"
          //     >
          //       <path
          //         strokeLinecap="round"
          //         strokeLinejoin="round"
          //         d="M6 18L18 6M6 6l12 12"
          //       />
          //     </svg>
          //   ),
          // },
        ];

        return (
          <div className="flex gap-2 items-center">
            <ActionIcons
              onView={() =>
                navigate(
                  `/freelancer-applications-management/${freelancer_application.uuid}`
                )
              }
              title="Customer Details"
            />
            <ActionDropdown
              actions={actions}
              disabled={allDisabled}
              isLastRow={isLastRow}
            />
          </div>
        );
      },
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },
  ];

  const tableData = Array.isArray(localData?.data?.data?.applications)
    ? localData.data.data.applications
    : [];

  return (
    <DataTable
      data={tableData}
      columns={columns}
      isLoading={isPending}
      emptyMessage="No freelancer applications found."
      pagination={{
        totalPages: localData?.data?.data?.totalPages || 0,
        currentPage,
        onPageChange: setCurrentPage,
      }}
      currentPage={currentPage}
      limit={limit}
      onRowClick={(freelancer_application) =>
        navigate(
          `/freelancer-applications-management/${freelancer_application.uuid}`
        )
      } // Add this line
      minWidth="1000px"
    />
  );
};

export default FreelancerApplicationTable;
