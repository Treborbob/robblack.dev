"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { BuildInfo } from "@/lib/build-info";

type Toggle = "wire" | "grid" | "freeze" | "band";

const TOGGLES: { id: Toggle; label: string; hint: string }[] = [
  { id: "wire", label: "wireframe", hint: "outline every box" },
  { id: "grid", label: "grid", hint: "12 column overlay" },
  {
    id: "band",
    label: "index band",
    hint: "the strip that lights the release index",
  },
  { id: "freeze", label: "freeze", hint: "pause every animation" },
];

interface Runtime {
  viewport: string;
  dpr: number;
  scrollY: number;
  fps: number;
  release: string;
  reducedMotion: boolean;
  online: boolean;
  memory: string;
  connection: string;
  ua: string;
}

interface PageStats {
  releases: number;
  changes: number;
  words: number;
}

function currentRelease(): string {
  const top = window.innerHeight * 0.18;
  const bottom = window.innerHeight * 0.38;
  for (const el of Array.from(
    document.querySelectorAll<HTMLElement>(".release"),
  )) {
    const r = el.getBoundingClientRect();
    if (r.top < bottom && r.bottom > top)
      return el.querySelector("h3")?.textContent ?? el.id;
  }
  return "none";
}

function pageStats(): PageStats {
  const main = document.querySelector("main");
  return {
    releases: document.querySelectorAll(".release").length,
    changes: document.querySelectorAll(".kind").length,
    words: (main?.innerText ?? "").trim().split(/\s+/).length,
  };
}

function shortUa(): string {
  const nav = navigator as Navigator & {
    userAgentData?: { brands?: { brand: string; version: string }[] };
  };
  const brand = nav.userAgentData?.brands?.find(
    (b) => !/Not.A.Brand|Chromium/i.test(b.brand),
  );
  if (brand) return `${brand.brand} ${brand.version}`;
  const m = navigator.userAgent.match(/(Firefox|Safari|Edg|Chrome)\/([\d.]+)/);
  return m ? `${m[1]} ${m[2].split(".")[0]}` : "unknown";
}

export function DebugConsole({
  build,
  cssTimelines,
  onClose,
}: {
  build: BuildInfo;
  cssTimelines: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLElement>(null);
  const [toggles, setToggles] = useState<Record<Toggle, boolean>>({
    wire: false,
    grid: false,
    freeze: false,
    band: false,
  });
  const [runtime, setRuntime] = useState<Runtime | null>(null);
  const [stats] = useState<PageStats>(() => pageStats());

  useEffect(() => {
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    let frames = 0;
    let last = performance.now();
    let fps = 0;
    let raf = 0;
    const tick = (now: number) => {
      frames += 1;
      if (now - last >= 1000) {
        fps = Math.round((frames * 1000) / (now - last));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const sample = () => {
      const nav = navigator as Navigator & {
        deviceMemory?: number;
        connection?: { effectiveType?: string };
      };
      setRuntime({
        viewport: `${window.innerWidth}×${window.innerHeight}`,
        dpr: window.devicePixelRatio,
        scrollY: Math.round(window.scrollY),
        fps,
        release: currentRelease(),
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
          .matches,
        online: navigator.onLine,
        memory: nav.deviceMemory ? `${nav.deviceMemory} GB` : "n/a",
        connection: nav.connection?.effectiveType ?? "n/a",
        ua: shortUa(),
      });
    };
    sample();
    const interval = window.setInterval(sample, 500);
    window.addEventListener("scroll", sample, { passive: true });

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", sample);
      window.clearInterval(interval);
      cancelAnimationFrame(raf);
      for (const t of TOGGLES)
        document.documentElement.removeAttribute(`data-debug-${t.id}`);
    };
  }, [onClose]);

  const flip = (id: Toggle) => {
    setToggles((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      document.documentElement.toggleAttribute(`data-debug-${id}`, next[id]);
      return next;
    });
  };

  const row = (k: string, v: React.ReactNode) => (
    <div key={k} className="flex justify-between gap-6">
      <dt className="text-added/70">{k}</dt>
      <dd className="truncate text-right text-added">{v}</dd>
    </div>
  );

  return createPortal(
    <>
      <section
        ref={panelRef}
        tabIndex={-1}
        aria-label="Debug console"
        className="mono fixed top-3 right-3 z-50 w-[min(92vw,21rem)] rounded-md border border-added/30 bg-ink/92 p-3 text-[11px] leading-relaxed text-added shadow-2xl backdrop-blur-md outline-none"
      >
        <div className="flex items-baseline justify-between border-b border-added/20 pb-2">
          <span className="font-medium">robblack.dev · debug</span>
          <button
            type="button"
            onClick={onClose}
            className="text-added/70 hover:text-added"
          >
            [esc]
          </button>
        </div>

        <dl className="mt-2 space-y-0.5">
          {row("version", `v${build.version}`)}
          {row("commit", build.commit)}
          {row(
            "built",
            build.builtAt
              ? `${build.builtAt.replace("T", " ").slice(0, 16)}Z`
              : "dev",
          )}
          {row("next", build.next)}
          {row("node", build.node)}
          {row("region", build.region)}
        </dl>

        <dl className="mt-2 space-y-0.5 border-t border-added/20 pt-2">
          {row(
            "viewport",
            runtime ? `${runtime.viewport} @${runtime.dpr}x` : "…",
          )}
          {row("fps", runtime ? runtime.fps : "…")}
          {row("scroll", runtime ? `${runtime.scrollY}px` : "…")}
          {row("release in band", runtime?.release ?? "…")}
          {row("index driver", cssTimelines ? "css timeline" : "js fallback")}
          {row(
            "reduced motion",
            runtime ? (runtime.reducedMotion ? "yes" : "no") : "…",
          )}
          {row("browser", runtime?.ua ?? "…")}
          {row("memory", runtime?.memory ?? "…")}
          {row("connection", runtime?.connection ?? "…")}
        </dl>

        <dl className="mt-2 space-y-0.5 border-t border-added/20 pt-2">
          {row("releases", stats.releases)}
          {row("changes", stats.changes)}
          {row("words", stats.words)}
        </dl>

        <fieldset className="mt-2 border-t border-added/20 pt-2">
          <legend className="sr-only">Debug toggles</legend>
          {TOGGLES.map((t) => (
            <label
              key={t.id}
              className="flex cursor-pointer items-center justify-between gap-3 py-0.5"
            >
              <span>
                {t.label} <span className="text-added/50">{t.hint}</span>
              </span>
              <input
                type="checkbox"
                checked={toggles[t.id]}
                onChange={() => flip(t.id)}
                className="accent-[color:var(--color-added)]"
              />
            </label>
          ))}
        </fieldset>
      </section>
      {toggles.grid ? <div aria-hidden="true" className="debug-grid" /> : null}
      {toggles.band ? <div aria-hidden="true" className="debug-band" /> : null}
    </>,
    document.body,
  );
}
