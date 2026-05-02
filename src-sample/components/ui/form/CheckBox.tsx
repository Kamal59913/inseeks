import type React from "react";
import { FieldErrors } from "react-hook-form";

interface CheckboxProps {
  value: boolean;
  className?: string;
  id?: string;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  errors?: FieldErrors;
  name: string;
  label?:string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  value,
  id,
  onChange,
  className = "",
  disabled = false,
  errors,
  name,
  label
}) => {
  const errorMessage = errors?.[name]?.message
    ? String(errors[name].message)
    : undefined;

  const handleChange = () => {
    if (!disabled) {
      onChange(!value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-3">
        <input
          id={id}
          type="checkbox"
          className={`w-4 h-4 mt-0.5 text-[#3C7396] bg-gray-100 border-gray-300 rounded focus:ring-[#3C7396] focus:ring-2 dark:focus:ring-[#3C7396] dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 disabled:opacity-60 ${className}`}
          checked={value}
          onChange={handleChange}
          disabled={disabled}
          name={name}
        />
        {label && (
          <label
            htmlFor={id}
            className={`text-sm text-gray-700 dark:text-gray-300 leading-5 cursor-pointer ${
              disabled ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            {label}
          </label>
        )}
      </div>

      {errorMessage && (
        <p className="mt-1.5 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default Checkbox;
