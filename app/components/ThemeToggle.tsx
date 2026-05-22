"use client";

import { useState, useEffect } from "react";

function getStoredTheme(): "light" | "dark" | null {
  try {
    return localStorage.getItem("theme") as "light" | "dark" | null;
  } catch {
    return null;
  }
}

function setStoredTheme(theme: "light" | "dark") {
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // ignore
  }
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let isActive = true;
    const stored = getStoredTheme();
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const shouldBeDark = stored === "dark" || (!stored && systemDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    }

    queueMicrotask(() => {
      if (!isActive) return;
      setIsDark(shouldBeDark);
      setMounted(true);
    });

    return () => {
      isActive = false;
    };
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    setStoredTheme(next ? "dark" : "light");
    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  if (!mounted) {
    return (
      <div
        className="h-7 w-12 shrink-0 rounded-full bg-gray-200"
        aria-hidden="true"
      />
    );
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "切换到日间模式" : "切换到夜间模式"}
      onClick={toggle}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        isDark
          ? "bg-green-500 focus-visible:ring-green-400"
          : "bg-gray-300 focus-visible:ring-gray-400"
      }`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
          isDark ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
