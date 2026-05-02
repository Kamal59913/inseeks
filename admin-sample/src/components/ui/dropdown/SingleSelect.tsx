import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { FieldError } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface SingleSelectDropdownProps {
  placeholder?: string;
  width?: string;
  title: string;
  options: Option[];
  selectedOption: Option | null;
  setSelectedOption: (option: Option | null) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage?: FieldError | undefined;
  disabled?: boolean;
}

const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  width = "w-full",
  title,
  options,
  selectedOption,
  setSelectedOption,
  isOpen,
  setIsOpen,
  errorMessage,
  disabled = false,
}) => {

  let inputClasses = `items-center gap-2`;

  if (disabled) {
    inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-black black-text dark:border-gray-700 opacity-40`;
  }

  const [searchTerm, setSearchTerm] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const selectOption = (option: Option): void => {
    // If the same option is clicked, do nothing
    if (selectedOption && selectedOption.value === option.value) {
      setIsOpen(false);
      return;
    }

    // Set the new selected option
    setSelectedOption(option);
    setIsOpen(false);
  };

  const clearSelection = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if(disabled) {
      return
    }
    setSelectedOption(null);
  };

  const toggleDropdown = (): void => {
    if(disabled) {
      return
    }
    setIsOpen((prev: boolean) => !prev);
    if (!isOpen) {
      setSearchTerm("");
    }
  };


  const filteredOptions = options?.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`${inputClasses}`}>
      <div className={`${width} relative`} ref={dropdownRef}>
        <div
          className={`bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-gray-800 rounded-lg px-4 flex items-center min-h-12 shadow-sm focus:outline-none focus:ring-2 transition duration-150 ${
            isOpen
              ? "ring-2 ring-blue-500 border-blue-500 dark:ring-blue-400 dark:border-blue-400"
              : disabled 
                ? "cursor-not-allowed"
                : "hover:border-gray-400 dark:hover:border-gray-700 cursor-pointer"
            }`}
          onClick={toggleDropdown}
        >
          {!selectedOption ? (
            <span className="text-gray-500 dark:text-white/60 py-2">
              Select {title}...
            </span>
          ) : (
            <div className="flex justify-between items-center w-full py-2">
              <span className="text-black dark:text-white">
                {selectedOption.label}
              </span>
              {selectedOption && !disabled && (
                <button
                  onClick={clearSelection}
                  className="ml-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          )}
          <div className="ml-auto flex items-center">
            <ChevronDown
              size={18}
              className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""
                }`}
            />
          </div>
        </div>

        {isOpen && (
          <div className="absolute mt-1 w-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-10 max-h-80 overflow-y-auto">
            <div className="p-2 sticky top-0 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-black dark:text-white/90 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  placeholder="Search options..."
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="p-2">
              {filteredOptions?.length > 0 ? (
                filteredOptions?.map((option: Option) => {
                  const isSelected: boolean = selectedOption?.value === option.value;
                  return (
                    <div
                      key={option.value}
                      className={`px-3 py-2 rounded-md flex items-center ${isSelected
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                          : "hover:bg-gray-100 dark:hover:bg-black/50 dark:text-white/90 cursor-pointer text-sm"
                        }`}
                      onClick={() => selectOption(option)}
                    >
                      <div className="mr-3 flex-shrink-0">
                        <div
                          className={`w-5 h-5 rounded-sm border flex items-center justify-center ${isSelected
                              ? "bg-blue-500 border-blue-500 dark:bg-blue-600 dark:border-blue-600"
                              : "border-gray-300 dark:border-gray-600"
                            }`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              ></path>
                            </svg>
                          )}
                        </div>
                      </div>
                      <span>{option.label}</span>
                    </div>
                  );
                })
              ) : (
                <div className="px-3 py-4 text-center text-gray-500 black-text">
                  No options match your search
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {errorMessage && (
        <p className="mt-1.5 text-xs text-red-500">{errorMessage?.message}</p>
      )}
    </div>
  );
};

export default SingleSelectDropdown;