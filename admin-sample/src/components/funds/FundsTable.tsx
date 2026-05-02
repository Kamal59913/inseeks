import { Dispatch, SetStateAction } from "react";
import {
  DataTable,
  Column,
} from "@shared/common/components/data-table/DataTable.tsx";
import { formatDate } from "../../utils/formateDate";
import { useGetFunds } from "@/hooks/queries/funds/useGetFunds";
import { useModalData } from "@/redux/hooks/useModal";
import { ToastService } from "@/utils/toastService";
import fundService from "@/api/services/fundsService";
import ActionDropdown, {
  DropdownAction,
} from "../ui/action-dropdown/ActionDropDown";

interface FundProps {
  title: string;
  searchWord: string;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  limit: number;
}

const FundsTable: React.FC<FundProps> = ({
  searchWord,
  currentPage,
  setCurrentPage,
  limit,
}) => {
  const { data: localData, isPending } = useGetFunds(
    {
      page: currentPage,
      limit,
    },
    searchWord
  );

  const { open, close } = useModalData();

  const handleFreeze = (paymentId: string) => {
    open("cancel-modal", {
      title: "Freeze Payment!",
      inputLabel: "Freeze Reason",
      inputPlaceholder: "Enter reason for freezing this payment...",
      confirmText: "Freeze Payment",
      validationRequired: true,
      validationError: "Freeze reason is required",
      action: async (reason: string) => {
        try {
          const response: any = await fundService.freezePayment({
            paymentId: Number(paymentId),
            reason: reason || "Admin Freeze",
          });

          if (response?.status === 200 || response?.status === 201) {
            ToastService.success(
              response.data.message || "Payment frozen successfully",
              "freeze-payment"
            );
            close();
          } else {
            ToastService.error(
              response?.response?.data?.message || "Failed to freeze payment",
              "freeze-payment-error"
            );
          }
        } catch (error) {
          ToastService.error("An error occurred", "freeze-payment-error");
        }
      },
    });
  };

  const handleRelease = (paymentId: string) => {
    open("complete-modal", {
      title: "Release Payment!",
      description:
        "Are you sure you want to release this payment? Funds will be sent to the freelancer and can’t be reverted.",
      action: async () => {
        try {
          const response: any = await fundService.releasePayment({
            paymentId: Number(paymentId),
          });

          if (response?.status === 200 || response?.status === 201) {
            ToastService.success(
              response.data.message || "Payment released successfully",
              "release-payment"
            );
            close();
          } else {
            ToastService.error(
              response?.response?.data?.message || "Failed to release payment",
              "release-payment-error"
            );
          }
        } catch (error) {
          ToastService.error("An error occurred", "release-payment-error");
        }
      },
    });
  };

  const handleRefund = (paymentId: string) => {
    open("refund-modal", {
      title: "Refund Payment!",
      description:
        "Are you sure you want to refund this payment? Once refunded, the funds will be transferred to the freelancer and cannot be reverted.",
      action: async (percentage: number) => {
        try {
          const response: any = await fundService.refundPayment({
            paymentId: Number(paymentId),
            percentage: percentage,
          });

          if (response?.status === 200 || response?.status === 201) {
            ToastService.success(
              response.data.message || "Payment refunded successfully",
              "refund-payment"
            );
            close();
          } else {
            ToastService.error(
              response?.response?.data?.message || "Failed to refund payment",
              "refund-payment-error"
            );
          }
        } catch (error) {
          ToastService.error("An error occurred", "refund-payment-error");
        }
      },
    });
  };

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
      header: "Booking ID",
      accessor: (fund) => fund?.bookingId ?? "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "Amount",
      accessor: (fund) =>
        fund?.amount ? `${fund.amount} ${fund.currency}` : "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "Frozen",
      accessor: (fund) => (fund?.isFrozen ? "Yes" : "No"),
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "Coupan Code",
      accessor: (fund) =>
        fund?.metadata?.couponCode?.trim() ? fund.metadata.couponCode : "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "Admin Decision",
      accessor: (fund) => fund?.adminDecision ?? "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 capitalize text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "Created At",
      accessor: (fund) =>
        formatDate(fund?.createdAt, { format: "dayFirst" }) || "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },
    {
      header: "Actions",
      accessor: (fund, index) => {
        const isFrozen = fund?.isFrozen;
        const adminDecision = fund?.adminDecision;
        const isReleased = adminDecision === "released";
        const isRefunded = adminDecision === "refunded";

        // All buttons disabled if released or refunded
        const allDisabled = isReleased || isRefunded;

        const totalRows = localData?.data?.length || 0;
        const isLastRow = typeof index === "number" && index >= totalRows - 2;

        const actions: DropdownAction[] = [
          {
            label: isFrozen ? "Frozen" : "Freeze",
            onClick: () => handleFreeze(fund?.paymentId),
            disabled: isFrozen,
            icon: (
              <svg
                className="mr-2 h-4 w-4 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            ),
          },
          {
            label: isReleased ? "Released" : "Release",
            onClick: () => handleRelease(fund?.paymentId),
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
          },
          {
            label: isRefunded ? "Refunded" : "Refund",
            onClick: () => handleRefund(fund?.paymentId),
            icon: (
              <svg
                className="mr-2 h-4 w-4 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
            ),
          },
        ];

        return (
          <ActionDropdown
            actions={actions}
            disabled={allDisabled}
            isLastRow={isLastRow}
          />
        );
      },
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },
  ];

  const tableData = Array.isArray(localData?.data) ? localData.data : [];

  return (
    <DataTable
      data={tableData}
      columns={columns}
      isLoading={isPending}
      emptyMessage="No Funds"
      pagination={{
        totalPages: localData?.pagination?.totalPages || 0,
        currentPage,
        onPageChange: setCurrentPage,
      }}
      currentPage={currentPage}
      limit={limit}
    />
  );
};

export default FundsTable;
