import React, { useState } from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';

interface PasswordFieldProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  control?: Control<T>;
  name: Path<T>;
}

const inputBaseClassName =
  'w-full field-subtle border-none text-slate-200 placeholder-slate-500 rounded-3xl px-6 py-3.5 pr-12 text-sm transition-all duration-200 focus:outline-none focus:bg-[#1b2742] focus:ring-1 focus:ring-indigo-500/35';

const inputStateClassName = (hasError: boolean): string =>
  hasError
    ? 'bg-red-500/10 text-red-200 placeholder-red-300 ring-1 ring-red-500/40'
    : '';

export const PasswordField = <T extends FieldValues>({
  label,
  error,
  className,
  control,
  name,
  ...props
}: PasswordFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  const renderInput = (fieldProps: any) => (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-bold text-slate-400 ml-2 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          {...fieldProps}
          {...props}
          type={showPassword ? 'text' : 'password'}
          className={`${inputBaseClassName} ${inputStateClassName(!!error)}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-6 flex items-center text-slate-500 hover:text-indigo-400 transition-colors"
        >
          <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
        </button>
      </div>
      {error && <p className="text-[11px] font-semibold text-red-400 ml-2 mt-0.5">{error}</p>}
    </div>
  );

  if (control) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => renderInput(field)}
      />
    );
  }

  return renderInput({});
};
