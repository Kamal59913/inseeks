import React from "react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
}

export function SearchInput({ icon = "fa-magnifying-glass", className, ...props }: SearchInputProps) {
  return (
    <div className="relative w-full group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <i className={`fa-solid ${icon} text-slate-500 group-focus-within:text-indigo-400 transition-colors text-sm`}></i>
      </div>
      <input
        {...props}
        className={`w-full field-subtle border-none text-slate-200 placeholder-slate-500 rounded-2xl pl-11 pr-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:bg-[#1b2742] focus:ring-1 focus:ring-indigo-500/35 ${className}`}
      />
    </div>
  );
}
