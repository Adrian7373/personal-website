"use client";

/** The current year, read in the browser so the page itself can stay prerendered. */
export function Year() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
