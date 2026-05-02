import React, { ReactNode, MouseEvent } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  size?: "sm" | "md" | "lg" | "icon" | "none";
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline" | "custom";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loadingState?: boolean;
  borderRadius?: string;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  loadingState,
  borderRadius = "rounded-xl",
  ...props
}) => {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
    icon: "p-1.5",
    none: "",
  };

  const variantClasses = {
    primary: "bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-slate-300 text-white font-semibold",
    secondary: "bg-slate-800 hover:bg-slate-700 text-white font-semibold",
    ghost: "text-slate-500 hover:text-indigo-400 hover:bg-[#1a2540]",
    danger: "bg-red-500 hover:bg-red-600 text-white font-semibold",
    outline: "border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10",
    custom: "",
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (type !== "submit") {
      e.preventDefault();
    }
    onClick?.(e);
  };

  return (
    <button
      {...props}
      type={type}
      className={`transition-all duration-200 flex items-center justify-center gap-2 ${borderRadius} ${sizeClasses[size]} ${variantClasses[variant]} ${
        disabled || loadingState ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      } ${className}`}
      onClick={handleClick}
      disabled={disabled || loadingState}
      onKeyDown={(e) => {
        if (e.key === "Enter" && type !== "submit") {
          e.preventDefault();
        }
        props.onKeyDown?.(e);
      }}
    >
      {!loadingState && startIcon && <span className="flex items-center">{startIcon}</span>}
      {loadingState ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin" style={{ width: "1rem", height: "1rem" }} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round" />
          </svg>
          {children && <span>Loading...</span>}
        </span>
      ) : (
        children
      )}
      {!loadingState && endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
