"use client";

import { useEffect, useRef } from "react";

/**
 * The build animation: on the first visit of a session, agents assemble the page.
 *
 * Every element marked `data-build` starts hidden. The page is split into scopes
 * (`data-build-scope`: the nav bar, each section, each project panel, the footer), and a
 * scope is built the first time it comes on screen. An agent's cursor comes in from one
 * side of the screen, drags a highlight rectangle over the spot where an element goes, and
 * only then does the element appear (`data-build="type"` is typed out, `data-build="place"`
 * is dropped in). When a scope is done its cursors leave by the sides.
 *
 * `data-build-scope="2"` sets how many agents work on a scope (default 4).
 * A scope must be a positioned element; the cursors are drawn in a layer inside it.
 *
 * The inline script in layout.tsx sets `<html data-build="pending">` before first paint,
 * and globals.css hides the elements while that attribute is present, so nothing shows early.
 * It is skipped under reduced motion, on deep links, and after the first run of a session.
 * Render this once per page.
 */

type Side = "left" | "right" | "top" | "bottom";
const AGENTS: { color: string; side: Side }[] = [
  { color: "var(--color-agent-1)", side: "left" },
  { color: "var(--color-agent-2)", side: "right" },
  { color: "var(--color-agent-3)", side: "bottom" },
  { color: "var(--color-agent-4)", side: "top" },
];
const CURSOR_SIZE = 36;
const CURSOR = `<svg viewBox="0 0 18 18" width="${CURSOR_SIZE}" height="${CURSOR_SIZE}" style="display:block;filter:drop-shadow(0 2px 3px rgba(21,35,28,.25))"><path d="M2 1l13 6.5-5.6 1.6L7.5 15z" fill="currentColor" style="stroke:var(--color-surface)" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
/** Ease in and out, so a cursor starts and lands softly. */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function Build() {
  const skip = useRef<() => void>(() => {});

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.build !== "pending") return;
    root.dataset.build = "waiting";

    const phone = window.innerWidth < 768;
    const started = performance.now();
    const waiting = new Set(document.querySelectorAll<HTMLElement>("[data-build-scope]"));
    const running = new Set<() => void>();
    let over = false;

    /** Builds one scope. Resolves when its agents have left, or as soon as it is stopped. */
    const build = (scope: HTMLElement) => {
      // The nav bar and the first screen are built at full pace; later sections go quicker.
      const pace = phone || performance.now() - started > 400 ? 0.6 : 1;
      let done = false;
      const pending = new Set<() => void>();
      const wait = (ms: number) =>
        new Promise<void>((resolve) => {
          if (done) return resolve();
          const finish = () => {
            window.clearTimeout(timer);
            pending.delete(finish);
            resolve();
          };
          const timer = window.setTimeout(finish, ms * pace);
          pending.add(finish);
        });

      // Movement is stepped frame by frame, so a cursor and the rectangle it drags can never
      // drift apart, and nothing is revealed before its rectangle has actually been drawn.
      const tween = (ms: number, step: (t: number) => void) =>
        new Promise<void>((resolve) => {
          if (done) return resolve();
          const length = ms * pace;
          let start = 0;
          const frame = (now: number) => {
            if (done) return resolve();
            start ||= now;
            const t = Math.min(1, (now - start) / length);
            step(ease(t));
            if (t < 1) requestAnimationFrame(frame);
            else resolve();
          };
          requestAnimationFrame(frame);
        });

      const host = document.createElement("div");
      host.setAttribute("aria-hidden", "true");
      host.style.cssText = "position:absolute;inset:0;z-index:5;pointer-events:none";
      scope.append(host);
      const origin = host.getBoundingClientRect();

      const all = Array.from(scope.querySelectorAll<HTMLElement>("[data-build]"));
      const targets = all
        // Elements that are not rendered at this screen size have nothing to build.
        .filter((el) => el.getClientRects().length > 0)
        .map((el) => {
          // Text nodes to type back in, in reading order.
          const texts: { node: Text; full: string }[] = [];
          if (el.dataset.build === "type") {
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
            while (walker.nextNode()) {
              const node = walker.currentNode as Text;
              if (node.data.trim()) texts.push({ node, full: node.data });
            }
          }
          // Typed elements are measured around their text, not their full-width block.
          let r = el.getBoundingClientRect();
          if (texts.length) {
            const range = document.createRange();
            const rects = texts.map(({ node }) => (range.selectNodeContents(node), range.getBoundingClientRect()));
            const left = Math.min(...rects.map((t) => t.left));
            const right = Math.max(...rects.map((t) => t.right));
            r = new DOMRect(left, r.top, right - left, r.height);
          }
          const pad = 6;
          const box = {
            x: r.left - origin.left - pad,
            y: r.top - origin.top - pad,
            w: r.width + pad * 2,
            h: r.height + pad * 2,
          };
          return { el, box, texts, size: `${Math.round(r.width)} × ${Math.round(r.height)}` };
        });

      let finished: () => void = () => {};
      const whenFinished = new Promise<void>((resolve) => (finished = resolve));
      const end = () => {
        if (done) return;
        done = true;
        pending.forEach((finish) => finish());
        targets.forEach(({ el, texts }) => {
          texts.forEach(({ node, full }) => (node.data = full));
          el.style.minHeight = "";
        });
        all.forEach((el) => el.setAttribute("data-built", ""));
        host.remove();
        finished();
      };

      /** A point just off the given side of the screen, in the layer's coordinates. */
      const offscreen = (side: Side, along: number): [number, number] => {
        const gap = CURSOR_SIZE * 2;
        const x = window.innerWidth * along - origin.left;
        const y = window.innerHeight * along - origin.top;
        if (side === "left") return [-origin.left - gap, y];
        if (side === "right") return [window.innerWidth - origin.left + gap, y];
        if (side === "top") return [x, -origin.top - gap];
        return [x, window.innerHeight - origin.top + gap];
      };

      const queue = [...targets];
      const agent = async ({ color, side }: (typeof AGENTS)[number], index: number) => {
        const cursor = document.createElement("div");
        cursor.innerHTML = CURSOR;
        let at = offscreen(side, 0.3 + index * 0.13);
        // The arrow's tip sits about 3px in from the corner of its box.
        const place = ([x, y]: [number, number]) => {
          cursor.style.transform = `translate(${x - 3}px,${y - 2}px)`;
        };
        cursor.style.cssText = `position:absolute;left:0;top:0;z-index:2;color:${color}`;
        place(at);
        host.append(cursor);
        const move = async (to: [number, number], ms: number, onStep?: (t: number) => void) => {
          const from = at;
          await tween(ms, (t) => {
            place([from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t]);
            onStep?.(t);
          });
          at = to;
        };
        await wait(60 + 180 * index);

        for (let task = queue.shift(); task && !done; task = queue.shift()) {
          const { el, box, texts, size } = task;
          await move([box.x, box.y], 520);
          if (done) return;

          // Drag the highlight rectangle from the top-left corner to the bottom-right.
          const drag = 300 + Math.min(260, box.w * 0.45);
          const frame = document.createElement("div");
          frame.style.cssText = `position:absolute;z-index:1;left:${box.x}px;top:${box.y}px;width:0;height:0;box-sizing:border-box;border:1.5px solid ${color};background:color-mix(in srgb, ${color} 14%, transparent);border-radius:2px`;
          host.append(frame);
          await move([box.x + box.w, box.y + box.h], drag, (t) => {
            frame.style.width = `${box.w * t}px`;
            frame.style.height = `${box.h * t}px`;
          });
          if (done) return;
          const label = document.createElement("span");
          label.textContent = size;
          label.style.cssText = `position:absolute;right:-1.5px;top:100%;margin-top:6px;font:500 11px var(--font-dm-mono),monospace;color:var(--color-surface);background:${color};padding:1px 6px;border-radius:2px;white-space:nowrap`;
          frame.append(label);
          await wait(220);
          if (done) return;

          // Only now does the element itself appear inside the highlight.
          if (texts.length) {
            el.style.minHeight = `${el.offsetHeight}px`;
            texts.forEach(({ node }) => (node.data = ""));
            el.setAttribute("data-built", "");
            const caret = document.createElement("span");
            caret.style.cssText =
              "display:inline-block;width:2px;height:1em;margin-left:2px;vertical-align:-0.12em;background:var(--color-pen)";
            const count = texts.reduce((sum, t) => sum + t.full.length, 0);
            const perChar = Math.min(38, 1200 / count);
            // Long passages are typed several characters at a time, so each step is still a visible frame.
            const chunk = Math.max(1, Math.ceil(12 / perChar));
            for (const { node, full } of texts) {
              node.after(caret);
              for (let i = chunk; i < full.length + chunk && !done; i += chunk) {
                node.data = full.slice(0, i);
                await wait(perChar * chunk);
              }
            }
            caret.remove();
          } else {
            el.setAttribute("data-built", "");
            await wait(260);
          }
          // The highlight fades while the agent moves on.
          tween(240, (t) => {
            frame.style.opacity = String(1 - t);
          }).then(() => frame.remove());
        }
        if (done) return;
        // Leave by the side it came in from.
        await move(offscreen(side, 0.45 + index * 0.1), 620);
        cursor.remove();
      };

      const count = Math.min(Number(scope.dataset.buildScope) || 4, phone ? 2 : 4, targets.length);
      Promise.all(AGENTS.slice(0, count).map(agent)).then(async () => {
        await wait(200);
        end();
      });
      return { end, whenFinished };
    };

    // `replay` leaves the page ready to build again (React re-running the effect in development).
    const finish = (replay = false) => {
      if (over) return;
      over = true;
      observer.disconnect();
      running.forEach((end) => end());
      if (replay) {
        document.querySelectorAll("[data-built]").forEach((el) => el.removeAttribute("data-built"));
        root.dataset.build = "pending";
        return;
      }
      delete root.dataset.build;
      try {
        sessionStorage.setItem("built", "1");
      } catch {}
    };
    const finishNow = () => finish();
    skip.current = finishNow;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const scope = entry.target as HTMLElement;
          if (!entry.isIntersecting || !waiting.has(scope)) return;
          waiting.delete(scope);
          observer.unobserve(scope);
          const { end, whenFinished } = build(scope);
          running.add(end);
          root.dataset.build = "running";
          whenFinished.then(() => {
            running.delete(end);
            if (over) return;
            if (!running.size) root.dataset.build = "waiting";
            if (!running.size && !waiting.size) finish();
          });
        });
      },
      // A scope starts once its top is a little way into the screen.
      { rootMargin: "0px 0px -15% 0px" },
    );
    waiting.forEach((scope) => observer.observe(scope));

    // A resize moves everything the agents measured, so the build ends. On touch screens the
    // browser's address bar slides away while scrolling, which fires `resize` with only the
    // height changed; sections are sized in `svh`, so nothing moves and the build carries on.
    const touch = window.matchMedia("(pointer: coarse)").matches;
    let width = window.innerWidth;
    const onResize = () => {
      const sameWidth = window.innerWidth === width;
      width = window.innerWidth;
      if (touch && sameWidth) return;
      finish();
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      finish(true);
    };
  }, []);

  return (
    // Shown only while agents are at work; gone once the page is finished.
    <button
      type="button"
      onClick={() => skip.current()}
      className="fixed bottom-5 right-5 z-20 hidden h-11 rounded-full border border-ink bg-paper px-5 font-mono text-[13px] font-medium text-ink shadow-[0_10px_24px_rgba(21,35,28,0.12)] transition-colors hover:bg-ink hover:text-paper [html[data-build=running]_&]:block"
    >
      Skip the build
    </button>
  );
}
