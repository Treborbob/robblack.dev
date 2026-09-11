"use client";

import { useEffect, useRef } from "react";

const MAIN_X = 18;
const BRANCH_X = 46;
const WIDTH = 64;

/**
 * A commit graph in the left margin of the changelog: one lane, a node per
 * release, and an amber branch that leaves the lane for the side ventures
 * and merges back. Draws itself as the page scrolls. Hidden where there is
 * no margin to draw in.
 */
export function CommitGraph() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    const host = svg?.parentElement;
    if (!svg || !host) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let nodes: { y: number; branch: boolean; el: SVGCircleElement }[] = [];
    let main: {
      el: SVGPathElement;
      y0: number;
      y1: number;
      len: number;
    } | null = null;
    let branches: {
      el: SVGPathElement;
      y0: number;
      y1: number;
      len: number;
    }[] = [];
    let height = 0;

    const layout = () => {
      const releases = Array.from(
        host.querySelectorAll<HTMLElement>(".release"),
      );
      const box = host.getBoundingClientRect();
      height = box.height;
      svg.setAttribute("viewBox", `0 0 ${WIDTH} ${height}`);
      svg.setAttribute("height", String(height));
      // Layout offsets, not rendered rects: the entries carry a translateY
      // from their scroll reveal until they have been seen.
      const ys = releases.map((r) => {
        const h = r.querySelector<HTMLElement>("h3") ?? r;
        let y = h.offsetTop + h.offsetHeight / 2;
        let el = h.offsetParent as HTMLElement | null;
        while (el && el !== host) {
          y += el.offsetTop;
          el = el.offsetParent as HTMLElement | null;
        }
        return y;
      });
      const flags = releases.map((r) => r.dataset.branch === "true");
      const y0 = ys[0];
      const yN = ys[ys.length - 1];
      let html = `<path data-main d="M${MAIN_X},${y0} L${MAIN_X},${yN}" fill="none" stroke="var(--color-line-strong)" stroke-width="1.5"/>`;
      ys.forEach((y, i) => {
        if (!flags[i]) return;
        const from = ys[i - 1] ?? y0;
        const to = ys[i + 1] ?? yN;
        const d = `M${MAIN_X},${from + 26} C${MAIN_X},${y - 48} ${BRANCH_X},${y - 72} ${BRANCH_X},${y} C${BRANCH_X},${y + 64} ${MAIN_X},${to - 56} ${MAIN_X},${to - 26}`;
        html += `<path data-branch data-y0="${from + 26}" data-y1="${to - 26}" d="${d}" fill="none" stroke="var(--color-accent)" stroke-width="1.5" opacity=".75"/>`;
      });
      ys.forEach((y, i) => {
        html += `<circle data-node data-y="${y}" cx="${flags[i] ? BRANCH_X : MAIN_X}" cy="${y}" r="4" fill="var(--color-ink)" stroke="${flags[i] ? "var(--color-accent)" : "var(--color-muted)"}" stroke-width="1.5" opacity="0" style="transition:opacity .25s"/>`;
      });
      svg.innerHTML = html;
      const mainEl = svg.querySelector<SVGPathElement>("[data-main]");
      if (!mainEl) return;
      const mlen = mainEl.getTotalLength();
      mainEl.style.strokeDasharray = String(mlen);
      main = { el: mainEl, y0, y1: yN, len: mlen };
      branches = Array.from(
        svg.querySelectorAll<SVGPathElement>("[data-branch]"),
      ).map((el) => {
        const len = el.getTotalLength();
        el.style.strokeDasharray = String(len);
        return {
          el,
          y0: Number(el.dataset.y0),
          y1: Number(el.dataset.y1),
          len,
        };
      });
      nodes = Array.from(
        svg.querySelectorAll<SVGCircleElement>("[data-node]"),
      ).map((el) => ({
        el,
        y: Number(el.dataset.y),
        branch: el.getAttribute("cx") === String(BRANCH_X),
      }));
      draw();
    };

    const draw = () => {
      if (!main) return;
      const box = host.getBoundingClientRect();
      // The graph is drawn down to just above the bottom of the viewport, so
      // the visible part is always complete and grows as entries scroll in.
      const line = reduced
        ? Number.POSITIVE_INFINITY
        : window.innerHeight * 0.92 - box.top;
      const reveal = (y0: number, y1: number) =>
        Math.max(0, Math.min(1, (line - y0) / (y1 - y0)));
      main.el.style.strokeDashoffset = String(
        main.len * (1 - reveal(main.y0, main.y1)),
      );
      for (const b of branches)
        b.el.style.strokeDashoffset = String(b.len * (1 - reveal(b.y0, b.y1)));
      for (const n of nodes) n.el.style.opacity = n.y <= line + 2 ? "1" : "0";
    };

    const ro = new ResizeObserver(layout);
    ro.observe(host);
    layout();
    window.addEventListener("scroll", draw, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", draw);
    };
  }, []);

  return (
    <svg
      ref={ref}
      width={WIDTH}
      className="pointer-events-none absolute top-0 hidden min-[1400px]:block"
      style={{ left: -88 }}
      role="presentation"
    />
  );
}
