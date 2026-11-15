"use client";

import { useEffect, useState } from "react";

/** Desktop section links. The section on screen gets the pen underline. */
export function NavLinks({ links }: { links: string[][] }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const sections = links
      .map(([, href]) => document.getElementById(href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    // A section is current while it crosses the middle of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const href = `#${entry.target.id}`;
          if (entry.isIntersecting) setActive(href);
          else setActive((now) => (now === href ? "" : now));
        });
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [links]);

  return (
    <ul className="hidden gap-7 text-[15px] font-medium md:flex lg:gap-9">
      {links.map(([text, href]) => {
        const current = active === href;
        return (
          <li key={href} data-build="place">
            <a
              href={href}
              aria-current={current ? "true" : undefined}
              className={`relative flex min-h-11 items-center transition-colors hover:text-ink ${
                current ? "text-ink" : "text-ink-2"
              }`}
            >
              {text}
              <svg
                aria-hidden="true"
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
                fill="none"
                className={`absolute inset-x-0 bottom-0.5 h-2.5 w-full origin-left overflow-visible transition-[scale,opacity] duration-300 motion-reduce:transition-none ${
                  current ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                }`}
              >
                <path
                  d="M0 6C30 3 64 9 100 6"
                  className="stroke-pen"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
