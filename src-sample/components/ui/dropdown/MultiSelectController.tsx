import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Search } from "lucide-react";
import { FieldError, Merge } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  title: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  errorMessage?: Merge<FieldError, (FieldError | undefined)[]> | undefined;
  width?: string;
  height?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  width = "w-full",
  title,
  options,
  value = [],
  onChange,
  errorMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const selectedOptions = options?.filter((option) =>
    value.includes(option.value)
  );

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

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value?.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const removeOption = (
    optionValue: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    onChange(value?.filter((v) => v !== optionValue));
  };

  const toggleDropdown = (): void => {
    setIsOpen((prev: boolean) => !prev);
    if (!isOpen) {
      setSearchTerm("");
    }
  };

  const filteredOptions = options?.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // text-primary earlier was text-blue-800 and text-blue-500 in certain places
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className={`${width} relative`} ref={dropdownRef}>
          <div
            className={`bg-[#FFFFFF0D] border border-white/5 opacity-80 rounded-lg px-4 flex flex-wrap items-center min-h-12 cursor-pointer shadow-sm focus:outline-none focus:ring-2 transition duration-150 overflow-auto ${
              isOpen
                ? "ring-2 ring-blue-500 border-blue-500 dark:ring-blue-400 dark:border-blue-400"
                : "hover:border-gray-400 dark:hover:border-gray-700"
            }`}
            onClick={toggleDropdown}
          >
            {(selectedOptions?.length === 0 || !selectedOptions) && (
              <span className="text-gray-500 dark:text-white/60">
                Select {title} ...
              </span>
            )}
            {selectedOptions?.slice(0, 3).map((option: Option) => (
              <div
                key={option.value}
                className="flex items-center bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md px-2 py-1 m-1 text-sm-v2 text-primary dark:text-blue-200"
              >
                <span className="mr-1">{option.label}</span>
                <button
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                    removeOption(option.value, e)
                  }
                  className="text-primary dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-100 focus:outline-none"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <div className="flex">
              {selectedOptions?.length > 2 && (
                <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  ....
                </span>
              )}
            </div>
            <div className="ml-auto flex items-center">
              {selectedOptions?.length > 0 && (
                <span className="mr-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                  {selectedOptions?.length}
                </span>
              )}
              <ChevronDown
                size={18}
                className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                  isOpen ? "transform rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {isOpen && (
            <div className="absolute mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-10 max-h-[48vh] overflow-y-auto z-100 ">
              <div className="p-2 sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="relative">
                  <Search
                    type="submit"
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-[16px] md:text-sm border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    placeholder="Search options..."
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div className="p-2">
                {filteredOptions?.length > 0 ? (
                  filteredOptions?.map((option: Option) => {
                    const isSelected: boolean = selectedOptions?.some(
                      (item: Option) => item.value === option.value
                    );
                    return (
                      <div
                        key={option.value}
                        className={`px-3 py-2 rounded-md cursor-pointer flex items-center ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-900/30 text-primary dark:text-blue-200"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800/50 dark:text-white/90"
                        }`}
                        onClick={() => toggleOption(option.value)}
                      >
                        <div className="mr-3 flex-shrink-0">
                          <div
                            className={`w-5 h-5 rounded border flex items-center justify-center ${
                              isSelected
                                ? "bg-primary border-blue-500 dark:bg-blue-600 dark:border-blue-600"
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
                  <div className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                    No options match your search
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {errorMessage && (
        <p className="mt-1.5 text-xs text-error-500">{errorMessage?.message}</p>
      )}
    </div>
  );
};

export default MultiSelectDropdown;

