"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={
        theme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110"
      style={{
        background: "var(--black-soft)",
        border: "1px solid var(--border-light)",
        color: "var(--accent-primary)",
      }}
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}