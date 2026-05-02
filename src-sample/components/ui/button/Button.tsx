import { ReactNode, MouseEvent } from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  children: ReactNode;
  size: "xs" | "sm" | "md" | "rg" | "none";
  variant?: "primary" | "outline" | "dark" | "red" | "dark2" | "primaryGreen" | "white" | "whiteGreen" | "glass";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  loadingState?: boolean;
  borderRadius?: string;
  backgroundColor?: string;
  borderColor?: string;
  shadow?: string;
  blur?: string;
}

const Button: React.FC<ButtonProps> = ({
  type,
  children,
  size = "rg",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  loadingState,
  borderRadius = "rounded-2xl",
  backgroundColor,
  borderColor,
  shadow,
  blur,
}) => {
  // Size Classes
  const sizeClasses = {
    xs: "h-[30px] px-2",
    sm: "h-[31px] px-4 text-[14px]",
    md: "px-4 text-[12px]",
    rg: "h-[51px] px-4 text-[14px] radius-[16px]",
    none: "", // No size classes applied
  };

  

  // Variant Classes
  const variantClasses = {
    primary: `bg-white hover:bg-gray-200 text-black ${
      disabled || loadingState ? "!btn-primary-dark" : ""
    }`,
        primaryGreen: `bg-white hover:bg-gray-200 text-green-500 shadow-[inset_0_-4px_4px_0_rgba(3,2,2,0.25)] ${
      disabled || loadingState ? "!btn-primary-dark" : ""
    }`,
    white: `bg-white hover:bg-gray-200 text-black shadow-[inset_0_-4px_4px_0_rgba(3,2,2,0.25)] ${
      disabled || loadingState ? "!btn-primary-dark" : ""
    }`,
    whiteGreen: `bg-white hover:bg-gray-200 text-green-500 shadow-[inset_0_-4px_4px_0_rgba(3,2,2,0.25)] ${
      disabled || loadingState ? "!btn-primary-dark" : ""
    }`,
    outline:
      "border-btn-outline hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    dark: `bg-[#FFFFFF1A] hover:bg-[#FFFFFF33]  text-white ${
      disabled || loadingState ? "!btn-primary-dark" : ""
    }`,
    red: `bg-red-500 hover:bg-gray-200 text-white hover:text-gray-800 ${
      disabled || loadingState ? "!btn-primary-dark" : ""
    }`,
    dark2: `bg-[#FFFFFF1A] hover:bg-[#FFFFFF33]  text-red-500 ${
      disabled || loadingState ? "!btn-primary-dark" : ""
    }`,
    glass: `${
      backgroundColor || "bg-white/5"
    } ${
      borderColor || "border border-white/15"
    } ${
      shadow || "shadow-[inset_0_4px_4px_0_rgba(255,255,255,0.25)]"
    } ${
      blur || "backdrop-blur-[82px]"
    } text-white`,
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
      className={`transition-colors ${borderRadius} ${className} ${
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

