import { useState } from "react";
import Input from "./Input";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface PasswordInputProps {
  // UseFormRegister<any> and FieldErrors<any> are intentional: this is a shared
  // UI primitive that must accept register/errors from any form schema.
  // Input.tsx uses the same pattern for the same reason.
  register: UseFormRegister<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  registerOptions: string;
  errors: FieldErrors<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  placeholder: string;
  variant?: "regular" | "transparent";
  showToggleIcon?: boolean;
  autoFocus?: boolean;
  textAlignment?: "text-center" | "text-left" | "text-right";
  errorSingleMessage?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  register,
  registerOptions,
  errors,
  placeholder,
  variant,
  showToggleIcon = true,
  autoFocus = false,
  textAlignment = "text-left",
  errorSingleMessage
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

    const errorMessage = errors?.[registerOptions]?.message
    ? String(errors[registerOptions].message)
    : undefined;

    
  return (
    <div>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          register={register}
          registerOptions={registerOptions}
          placeholder={placeholder}
          variant={variant}
          autoFocus={autoFocus}
        />
        {showToggleIcon && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none z-10"
            onClick={togglePassword}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>

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

