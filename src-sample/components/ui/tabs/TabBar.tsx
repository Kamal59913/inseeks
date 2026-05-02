"use client";
import { usePathname } from "next/navigation";

export interface TabItem {
  label: string;
  path: string;
  disabled: boolean;
}

interface TabBarProps {
  tabs: readonly TabItem[];
  onNavigate: (route: string) => void;
  /** Optional extra className for the container */
  className?: string;
  /** Optional variant for different text sizes */
  variant?: "default" | "heading";
}

/**
 * Shared presentational tab bar used across section layouts
 * (Bookings, Catalog, Profile).
 */
export function TabBar({
  tabs,
  onNavigate,
  className = "",
  variant = "default",
}: TabBarProps) {
  const pathname = usePathname();

  const textSizeClass =
    variant === "heading" ? "font-bold text-[28px]" : "font-medium";

  return (
    <div className={`flex gap-8 ${className}`}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        const isDisabled = tab.disabled;

        return (
          <button
            key={tab.path}
            type="button"
            className={`pb-3 ${textSizeClass} transition-colors text-white ${
              isDisabled
                ? "text-gray-600 cursor-not-allowed opacity-50"
                : isActive
                  ? "opacity-100 cursor-pointer"
                  : "text-gray-500 hover:text-gray-300 opacity-50 cursor-pointer"
            }`}
            onClick={() => !isDisabled && onNavigate(tab.path)}
            disabled={isDisabled}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

