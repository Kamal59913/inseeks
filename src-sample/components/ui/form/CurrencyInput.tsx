"use client";
import type React from "react";
import type { FC } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useEffect, useRef, useState } from "react";

interface CurrencyInputProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  register: UseFormRegister<any>;
  registerOptions: string;
  errors?: FieldErrors;
  currency?: string; // Currency symbol (default: $)
  allowDecimal?: boolean; // Allow decimal points for currency
  maxLength?: number;
  autoFocus?: boolean;
  errorSingleMessage?: string;
}

const CurrencyInput: FC<CurrencyInputProps> = ({
  id,
  placeholder = "0",
  value,
  className = "",
  min,
  max,
  disabled = false,
  success = false,
  error = false,
  hint,
  register,
  registerOptions,
  errors,
  currency = "£",
  allowDecimal = true,
  maxLength,
  autoFocus = false,
  errorSingleMessage = "",
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  let containerClasses = `flex rounded-lg border transition-all`;
  let currencyClasses = `flex items-center px-3 py-2.5 text-sm bg-[#FFFFFF0D] border border-white/5 opacity-80 rounded-l-lg dark:text-white/90`;
  let inputClasses = `h-11 w-full bg-[#FFFFFF0D] rounded-r-lg  appearance-none pr-4 py-2.5 text-[16px] md:text-sm placeholder:text-gray-400 focus:outline-none dark:text-white/90 dark:placeholder:text-white/30 border-0 ${className}`;

  if (disabled) {
    containerClasses += `opacity-40 cursor-not-allowed`;
    inputClasses += ` text-gray-500 bg-[#FFFFFF0D] cursor-not-allowed`;
  } else if (error || errors?.[registerOptions]) {
    containerClasses += ` border-error-500 dark:border-error-500`;
    inputClasses += ` dark:text-error-400`;
    if (isFocused) containerClasses += `ring-error-500/20`;
  } else if (success) {
    containerClasses += ` border-success-500 dark:border-success-500`;
    inputClasses += ` dark:text-success-400`;
    if (isFocused) containerClasses += `ring-success-500/20`;
  } else {
    containerClasses += ``;
    inputClasses += `text-gray-800 dark:text-white/90`;
    if (isFocused)
      containerClasses += `border-primary ring-brand-500/20 dark:border-primary`;
  }

  // Function to clean the input value for currency format
  const cleanCurrencyValue = (inputValue: string): string => {
    let cleanedValue = inputValue;

    // Handle decimal point (only one allowed if enabled)
    if (allowDecimal) {
      const decimalParts = cleanedValue.split(".");
      if (decimalParts.length > 2) {
        // Keep only the first decimal point
        cleanedValue = decimalParts[0] + "." + decimalParts.slice(1).join("");
      }
      // Limit decimal places to 2
      if (decimalParts.length === 2 && decimalParts[1].length > 2) {
        cleanedValue = decimalParts[0] + "." + decimalParts[1].slice(0, 2);
      }
    } else {
      // Remove all decimal points if not allowed
      cleanedValue = cleanedValue.replace(/\./g, "");
    }

    // Remove all non-numeric characters except decimal point
    let allowedChars = "0-9";
    if (allowDecimal) allowedChars += "\\.";

    const regex = new RegExp(`[^${allowedChars}]`, "g");
    cleanedValue = cleanedValue.replace(regex, "");

    return cleanedValue;
  };

  // Handle input events (typing, pasting, etc.)
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursorPosition = input.selectionStart || 0;
    const originalValue = input.value;
    let cleanedValue = cleanCurrencyValue(originalValue);

    // ✅ Enforce maxLength after cleaning
    if (maxLength && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.substring(0, maxLength);
    }

    if (originalValue !== cleanedValue) {
      // Calculate how many characters were removed before the cursor
      const beforeCursor = originalValue.substring(0, cursorPosition);
      const cleanedBeforeCursor = cleanCurrencyValue(beforeCursor);
      const removedBeforeCursor =
        beforeCursor.length - cleanedBeforeCursor.length;

      // New cursor position should account for removed characters
      let newCursorPosition = Math.max(0, cursorPosition - removedBeforeCursor);

      // ✅ Don't let cursor go beyond maxLength
      if (maxLength && newCursorPosition > maxLength) {
        newCursorPosition = maxLength;
      }

      // Update the input value
      input.value = cleanedValue;

      // Restore cursor position
      input.setSelectionRange(newCursorPosition, newCursorPosition);

      // Trigger change event for form validation
      const event = new Event("input", { bubbles: true });
      input.dispatchEvent(event);
    }
  };
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const input = e.currentTarget;
    const pastedText = e.clipboardData.getData("text");
    const cursorStart = input.selectionStart || 0;
    const cursorEnd = input.selectionEnd || cursorStart;
    const currentValue = input.value;

    const beforeCursor = currentValue.substring(0, cursorStart);
    const afterCursor = currentValue.substring(cursorEnd);
    const newValue = beforeCursor + pastedText + afterCursor;

    let cleanedValue = cleanCurrencyValue(newValue);

    // ✅ Enforce maxLength after cleaning
    if (maxLength && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.substring(0, maxLength);
    }

    const cleanedPastedText = cleanCurrencyValue(pastedText);
    const cleanedBeforeCursor = cleanCurrencyValue(beforeCursor);
    let newCursorPosition =
      cleanedBeforeCursor.length + cleanedPastedText.length;

    // ✅ Adjust cursor position if we truncated due to maxLength
    if (maxLength && newCursorPosition > maxLength) {
      newCursorPosition = maxLength;
    }

    input.value = cleanedValue;
    input.setSelectionRange(newCursorPosition, newCursorPosition);

    // ✅ Trigger React Hook Form's onChange directly
    if (registerProps.onChange) {
      registerProps.onChange({
        target: input,
        currentTarget: input,
        type: "change",
      } as any);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, arrow keys
    if (
      [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(e.key)
    ) {
      return;
    }

    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey && ["a", "c", "v", "x"].includes(e.key.toLowerCase())) {
      return;
    }

    const input = e.currentTarget;
    const currentValue = input.value;

    // Allow decimal point only if allowDecimal is true and there's no existing decimal
    if (e.key === "." && allowDecimal && !currentValue.includes(".")) {
      return;
    }

    // Allow numeric keys
    if (/[0-9]/.test(e.key)) {
      return;
    }

    // Block all other keys
    e.preventDefault();
  };

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleAutoFill = () => {
      const cleanedValue = cleanCurrencyValue(input.value);
      if (input.value !== cleanedValue) {
        input.value = cleanedValue;
        const event = new Event("input", { bubbles: true });
        input.dispatchEvent(event);
      }
    };

    const interval = setInterval(handleAutoFill, 100);
    input.addEventListener("animationstart", handleAutoFill);

    return () => {
      clearInterval(interval);
      input.removeEventListener("animationstart", handleAutoFill);
    };
  }, [allowDecimal]);

  const errorMessage = errors?.[registerOptions]?.message
    ? String(errors[registerOptions].message)
    : undefined;

  const registerProps = register(registerOptions);

  return (
    <div className="relative">
      <div className={containerClasses}>
        <span className={currencyClasses}>{currency}</span>
        <input
          {...registerProps}
          ref={(e) => {
            registerProps.ref(e);
            inputRef.current = e;
          }}
          type="text"
          id={id}
          placeholder={placeholder}
          value={value}
          min={min}
          max={max}
          disabled={disabled}
          className={inputClasses}
          onInput={handleInput}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoFocus={autoFocus}
          {...(maxLength ? { maxLength } : {})}
        />
      </div>

      {errorMessage && (
        <p className="mt-1.5 text-xs text-red-500">{errorMessage}</p>
      )}

      {errorSingleMessage && (
        <p className="mt-1.5 text-xs text-red-500">{errorSingleMessage}</p>
      )}
    </div>
  );
};

export default CurrencyInput;

