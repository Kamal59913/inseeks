import { ReactNode } from "react";
import { useSidebar } from "../../context/SidebarContext";
interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  data?: any;
  tableName?: string;
  footerContent?: ReactNode;
}

const CustomComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  className,
  footerContent
}) => {
  const { isExpanded, isHovered } = useSidebar()

  return (
          <div
            className={`rounded-2xl border border-gray-200 dark:border-gray-800 dark:bg-white/[0.03] pt-4 ${className} ${isExpanded || isHovered? 'max-w-[78vw]' : 'max-w-[92vw]'}`}
          >
            <div className="flex flex-col gap-5 px-6 mb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white/90">
                  {title}
                </h3>
              </div>
              {footerContent && (
         <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
         {footerContent}
       </div>
      )}

             
            </div>

            {/* Card Body */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
              <div className="space-y-6">{children}</div>
            </div>
          </div>
  );
};

export default CustomComponentCard;
