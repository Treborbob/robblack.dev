"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "0123456789abcdef<>/{}[]=+-*#$%&";
const CELL_W = 14;
const CELL_H = 17.5;
const BASE_ALPHA = 0.028;
const HALO_RADIUS = 180;

/**
 * A faint field of mono characters behind the hero. It cycles slowly and
 * brightens in amber around the pointer. Reduced motion stops the cycling;
 * the pointer halo stays because the visitor is driving it.
 */
export function Phosphor({ fade = "bottom" }: { fade?: "bottom" | "top" }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const canHover = window.matchMedia("(hover: hover)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mono =
      getComputedStyle(document.documentElement).getPropertyValue(
        "--font-mono",
      ) || "ui-monospace, monospace";

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let cells: string[] = [];
    const base = document.createElement("canvas");
    const bctx = base.getContext("2d");
    if (!bctx) return;

    const pointer = { x: -9999, y: -9999 };
    let strength = 0; // halo strength, eased toward target
    let target = 0;
    let raf = 0;
    let lastCycle = 0;

    const drawBase = () => {
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      bctx.clearRect(0, 0, w, h);
      bctx.font = `12px ${mono}`;
      bctx.fillStyle = `rgba(231, 228, 220, ${BASE_ALPHA})`;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++)
          bctx.fillText(cells[y * cols + x], x * CELL_W, y * CELL_H + 12);
      }
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      // A hidden or collapsed host measures 0x0; a zero-size canvas cannot be
      // drawn from, so leave the previous frame alone until it has a size.
      if (w === 0 || h === 0) return;
      canvas.width = base.width = Math.round(w * dpr);
      canvas.height = base.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      cols = Math.ceil(w / CELL_W);
      rows = Math.ceil(h / CELL_H);
      cells = Array.from(
        { length: cols * rows },
        () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
      );
      drawBase();
      composite();
    };

    const composite = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(base, 0, 0);
      if (strength <= 0.01) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `12px ${mono}`;
      const x0 = Math.max(0, Math.floor((pointer.x - HALO_RADIUS) / CELL_W));
      const x1 = Math.min(
        cols - 1,
        Math.ceil((pointer.x + HALO_RADIUS) / CELL_W),
      );
      const y0 = Math.max(0, Math.floor((pointer.y - HALO_RADIUS) / CELL_H));
      const y1 = Math.min(
        rows - 1,
        Math.ceil((pointer.y + HALO_RADIUS) / CELL_H),
      );
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const px = x * CELL_W;
          const py = y * CELL_H + 12;
          const d = Math.hypot(px - pointer.x, py - pointer.y);
          const near = Math.max(0, 1 - d / HALO_RADIUS);
          if (near <= 0.02) continue;
          ctx.fillStyle = `rgba(240, 179, 91, ${near * near * 0.5 * strength})`;
          ctx.fillText(cells[y * cols + x], px, py);
        }
      }
    };

    const frame = (now: number) => {
      raf = 0;
      if (!reduced && now - lastCycle > 120) {
        lastCycle = now;
        const n = Math.ceil(cells.length * 0.015);
        for (let i = 0; i < n; i++)
          cells[Math.floor(Math.random() * cells.length)] =
            GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        drawBase();
      }
      strength += (target - strength) * 0.18;
      composite();
      const settled =
        Math.abs(target - strength) < 0.01 && (reduced || target === 0);
      if (!settled || !reduced) raf = requestAnimationFrame(frame);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      target = 1;
      schedule();
    };
    const onLeave = () => {
      target = 0;
      schedule();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    if (canHover) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
    }
    if (!reduced) schedule();

    // Pause when the hero is off screen; the canvas is not visible anyway.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) schedule();
      else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(host);

    return () => {
      observer.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className={`pointer-events-none absolute inset-0 h-full w-full ${fade === "top" ? "[mask-image:linear-gradient(to_top,black_35%,transparent_100%)]" : "[mask-image:linear-gradient(to_bottom,black_45%,transparent_100%)]"}`}
    />
  );
}
