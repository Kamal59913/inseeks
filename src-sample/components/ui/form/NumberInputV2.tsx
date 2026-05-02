"use client";
import type React from "react";
import type { FC } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useEffect, useRef } from "react";

interface NumberInputProps {
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
  allowPlus?: boolean; // Allow + at the start for international numbers
  allowDecimal?: boolean; // Allow decimal points for float numbers
  allowNegative?: boolean; // Allow negative numbers
  variant?: "regular" | "transparent";
  maxLength?: number;
    autoFocus?: boolean;
  textAlignment?: "text-center" | "text-left" | "text-right";


}

const NumberInputV2: FC<NumberInputProps> = ({
  id,
  placeholder = "Enter number",
  value,
  className = "",
  min,
  max,
  disabled = false,
  success = false,
  error = false,
  hint,
  onChange: propsOnChange,
  register,
  registerOptions,
  errors,
  allowPlus = false,
  allowDecimal = false,
  allowNegative = false,
  variant = "regular",
  autoFocus = false,

  maxLength,
    textAlignment = "text-center"

}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Helper to get nested error
  const getNestedError = (errors: FieldErrors | undefined, path: string) => {
    if (!errors) return undefined;
    return path.split('.').reduce((obj: any, key) => obj && obj[key], errors);
  };

  const fieldError = getNestedError(errors, registerOptions);
  const errorMessage = fieldError?.message as string | undefined;

  let inputClasses = "";

  if (variant === "transparent") {
    // Transparent variant styling
    inputClasses = `w-full ${textAlignment} bg-transparent text-white text-[20px] px-0 py-3 focus:outline-none placeholder-gray-500 caret-white ${className}`;

    if (disabled) {
      inputClasses += ` text-gray-500 opacity-40 cursor-not-allowed`;
    } else if (error || fieldError) {
      inputClasses += ` focus:border-red-400`;
    } else if (success) {
      inputClasses += ` focus:border-green-400`;
    } else {
      inputClasses += ` focus:border-white`;
    }
  } else {
    // Regular variant styling
    inputClasses = `mt-2 w-full text-[16px] md:text-sm rounded-lg p-3 bg-[#FFFFFF0D] border border-white/5 opacity-80 ${className}`;
    if (disabled) {
      inputClasses += ` opacity-40 bg-gray-800 cursor-not-allowed`;
    } else if (error || fieldError) {
      inputClasses += ` border-error-500 focus:border-primary focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-primary`;
    } else if (success) {
      inputClasses += ` border-success-500 focus:border-primary focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-primary`;
    } else {
      inputClasses += ` bg-transparent text-gray-800 border-gray-300 focus:border-primary focus:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus:border-primary`;
    }
  }

  // Function to clean the input value based on number rules
  const cleanNumberValue = (inputValue: string): string => {
    let cleanedValue = inputValue;

    // Handle + sign (only at the start if allowed)
    if (allowPlus) {
      // Remove + from anywhere except the start
      if (cleanedValue.includes("+")) {
        const hasLeadingPlus = cleanedValue.startsWith("+");
        cleanedValue = cleanedValue.replace(/\+/g, "");
        if (hasLeadingPlus) {
          cleanedValue = "+" + cleanedValue;
        }
      }
    } else {
      // Remove all + signs if not allowed
      cleanedValue = cleanedValue.replace(/\+/g, "");
    }

    // Handle negative sign (only at the start if allowed)
    if (allowNegative) {
      // Remove - from anywhere except the start
      if (cleanedValue.includes("-")) {
        const hasLeadingMinus =
          cleanedValue.startsWith("-") ||
          (allowPlus && cleanedValue.startsWith("+-"));
        cleanedValue = cleanedValue.replace(/-/g, "");
        if (hasLeadingMinus) {
          if (cleanedValue.startsWith("+")) {
            cleanedValue = "+" + "-" + cleanedValue.slice(1);
          } else {
            cleanedValue = "-" + cleanedValue;
          }
        }
      }
    } else {
      // Remove all - signs if not allowed
      cleanedValue = cleanedValue.replace(/-/g, "");
    }

    // Handle decimal point (only one allowed if enabled)
    if (allowDecimal) {
      const decimalParts = cleanedValue.split(".");
      if (decimalParts.length > 2) {
        // Keep only the first decimal point
        cleanedValue = decimalParts[0] + "." + decimalParts.slice(1).join("");
      }
    } else {
      // Remove all decimal points if not allowed
      cleanedValue = cleanedValue.replace(/\./g, "");
    }

    // Remove all non-numeric characters except allowed ones
    let allowedChars = "0-9";
    if (allowPlus) allowedChars += "\\+";
    if (allowNegative) allowedChars += "-";
    if (allowDecimal) allowedChars += "\\.";

    const regex = new RegExp(`[^${allowedChars}]`, "g");
    cleanedValue = cleanedValue.replace(regex, "");

    return cleanedValue;
  };

  const { onChange: rhfOnChange, ...restRegisterProps } = register(registerOptions);

  // Handle input changes (typing)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    // Store original cursor/value state
    const cursorPosition = input.selectionStart || 0;
    const originalValue = input.value;
    
    // Clean the value
    let cleanedValue = cleanNumberValue(originalValue);

    // Enforce maxLength
    if (maxLength && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.substring(0, maxLength);
    }

    // If cleaning changed the value, update input and cursor
    if (originalValue !== cleanedValue) {
      const beforeCursor = originalValue.substring(0, cursorPosition);
      const cleanedBeforeCursor = cleanNumberValue(beforeCursor);
      const removedBeforeCursor = beforeCursor.length - cleanedBeforeCursor.length;
      
      let newCursorPosition = Math.max(0, cursorPosition - removedBeforeCursor);
      
      if (maxLength && newCursorPosition > maxLength) {
        newCursorPosition = maxLength;
      }

      input.value = cleanedValue;
      
      // We need to set selection range, but in React onChange this can be tricky because
      // React might reset it on re-render. Usually safe to set it here though.
      // Use requestAnimationFrame or timeout if cursor jumps, but direct set often works.
      input.setSelectionRange(newCursorPosition, newCursorPosition);
    }

    // Forward to RHF
    rhfOnChange(e);
    
    // Forward to external onChange if provided
    if (propsOnChange) {
      propsOnChange(e);
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

    let cleanedValue = cleanNumberValue(newValue);

    if (maxLength && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.substring(0, maxLength);
    }

    const cleanedPastedText = cleanNumberValue(pastedText);
    const cleanedBeforeCursor = cleanNumberValue(beforeCursor);
    let newCursorPosition =
      cleanedBeforeCursor.length + cleanedPastedText.length;

    if (maxLength && newCursorPosition > maxLength) {
      newCursorPosition = maxLength;
    }

    input.value = cleanedValue;
    input.setSelectionRange(newCursorPosition, newCursorPosition);

    // Trigger RHF change with a synthetic event
    // We create a synthetic-like object or triggering event is hard.
    // Easiest is to call rhfOnChange with a mock event
    // or dispatch 'input' event if RHF listens to it (it listens to onChange prop).
    
    // Call the destructured rhfOnChange directly
    rhfOnChange({
      target: input,
      currentTarget: input,
       type: "change",
      bubbles: true, 
    } as any);
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
    const cursorPosition = input.selectionStart || 0;
    const currentValue = input.value;

    // Allow + only if it's at the start and allowPlus is true
    if (
      e.key === "+" &&
      allowPlus &&
      cursorPosition === 0 &&
      !currentValue.includes("+")
    ) {
      return;
    }

    // Allow - only if it's at the start and allowNegative is true
    if (
      e.key === "-" &&
      allowNegative &&
      cursorPosition === 0 &&
      !currentValue.includes("-")
    ) {
      return;
    }

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
      const cleanedValue = cleanNumberValue(input.value);
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
  }, [allowPlus, allowDecimal, allowNegative]);


  return (
    <div className="relative">
      {variant === "transparent" && (
        <style jsx>{`
          input.transparent-input::placeholder {
            color: rgba(156, 163, 175, 0.6);
            font-weight: 300;
          }
          input.transparent-input {
            caret-color: white;
          }
          input.transparent-input::-webkit-input-placeholder {
            color: rgba(156, 163, 175, 0.6);
          }
          input.transparent-input::-moz-placeholder {
            color: rgba(156, 163, 175, 0.6);
          }
          input.transparent-input:-ms-input-placeholder {
            color: rgba(156, 163, 175, 0.6);
          }
          input.transparent-input:-moz-placeholder {
            color: rgba(156, 163, 175, 0.6);
          }
        `}</style>
      )}
      <input
        {...restRegisterProps}
        ref={(e) => {
          restRegisterProps.ref(e);
          inputRef.current = e;
        }}
        type="text"
        id={id}
        placeholder={placeholder}
        value={value}
        min={min}
        max={max}
        disabled={disabled}
        className={`${inputClasses} ${
          variant === "transparent" ? "transparent-input" : ""
        }`}
        onChange={handleChange}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        {...(maxLength ? { maxLength } : {})}
      />

      {errorMessage && (
        <p
          className={`mt-1.5 text-xs ${
            variant === "transparent"
              ? `text-red-400 ${textAlignment}`
              : "text-red-500"
          }`}
        >
          {errorMessage}
        </p>
      )}

      {hint && !errorMessage && (
        <p className="mt-1.5 text-xs text-gray-500">{hint}</p>
      )}
    </div>
  );
};

export default NumberInputV2;

