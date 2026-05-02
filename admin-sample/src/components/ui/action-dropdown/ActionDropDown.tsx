import React from "react";

export interface DropdownAction {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

interface ActionDropdownProps {
  actions: DropdownAction[];
  disabled?: boolean;
  triggerClassName?: string;
  dropdownClassName?: string;
  isLastRow?: boolean;
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({
  actions,
  disabled = false,
  triggerClassName = "",
  dropdownClassName = "",
  isLastRow = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = React.useState<{
    top?: number;
    bottom?: number;
    left?: number;
  } | null>(null);

  // Calculate dropdown position
  React.useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: isLastRow ? undefined : rect.bottom + 4,
        bottom: isLastRow ? window.innerHeight - rect.top + 4 : undefined,
        left: rect.right - 128, // 8rem = 128px (min-w-[8rem])
      });
    } else {
      setDropdownPosition(null);
    }
  }, [isOpen, isLastRow]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Three Dot Button */}
      <button
        ref={buttonRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`inline-flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : isOpen
              ? "bg-gray-100 dark:bg-gray-800"
              : "hover:bg-gray-100 dark:hover:bg-gray-800"
        } ${triggerClassName}`}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
        >
          <path
            d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM12.5 8.625C13.1213 8.625 13.625 8.12132 13.625 7.5C13.625 6.87868 13.1213 6.375 12.5 6.375C11.8787 6.375 11.375 6.87868 11.375 7.5C11.375 8.12132 11.8787 8.625 12.5 8.625Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && dropdownPosition && (
        <div
          className={`fixed z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-1 text-gray-950 dark:text-gray-50 shadow-md animate-in fade-in-0 zoom-in-95 ${dropdownClassName}`}
          style={dropdownPosition}
        >
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                if (!action.disabled && !disabled) {
                  action.onClick();
                  setIsOpen(false);
                }
              }}
              disabled={action.disabled || disabled}
              className={`relative flex w-full cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors ${
                action.disabled || disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800"
              } ${action.className || ""}`}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;