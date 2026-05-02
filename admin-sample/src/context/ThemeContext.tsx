"use client";

import type React from "react";
import { createContext, useContext, useEffect } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Always use light mode
  const theme: Theme = "light";

  useEffect(() => {
    // Ensure dark class is never applied
    document.documentElement.classList.remove("dark");
  }, []);

  // No-op function to prevent breaking components that call toggleTheme
  const toggleTheme = () => {
    // Theme is locked to light mode, do nothing
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
