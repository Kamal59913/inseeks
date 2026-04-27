import React, { useState } from 'react';
import { Control, useController } from 'react-hook-form';
import { getBufferedMaxLength } from '../../utils/formLimits';

const inputBaseClassName =
  'w-full bg-[#111827] border text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 pr-12 text-sm transition-all duration-200 focus:outline-none';

const inputStateClassName = (hasError: boolean): string =>
  hasError
    ? 'border-red-500/70 focus:border-red-400'
 : ' focus:bg-[#1a2540]';

interface PasswordFieldProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

export function PasswordField({
  control,
  name,
  label,
  placeholder,
  maxLength,
  disabled = false,
}: PasswordFieldProps) {
  const { field, fieldState } = useController({ control, name });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5">
      {label ? (
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          {...field}
          type={showPassword ? 'text' : 'password'}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={getBufferedMaxLength(maxLength)}
          className={`${inputBaseClassName} ${inputStateClassName(Boolean(fieldState.error))}`}
        />
        <button
          type="button"
          onClick={() => !disabled && setShowPassword((v) => !v)}
          disabled={disabled}
          className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-[#1a2540] hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-base`}></i>
        </button>
      </div>
      {fieldState.error ? (
        <p className="text-xs text-red-400">{fieldState.error.message}</p>
      ) : null}
    </div>
  );
}
