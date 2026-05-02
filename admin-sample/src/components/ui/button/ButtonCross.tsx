import { ReactNode, MouseEvent } from "react";
import { RxCross2 } from "react-icons/rx";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
  onDelete?: () => void;
}

const ButtonCross: React.FC<ButtonProps> = ({
  type,
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  onDelete,
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    // primary:
    //   " btn-primary hover:btn-primary-dark bg-brand-500 text-white  hover:bg-brand-600 disabled:bg-brand-300",
    // outline:
    //   "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-black black-text dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
    primary: `btn-primary hover:btn-primary-dark ${
      disabled ? "!btn-primary-dark" : ""
    } text-white`,
    outline:
      "bg-white text-primary ring-1 ring-primary hover:bg-pink-50 dark:bg-black black-text dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
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
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={handleClick}
      disabled={disabled} // Block clicks when loading
      type="submit"
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children} <RxCross2 color="white" size={16} onClick={onDelete}/>
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default ButtonCross;
