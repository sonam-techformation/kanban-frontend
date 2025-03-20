"use client"; // Marks this as a Client Component

import { useState, createContext, useContext } from "react";

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center justify-center
        px-2 py-2 rounded-full
        transition-colors duration-300
        text-sm font-medium
        focus:outline-none focus:ring-2 focus:ring-offset-2
        border border-amber-50
        ${
          theme === "light"
            ? "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300"
            : "bg-gray-800 text-gray-200 hover:bg-gray-700 focus:ring-gray-700"
        }
        sm:px-6 sm:py-3 sm:text-base // Responsive sizing
      `}
    >
      {theme === "light" ? <p>Dark</p> : <p>Light</p>}
    </button>
  );
};
