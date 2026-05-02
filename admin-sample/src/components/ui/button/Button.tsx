import { ReactNode, MouseEvent } from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  children: ReactNode;
  size?: "sm" | "md";
  variant?: "primary" | "outline" | "dark" | "red" | "light";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  loadingState?: boolean;
  borderRadius?: string;
}

const Button: React.FC<ButtonProps> = ({
  type,
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  loadingState,
  borderRadius = "rounded-full",
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "h-10 px-4 py-1",
    md: "px-4 py-3",
  };

  // Variant Classes
  const variantClasses = {
    primary: `${
      disabled || loadingState
        ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
        : "bg-[#000000] hover:bg-[#1a1a1a] text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black"
    }`,
    light: `bg-[#7d2f79] hover:bg-[#000000] text-white dark:bg-gray-200 dark:hover:bg-white dark:text-black ${
      disabled || loadingState ? "opacity-50" : ""
    }`,
    outline:
      "border-btn-outline hover:bg-gray-200 dark:bg-black dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    dark: `text-gray-700 bg-gray-200  hover:bg-gray-300 dark:bg-[#FFFFFF1A] dark:hover:bg-[#FFFFFF33] dark:text-white ${
      disabled || loadingState ? "opacity-50" : ""
    }`,
    red: "px-6 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 transition-colors",
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // Prevent default if not a submit button
    if (type !== "submit") {
      e.preventDefault();
    }
    onClick?.(e);
  };

  return (
    <button
      className={`font-medium transition-colors ${borderRadius} ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
      onClick={handleClick}
      disabled={disabled || loadingState} // Block clicks when loading
      type={type}
      onKeyDown={(e) => {
        // Only prevent default for Enter key if this isn't a submit button
        if (e.key === "Enter" && type !== "submit") {
          e.preventDefault();
        }
      }}
    >
      {!loadingState && startIcon && (
        <span className="flex items-center">{startIcon}</span>
      )}
      {loadingState ? (
        <span className="inline-flex items-center gap-2">
          {/* Custom SVG loader - fully adjustable size */}
          <svg
            className="animate-spin"
            style={{ width: "1rem", height: "1rem" }} // Adjust size here
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray="31.4 31.4" // Creates the partial circle effect
              strokeLinecap="round"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
      {!loadingState && endIcon && (
        <span className="flex items-center">{endIcon}</span>
      )}
    </button>
  );
};

export default Button;
