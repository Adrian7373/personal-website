"use client";

import { useEffect } from "react";

/**
 * Light/dark switch. With nothing saved the site follows the system setting
 * (the inline script in layout.tsx sets `<html data-theme>` before first paint).
 * Picking the theme the system already uses clears the saved choice, so the site
 * goes back to following the system.
 */

const systemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export function ThemeToggle() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const follow = () => {
      try {
        if (localStorage.getItem("theme")) return;
      } catch {}
      document.documentElement.dataset.theme = systemTheme();
    };
    media.addEventListener("change", follow);
    return () => media.removeEventListener("change", follow);
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      if (next === systemTheme()) localStorage.removeItem("theme");
      else localStorage.setItem("theme", next);
    } catch {}
  };

  return (
    <button
      type="button"
      data-build="place"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      className="group flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink hover:text-paper"
    >
      <svg
        aria-hidden="true"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="transition-transform duration-300 group-hover:rotate-45 motion-reduce:transition-none"
      >
        {/* Sun in the light theme, moon in the dark one. */}
        <g className="dark:hidden">
          <circle cx="10" cy="10" r="3.6" />
          <path d="M10 1.5v2.2M10 16.3v2.2M1.5 10h2.2M16.3 10h2.2M4 4l1.6 1.6M14.4 14.4L16 16M4 16l1.6-1.6M14.4 5.6L16 4" />
        </g>
        <path className="hidden dark:block" d="M16.5 12.2A7 7 0 017.8 3.5a7 7 0 108.7 8.7z" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
