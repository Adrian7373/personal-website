"use client";

import { useEffect, useRef } from "react";

/**
 * The pen line. It lives only in the Projects section: it starts as the underline of the
 * section heading (`data-thread-start`), circles the notes of each project
 * (`data-thread-stop` inside each `data-project`) and is drawn as the page scrolls.
 * Place it as the last child of a positioned, isolated container.
 */

type Pt = { x: number; y: number };

/** Smooth curve through the points (Catmull-Rom as cubic Béziers). */
function spline(pts: Pt[]): string {
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += `C${f(p1.x + (p2.x - p0.x) / 6)} ${f(p1.y + (p2.y - p0.y) / 6)} ${f(p2.x - (p3.x - p1.x) / 6)} ${f(p2.y - (p3.y - p1.y) / 6)} ${f(p2.x)} ${f(p2.y)}`;
  }
  return d;
}

function route(root: HTMLElement): Pt[] {
  const origin = root.getBoundingClientRect();
  const box = (el: Element) => {
    const r = el.getBoundingClientRect();
    return {
      l: r.left - origin.left,
      t: r.top - origin.top,
      r: r.right - origin.left,
      b: r.bottom - origin.top,
      w: r.width,
      h: r.height,
    };
  };
  const wide = origin.width >= 1024;
  const edge = origin.width - 9;
  const pts: Pt[] = [];

  const start = root.querySelector("[data-thread-start]");
  if (start) {
    const s = box(start);
    pts.push({ x: s.l, y: s.b + 7 }, { x: s.l + s.w * 0.5, y: s.b + 10 }, { x: s.r + 8, y: s.b + 6 });
  }

  root.querySelectorAll("[data-project]").forEach((panel, i) => {
    const p = box(panel);
    const turn = i % 2 ? -1 : 1;
    let lastX = p.l + p.w / 2;
    if (!wide) pts.push({ x: edge, y: p.t + 36 });
    panel.querySelectorAll("[data-thread-stop]").forEach((stop) => {
      const s = box(stop);
      const cx = s.l + s.w / 2;
      const cy = s.t + s.h / 2;
      const rad = Math.min(s.w, s.h) * 0.2;
      // One and a bit turns around the middle of the notes.
      for (let step = 0; step <= 6; step++) {
        const a = ((-90 + step * 70 * turn) * Math.PI) / 180;
        const r = rad * (1 - step * 0.06);
        pts.push({ x: cx + Math.cos(a) * r * 1.3, y: cy + Math.sin(a) * r });
      }
      pts.push({ x: cx + turn * rad * 0.4, y: s.b + (wide ? 18 : 6) });
      lastX = cx;
    });
    if (wide) {
      pts.push({ x: lastX + (p.l + p.w / 2 - lastX) * 0.35, y: p.b });
    } else {
      pts.push({ x: edge, y: p.b - 60 }, { x: edge, y: p.b });
    }
  });
  return pts;
}

export function Thread() {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const tip = tipRef.current;
    const root = svg?.parentElement;
    if (!svg || !path || !tip || !root) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const STEP = 24;
    let total = 0;
    let reach: number[] = []; // lowest y the line has reached at each STEP of its length
    let frame = 0;

    const draw = () => {
      frame = 0;
      if (!total) return;
      let len = total;
      if (!still) {
        const target = window.innerHeight * 0.62 - root.getBoundingClientRect().top;
        let lo = 0;
        let hi = reach.length;
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          if (reach[mid] < target) lo = mid + 1;
          else hi = mid;
        }
        len = Math.min(total, lo * STEP);
      }
      path.style.strokeDashoffset = String(total - len);
      path.style.opacity = len > 0 ? "1" : "0";
      const moving = !still && len > 0 && len < total;
      tip.style.opacity = moving ? "1" : "0";
      if (moving) {
        const at = path.getPointAtLength(len);
        tip.setAttribute("transform", `translate(${at.x.toFixed(1)} ${at.y.toFixed(1)}) scale(0.78)`);
      }
    };

    const build = () => {
      const pts = route(root);
      if (pts.length < 2) return;
      // Lay the route down, then resample it with a slight hand wobble.
      path.setAttribute("d", spline(pts));
      const length = path.getTotalLength();
      const wobbly: Pt[] = [];
      for (let l = 0; l <= length; l += 36) {
        const at = path.getPointAtLength(l);
        wobbly.push({
          x: at.x + Math.sin(l * 0.013 + 1.7) * 2.2 + Math.sin(l * 0.031) * 1.2,
          y: at.y + Math.sin(l * 0.017 + 0.4) * 2 + Math.sin(l * 0.037 + 2.1) * 1.1,
        });
      }
      path.setAttribute("d", spline(wobbly));
      total = path.getTotalLength();
      path.style.strokeDasharray = String(total);
      reach = [];
      let lowest = -Infinity;
      for (let l = 0; l <= total; l += STEP) {
        lowest = Math.max(lowest, path.getPointAtLength(l).y);
        reach.push(lowest);
      }
      draw();
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    build();
    document.fonts?.ready.then(build);
    const observer = new ResizeObserver(build);
    observer.observe(root);
    if (!still) window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      fill="none"
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
    >
      <path
        ref={pathRef}
        className="stroke-pen"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ opacity: 0 }}
      />
      <path
        ref={tipRef}
        d="M2 1l13 6.5-5.6 1.6L7.5 15z"
        className="fill-pen stroke-surface"
        style={{ opacity: 0 }}
      />
    </svg>
  );
}
