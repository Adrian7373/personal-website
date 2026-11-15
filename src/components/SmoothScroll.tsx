"use client";

import { useEffect } from "react";

/**
 * Scrolling for the whole page.
 *
 * 1. Mouse wheel: instead of jumping a notch at a time, the page glides toward where the
 *    wheel has asked it to go. Trackpads, touch, the keyboard and the scrollbar already
 *    scroll smoothly and are left to the browser.
 * 2. Snap: when scrolling stops with a `data-snap` section's top edge close to the nav bar
 *    in the direction of travel (the content above it is almost out of sight), the page
 *    eases the rest of the way so the section sits flush. Anywhere else it stays put, so
 *    nothing snaps while moving from project to project.
 */

/** How close (as a share of the screen) a section's top must be to the nav bar to snap. */
const SNAP_RANGE = 0.25;
/** Time constant of the glide, in ms: smaller is snappier. */
const GLIDE_MS = 110;

export function SmoothScroll() {
  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let target = window.scrollY;
    let current = target;
    let lastSet = target;
    let lastTime = 0;
    let frame = 0;
    let lastY = target;
    let direction = 0;
    let idle = 0;

    const limit = () => document.documentElement.scrollHeight - window.innerHeight;

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    const step = (now: number) => {
      frame = 0;
      // Something else moved the page (a link, the keyboard, a finger): let it.
      if (Math.abs(window.scrollY - lastSet) > 2) return;
      const dt = Math.min(64, now - lastTime);
      lastTime = now;
      current += (target - current) * (1 - Math.exp(-dt / GLIDE_MS));
      if (Math.abs(target - current) < 0.5) current = target;
      lastSet = current;
      window.scrollTo({ top: current, behavior: "instant" });
      if (current !== target) frame = requestAnimationFrame(step);
    };

    const glideTo = (y: number) => {
      target = Math.max(0, Math.min(limit(), y));
      if (still.matches) {
        stop();
        window.scrollTo({ top: target, behavior: "instant" });
        return;
      }
      if (frame) return;
      current = window.scrollY;
      lastSet = current;
      lastTime = performance.now();
      frame = requestAnimationFrame(step);
    };

    const onWheel = (event: WheelEvent) => {
      if (still.matches || event.ctrlKey || event.deltaY === 0) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (event.target instanceof Element && event.target.closest("textarea, select")) return;
      // Small pixel deltas come from a trackpad, which is smooth already.
      if (event.deltaMode === 0 && Math.abs(event.deltaY) < 40) {
        stop();
        return;
      }
      event.preventDefault();
      const delta =
        event.deltaMode === 1 ? event.deltaY * 40 : event.deltaMode === 2 ? event.deltaY * window.innerHeight : event.deltaY;
      glideTo((frame ? target : window.scrollY) + delta);
    };

    const snap = () => {
      if (frame || !direction) return;
      const navHeight = document.querySelector("header")?.offsetHeight ?? 0;
      const range = (window.innerHeight - navHeight) * SNAP_RANGE;
      for (const el of document.querySelectorAll<HTMLElement>("[data-snap]")) {
        // Distance still to travel, in the direction of the last scroll, until the section is flush.
        const gap = (el.getBoundingClientRect().top - navHeight) * direction;
        if (gap > 1 && gap <= range) {
          glideTo(window.scrollY + gap * direction);
          return;
        }
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (y !== lastY) direction = y > lastY ? 1 : -1;
      lastY = y;
      window.clearTimeout(idle);
      idle = window.setTimeout(snap, 140);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idle);
      stop();
    };
  }, []);

  return null;
}
