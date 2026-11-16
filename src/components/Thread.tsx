"use client";

import { useEffect, useId, useRef } from "react";

/**
 * The pen line of the Projects section. It starts as the underline of the section heading
 * (`data-thread-start`) and then wires each project's notes together in the order the product
 * works, like the connectors of a flow diagram.
 *
 * Each `data-project` panel carries its route as JSON in `data-thread` (see `ThreadSpec` in
 * ProjectNotes.tsx). A route names ports on the notes: "video.b" is the middle of the bottom
 * edge of the note marked `data-node="video"`, "map.r.60" is 60% of the way down the right edge.
 * The line leaves and enters a note square to its edge and runs hidden behind the note between
 * two ports of the same note. Forks leave the main line and either land back on it or end in a dot.
 *
 * The line is drawn as the page scrolls. How much of it is drawn follows the scroll position
 * through a smoothed, speed-limited map and is then eased over time, so it moves at an even pace
 * however the route bends. Place it as the last child of a positioned, isolated container.
 *
 * The line is drawn twice: once under the notes and titles, and once more above the titles but
 * clipped to the elements marked `data-thread-over`, so it weaves over one line of a title and
 * behind the next.
 */

type Vec = { x: number; y: number };
/** A point the line passes through, with the direction it arrives in and leaves in. */
type Way = Vec & { in: Vec; out: Vec; el: object | null };
type Fork = { at: string; join?: string; via: string[] };
type Spec = { main: string[]; forks?: Fork[] };
type Box = { l: number; t: number; r: number; b: number };

const NS = "http://www.w3.org/2000/svg";
const SIDES: Record<string, Vec> = { t: { x: 0, y: -1 }, b: { x: 0, y: 1 }, l: { x: -1, y: 0 }, r: { x: 1, y: 0 } };
/** The line is measured every STEP px of its length. */
const STEP = 20;
/** The pace of the line is averaged over this many steps either side, twice. */
const BLUR = 24;
/** Where on the screen the tip of the line sits, as a share of the screen height. */
const TIP_AT = 0.62;
/** Time constant of the easing toward the scroll position, in ms. */
const EASE_MS = 150;
const f = (n: number) => n.toFixed(1);
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Resolves "id.side.percent" to a point on the edge of a note, allowing for its tilt and scale. */
function port(panel: Element, token: string, origin: DOMRect): Way | null {
  const [id, side = "b", percent = "50"] = token.split(".");
  const el = panel.querySelector<HTMLElement>(`[data-node="${id}"]`);
  if (!el || !el.getClientRects().length) return null;
  const stage = el.closest<HTMLElement>("[data-stage]");
  const scale = stage ? stage.getBoundingClientRect().width / Number(stage.dataset.stage) : 1;
  let tilt = 0;
  for (let node: Element | null = el; node && node !== stage && node !== panel; node = node.parentElement) {
    tilt += parseFloat(getComputedStyle(node).rotate) || 0;
  }
  const normal = SIDES[side] ?? SIDES.b;
  const along = Number(percent) / 100 - 0.5;
  const w = el.offsetWidth * scale;
  const h = el.offsetHeight * scale;
  const local = normal.x ? { x: (normal.x * w) / 2, y: along * h } : { x: along * w, y: (normal.y * h) / 2 };
  const a = (tilt * Math.PI) / 180;
  // A box keeps its centre when it is rotated, so the bounding box gives the true centre.
  const box = el.getBoundingClientRect();
  return {
    x: box.left + box.width / 2 - origin.left + local.x * Math.cos(a) - local.y * Math.sin(a),
    y: box.top + box.height / 2 - origin.top + local.x * Math.sin(a) + local.y * Math.cos(a),
    out: normal,
    in: { x: -normal.x, y: -normal.y },
    el,
  };
}

