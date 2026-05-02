import PageMeta from "../common/PageMeta";
import { useState } from "react";
import ModuleHeader from "../common/ModuleHeader";
import { HEADER_CONFIG } from "../../config/headerName";
import FundsTable from "./FundsTable";

const FundsModule: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  return (
    <>
      <PageMeta
        title={`Explore Funds Management Directory ${HEADER_CONFIG.NAME}`}
        description="Browse and manage the comprehensive list of Funds within the Empera system."
      />
      <ModuleHeader
        pageTitle="Funds Management"
        is_reverse={true}
        destination_path="funds-management"
      />
      <div className="space-y-6">
        <FundsTable
          title={"Funds Management"}
          searchWord={""}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          limit={limit}
        />
      </div>
    </>
  );
};

export default FundsModule;
