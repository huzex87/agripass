import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    console.log("1. Saved theme from localStorage:", savedTheme);

    if (savedTheme) {
      console.log("2. Using saved theme:", savedTheme);
      setTheme(savedTheme);
    } else {
      const isSystemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      console.log("3. System prefers dark:", isSystemDark);
      const systemTheme = isSystemDark ? "dark" : "light";
      console.log("4. Setting system theme to:", systemTheme);
      setTheme(systemTheme);
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      if (!localStorage.getItem("theme")) {
        console.log(
          "5. System theme changed to:",
          e.matches ? "dark" : "light"
        );
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    console.log("6. Applying theme to DOM:", theme);
    document.documentElement.setAttribute("data-theme", theme);
    if (theme !== "light" || localStorage.getItem("theme")) {
      localStorage.setItem("theme", theme);
      console.log("7. Saved theme to localStorage:", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const setThemeManually = (newTheme) => {
    if (newTheme === "system") {
      localStorage.removeItem("theme");
      const isSystemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(isSystemDark ? "dark" : "light");
    } else {
      setTheme(newTheme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, setTheme: setThemeManually }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context || context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
