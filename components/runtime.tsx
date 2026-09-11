"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { BuildInfo } from "@/lib/build-info";

const Terminal = dynamic(() => import("./terminal").then((m) => m.Terminal), {
  ssr: false,
});

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

declare global {
  interface Window {
    help?: () => void;
    debug?: () => void;
    version?: () => string;
    changelog?: () => void;
  }
}

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    el.isContentEditable
  );
}

const MONO = "font-family:ui-monospace,Menlo,monospace";
const AMBER = `${MONO};color:#f0b35b;font-weight:600`;
const DIM = `${MONO};color:#8e96a6`;
const TEXT = `${MONO};color:inherit`;

function stamp() {
  return `[${(performance.now() / 1000).toFixed(3).padStart(7, " ")}]`;
}

function line(tag: string, message: string) {
  console.log(`%c${stamp()} %c${tag.padEnd(6)} %c${message}`, DIM, AMBER, TEXT);
}

let booted = false;

function bootLog(build: BuildInfo, cssTimelines: boolean) {
  if (booted) return;
  booted = true;
  const releases = document.querySelectorAll(".release").length;
  const changes = document.querySelectorAll(".kind").length;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const paint = performance
    .getEntriesByType("paint")
    .find((e) => e.name === "first-contentful-paint");
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  const fonts = Array.from(document.fonts)
    .filter((f) => f.status === "loaded")
    .map((f) => f.family.replace(/["']/g, "").toLowerCase());

  console.log(
    `%crobblack.dev v${build.version}%c  commit ${build.commit} · built ${build.builtAt.slice(0, 16).replace("T", " ") || "dev"}Z`,
    AMBER,
    DIM,
  );
  line(
    "boot",
    `region ${build.region}, next ${build.next}, node ${build.node}`,
  );
  line(
    "fonts",
    fonts.length ? Array.from(new Set(fonts)).join(", ") : "system fallback",
  );
  line(
    "index",
    `scroll-driven timelines: ${cssTimelines ? "supported" : "unsupported, js fallback armed"}`,
  );
  line(
    "page",
    `${releases} releases, ${changes} changes, 1 rollback (deliberate)`,
  );
  line(
    "motion",
    `prefers-reduced-motion: ${reduced ? "reduce" : "no-preference"}`,
  );
  if (paint || nav) {
    line(
      "ready",
      [
        paint ? `first paint ${Math.round(paint.startTime)}ms` : null,
        nav ? `dom ${Math.round(nav.domContentLoadedEventEnd)}ms` : null,
      ]
        .filter(Boolean)
        .join(", "),
    );
  }
  line("hint", "press ` for the console. up up down down also works.");
  line("hint", "type help() for commands.");
}

function installCommands(build: BuildInfo, open: () => void) {
  window.help = () => {
    console.log(
      `%chelp()      this list\n%cdebug()     open the console (or press \`)\n%cversion()   current version string\n%cchangelog() every release, newest first`,
      TEXT,
      TEXT,
      TEXT,
      TEXT,
    );
  };
  window.debug = open;
  window.version = () => `v${build.version}`;
  window.changelog = () => {
    const rows = Array.from(
      document.querySelectorAll<HTMLElement>(".release"),
    ).map((el) => {
      const version = el.querySelector("h3")?.textContent ?? "";
      const [org, role] = (el.querySelector("p")?.textContent ?? "").split(
        " · ",
      );
      return { version, org: org?.trim(), role: role?.trim() };
    });
    console.table(rows);
  };
}

/**
 * The only script that runs for everyone. It writes a boot log to the
 * console, installs a few commands, listens for the console key, and in
 * browsers without scroll-driven animations drives the release index
 * highlight with an IntersectionObserver instead.
 */
export function Runtime({ build }: { build: BuildInfo }) {
  const [open, setOpen] = useState(false);
  const [cssTimelines, setCssTimelines] = useState(false);

  useEffect(() => {
    const supported =
      typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()");
    setCssTimelines(supported);

    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => bootLog(build, supported));
    installCommands(build, () => setOpen(true));

    let buffer: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      if (e.key === "`" || e.key === "~" || e.code === "Backquote") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      buffer = [...buffer, e.key].slice(-KONAMI.length);
      if (
        buffer.length === KONAMI.length &&
        buffer.every((k, i) => k === KONAMI[i])
      ) {
        buffer = [];
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);

    // Firefox (until 158) and older browsers: same highlight, done in JS.
    let observer: IntersectionObserver | undefined;
    if (!supported && "IntersectionObserver" in window) {
      const links = Array.from(
        document.querySelectorAll<HTMLElement>(".index-link"),
      );
      const releases = Array.from(
        document.querySelectorAll<HTMLElement>(".release"),
      );
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const i = releases.indexOf(entry.target as HTMLElement);
            links[i]?.classList.toggle("is-active", entry.isIntersecting);
          }
        },
        // Same band as the CSS timeline: 18% to 38% of the viewport.
        { rootMargin: "-18% 0px -62% 0px", threshold: 0 },
      );
      for (const r of releases) observer.observe(r);
    }

    return () => {
      window.removeEventListener("keydown", onKey);
      observer?.disconnect();
      window.help =
        window.debug =
        window.version =
        window.changelog =
          undefined;
    };
  }, [build]);

  if (!open) return null;
  return (
    <Terminal
      build={build}
      cssTimelines={cssTimelines}
      onClose={() => setOpen(false)}
    />
  );
}
