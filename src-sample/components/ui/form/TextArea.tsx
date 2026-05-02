"use client";
import type React from "react";
import type { FC } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useEffect, useRef, useState } from "react";

interface TextareaProps {
  placeholder?: string;
  rows?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  register: UseFormRegister<any>;
  registerOptions: string;
  errors?: FieldErrors;
  noOfSpaceAllowed?: number;
  isSpaceAtStart?: boolean;
  isSpaceAtEnd?: boolean;
  variant?: "regular" | "transparent";
  maxLength?: number;
  autoFocus?: boolean;
}

const TextArea: FC<TextareaProps> = ({
  placeholder = "Enter your message",
  rows = 3,
  value,
  className = "",
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
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  let textareaClasses = "";

  if (variant === "transparent") {
    // Transparent variant styling
    textareaClasses = `w-full text-center bg-transparent text-white text-[20px] px-0 py-3 focus:outline-none placeholder-gray-500 caret-white resize-none ${className}`;

    if (disabled) {
      textareaClasses += ` text-gray-500 opacity-40 cursor-not-allowed`;
    } else if (error || errors?.[registerOptions]) {
      textareaClasses += ` focus:border-red-400`;
    } else if (success) {
      textareaClasses += ` focus:border-green-400`;
    } else {
      textareaClasses += ` focus:border-white`;
    }
  } else {
    // Regular variant styling
    textareaClasses = `mt-2 w-full text-[16px] md:text-sm rounded-lg p-3 bg-[#FFFFFF0D] border border-white/5 opacity-80 ${className}`;
    if (disabled) {
      textareaClasses += ` opacity-40 bg-gray-800 cursor-not-allowed`;
    } else if (error || errors?.[registerOptions]) {
      textareaClasses += ` border-error-500 focus:border-primary focus:ring-error-500/20 dark:text-error-400 dark:border-error-500 dark:focus:border-primary`;
    } else {
      textareaClasses += ` border-success-500 focus:border-primary focus:ring-success-500/20 dark:text-success-400 dark:border-success-500 dark:focus:border-primary`;
    }
  }

  const cleanTextareaValue = (inputValue: string): string => {
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

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const cursorPosition = textarea.selectionStart || 0;
    const originalValue = textarea.value;
    let cleanedValue = cleanTextareaValue(originalValue);

    // ✅ Enforce maxLength after cleaning
    if (maxLength && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.substring(0, maxLength);
    }

    if (originalValue !== cleanedValue) {
      const beforeCursor = originalValue.substring(0, cursorPosition);
      const cleanedBeforeCursor = cleanTextareaValue(beforeCursor);
      const removedBeforeCursor =
        beforeCursor.length - cleanedBeforeCursor.length;

      let newCursorPosition = Math.max(0, cursorPosition - removedBeforeCursor);

      // ✅ Don't let cursor go beyond maxLength
      if (maxLength && newCursorPosition > maxLength) {
        newCursorPosition = maxLength;
      }

      textarea.value = cleanedValue;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);

      const event = new Event("input", { bubbles: true });
      textarea.dispatchEvent(event);
    }
  };

  const registerProps = register(registerOptions);

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const textarea = e.currentTarget;
    const pastedText = e.clipboardData.getData("text");
    const cursorStart = textarea.selectionStart || 0;
    const cursorEnd = textarea.selectionEnd || cursorStart;
    const currentValue = textarea.value;

    const beforeCursor = currentValue.substring(0, cursorStart);
    const afterCursor = currentValue.substring(cursorEnd);
    const newValue = beforeCursor + pastedText + afterCursor;

    let cleanedValue = cleanTextareaValue(newValue);

    // ✅ Enforce maxLength after cleaning
    if (maxLength && cleanedValue.length > maxLength) {
      cleanedValue = cleanedValue.substring(0, maxLength);
    }

    const cleanedPastedText = cleanTextareaValue(pastedText);
    const cleanedBeforeCursor = cleanTextareaValue(beforeCursor);
    let newCursorPosition =
      cleanedBeforeCursor.length + cleanedPastedText.length;

    // ✅ Adjust cursor position if we truncated due to maxLength
    if (maxLength && newCursorPosition > maxLength) {
      newCursorPosition = maxLength;
    }

    textarea.value = cleanedValue;
    textarea.setSelectionRange(newCursorPosition, newCursorPosition);

    if (registerProps.onChange) {
      registerProps.onChange({
        target: textarea,
        currentTarget: textarea,
        type: "change",
      } as any);
    }
  };
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const handleAutoFill = () => {
      const cleanedValue = cleanTextareaValue(textarea.value);
      if (textarea.value !== cleanedValue) {
        textarea.value = cleanedValue;
        const event = new Event("input", { bubbles: true });
        textarea.dispatchEvent(event);
      }
    };

    const interval = setInterval(handleAutoFill, 100);

    textarea.addEventListener("animationstart", handleAutoFill);

    return () => {
      clearInterval(interval);
      textarea.removeEventListener("animationstart", handleAutoFill);
    };
  }, [noOfSpaceAllowed, isSpaceAtStart, isSpaceAtEnd]);

  const errorMessage = errors?.[registerOptions]?.message
    ? String(errors[registerOptions].message)
    : undefined;

  return (
    <div className="relative">
      {variant === "transparent" && (
        <style jsx>{`
          textarea.transparent-textarea::placeholder {
            color: rgba(156, 163, 175, 0.6);
            font-weight: 300;
          }
          textarea.transparent-textarea {
            caret-color: white;
          }
          textarea.transparent-textarea::-webkit-input-placeholder {
            color: rgba(156, 163, 175, 0.6);
          }
          textarea.transparent-textarea::-moz-placeholder {
            color: rgba(156, 163, 175, 0.6);
          }
          textarea.transparent-textarea:-ms-input-placeholder {
            color: rgba(156, 163, 175, 0.6);
          }
          textarea.transparent-textarea:-moz-placeholder {
            color: rgba(156, 163, 175, 0.6);
          }
        `}</style>
      )}

      <textarea
        {...registerProps}
        ref={(e) => {
          registerProps.ref(e);
          textareaRef.current = e;
        }}
        placeholder={placeholder}
        rows={rows}
        value={value}
        disabled={disabled}
        className={`${textareaClasses} ${
          variant === "transparent" ? "transparent-textarea" : ""
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

export default TextArea;

