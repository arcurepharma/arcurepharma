"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export type Theme = "green" | "navy";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "green";
  try {
    return (localStorage.getItem("arcure_theme") as Theme) === "navy"
      ? "navy"
      : "green";
  } catch {
    return "green";
  }
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "green",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    const html = document.documentElement;
    html.classList.add("theme-transition");
    localStorage.setItem("arcure_theme", t);
    html.setAttribute("data-theme", t);
    setThemeState(t);
    window.setTimeout(() => html.classList.remove("theme-transition"), 400);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "green" ? "navy" : "green");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);