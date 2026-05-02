import type { FC } from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { useState } from "react";

interface EmailInputProps {
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
  variant?: "regular" | "transparent";
  maxLength?: number;
  autoFocus?: boolean;
}

const EmailInput: FC<EmailInputProps> = ({
  type = "email",
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
  variant = "regular",
  maxLength,
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  let inputClasses = "";

  if (variant === "transparent") {
    // Transparent variant styling
    inputClasses = `w-full bg-transparent text-white text-[20px] px-0 py-3 focus:outline-none placeholder-gray-500 caret-white text-center ${className}`;

    if (disabled) {
      inputClasses += ` text-gray-500 opacity-40 cursor-not-allowed`;
    } else if (error || errors?.[registerOptions]) {
      inputClasses += ` focus:border-red-400`;
    } else if (success) {
      inputClasses += `focus:border-green-400`;
    } else {
      inputClasses += `focus:border-white`;
    }
  } else {
    // Regular variant styling (existing)
    inputClasses = `mt-2 w-full h-10 text-[16px] md:text-sm rounded-lg p-3 bg-[#FFFFFF0D] border border-white/5 opacity-80 ${className}`;

    if (disabled) {
      inputClasses += ` text-gray-500 border-gray-300 opacity-40 bg-gray-100 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 opacity-40`;
    } else if (error || errors?.[registerOptions]) {
      inputClasses += ` border-error-500 focus:border-primary focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-primary`;
    } else {
      inputClasses += ` border-success-500 focus:border-primary focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-primary`;
    }
  }

  // Email-specific registration
  const emailRegister = register(registerOptions, {
    setValueAs: (value: unknown) =>
      typeof value === "string" ? value.replace(/\s+/g, "").trim() : value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      const cursorPos = e.target.selectionStart;
      const newValue = e.target.value.replace(/\s/g, "");
      if (e.target.value !== newValue) {
        e.target.value = newValue;
        e.target.setSelectionRange(cursorPos, cursorPos);
      }
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.value = e.target.value.trim();
      setIsFocused(false);
    },
  });

  const errorMessage = errors?.[registerOptions]?.message as string | undefined;

  // Add these handlers before the return statement

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursorPosition = input.selectionStart || 0;
    const originalValue = input.value;

    // Remove all spaces
    let cleanedValue = originalValue.replace(/\s/g, "");

    // ✅ Enforce maxLength after cleaning
    if (maxLength && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.substring(0, maxLength);
    }

    if (originalValue !== cleanedValue) {
      const beforeCursor = originalValue.substring(0, cursorPosition);
      const cleanedBeforeCursor = beforeCursor.replace(/\s/g, "");
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

    // Remove all spaces
    let cleanedValue = newValue.replace(/\s/g, "");

    // ✅ Enforce maxLength after cleaning
    if (maxLength && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.substring(0, maxLength);
    }

    const cleanedPastedText = pastedText.replace(/\s/g, "");
    const cleanedBeforeCursor = beforeCursor.replace(/\s/g, "");
    let newCursorPosition =
      cleanedBeforeCursor.length + cleanedPastedText.length;

    // ✅ Adjust cursor position if we truncated due to maxLength
    if (maxLength && newCursorPosition > maxLength) {
      newCursorPosition = maxLength;
    }

    input.value = cleanedValue;
    input.setSelectionRange(newCursorPosition, newCursorPosition);

    // ✅ Trigger React Hook Form's onChange
    if (emailRegister.onChange) {
      emailRegister.onChange({
        target: input,
        currentTarget: input,
        type: "change",
      } as any);
    }
  };

  return (
    <div className="relative">
      {variant === "transparent" && (
        <style jsx>{`
          input.transparent-email::placeholder {
            color: rgba(156, 163, 175, 0.6);
            font-weight: 300;
          }
          input.transparent-email {
            caret-color: white;
          }
          input.transparent-email::-webkit-input-placeholder {
            color: rgba(156, 163, 175, 0.6);
          }
          input.transparent-email::-moz-placeholder {
            color: rgba(156, 163, 175, 0.6);
          }
          input.transparent-email:-ms-input-placeholder {
            color: rgba(156, 163, 175, 0.6);
          }
          input.transparent-email:-moz-placeholder {
            color: rgba(156, 163, 175, 0.6);
          }
        `}</style>
      )}

      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`${inputClasses} ${
          variant === "transparent" ? "transparent-email" : ""
        }`}
        onFocus={() => setIsFocused(true)}
        onInput={handleInput} // ✅ Add this
        onPaste={handlePaste} // ✅ Add this
        {...emailRegister}
        {...(maxLength ? { maxLength } : {})}
        autoFocus={autoFocus}
      />

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

export default EmailInput;