/** Where a straight run from `a` to `b` would cross a block of text, takes it down the side of the block. */
function detour(ways: Way[], avoid: Box[], width: number): Way[] {
  const result: Way[] = [];
  ways.forEach((b, i) => {
    const a = ways[i - 1];
    if (a && a.el !== b.el && Math.abs(b.y - a.y) > 1) {
      const dir = b.y > a.y ? 1 : -1;
      const blocks = avoid
        .filter((box) => box.t > Math.min(a.y, b.y) + 4 && box.b < Math.max(a.y, b.y) - 4)
        .sort((p, q) => (p.t - q.t) * dir);
      for (const box of blocks) {
        const xAt = (y: number) => a.x + ((b.x - a.x) * (y - a.y)) / (b.y - a.y);
        const lo = Math.min(xAt(box.t), xAt(box.b)) - 30;
        const hi = Math.max(xAt(box.t), xAt(box.b)) + 30;
        if (hi < box.l || lo > box.r) continue;
        const mid = (lo + hi) / 2;
        const sides = [box.l - 18, box.r + 18].filter((x) => x >= 10 && x <= width - 10);
        const x = sides.length
          ? sides.reduce((best, s) => (Math.abs(s - mid) < Math.abs(best - mid) ? s : best))
          : mid < width / 2 ? 10 : width - 10;
        const run = {};
        const down = { x: 0, y: dir };
        result.push(
          { x, y: dir > 0 ? box.t : box.b, in: down, out: down, el: run },
          { x, y: dir > 0 ? box.b : box.t, in: down, out: down, el: run },
        );
      }
    }
    result.push(b);
  });
  return result;
}

/** Width of the section the line is drawn in; set on every build. */
let bounds = Infinity;

/** The path from `a` to `b`: straight behind a note, otherwise a curve square to both ends. */
function link(a: Way, b: Way): string {
  if (a.el && a.el === b.el) return `L${f(b.x)} ${f(b.y)}`;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const reach = Math.hypot(dx, dy) * 0.1;
  // A curve that sets off sideways may not swing past the edge of the section (narrow screens).
  const room = (at: number, dir: number) => (dir > 0 ? bounds - 8 - at : dir < 0 ? at - 8 : Infinity);
  const k1 = clamp(Math.abs(dx * a.out.x + dy * a.out.y) * 0.5 + reach, 14, Math.max(14, Math.min(300, room(a.x, a.out.x))));
  const k2 = clamp(Math.abs(dx * b.in.x + dy * b.in.y) * 0.5 + reach, 14, Math.max(14, Math.min(300, room(b.x, -b.in.x))));
  return `C${f(a.x + a.out.x * k1)} ${f(a.y + a.out.y * k1)} ${f(b.x - b.in.x * k2)} ${f(b.y - b.in.y * k2)} ${f(b.x)} ${f(b.y)}`;
}

/** A line that ends at a note stops just short of it, so its ringed dot sits clear of the edge. */
const shy = (way: Way): Way => ({ ...way, x: way.x - way.in.x * 10, y: way.y - way.in.y * 10 });

const pathOf = (ways: Way[]) => `M${f(ways[0].x)} ${f(ways[0].y)}` + ways.slice(1).map((b, i) => link(ways[i], b)).join("");

/** One drawn stroke: a stretch of the main line, or a fork. */
type Line = {
  /** The stroke and its tip, each drawn twice: under the titles and, clipped, over them. */
  paths: SVGPathElement[];
  heads: SVGGElement[];
  length: number;
  /** Length of the main line at which this stroke starts and at which it is complete. */
  from: number;
  to: number;
  /** Stays as a dot at its end once drawn, instead of handing over to another stroke. */
  ends: boolean;
  drawn: number;
};

/** One curve of the main line, kept on its own so points along the line are cheap to find. */
type Seg = { start: number; length: number; el: SVGPathElement };

