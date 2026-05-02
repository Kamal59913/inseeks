import { ReactNode } from "react";
interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  data?: any;
  tableName?: string;
  footerContent?: ReactNode;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  children,
  className = "",
}) => {
  return (
          <div
            className={`rounded-2xl ${className}`}
          >
            <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12">
            {children}
            </div>
            </div>
          </div>
  );
};

export default ComponentCard;
