"use client";
import type React from "react";
import type { FC } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface DurationInputProps {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
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
  minuteStep?: number;
  maxHours?: number;
}

const DurationInput: FC<DurationInputProps> = ({
  id,
  placeholder = "Select duration",
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
  onChange,
  minuteStep = 1,
  maxHours,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number>(0);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  // Parse value prop into hours and minutes
  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      setSelectedHour(h || 0);
      setSelectedMinute(m || 0);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
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

  // Scroll to selected values when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (hourScrollRef.current) {
          const hourElement = hourScrollRef.current.querySelector(
            `[data-hour="${selectedHour}"]`
          );
          if (hourElement) {
            hourElement.scrollIntoView({ block: "center", behavior: "auto" });
          }
        }
        if (minuteScrollRef.current) {
          const minuteElement = minuteScrollRef.current.querySelector(
            `[data-minute="${selectedMinute}"]`
          );
          if (minuteElement) {
            minuteElement.scrollIntoView({ block: "center", behavior: "auto" });
          }
        }
      }, 50);
    }
  }, [isOpen, selectedHour, selectedMinute]);

  const handleHourSelect = (hour: number) => {
    setSelectedHour(hour);
    // If we select maxHours, force minutes to 0
    if (maxHours !== undefined && hour === maxHours) {
      setSelectedMinute(0);
      updateDuration(hour, 0);
    } else {
      updateDuration(hour, selectedMinute);
    }
  };

  const handleMinuteSelect = (minute: number) => {
    setSelectedMinute(minute);
    updateDuration(selectedHour, minute);
  };

  const updateDuration = (hour: number, minute: number) => {
    const formattedValue = `${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}`;
    if (onChange) {
      onChange(formattedValue);
    }
  };

  const displayValue = value
    ? `${String(selectedHour).padStart(2, "0")}:${String(
        selectedMinute
      ).padStart(2, "0")}`
    : "";

  // Generate hours array
  const hoursLimit = maxHours !== undefined ? maxHours : 23;
  const hours = Array.from({ length: hoursLimit + 1 }, (_, i) => i);

  // Generate minutes array (0-59) based on minuteStep
  // If selectedHour is maxHours, only allow minute 0
  const isMaxHourSelected = maxHours !== undefined && selectedHour === maxHours;
  const minutes = isMaxHourSelected
    ? [0]
    : Array.from(
        { length: Math.ceil(60 / minuteStep) },
        (_, i) => i * minuteStep
      );

  let containerClasses = "";
  if (variant === "transparent") {
    containerClasses = `relative flex items-center justify-between gap-2 w-full text-center bg-transparent text-white text-[20px] px-0 py-3 cursor-pointer ${className}`;
  } else {
    containerClasses = `relative flex items-center justify-between gap-2 w-full text-sm rounded-lg p-3 bg-[#FFFFFF0D] border border-white/5 opacity-80 cursor-pointer ${className}`;
  }

  if (disabled)
    containerClasses += ` opacity-40 bg-gray-800 cursor-not-allowed`;

  const errorMessage = errors?.[registerOptions]?.message
    ? String(errors[registerOptions].message)
    : undefined;

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={containerClasses}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="flex-1 text-left text-white">
          {displayValue || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-[#FFFFFF0D] border border-white/5 rounded-lg shadow-xl overflow-hidden backdrop-blur-sm">
          <div className="flex">
            {/* Hours Column */}
            <div className="flex-1 flex flex-col">
              <div className="px-3 py-2.5 text-xs text-gray-400 font-medium border-b border-white/10 text-center bg-[#FFFFFF08]">
                HH
              </div>
              <div
                ref={hourScrollRef}
                className="h-[240px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full"
              >
                {hours.map((hour) => (
                  <div
                    key={hour}
                    data-hour={hour}
                    onClick={() => handleHourSelect(hour)}
                    className={` py-3 text-sm cursor-pointer transition-colors text-center ${
                      selectedHour === hour
                        ? "bg-white/20 text-white font-medium"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {String(hour).padStart(2, "0")}
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-white/10" />

            {/* Minutes Column */}
            <div className="flex-1 flex flex-col">
              <div className="px-3 py-2.5 text-xs text-gray-400 font-medium border-b border-white/10 text-center bg-[#FFFFFF08]">
                MM
              </div>
              <div
                ref={minuteScrollRef}
                className="h-[240px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full"
              >
                {minutes.map((minute) => (
                  <div
                    key={minute}
                    data-minute={minute}
                    onClick={() => handleMinuteSelect(minute)}
                    className={` py-3 text-sm cursor-pointer transition-colors text-center ${
                      selectedMinute === minute
                        ? "bg-white/20 text-white font-medium"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {String(minute).padStart(2, "0")}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <p className="mt-1.5 text-xs text-red-500">{errorMessage}</p>
      )}

      {errorSingleMessage && (
        <p className="mt-1.5 text-xs text-red-500">{errorSingleMessage}</p>
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

