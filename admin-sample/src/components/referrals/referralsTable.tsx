import {
  DataTable,
  Column,
} from "@shared/common/components/data-table/DataTable.tsx";
import { formatDate } from "../../utils/formateDate";
import { useGetReferrals } from "@/hooks/queries/referrals/useGetReferrals";

interface ReferralsProps {
  title: string;
  filters?: any;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  limit: number;
}

const ReferralsTable: React.FC<ReferralsProps> = ({
  currentPage,
  setCurrentPage,
  limit,
  filters,
}) => {
  const { data: localData, isPending } = useGetReferrals(
    {
      page: currentPage,
      limit,
    },
    filters
  );

  // ✅ TABLE COLUMNS (REFERRALS)
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
      accessor: (row) => `${row?.first_name || ""} ${row?.last_name || ""}`,
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-700 text-start text-theme-sm dark:text-gray-300",
    },
    {
      header: "Username",
      accessor: (row) => row?.username ?? "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },
    {
      header: "Email",
      accessor: (row) => row?.email ?? "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },
    {
      header: "Phone",
      accessor: (row) =>
        row?.phone ? `${row.country_code || ""} ${row.phone}` : "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },
    {
      header: "Referral Count",
      accessor: (row) => row?.referral_count ?? 0,
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 font-semibold text-start text-theme-sm text-black dark:text-white",
    },
    {
      header: "Created At",
      accessor: (row) =>
        formatDate(row?.created_at, { format: "dayFirst" }) || "NA",
      headerClassName:
        "pl-4 py-3 font-medium text-start text-theme-th dark:text-gray-400",
      cellClassName:
        "pl-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400",
    },
  ];

  const tableData = Array.isArray(localData?.data?.data?.freelancers)
    ? localData.data.data.freelancers
    : [];

  return (
    <DataTable
      data={tableData}
      columns={columns}
      isLoading={isPending}
      emptyMessage="No referrals found."
      pagination={{
        totalPages: localData?.data?.data?.totalPages || 0,
        currentPage,
        onPageChange: setCurrentPage,
      }}
      currentPage={currentPage}
      limit={limit}
      minWidth="1000px"
    />
  );
};

export default ReferralsTable;