export function Thread() {
  const underRef = useRef<SVGSVGElement>(null);
  const overRef = useRef<SVGSVGElement>(null);
  const clipId = `thread-over-${useId().replace(/[^a-z0-9]/gi, "")}`;

  useEffect(() => {
    const under = underRef.current;
    const over = overRef.current;
    const root = under?.parentElement;
    if (!under || !over || !root) return;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const html = document.documentElement;
    let lines: Line[] = [];
    let dots: { el: SVGCircleElement; at: number }[] = [];
    /** For each panel, the length of the main line where it comes into that panel. */
    let panels: { el: Element; enter: number }[] = [];
    let total = 0;
    let reach: number[] = []; // the scroll line at which each STEP of the main line is drawn
    let shown = -1;
    let frame = 0;
    let lastTime = 0;
    let size = "";

    const make = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>) => {
      const el = document.createElementNS(NS, tag);
      for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, String(value));
      return el;
    };

    /** How much of the main line should be drawn for the current scroll position. */
    const goal = () => {
      if (still) return total;
      const at = window.innerHeight * TIP_AT - root.getBoundingClientRect().top;
      let lo = 0;
      let hi = reach.length - 1;
      if (at <= reach[0]) return 0;
      if (at >= reach[hi]) return total;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (reach[mid] < at) lo = mid;
        else hi = mid;
      }
      let length = (lo + (at - reach[lo]) / (reach[hi] - reach[lo])) * STEP;
      // While the build animation runs, the line waits at the door of a panel that is not built yet.
      if (html.dataset.build) {
        if (root.querySelector("[data-thread-start]")?.closest("[data-build]:not([data-built], html)")) return 0;
        for (const panel of panels) {
          if (panel.el.querySelector("[data-build]:not([data-built])")) {
            length = Math.min(length, panel.enter);
            break;
          }
        }
      }
      return Math.min(total, length);
    };

    // Only the strokes that are growing are touched, so a frame repaints one panel's worth of line.
    const render = () => {
      for (const line of lines) {
        const share = clamp((shown - line.from) / (line.to - line.from), 0, 1);
        const drawn = share * line.length;
        if (drawn === line.drawn) continue;
        line.drawn = drawn;
        const tip = drawn > 0 && (share < 1 || line.ends);
        const at = tip ? line.paths[0].getPointAtLength(drawn) : null;
        line.paths.forEach((path) => {
          path.style.strokeDashoffset = f(line.length - drawn);
          path.style.visibility = drawn > 0 ? "visible" : "hidden";
        });
        line.heads.forEach((head) => {
          head.setAttribute("visibility", tip ? "visible" : "hidden");
          if (at) head.setAttribute("transform", `translate(${f(at.x)} ${f(at.y)})`);
        });
      }
      for (const dot of dots) dot.el.setAttribute("visibility", shown >= dot.at && shown > 0 ? "visible" : "hidden");
    };

    const tick = (now: number) => {
      frame = 0;
      if (!total) return;
      const target = goal();
      const dt = lastTime ? Math.min(64, now - lastTime) : 16;
      lastTime = now;
      // The first frame after a (re)build lands straight on the target.
      if (shown < 0) shown = target;
      else shown += (target - shown) * (1 - Math.exp(-dt / EASE_MS));
      if (Math.abs(target - shown) < 0.4) shown = target;
      render();
      if (shown !== target) frame = requestAnimationFrame(tick);
      else lastTime = 0;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const build = () => {
      const origin = root.getBoundingClientRect();
      size = `${Math.round(origin.width)}x${Math.round(origin.height)}`;
      bounds = origin.width;
      const strokes = make("g", {});
      const tips = make("g", {});
      const overGroup = make("g", { "clip-path": `url(#${clipId})` });
      const clip = make("clipPath", { id: clipId, clipPathUnits: "userSpaceOnUse" });
      lines = [];
      dots = [];
      panels = [];
      total = 0;
      shown = -1;

      // The line runs over the parts of a title marked `data-thread-over` and behind the rest.
      root.querySelectorAll("[data-thread-over]").forEach((el) => {
        const r = el.getBoundingClientRect();
        clip.append(make("rect", { x: f(r.left - origin.left), y: f(r.top - origin.top), width: f(r.width), height: f(r.height) }));
      });
      const avoid: Box[] = Array.from(root.querySelectorAll("[data-thread-avoid]"), (el) => {
        const r = el.getBoundingClientRect();
        return { l: r.left - origin.left - 14, t: r.top - origin.top - 14, r: r.right - origin.left + 14, b: r.bottom - origin.top + 14 };
      });

      const addLine = (d: string, from: number, to: number | null, ends: boolean) => {
        const paths = [make("path", { d, class: "thread-line" }), make("path", { d, class: "thread-line" })];
        const heads = paths.map(() => {
          const head = make("g", { visibility: "hidden" });
          head.append(make("circle", { r: 8, class: "thread-ring" }), make("circle", { r: 3.5, class: "thread-dot" }));
          return head;
        });
        strokes.append(paths[0]);
        tips.append(heads[0]);
        overGroup.append(paths[1], heads[1]);
        const length = paths[0].getTotalLength();
        paths.forEach((path) => {
          path.style.strokeDasharray = `${f(length)} ${f(length + 4)}`;
          path.style.strokeDashoffset = f(length);
        });
        lines.push({ paths, heads, length, from, to: to ?? from + length, ends, drawn: -1 });
      };

      // The main line: the underline of the heading, then every panel's route in turn.
      const main: Way[] = [];
      const segs: Seg[] = [];
      const lengthAt = new Map<Way, number>();
      const add = (ways: Way[]) => {
        for (const way of detour(main.length ? [main[main.length - 1], ...ways] : ways, avoid, origin.width).slice(main.length ? 1 : 0)) {
          const last = main[main.length - 1];
          if (last) {
            const el = make("path", { d: `M${f(last.x)} ${f(last.y)}${link(last, way)}` });
            const seg = { start: lengthAt.get(last)!, length: el.getTotalLength(), el };
            segs.push(seg);
            lengthAt.set(way, seg.start + seg.length);
          } else lengthAt.set(way, 0);
          main.push(way);
        }
      };
      const start = root.querySelector("[data-thread-start]");
      if (start) {
        const r = start.getBoundingClientRect();
        const right = { x: 1, y: 0 };
        const y = r.bottom - origin.top + 9;
        add([
          { x: r.left - origin.left, y, in: right, out: right, el: start },
          { x: r.right - origin.left + 10, y, in: right, out: right, el: start },
        ]);
      }
      const routes = Array.from(root.querySelectorAll<HTMLElement>("[data-project]"), (panel) => {
        let spec: Spec | null = null;
        try {
          spec = JSON.parse(panel.dataset.thread ?? "");
        } catch {}
        const named = new Map<string, Way>();
        const ways = (spec?.main ?? []).flatMap((token) => {
          const way = port(panel, token, origin);
          if (way) named.set(token, way);
          return way ? [way] : [];
        });
        return { panel, spec, named, ways };
      }).filter((route) => route.ways.length);
      const forks: { ways: Way[]; from: number; to: number | null }[] = [];
      /** Index in `main` of the last point of each stretch; one stretch per panel. */
      const cuts = [0];
      routes.forEach(({ panel, spec, named, ways }, i) => {
        if (i === routes.length - 1) {
          const end = shy(ways[ways.length - 1]);
          named.forEach((way, token) => way === ways[ways.length - 1] && named.set(token, end));
          ways[ways.length - 1] = end;
        }
        add(ways);
        cuts.push(main.length - 1);
        panels.push({ el: panel, enter: lengthAt.get(ways[0])! });
        for (const fork of spec?.forks ?? []) {
          const from = named.get(fork.at);
          const to = fork.join ? named.get(fork.join) : null;
          const via = fork.via.flatMap((token) => port(panel, token, origin) ?? []);
          if (!from || via.length < 2 || (fork.join && !to)) continue;
          if (!to) via.push(shy(via.pop()!));
          forks.push({ ways: detour(via, avoid, origin.width), from: lengthAt.get(from)!, to: to ? lengthAt.get(to)! : null });
        }
      });
      under.replaceChildren();
      over.replaceChildren();
      if (main.length < 2) return;
      total = lengthAt.get(main[main.length - 1])!;

      for (let i = 1; i < cuts.length; i++) {
        if (cuts[i] === cuts[i - 1]) continue;
        const from = lengthAt.get(main[cuts[i - 1]])!;
        const to = lengthAt.get(main[cuts[i]])!;
        addLine(pathOf(main.slice(cuts[i - 1], cuts[i] + 1)), from, to, i === cuts.length - 1);
      }
      const seen = new Set<string>();
      const addDot = (at: Vec, when: number) => {
        const key = `${Math.round(at.x)},${Math.round(at.y)}`;
        if (seen.has(key)) return;
        seen.add(key);
        const el = make("circle", { cx: f(at.x), cy: f(at.y), r: 3, class: "thread-dot", visibility: "hidden" });
        tips.append(el);
        dots.push({ el, at: when });
      };
      for (const fork of forks) {
        if (fork.to !== null && fork.to <= fork.from) continue;
        addLine(pathOf(fork.ways), fork.from, fork.to, fork.to === null);
        addDot(fork.ways[0], fork.from);
        if (fork.to !== null) addDot(fork.ways[fork.ways.length - 1], fork.to);
      }
      // Dots and tips sit above every stroke.
      under.append(strokes, tips);
      over.append(make("defs", {}), overGroup);
      over.firstChild!.appendChild(clip);

      // Map the scroll position to a drawn length. `lowest` is the scroll line at which each
      // point first comes on; limiting how fast the line may run and averaging the result
      // keeps its pace even where the route runs sideways or doubles back.
      const lowest: number[] = [];
      for (let l = 0, s = 0, max = -Infinity; l <= total + STEP; l += STEP) {
        const at = Math.min(l, total);
        while (s < segs.length - 1 && at > segs[s].start + segs[s].length) s++;
        max = Math.max(max, segs[s].el.getPointAtLength(at - segs[s].start).y);
        lowest.push(max);
      }
      const n = lowest.length;
      const slope = ((lowest[n - 1] - lowest[0]) / (n - 1)) * 0.6; // at most 1.7 times the average pace
      const fwd = [...lowest];
      const back = [...lowest];
      for (let i = 1; i < n; i++) fwd[i] = Math.max(fwd[i], fwd[i - 1] + slope);
      for (let i = n - 2; i >= 0; i--) back[i] = Math.min(back[i], back[i + 1] - slope);
      reach = fwd.map((v, i) => (v + back[i]) / 2);
      for (let pass = 0; pass < 2; pass++) {
        // A running sum makes each averaging pass one walk over the samples.
        const from = reach;
        const value = (j: number) => from[clamp(j, 0, n - 1)] + (j < 0 ? j * slope : j > n - 1 ? (j - n + 1) * slope : 0);
        let sum = 0;
        for (let j = -BLUR; j <= BLUR; j++) sum += value(j);
        reach = from.map((_, i) => {
          const mean = sum / (BLUR * 2 + 1);
          sum += value(i + BLUR + 1) - value(i - BLUR);
          return mean;
        });
      }
      schedule();
    };

    // Rebuilding is only needed when the section itself changes size.
    let pending = 0;
    const rebuild = () => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        const r = root.getBoundingClientRect();
        if (`${Math.round(r.width)}x${Math.round(r.height)}` !== size) build();
      });
    };

    build();
    document.fonts?.ready.then(build);
    const observer = new ResizeObserver(rebuild);
    observer.observe(root);
    if (!still) window.addEventListener("scroll", schedule, { passive: true });
    // The build animation reveals panels without a scroll event; keep checking while it runs.
    const poll = window.setInterval(() => {
      if (html.dataset.build) schedule();
      else window.clearInterval(poll);
    }, 250);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.clearInterval(poll);
      if (frame) cancelAnimationFrame(frame);
      if (pending) cancelAnimationFrame(pending);
    };
  }, [clipId]);

  const layer = "thread pointer-events-none absolute inset-0 h-full w-full";
  return (
    <>
      {/* Under the notes and the titles. */}
      <svg ref={underRef} aria-hidden="true" fill="none" className={`${layer} z-[1]`} />
      {/* The same line again, shown only where it crosses over a title. */}
      <svg ref={overRef} aria-hidden="true" fill="none" className={`${layer} z-[3]`} />
    </>
  );
}
