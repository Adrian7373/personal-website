"use client";

import { useState } from "react";

/** Phone navigation: a two-line menu button that opens the section links under the nav bar. */
export function MobileMenu({ links }: { links: string[][] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        type="button"
        data-build="place"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
        className="flex size-11 items-center justify-center"
      >
        <svg aria-hidden="true" width="20" height="12" viewBox="0 0 20 12" fill="none" className="stroke-ink" strokeWidth="1.5">
          <path
            d={open ? "M3 0l14 12M3 12L17 0" : "M0 1h20M0 11h20"}
          />
        </svg>
      </button>
      {open ? (
        <ul
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b border-line bg-paper px-5 pb-4 shadow-[0_18px_30px_rgba(0,0,0,0.12)] sm:px-10"
        >
          {links.map(([text, href]) => (
            <li key={href} className="border-t border-line first:border-t-0">
              <a
                href={href}
                onClick={() => setOpen(false)}
                className="flex min-h-13 items-center font-display text-[22px] font-semibold"
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
