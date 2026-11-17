"use client";

import { useEffect, useRef } from "react";

/** Weight of a letter at rest, and right under the pointer (Fraunces runs 100–900). */
const REST = 300;
const PEAK = 900;
/** How far from a letter's centre, in px, the pointer still thickens it. */
const REACH = 300;
/** Share of the remaining distance a letter's weight closes each frame. */
const EASE = 0.16;

/**
 * The hero name. Each letter thickens as the pointer comes near it and thins out again as it
 * leaves, so the name swells around the cursor. Only on devices with a hovering pointer and
 * without reduced motion; elsewhere the letters stay at one steady semibold weight.
 */
export function HeroName({ words, className }: { words: string[]; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Read lazily: the build animation types the letters back in after mount.
    const letters = () => Array.from(el.querySelectorAll<HTMLElement>("[data-letter]"));
    let weights: number[] = [];
    let px = -1e5;
    let py = -1e5;
    let frame = 0;

    const tick = () => {
      const spans = letters();
      if (weights.length !== spans.length) weights = spans.map(() => REST);
      // Measure every letter first, then restyle, so each frame lays out once.
      const centres = spans.map((s) => {
        const r = s.getBoundingClientRect();
        return [r.left + r.width / 2, r.top + r.height / 2];
      });
      let moving = false;
      spans.forEach((span, i) => {
        const t = Math.max(0, 1 - Math.hypot(px - centres[i][0], py - centres[i][1]) / REACH);
        const target = REST + (PEAK - REST) * t * t * (3 - 2 * t);
        weights[i] += (target - weights[i]) * EASE;
        if (Math.abs(target - weights[i]) > 0.5) moving = true;
        else weights[i] = target;
        span.style.fontVariationSettings = `"wght" ${Math.round(weights[i])}`;
      });
      frame = moving ? requestAnimationFrame(tick) : 0;
    };
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      wake();
    };
    const onLeave = () => {
      px = py = -1e5;
      wake();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", wake, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", wake);
      letters().forEach((s) => (s.style.fontVariationSettings = ""));
    };
  }, []);

  return (
    <h1
      ref={ref}
      data-build="type"
      aria-label={words.join(" ")}
      className={`${className ?? ""} [font-variation-settings:'wght'_300] motion-reduce:[font-variation-settings:'wght'_600] [@media(hover:none),(pointer:coarse)]:[font-variation-settings:'wght'_600]`}
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden="true" className={i === words.length - 1 ? "block" : "block lg:inline"}>
          {Array.from(word).map((ch, j) => (
            <span key={j} data-letter="" className="inline-block">
              {ch}
            </span>
          ))}{" "}
        </span>
      ))}
    </h1>
  );
}
