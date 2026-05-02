"use client";
import type React from "react";
import type { FC } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useRef } from "react";
import { Clock } from "lucide-react";

interface DurationInputProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  register?: UseFormRegister<any>;
  registerOptions: string;
  errors?: FieldErrors;
  variant?: "regular" | "transparent";
  autoFocus?: boolean;
  errorSingleMessage?: string;
  useNativePicker?: boolean;
  use24HourFormat?: boolean; // 🔥 NEW PROP
}

const DurationInput: FC<DurationInputProps> = ({
  id,
  placeholder = "00:00",
  value,
  className = "",
  disabled = false,
  success = false,
  error = false,
  hint,
  register,
  registerOptions,
  errors,
  variant = "regular",
  autoFocus = false,
  errorSingleMessage = "",
  useNativePicker = true,
  use24HourFormat = true, // 🔥 DEFAULT TO 24-HOUR
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const displayValue = value ?? "";

  const formatTime = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;

    const h = Math.min(23, parseInt(digits.slice(0, 2)));
    const m = Math.min(59, parseInt(digits.slice(2, 4)));

    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const registerProps = register ? register(registerOptions) : ({} as any);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (useNativePicker) {
      if (onChange) {
        onChange(e);
      } else if (registerProps.onChange) {
        registerProps.onChange(e);
      }
      return;
    }

    const input = e.currentTarget;
    const cursor = input.selectionStart || 0;
    const prevValue = input.value;

    const formatted = formatTime(prevValue);

    const newEvent = {
      ...e,
      target: { ...e.target, value: formatted },
    };

    if (onChange) {
      onChange(newEvent as any);
    } else if (registerProps.onChange) {
      registerProps.onChange(newEvent);
    }

    setTimeout(() => {
      const isColonInserted = formatted.length === 5 && prevValue.length === 4;

      input.setSelectionRange(
        isColonInserted && cursor === 2 ? 3 : cursor,
        isColonInserted && cursor === 2 ? 3 : cursor
      );
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (useNativePicker) return;

    const key = e.key;
    const input = e.currentTarget;

    if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(key))
      return;

    if (!/^\d$/.test(key)) {
      e.preventDefault();
      return;
    }

    const digits = input.value.replace(/\D/g, "");

    if (digits.length >= 4 && input.selectionStart === input.selectionEnd) {
      e.preventDefault();
    }
  };

  let inputClasses = "";

  if (variant === "transparent") {
    inputClasses = `w-full text-center bg-transparent text-white text-[20px] px-0 py-3 focus:outline-none placeholder-gray-500 caret-white ${className}`;
    if (disabled) inputClasses += ` opacity-40 cursor-not-allowed`;
  } else {
    inputClasses = `w-full text-[16px] md:text-sm rounded-lg p-3 bg-[#FFFFFF0D] border border-white/5 opacity-80 ${className}`;
    if (disabled) inputClasses += ` opacity-40 bg-gray-800 cursor-not-allowed`;
  }

  const errorMessage = errors?.[registerOptions]?.message
    ? String(errors[registerOptions].message)
    : undefined;

  return (
    <div className="relative">
      <input
        {...registerProps}
        ref={(e) => {
          if (registerProps.ref) {
            registerProps.ref(e);
          }
          inputRef.current = e;
        }}
        type={useNativePicker ? "time" : "text"}
        id={id}
        placeholder={placeholder}
        value={displayValue}
        disabled={disabled}
        className={`${inputClasses}`}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoFocus={autoFocus}
        maxLength={5}
        // 🔥 FORCE 24-HOUR FORMAT
        step={use24HourFormat ? 60 : undefined}
      />

      {!disabled && (
        <Clock
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer hover:text-white transition-colors"
          onClick={() => {
            inputRef.current?.showPicker?.();
            inputRef.current?.focus();
          }}
        />
      )}

      {errorMessage && (
        <p className="mt-1.5 text-xs text-red-500 text-center">
          {errorMessage}
        </p>
      )}

      {errorSingleMessage && (
        <p className="mt-1.5 text-xs text-red-500 text-center">
          {errorSingleMessage}
        </p>
      )}
    </div>
  );
};

export default DurationInput;

export const timeToMinutes = (timeString: string): number => {
  if (!timeString) return 0;
  const [h, m] = timeString.split(":").map(Number);
  return h * 60 + m;
};

export const minutesToTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};
