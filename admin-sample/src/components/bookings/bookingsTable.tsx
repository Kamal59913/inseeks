import {
  DataTable,
  Column,
} from "@shared/common/components/data-table/DataTable.tsx";
import { useGetBookings } from "@/hooks/queries/bookings/useGetBookings";
import Badge from "../ui/badge/Badge";
import { formatDate } from "@/utils/formateDate";
import { useNavigate } from "react-router";
import { useModalData } from "@/redux/hooks/useModal";
import commonUserService from "@/api/services/commonUserService";
import { ToastService } from "@/utils/toastService";
import { queryClient } from "@/utils/queryClient";
import ActionDropdown, {
  DropdownAction,
} from "../ui/action-dropdown/ActionDropDown";
import bookingsService from "@/api/services/bookingsService";

interface BookingsTableProps {
  title: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  limit: number;
  filters: any;
}

const BookingsTable: React.FC<BookingsTableProps> = ({
  currentPage,
  setCurrentPage,
  limit,
  filters,
}) => {
  // const apiFilters = {
  //   status: filters.status || undefined,
  //   from_date: filters.from_date || undefined,
  //   to_date: filters.to_date || undefined,
  //   freelancer_uuid: filters.freelancer_uuid || undefined,
  // };

  const { data: localData, isPending } = useGetBookings(
    { page: currentPage, limit },
    filters
  );

  const navigate = useNavigate();
  const { open, close } = useModalData();

  const deleteBooking = async (id: string | number) => {
    try {
      const response = await commonUserService.deleteBookingById(id);
      if (response.status === 200) {
        ToastService.success(
          response.data?.message || "Booking deleted successfully"
        );
        await queryClient.invalidateQueries({ queryKey: ["get-all-bookings"] });
        close();
      } else {
        ToastService.error(
          response.data?.message || "Failed to delete booking"
        );
      }
    } catch (error: any) {
      ToastService.error("An error occurred while deleting the booking");
    }
  };

  const handleGenerateInvoice = async (bookingId: string | number) => {
    try {
      const response = await bookingsService.generateInvoice(bookingId);
      if (response.status === 200 || response.status === 201) {
        ToastService.success(
          response.data?.message || "Invoice generated successfully"
        );
      } else {
        ToastService.error(
          response.data?.message || "Failed to generate invoice"
        );
      }
    } catch (error: any) {
      ToastService.error("An error occurred while generating the invoice");
    }
  };

  const handleDownloadInvoice = async (bookingId: string | number) => {
    try {
      const response = await bookingsService.downloadInvoice(bookingId);
      if (response.status === 200 || response.status === 201) {
        const fileData = response?.data?.data;

        if (!fileData?.download_url) {
          ToastService.error("Download URL not found");
          return;
        }

        const link = document.createElement("a");
        link.href = fileData.download_url;
        link.download = fileData.filename || `Invoice-${bookingId}.pdf`;
        link.target = "_blank";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        ToastService.success(
          response.data?.message || "Invoice download started"
        );
      } else {
        ToastService.error(
          response.data?.message || "Failed to download invoice"
        );
      }
    } catch (error: any) {
      ToastService.error("An error occurred while downloading the invoice");
    }
  };

  const columns: Column<any>[] = [
    {
      header: "#",
      accessor: (_, index) => index + 1,
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-600 text-start text-theme-sm dark:text-gray-300",
    },

    {
      header: "Customer",
      accessor: (booking) =>
        booking?.customer
          ? `${booking.customer.first_name} ${booking.customer.last_name ?? ""}`
          : "Deleted Customer",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-300",
    },

    {
      header: "Freelancer",
      accessor: (booking) =>
        booking?.freelancer
          ? `${booking.freelancer.first_name} ${booking.freelancer.last_name ?? ""}`
          : "Unknown",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-300",
    },

    {
      header: "Service",
      accessor: (booking) => booking?.product?.name || "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-600 text-start text-theme-sm dark:text-gray-300",
    },

    {
      header: "Booking Time",
      accessor: (booking) =>
        formatDate(booking?.booking_timestamp, { format: "dayFirst" }),
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-600 text-start text-theme-sm dark:text-gray-300",
    },

    {
      header: "Status",
      accessor: (booking) => (
        <Badge
          size="sm"
          color={
            booking?.appointment_status === "accepted"
              ? "success"
              : booking?.appointment_status === "pending"
                ? "warning"
                : "error"
          }
        >
          {booking?.appointment_status || "NA"}
        </Badge>
      ),
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
    },

    // {
    //   header: "Payment",
    //   accessor: (booking) => (
    //     <Badge
    //       size="sm"
    //       color={
    //         booking?.payment?.status === "succeeded"
    //           ? "success"
    //           : booking?.payment?.status === "authorized"
    //           ? "primary"
    //           : booking?.payment?.status
    //           ? "warning"
    //           : "error"
    //       }
    //     >
    //       {booking?.payment?.status
    //         ? booking.payment.status.replace(/_/g, " ").toUpperCase()
    //         : "NA"}
    //     </Badge>
    //   ),
    //   headerClassName:
    //     "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
    // },

    {
      header: "Action",
      accessor: (booking, index) => {
        const totalRows = localData?.data?.data?.bookings?.length || 0;
        const isLastRow = typeof index === "number" && index >= totalRows - 2;

        const actions: DropdownAction[] = [
          {
            label: "View Details",
            onClick: () => navigate(`/bookings/${booking.id}`),
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            ),
          },
          {
            label: "Generate Invoice",
            onClick: () => handleGenerateInvoice(booking.id),
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            ),
          },
          {
            label: "Download Invoice",
            onClick: () => handleDownloadInvoice(booking.id),
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            ),
          },
          {
            label: "Delete",
            onClick: () => {
              open("delete-action", {
                description: "Are you sure you want to delete this booking?",
                action: () => deleteBooking(booking.id),
              });
            },
            className: "text-red-600",
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            ),
          },
        ];

        return (
          <div className="flex gap-2 items-center">
            {booking?.customer && (
              <ActionDropdown actions={actions} isLastRow={isLastRow} />
            )}
          </div>
        );
      },
      headerClassName:
        "pl-4 py-3 font-medium font-gray-dark text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
      disableRowClick: true,
    },
  ];

  const tableData = Array.isArray(localData?.data?.data?.bookings)
    ? localData.data.data.bookings
    : [];

  return (
    <div className="relative">
      <DataTable
        data={tableData}
        columns={columns}
        isLoading={isPending}
        emptyMessage="No bookings found."
        pagination={{
          totalPages: localData?.data?.data?.totalPages || 0,
          currentPage,
          onPageChange: setCurrentPage,
        }}
        currentPage={currentPage}
        limit={limit}
        onRowClick={(booking) =>
          booking?.customer && navigate(`/bookings/${booking.id}`)
        }
        getRowClassName={(booking) =>
          !booking?.customer
            ? "opacity-50 grayscale pointer-events-none italic"
            : ""
        }
        minWidth="1000px"
      />
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default BookingsTable;
