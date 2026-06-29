"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { themes, Theme, applyTheme } from "@/lib/themes";

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: themes[0],
  setTheme: () => {},
  themes,
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState(themes[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("system777-theme");
    if (saved) {
      const found = themes.find((t) => t.id === saved);
      if (found) {
        setCurrentTheme(found);
        applyTheme(found);
      }
    } else {
      applyTheme(themes[0]);
    }
  }, []);

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    localStorage.setItem("system777-theme", theme.id);
    applyTheme(theme);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}
