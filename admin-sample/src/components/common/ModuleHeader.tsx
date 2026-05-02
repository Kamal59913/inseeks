
import { ReactNode } from "react";

interface ModuleHeaderProps {
  pageTitle?: string;
  destination_name?: string;
  destination_path?: string;
  is_reverse?: boolean;
  footerContent?: ReactNode;
  isMultiLine?: boolean;
}

const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  pageTitle,
  footerContent,
  isMultiLine = false,
}) => {
  return (
    <div
      className={`min-h-[11vh] flex ${
        isMultiLine ? "flex-col items-stretch" : "flex-wrap items-center justify-between"
      } gap-3 mb-6 bg-white dark:bg-black p-4 rounded-lg border border-gray-200 dark:border-gray-800`}
    >
      {pageTitle && (
        <h1 className="text-xl font-medium text-gray-900 dark:text-white ml-[5px]">
          {pageTitle}
        </h1>
      )}

      {footerContent && (
        <div
          className={`${
            isMultiLine ? "w-full" : pageTitle ? "" : "ml-auto"
          }`}
        >
          {footerContent}
        </div>
      )}
    </div>
  );
};
export default ModuleHeader;