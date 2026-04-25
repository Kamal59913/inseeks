import React from "react";
import { useController } from "react-hook-form";
import { getBufferedMaxLength } from "../../utils/formLimits";

const labelClassName =
  "text-xs font-semibold text-slate-400 uppercase tracking-wider";
const baseFieldClassName =
  "w-full bg-[#111827] border text-slate-200 placeholder-slate-500 rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none";

const getFieldClasses = (hasError) =>
  `${baseFieldClassName} ${
    hasError
      ? "border-red-500/70 focus:border-red-400"
      : "border-[#2a3d5c] focus:border-indigo-500 focus:bg-[#1a2540]"
  }`;

export function FormField({
  control,
  name,
  label,
  placeholder,
  type = "text",
  maxLength,
  disabled = false,
}) {
  const { field, fieldState } = useController({ control, name });

  return (
    <div className="space-y-1.5">
      {label ? <label className={labelClassName}>{label}</label> : null}
      <input
        {...field}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={getBufferedMaxLength(maxLength)}
        className={getFieldClasses(Boolean(fieldState.error))}
      />
      {fieldState.error ? (
        <p className="text-xs text-red-400">{fieldState.error.message}</p>
      ) : null}
    </div>
  );
}

export function FormTextarea({
  control,
  name,
  label,
  placeholder,
  rows = 3,
  maxLength,
  disabled = false,
}) {
  const { field, fieldState } = useController({ control, name });

  return (
    <div className="space-y-1.5">
      {label ? <label className={labelClassName}>{label}</label> : null}
      <textarea
        {...field}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        maxLength={getBufferedMaxLength(maxLength)}
        className={`${getFieldClasses(Boolean(fieldState.error))} resize-none`}
      />
      {fieldState.error ? (
        <p className="text-xs text-red-400">{fieldState.error.message}</p>
      ) : null}
    </div>
  );
}

export function FormFileField({
  control,
  name,
  label,
  accept,
  multiple = false,
  disabled = false,
  helperText,
}) {
  const { field, fieldState } = useController({ control, name });

  return (
    <div className="space-y-2">
      {label ? <p className={labelClassName}>{label}</p> : null}
      <label
        className={`inline-flex items-center justify-center rounded-md px-3.5 py-2.5 font-semibold transition-all duration-200 ${
          disabled
            ? "cursor-not-allowed bg-slate-700 text-slate-300"
            : "cursor-pointer bg-slate-600 text-white hover:bg-black/80"
        }`}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
          onChange={(event) => {
            const files = Array.from(event.target.files || []);
            field.onChange(multiple ? files : files[0] || null);
          }}
        />
        <i className="fa-solid fa-image"></i>
      </label>
      {helperText ? <p className="text-xs text-slate-500">{helperText}</p> : null}
      {fieldState.error ? (
        <p className="text-xs text-red-400">{fieldState.error.message}</p>
      ) : null}
    </div>
  );
}
