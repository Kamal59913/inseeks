import React, { useState } from "react";

export default function SearchBar() {
  const [focused, setFocused] = useState(false);

  return (
 <div className="w-full px-4 py-3 bg-[#090e1a] border-b border-[#1f2e47]">
      <div
        className={`flex items-center gap-3 bg-[#1a2540] rounded-xl px-4 py-2.5 transition-all duration-200 max-w-2xl mx-auto
 ${focused ? " ring-1 ring-indigo-500/30" : ""}`}
      >
        <i
          className={`fa-solid fa-magnifying-glass text-sm transition-colors ${
            focused ? "text-indigo-400" : "text-slate-500"
          }`}
        ></i>
        <input
          type="text"
          placeholder="Search Inseeks..."
          className="flex-1 bg-transparent text-slate-200 text-sm placeholder-slate-500 border-none focus:outline-none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
 <kbd className="hidden sm:flex text-xs text-slate-600 bg-[#0f172a] px-1.5 py-0.5 rounded ">
          ⌘K
        </kbd>
      </div>
    </div>
  );
}
