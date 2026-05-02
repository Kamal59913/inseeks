import Button from "@shared/common/components/ui/button/Button.js";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface BreadcrumbProps {
  pageTitle: string;
  destination_name?: string;
  destination_path?: string;
  is_reverse?: boolean;
  footerContent?: ReactNode;
  backButtonText?: string;
}

const PageBreadcrumbButton: React.FC<BreadcrumbProps> = ({
  backButtonText = "Back",destination_path
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(`/${destination_path}`);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <Button
        className="rounded-md flex items-center gap-2"
        onClick={handleBackClick}
      >
        <svg
          className="w-4 h-4 "
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {backButtonText}
      </Button>
    </div>
  );
};

export default PageBreadcrumbButton;
