import { ReactNode } from "react";

interface ModuleHeaderProps {
  pageTitle: string;
  destination_name?: string;
  destination_path?: string;
  is_reverse?: boolean;
  footerContent?: ReactNode;
}

const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  footerContent,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 mb-6 bg-white dark:bg-black p-4 rounded-lg border border-gray-200 dark:border-gray-800">
      {footerContent && (
        <> 
          {footerContent}
        </>
      )}
    </div>
  );
};

export default ModuleHeader;