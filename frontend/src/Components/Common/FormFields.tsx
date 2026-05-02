import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface FormFieldProps<
  T extends FieldValues,
> extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
  control?: Control<T>;
  name: Path<T>;
}

interface FormTextareaProps<
  T extends FieldValues,
> extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  control?: Control<T>;
  name: Path<T>;
}

const baseFieldClassName =
  "w-full field-subtle border-none text-slate-200 placeholder-slate-500 rounded-xl px-6 py-3.5 text-sm transition-all duration-200 focus:outline-none focus:bg-[#1b2742] focus:ring-1 focus:ring-indigo-500/35";

const getFieldClasses = (hasError: boolean): string =>
  `${baseFieldClassName} ${
    hasError
      ? "bg-red-500/10 text-red-200 placeholder-red-300 ring-1 ring-red-500/50"
      : ""
  }`;

export const FormField = <T extends FieldValues>({
  label,
  error,
  icon,
  className,
  control,
  name,
  ...props
}: FormFieldProps<T>) => {
  const renderInput = (fieldProps: any) => (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-bold text-slate-400 ml-2 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <i
              className={`fa-solid ${icon} text-slate-500 group-focus-within:text-indigo-400 transition-colors text-sm`}
            ></i>
          </div>
        )}
        <input
          {...fieldProps}
          {...props}
          className={`${getFieldClasses(!!fieldProps.error || !!error)} ${icon ? "pl-12" : ""}`}
        />
      </div>
      {(fieldProps.error || error) && (
        <p className="text-[11px] font-semibold text-red-400 ml-2 mt-0.5">
          {fieldProps.error || error}
        </p>
      )}
    </div>
  );

  if (control) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) =>
          renderInput({ ...field, error: error || fieldState.error?.message })
        }
      />
    );
  }

  return renderInput({});
};

export const FormTextarea = <T extends FieldValues>({
  label,
  error,
  className,
  control,
  name,
  ...props
}: FormTextareaProps<T>) => {
  const renderTextarea = (fieldProps: any) => (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-bold text-slate-400 ml-2 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        {...fieldProps}
        {...props}
        className={`${getFieldClasses(!!fieldProps.error || !!error)} resize-none min-h-[120px]`}
      />
      {(fieldProps.error || error) && (
        <p className="text-[11px] font-semibold text-red-400 ml-2 mt-0.5">
          {fieldProps.error || error}
        </p>
      )}
    </div>
  );

  if (control) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) =>
          renderTextarea({
            ...field,
            error: error || fieldState.error?.message,
          })
        }
      />
    );
  }

  return renderTextarea({});
};

export const FormFileField = <T extends FieldValues>({
  label,
  error,
  className,
  control,
  name,
  ...props
}: FormFieldProps<T>) => {
  const renderFileInput = (fieldProps: any) => (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-bold text-slate-400 ml-2 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          {...props}
          {...fieldProps}
          type="file"
          className={`${getFieldClasses(!!fieldProps.error || !!error)} file:hidden cursor-pointer`}
          value={undefined}
          onChange={(e) => {
            fieldProps.onChange?.(e.target.files?.[0]);
            props.onChange?.(e);
          }}
        />
        <div className="absolute right-6 pointer-events-none">
          <i className="fa-solid fa-cloud-arrow-up text-indigo-400"></i>
        </div>
      </div>
      {(fieldProps.error || error) && (
        <p className="text-[11px] font-semibold text-red-400 ml-2 mt-0.5">
          {fieldProps.error || error}
        </p>
      )}
    </div>
  );

  if (control) {
    return (
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) =>
          renderFileInput({
            ...field,
            error: error || fieldState.error?.message,
          })
        }
      />
    );
  }

  return renderFileInput({});
};
