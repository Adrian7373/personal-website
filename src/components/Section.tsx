import type { ReactNode } from "react";

/** Page column: 1120px of content at 1440, 20px side margin on phones. */
export const wrap =
  "mx-auto w-full max-w-[1440px] px-5 sm:px-10 lg:px-[min(11.11vw,160px)]";

/** Small uppercase mono label. */
export const label =
  "font-mono text-xs font-medium uppercase tracking-[0.1em] text-ink-2";

export const h2 =
  "font-display text-[2.5rem] font-semibold leading-[1.1] lg:text-7xl lg:leading-[1.05]";

/** Height of the screen below the sticky nav bar. */
export const screenHeight = "min-h-[calc(100svh_-_var(--nav-h))]";

/**
 * Shared wrapper for every page section: one full screen (together with the nav bar),
 * with its content centred and its own paper tone edge to edge.
 * `data-snap` lets SmoothScroll.tsx settle the section flush under the nav bar, and
 * `data-build-scope` has the agents build its `data-build` elements when it comes on screen.
 * A section with a heading opens with the 2px ink rule; `aside` sits on the heading's row.
 */
export function Section({
  id,
  heading,
  aside,
  tone = "bg-paper",
  backdrop,
  children,
}: {
  id: string;
  heading?: string;
  aside?: ReactNode;
  tone?: string;
  backdrop?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-section={id}
      data-snap
      data-build-scope
      className={`relative isolate flex flex-col justify-center overflow-x-clip ${screenHeight} ${tone}`}
    >
      {backdrop}
      <div className={`${wrap} py-12 lg:py-14`}>
        {heading ? (
          <div className="mb-8 flex flex-col gap-4 border-t-2 border-ink pt-5 lg:mb-11 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <h2 data-build="type" className={h2}>
              {heading}
            </h2>
            {aside}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  );
}
