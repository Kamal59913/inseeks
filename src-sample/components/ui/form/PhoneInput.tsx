import { useState, useEffect, useRef } from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";

interface CountryCode {
  code: string;
  label: string;
}

interface PhoneInputProps {
  countries: CountryCode[];
  placeholder?: string;
  onChange?: (phoneNumber: string) => void;
  id?: string;
  disabled?: boolean;
  success?: boolean;
  hint?: string;
  register: UseFormRegister<any>;
  registerOptions: string;
  registerOptionsCountryCode?: string;
  setValue: UseFormSetValue<any>;
  errors?: FieldErrors;
  className?: string;
  preValue?: string;
  preCountryCode?: string;
  showCountryName?: boolean;
  maxLength?: number;
  defaultCountry?: string;
  variant?: "regular" | "transparent";
  showSearchInput?: boolean;
  submitType?: "code" | "phoneCode" | "merged" | "separated";
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  countries,
  placeholder = "0000-000000",
  onChange,
  id,
  disabled = false,
  success = false,
  hint,
  register,
  registerOptions,
  registerOptionsCountryCode,
  setValue,
  errors,
  className = "",
  preValue = "",
  preCountryCode = "",
  maxLength,
  defaultCountry = "GB",
  variant = "regular",
  showSearchInput = true,
  submitType = "code",
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>(defaultCountry);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const countryCodes: Record<string, string> = countries.reduce(
    (acc, { code, label }) => ({ ...acc, [code]: label }),
    {}
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showSearchInput && isDropdownOpen && !disabled) {
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          setSearchQuery((prev) => prev + event.key);
        } else if (event.key === "Backspace") {
          setSearchQuery((prev) => prev.slice(0, -1));
        } else if (event.key === "Escape") {
          setSearchQuery("");
          setIsDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    if (!showSearchInput) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (!showSearchInput) {
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [showSearchInput, isDropdownOpen, disabled]);

  useEffect(() => {
    if ((preValue || preCountryCode) && !isInitialized) {
      // Sort countries by label length (desc) to match longest prefix first (e.g. +1-684 before +1)
      const sortedCountries = [...countries].sort((a, b) => b.label.length - a.label.length);
      
      let countryToSet = selectedCountry;
      let numberToSet = preValue || "";

      // 1. Proactively search for prefix in preValue first (Highest priority)
      const cleanPreValue = (preValue || "").replace(/\s/g, "");
      const matchedCountry = sortedCountries.find((c) => 
        cleanPreValue.startsWith(c.label.replace(/[^\d+]/g, ""))
      );

      if (matchedCountry) {
        countryToSet = matchedCountry.code;
        const prefix = matchedCountry.label.replace(/[^\d+]/g, "");
        numberToSet = cleanPreValue.slice(prefix.length);
      } else if (registerOptionsCountryCode && preCountryCode) {
        // 2. Fallback to preCountryCode if provided
        const countryEntry = countries.find(
          (c) => (submitType === "phoneCode" ? c.label : c.code) === preCountryCode
        );
        if (countryEntry) {
          countryToSet = countryEntry.code;
        }
      }

      setSelectedCountry(countryToSet);
      setPhoneNumber(numberToSet.replace(/[^\d ]/g, ""));
      setIsInitialized(true);
    }
  }, [
    preValue,
    preCountryCode,
    isInitialized,
    countries,
    registerOptionsCountryCode,
    submitType,
  ]);

  useEffect(() => {
    if (!isInitialized && !phoneNumber) return;

    const dialCode = countryCodes[selectedCountry] || "";
    const cleanPrefix = dialCode.replace(/[^\d+]/g, "");
    const cleanNumber = phoneNumber.replace(/\s/g, "").replace(/[^\d]/g, "");
    
    const mergedValue = cleanNumber ? `${cleanPrefix}${cleanNumber}` : "";

    if (submitType === "separated") {
      // Flow for Booking and Signup: Separate fields
      setValue(registerOptions, cleanNumber, {
        shouldValidate: !!phoneNumber,
        shouldDirty: true,
        shouldTouch: true,
      });
      if (registerOptionsCountryCode) {
        setValue(registerOptionsCountryCode, dialCode, {
          shouldValidate: !!phoneNumber,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    } else {
      // Default / Merged: Single field with Prefix+Number
      setValue(registerOptions, mergedValue, {
        shouldValidate: !!phoneNumber,
        shouldDirty: true,
        shouldTouch: true,
      });

      if (registerOptionsCountryCode) {
        // Still set the ISO code if field provided, but primary is merged
        setValue(registerOptionsCountryCode, submitType === "phoneCode" ? dialCode : selectedCountry, {
          shouldValidate: !!phoneNumber,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    }

    if (onChange) {
      onChange(mergedValue);
    }
  }, [selectedCountry, phoneNumber, registerOptionsCountryCode, submitType, isInitialized]);

  useEffect(() => {
    if (isDropdownOpen && showSearchInput && searchInputRef.current) {
      searchInputRef.current.focus();
    } else if (!isDropdownOpen) {
      setSearchQuery("");
    }
  }, [isDropdownOpen, showSearchInput]);

  const handleCountrySelect = (code: string) => {
    setSelectedCountry(code);
    setIsDropdownOpen(false);
  };

  const sanitizePhoneInput = (value: string) => {
    return value.replace(/[^\d ]/g, "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    let sanitizedValue = sanitizePhoneInput(rawValue);

    if (maxLength && sanitizedValue.length > maxLength) {
      sanitizedValue = sanitizedValue.substring(0, maxLength);
    }
    setPhoneNumber(sanitizedValue);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const sanitizedPaste = sanitizePhoneInput(pastedText);

    const input = e.currentTarget;
    const cursorStart = input.selectionStart || 0;
    const cursorEnd = input.selectionEnd || cursorStart;
    const currentValue = phoneNumber;

    const beforeCursor = currentValue.substring(0, cursorStart);
    const afterCursor = currentValue.substring(cursorEnd);
    const newValue = beforeCursor + sanitizedPaste + afterCursor;

    let finalValue = newValue;
    if (maxLength && finalValue.length > maxLength) {
      finalValue = finalValue.substring(0, maxLength);
    }

    setPhoneNumber(finalValue);
  };

  let inputClasses = "";
  let selectClasses = "";

  if (variant === "transparent") {
    // Transparent variant styling
    inputClasses = `w-full bg-transparent text-white text-[20px] px-4 py-3 focus:outline-none placeholder-gray-500 caret-white ${className}`;
    selectClasses = `bg-transparent text-white text-[20px] px-4 py-3 focus:outline-none cursor-pointer`;

    if (disabled) {
      inputClasses += ` text-gray-500 opacity-40 cursor-not-allowed`;
      selectClasses += ` text-gray-500 opacity-40 cursor-not-allowed`;
    } else if (errors?.[registerOptions]) {
      inputClasses += ` focus:border-red-400`;
    } else if (success) {
      inputClasses += ` focus:border-green-400`;
    }
  } else {
    // Regular variant styling
    inputClasses = `mt-2 w-full h-10 text-[16px] md:text-sm rounded-lg p-3 bg-[#FFFFFF0D] border border-white/5 opacity-80 ${className}`;
    selectClasses = `mt-2 w-full h-10 text-[16px] md:text-sm rounded-lg p-3 bg-[#FFFFFF0D] border border-white/5 opacity-80 ${className}`;

    if (disabled) {
      inputClasses += ` opacity-40 bg-gray-800 cursor-not-allowed`;
    } else if (errors?.[registerOptions]) {
      inputClasses += ` border-error-500 focus:border-primary focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-primary`;
    } else if (success) {
      inputClasses += ` border-success-500 focus:border-primary focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-primary`;
    } else {
      inputClasses += `focus:border-zinc-700 dark:text-white/90`;
    }
  }

  const errorMessage = errors?.[registerOptions]?.message
    ? String(errors[registerOptions].message)
    : undefined;

  const { ref } = register(registerOptions, {
    pattern: {
      value: /^[+]?\d+$/,
      message: "Phone number can only contain digits",
    },
  });

  const filteredCountries = countries.filter((country) => {
    const query = searchQuery.toLowerCase();
    return (
      country.code.toLowerCase().includes(query) ||
      country.label.toLowerCase().includes(query)
    );
  });

  return (
    <div className="relative">
      {variant === "transparent" && (
        <style jsx>{`
          select.transparent-select {
            color: white;
            caret-color: white;
          }
          select.transparent-select option {
            background: #1a1a2e;
            color: white;
          }
          input.transparent-phone-input::placeholder {
            color: rgba(156, 163, 175, 0.6);
            font-weight: 300;
          }
          input.transparent-phone-input {
            caret-color: white;
          }
          input.transparent-phone-input::-webkit-input-placeholder {
            color: rgba(156, 163, 175, 0.6);
          }
          input.transparent-phone-input::-moz-placeholder {
            color: rgba(156, 163, 175, 0.6);
          }
          input.transparent-phone-input:-ms-input-placeholder {
            color: rgba(156, 163, 175, 0.6);
          }
          input.transparent-phone-input:-moz-placeholder {
            color: rgba(156, 163, 175, 0.6);
          }
        `}</style>
      )}

      <div
        className={`relative flex items-center gap-2 ${
          variant === "transparent"
            ? "rounded-2xl px-2"
            : "phone-input"
        }`}
      >
        {/* Country dropdown */}
        <div
          ref={dropdownRef}
          className={`relative flex items-center ${
            variant === "transparent" ? "bg-white/5 border-white/10 pr-2 rounded-2xl" : ""
          }`}
        >
          <button
            type="button"
            onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
            className={`${selectClasses} ${
              variant === "transparent" ? "transparent-select" : ""
            } flex items-center gap-2 whitespace-nowrap`}
            disabled={disabled}
          >
            <span>{countryCodes[selectedCountry]}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className={`absolute top-full left-0 mt-2 ${showSearchInput ? 'w-full min-w-[125px]' : 'w-30'} max-h-[300px] bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden`}>
              {/* Search Input - Only show if showSearchInput is true */}
              {showSearchInput && (
                <div className="sticky top-0 bg-[#1a1a2e] p-2 border-b border-white/10">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Country code"
                    className="w-full px-3 py-2 placeholder:text-[14px] text-[16px] md:text-sm rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/20"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              
              {/* Country List */}
              <div className="max-h-[240px] overflow-y-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country.code)}
                      className={`w-full text-left px-4 py-3 ${variant === "regular" ? "text-[14px] font-normal" : "text-sm"} hover:bg-white/5 transition-colors ${
                        selectedCountry === country.code ? "bg-white/10 text-white" : "text-gray-300"
                      }`}
                    >
                      <span className="mr-2 text-white/50">{country.code}</span>
                      <span className="text-white">{country.label}</span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">
                    No countries found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
     
        {/* Input field */}
        <input
          type="tel"
          id={id}
          ref={ref}
          value={phoneNumber}
          onChange={handleInputChange}
          onPaste={handlePaste}
          placeholder={placeholder}
          disabled={disabled}
          className={`${inputClasses} ${
            variant === "transparent"
              ? "transparent-phone-input flex-1"
              : ""
          }`}
          maxLength={16}
          onKeyDown={(e) => {
            const allowedKeys = [
              "0",
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              " ",
              "Backspace",
              "Delete",
              "ArrowLeft",
              "ArrowRight",
              "Tab",
            ];

            if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
              e.preventDefault();
            }
          }}
        />
      </div>

      {errorMessage && (
        <p
          className={`mt-1.5 text-xs ${
            variant === "transparent"
              ? "text-red-400 text-center"
              : "text-red-500"
          }`}
        >
          {errorMessage}
        </p>
      )}

      {hint && !errorMessage && (
        <p
          className={`mt-1.5 text-xs ${
            variant === "transparent" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default PhoneInput;
