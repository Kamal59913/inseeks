import type React from "react";
import { FieldErrors } from "react-hook-form";

interface SwitchProps {
  name: string;
  label?: string;
  value: boolean;                     // controlled by React Hook Form
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  errors?: FieldErrors;
  color?: "blue" | "gray";            // color theme
}

const Switch: React.FC<SwitchProps> = ({
  name,
  label = "",
  value,
  onChange,
  disabled = false,
  errors,
  color = "blue",
}) => {
  const errorMessage = errors?.[name]?.message
    ? String(errors[name]?.message)
    : undefined;

  const handleToggle = () => {
    if (!disabled) onChange(!value);
  };

  const switchColors =
    color === "blue"
      ? {
          background: value
            ? "bg-brand-500 dark:bg-purple-400"
            : "bg-gray-200 dark:bg-gray-600",
          backgroundStyle: value ? { backgroundColor: '#7B5BDA57' } : {},
          knob: value
            ? "translate-x-[10px]"
            : "translate-x-0",
          knobStyle: value ? { backgroundColor: '#7B5BDA' } : { backgroundColor: 'white' },
        }
      : {
          background: value
            ? "bg-black dark:bg-purple-400"
            : "bg-gray-200 dark:bg-gray-600",
          backgroundStyle: value ? { backgroundColor: '#7B5BDA57' } : {},
          knob: value
            ? "translate-x-[10px]"
            : "translate-x-0",
          knobStyle: value ? { backgroundColor: '#7B5BDA' } : { backgroundColor: 'white' },
        };

  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className={`flex cursor-pointer select-none items-center gap-3 text-sm font-medium ${
          disabled ? "text-gray-400" : "text-gray-700 dark:text-gray-400"
        }`}
        onClick={handleToggle}
      >
        <div className="relative">
          <div
            className={`block transition duration-150 ease-linear h-[13px] w-[23px] rounded-full ${
              disabled
                ? "bg-gray-100 pointer-events-none dark:bg-black"
                : !value ? switchColors.background : ""
            }`}
            style={!disabled && value ? switchColors.backgroundStyle : {}}
          ></div>
          <div
            className={`absolute left-0 top-0 h-[13px] w-[13px] rounded-full shadow-theme-sm duration-150 ease-linear transform ${switchColors.knob}`}
            style={switchColors.knobStyle}
          ></div>
        </div>
        {label && <span>{label}</span>}
      </label>

      {errorMessage && (
        <p className="mt-1.5 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default Switch;
