import { ReactNode } from "react";

interface ComponentCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  type?: string;
  footerContent?: ReactNode; // Footer content
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  type = "general",
  title,
  children,
  className = "",
  desc = "",
  footerContent,
}) => {
  return (
    <div
      className={`rounded border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}
    >
      {/* Card Header */}
      {type !== "image" && (
        <div className="px-3.5 py-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-medium text-black dark:text-white/90">
              {title}
            </h3>
            {desc && (
              <p className="mt-1 text-sm text-gray-500 black-text">
                {desc}
              </p>
            )}
          </div>
          
          {footerContent && (
            <div className={title ? "" : "mr-auto"}>
              {footerContent}
            </div>
          )}
        </div>
      )}

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;