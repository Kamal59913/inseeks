"use client";
import type React from "react";
import type { FC } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useEffect, useRef, useState } from "react";

interface InputProps {
  type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  min?: string;
  max?: string;
  step?: number;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  register: UseFormRegister<any>;
  registerOptions: string;
  errors?: FieldErrors;
  doesExist?: boolean;
  noOfSpaceAllowed?: number;
  isSpaceAtStart?: boolean;
  isSpaceAtEnd?: boolean;
  variant?: "regular" | "transparent";
  maxLength?: number;
  autoFocus?: boolean;
  errorSingleMessage?: string;
  textAlignment?: "text-center" | "text-left" | "text-right";
}

const Input: FC<InputProps> = ({
  type = "text",
  id,
  placeholder,
  value,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  register,
  registerOptions,
  errors,
  noOfSpaceAllowed = 1,
  isSpaceAtStart = false,
  isSpaceAtEnd = true,
  variant = "regular",
  maxLength,
  autoFocus = false,
  errorSingleMessage = "",
  textAlignment = "text-center"
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  let inputClasses = "";

  if (variant === "transparent") {
    // Transparent variant styling
    inputClasses = `w-full ${textAlignment} bg-transparent text-white text-[20px] px-0 py-3 focus:outline-none placeholder-gray-500 caret-white ${className}`;

    if (disabled) {
      inputClasses += ` text-gray-500 opacity-40 cursor-not-allowed`;
    } else if (error || errors?.[registerOptions]) {
      inputClasses += ` focus:border-red-400`;
    } else if (success) {
      inputClasses += ` focus:border-green-400`;
    } else {
      inputClasses += ` focus:border-white`;
    }
  } else {
    // Regular variant styling (existing)
    inputClasses = `w-full h-10 text-[16px] md:text-sm rounded-lg p-3 bg-[#FFFFFF0D] border border-white/5 opacity-80 ${className}`;

    if (disabled) {
      inputClasses += `text-gray-500 cursor-not-allowed bg-[#FFFFFF0D]`;
    } else if (error || errors?.[registerOptions]) {
      inputClasses += ` border-error-500 focus:border-primary focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-primary`;
    } else {
      inputClasses += ` border-success-500 focus:border-primary focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-primary`;
    }
  }

  const cleanInputValue = (inputValue: string): string => {
    let cleanedValue = inputValue;

    if (noOfSpaceAllowed === 0) {
      cleanedValue = cleanedValue.replace(/\s/g, "");
    } else if (noOfSpaceAllowed > 0) {
      const spacePattern = new RegExp(`\\s{${noOfSpaceAllowed + 1},}`, "g");
      const replacementSpaces = " ".repeat(noOfSpaceAllowed);
      cleanedValue = cleanedValue.replace(spacePattern, replacementSpaces);
    }

    if (!isSpaceAtStart) {
      cleanedValue = cleanedValue.replace(/^\s+/, "");
    }

    if (!isSpaceAtEnd) {
      cleanedValue = cleanedValue.replace(/\s+$/, "");
    }

    return cleanedValue;
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursorPosition = input.selectionStart || 0;
    const originalValue = input.value;
    let cleanedValue = cleanInputValue(originalValue);

    // ✅ Enforce maxLength after cleaning
    if (maxLength && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.substring(0, maxLength);
    }

    if (originalValue !== cleanedValue) {
      const beforeCursor = originalValue.substring(0, cursorPosition);
      const cleanedBeforeCursor = cleanInputValue(beforeCursor);
      const removedBeforeCursor =
        beforeCursor.length - cleanedBeforeCursor.length;

      let newCursorPosition = Math.max(0, cursorPosition - removedBeforeCursor);

      // ✅ Don't let cursor go beyond maxLength
      if (maxLength && newCursorPosition > maxLength) {
        newCursorPosition = maxLength;
      }

      input.value = cleanedValue;
      input.setSelectionRange(newCursorPosition, newCursorPosition);

      const event = new Event("input", { bubbles: true });
      input.dispatchEvent(event);
    }
  };

  const registerProps = register(registerOptions);

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

    let cleanedValue = cleanInputValue(newValue);

    // ✅ Enforce maxLength after cleaning
    if (maxLength && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.substring(0, maxLength);
    }

    const cleanedPastedText = cleanInputValue(pastedText);
    const cleanedBeforeCursor = cleanInputValue(beforeCursor);
    let newCursorPosition =
      cleanedBeforeCursor.length + cleanedPastedText.length;

    // ✅ Adjust cursor position if we truncated due to maxLength
    if (maxLength && newCursorPosition > maxLength) {
      newCursorPosition = maxLength;
    }

    input.value = cleanedValue;
    input.setSelectionRange(newCursorPosition, newCursorPosition);

    // Trigger React Hook Form's onChange directly
    if (registerProps.onChange) {
      registerProps.onChange({
        target: input,
        currentTarget: input,
        type: "change",
      } as any);
    }
  };

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const handleAutoFill = () => {
      const cleanedValue = cleanInputValue(input.value);
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
  }, [noOfSpaceAllowed, isSpaceAtStart, isSpaceAtEnd]);

  const errorMessage = errors?.[registerOptions]?.message
    ? String(errors[registerOptions].message)
    : undefined;

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
        {...registerProps}
        ref={(e) => {
          registerProps.ref(e);
          inputRef.current = e;
        }}
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`${inputClasses} ${
          variant === "transparent" ? "transparent-input" : ""
        }`}
        onInput={handleInput}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus={autoFocus}
        {...(maxLength ? { maxLength } : {})}
      />

      {errorMessage && (
        <p
          className={`mt-1.5 text-xs  ${
            variant === "transparent"
              ? `text-red-400 ${textAlignment}`
              : "text-red-500"
          }`}
        >
          {errorMessage}
        </p>
      )}

      {errorSingleMessage && (
        <p
          className={`mt-1.5 text-xs ${
            variant === "transparent"
              ? `text-red-400 ${textAlignment}`
              : "text-red-500"
          }`}
        >
          {errorSingleMessage}
        </p>
      )}
    </div>
  );
};

export default Input;

