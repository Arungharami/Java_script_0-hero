"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const saved = window.localStorage.getItem("js0hero:theme");
      const next = saved
        ? saved === "dark"
        : matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(next);
      document.documentElement.dataset.theme = next ? "dark" : "light";
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    window.localStorage.setItem("js0hero:theme", next ? "dark" : "light");
  }
  return (
    <button
      onClick={toggle}
      className="grid size-9 place-items-center rounded-lg border border-[var(--line)]"
      aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
    >
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
