import { useMemo } from "react";
import {
  DataTable,
  Column,
} from "@shared/common/components/data-table/DataTable.tsx";
import { ActionIcons } from "../action/action";
import { formatDate } from "../../utils/formateDate";
import { useGetPromoCode } from "@/hooks/queries/promoCode/useGetPromoCode";
import { useModalData } from "@/redux/hooks/useModal";
import promoCodeService from "@/api/services/promoCodeService";
import { ToastService } from "@/utils/toastService";

interface PromoCodeProps {
  title: string;
  filters?: any;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  limit: number;
}

const PromoCodesTable: React.FC<PromoCodeProps> = ({
  filters,
  currentPage,
  setCurrentPage,
  limit,
}) => {
  const { data: localData, isPending } = useGetPromoCode(
    {
      page: 1, // Fetch all for frontend filtering
      limit: 1000, 
    },
    {} // Don't pass filters to backend
  );

  const { open, close } = useModalData();

  const allData = useMemo(() => {
    return Array.isArray(localData?.data) ? localData.data : [];
  }, [localData]);

  const filteredAndSortedData = useMemo(() => {
    let result = [...allData];

    // Search Filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchLower) ||
          item.id?.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    if (filters.sort_by) {
      result.sort((a, b) => {
        let valA = a[filters.sort_by];
        let valB = b[filters.sort_by];

        if (filters.sort_by === "created") {
          valA = a.created || 0;
          valB = b.created || 0;
        }

        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();

        if (valA < valB) return filters.sort_order === "DESC" ? 1 : -1;
        if (valA > valB) return filters.sort_order === "DESC" ? -1 : 1;
        return 0;
      });
    }

    return result;
  }, [allData, filters]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredAndSortedData.slice(start, start + limit);
  }, [filteredAndSortedData, currentPage, limit]);

  const totalPages = Math.ceil(filteredAndSortedData.length / limit);


  // DELETE PROMO CODE
  const deletePromoCode = async (_id: string) => {
    const response = await promoCodeService.deletePromoCode(_id);

    if (response.status === 200) {
      ToastService.success(
        `${response?.data?.message || "Promo Code Deleted Successfully"}`,
        "delete-promo-code"
      );

      // await handlePaginatedDelete(
      //   localData?.data?.data?.length || 0,
      //   currentPage,
      //   setCurrentPage,
      //   () =>
      //     queryClient.invalidateQueries({
      //       queryKey: ["get-promo-codes"],
      //     })
      // );

      close();
    } else {
      ToastService.error(
        `${response?.data?.message || "Failed Deleting Promo Code"}`,
        "delete-promo-code-fail"
      );
    }
  };

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
      header: "Name",
      accessor: (promo) => promo?.name || "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "Duration",
      accessor: (promo) => promo?.duration ?? "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },
    {
      header: "Duration In Months",
      accessor: (promo) => promo?.durationInMonths ?? "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },
    {
      header: "Percentage / Flat Off",
      accessor: (promo) => {
        // Percentage-based coupon
        if (promo?.percentOff !== null && promo?.percentOff !== undefined) {
          return `${promo.percentOff}%`;
        }

        // Flat-based coupon
        if (promo?.amountOff !== null && promo?.amountOff !== undefined) {
          return `£${promo.amountOff} Flat`;
        }

        return "NA";
      },
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "Max. Redemptions",
      accessor: (promo) => promo?.maxRedemptions ?? "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "Coupon Type",
      accessor: (promo) => (promo?.percentOff === null ? "Flat" : "Percentage"),
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    // {
    //   header: "Used",
    //   accessor: (promo) => promo?.uses ?? "NA",
    //   headerClassName:
    //     "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
    //   cellClassName:
    //     "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    // },

    {
      header: "Validity",
      accessor: (promo) => (promo?.valid ? "Yes" : "No"),
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "Created At",
      accessor: (promo) =>
        formatDate(promo?.created, { format: "dayFirst" }) || "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },

    {
      header: "Action",
      accessor: (promo) => (
        <div className="flex gap-2 items-center">
          <ActionIcons
            onDelete={() => {
              open("delete-action", {
                description: "Are you sure want to delete this promo code?",
                action: () => {
                  deletePromoCode(promo?.id);
                },
              });
            }}
            title="Promo Code"
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

  return (
    <DataTable
      data={paginatedData}
      columns={columns}
      isLoading={isPending}
      emptyMessage="No promo codes found."
      pagination={{
        totalPages: totalPages,
        currentPage,
        onPageChange: setCurrentPage,
      }}
      currentPage={currentPage}
      limit={limit}
      minWidth="1000px"
    />
  );

};

export default PromoCodesTable;
