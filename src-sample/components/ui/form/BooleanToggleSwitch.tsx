import type React from "react";
import { FieldErrors } from "react-hook-form";

interface BooleanToggleSwitchProps {
  value: boolean | undefined;
  className?: string;
  id?: string;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  errors?: FieldErrors;
  name: string;
  // New flexible color props
  checkedBackgroundColor?: string;
  uncheckedBackgroundColor?: string;
  knobColor?: string;
  focusRingColor?: string;
}

/*Usage Example: 
checkedBackgroundColor="bg-green-400"
uncheckedBackgroundColor="bg-green-100"
knobColor="bg-white"
focusRingColor="focus:ring-green-400"
*/

const BooleanToggleSwitch: React.FC<BooleanToggleSwitchProps> = ({
  value,
  id,
  onChange,
  className = "",
  disabled = false,
  errors,
  name,
  checkedBackgroundColor,
  uncheckedBackgroundColor,
  knobColor = "bg-white",
  focusRingColor = "focus:ring-blue-500",
}) => {
  const errorMessage = errors?.[name]?.message
    ? String(errors[name].message)
    : undefined;

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  // Get background color based on state and custom props
  const getBackgroundColor = () => {
    if (checkedBackgroundColor && uncheckedBackgroundColor) {
      return value === true ? checkedBackgroundColor : uncheckedBackgroundColor;
    }
    
    // Fallback to original colors
    return value === true ? 'bg-blue-600' : 'bg-gray-200';
  };

  const getKnobClasses = () => {
    const translateClass = value === true ? 'translate-x-6' : 'translate-x-1';
    return `inline-block h-4 w-4 transform rounded-full transition-transform ${translateClass} ${knobColor}`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={id}
          checked={value === true}
          onChange={handleToggle}
          disabled={disabled}
          className="sr-only"
        />
        <label htmlFor={id} className={`flex items-center ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
          <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 ${focusRingColor} focus:ring-offset-2 ${getBackgroundColor()} ${className}`}>
            <span className={getKnobClasses()} />
          </div>
        </label>
      </div>

      {errorMessage && (
        <p className="mt-1.5 text-xs text-error-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default BooleanToggleSwitch;
