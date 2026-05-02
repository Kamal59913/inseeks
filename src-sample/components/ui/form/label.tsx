import { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  isRequired?: boolean;
  variant?: "regular" | "lg";
  subtitle?: string;
}

const Label: FC<LabelProps> = ({
  htmlFor,
  children,
  className,
  isRequired,
  variant = "regular",
  subtitle = "",
}) => {
  const baseClasses =
    variant === "lg"
      ? "text-white text-[24px] font-light mb-3 block text-center"
      : "text-white text-sm mb-2 block";

  return (
    <>
      <label
        htmlFor={htmlFor}
        className={clsx(twMerge(baseClasses, className))}
      >
        {children}{" "}
        {isRequired && (
          <>
            <span className="text-red-500">*</span>{" "}
          </>
        )}
      </label>
      {subtitle && (
        <div className="mb-6">
          <p className="text-md text-center">{subtitle}</p>
        </div>
      )}
    </>
  );
};

export default Label;

