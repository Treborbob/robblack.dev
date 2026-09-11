"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { BuildInfo } from "@/lib/build-info";

type Toggle = "wire" | "grid" | "band";
const TOGGLES: Toggle[] = ["wire", "grid", "band"];

interface Line {
  id: number;
  text: string;
  tone?: "dim" | "ok" | "warn" | "accent";
}

interface SysInfo {
  [key: string]: string;
}

const PROMPT = "guest@robblack.dev:~$";

function pad(n: number) {
  return n.toFixed(6).padStart(12, " ");
}

function collect(build: BuildInfo, cssTimelines: boolean): SysInfo {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string; rtt?: number; downlink?: number };
    userAgentData?: {
      brands?: { brand: string; version: string }[];
      platform?: string;
    };
  };
  const timing = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  const paint = performance
    .getEntriesByType("paint")
    .find((e) => e.name === "first-contentful-paint");
  const resources = performance.getEntriesByType(
    "resource",
  ) as PerformanceResourceTiming[];
  const transferred =
    resources.reduce((sum, r) => sum + (r.transferSize || 0), 0) +
    (timing?.transferSize ?? 0);

  let gpu = "unknown";
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    const ext = gl?.getExtension("WEBGL_debug_renderer_info");
    if (gl && ext) gpu = String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL));
  } catch {
    // no webgl, no gpu string
  }

  const brand = nav.userAgentData?.brands?.find(
    (b) => !/Not.A.Brand|Chromium/i.test(b.brand),
  );
  const uaMatch = navigator.userAgent.match(
    /(Firefox|Edg|Chrome|Safari)\/([\d.]+)/,
  );
  const browser = brand
    ? `${brand.brand} ${brand.version}`
    : uaMatch
      ? `${uaMatch[1]} ${uaMatch[2].split(".")[0]}`
      : "unknown";
  const platform =
    nav.userAgentData?.platform ?? navigator.platform ?? "unknown";
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offset = -new Date().getTimezoneOffset() / 60;
  const fonts = Array.from(
    new Set(
      Array.from(document.fonts)
        .filter((f) => f.status === "loaded")
        .map((f) => f.family.replace(/["']/g, "").toLowerCase()),
    ),
  );

  let storage = "unavailable";
  try {
    localStorage.setItem("robblack.probe", "1");
    localStorage.removeItem("robblack.probe");
    storage = "ok";
  } catch {
    storage = "blocked";
  }

  return {
    host: `${location.host} via ${timing?.nextHopProtocol || "h1"}`,
    commit: build.commit,
    built: build.builtAt
      ? `${build.builtAt.slice(0, 16).replace("T", " ")}Z`
      : "dev",
    region: build.region,
    runtime: `next ${build.next} / node ${build.node}`,
    timing: timing
      ? `dns ${Math.round(timing.domainLookupEnd - timing.domainLookupStart)}ms, tcp ${Math.round(timing.connectEnd - timing.connectStart)}ms, ttfb ${Math.round(timing.responseStart)}ms, dom ${Math.round(timing.domContentLoadedEventEnd)}ms`
      : "n/a",
    paint: paint ? `${Math.round(paint.startTime)}ms` : "n/a",
    transfer: `${resources.length + 1} requests, ${(transferred / 1024).toFixed(0)} KB`,
    browser: `${browser} on ${platform}`,
    locale: `${navigator.languages?.join(", ") || navigator.language} · ${tz} (UTC${offset >= 0 ? "+" : ""}${offset})`,
    display: `${screen.width}x${screen.height} @${window.devicePixelRatio}x, ${screen.colorDepth}-bit, viewport ${window.innerWidth}x${window.innerHeight}`,
    cpu: `${navigator.hardwareConcurrency ?? "?"} cores, ${nav.deviceMemory ? `${nav.deviceMemory} GB` : "memory undisclosed"}`,
    gpu,
    net: `${nav.connection?.effectiveType ?? "unknown"}${nav.connection?.rtt != null ? `, rtt ${nav.connection.rtt}ms` : ""}${nav.connection?.downlink != null ? `, ${nav.connection.downlink} Mbps` : ""}, ${navigator.onLine ? "online" : "offline"}`,
    touch: `${navigator.maxTouchPoints} touch points`,
    storage: `localStorage ${storage}, cookies ${navigator.cookieEnabled ? "enabled" : "disabled"}`,
    fonts: fonts.join(", ") || "system fallback",
    index: cssTimelines
      ? "scroll-driven timelines supported"
      : "scroll-driven timelines unsupported, js fallback armed",
    page: `${document.querySelectorAll(".release").length} releases, ${document.querySelectorAll(".kind").length} changes, ${(document.querySelector("main")?.innerText ?? "").trim().split(/\s+/).length} words`,
    motion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "reduce"
      : "no-preference",
    scheme: window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light (overruled)",
    referrer: document.referrer || "direct",
    ip: "not collected. this site does not look.",
  };
}

function bootScript(build: BuildInfo, info: SysInfo): Line[] {
  let t = 0;
  let id = 0;
  const k = (text: string, tone?: Line["tone"]) => {
    t += 0.0004 + Math.random() * 0.0011;
    return { id: id++, text: `[${pad(t)}] ${text}`, tone };
  };
  const ok = (text: string) => ({
    id: id++,
    text: `[  OK  ] ${text}`,
    tone: "ok" as const,
  });
  return [
    {
      id: id++,
      text: `robblack.dev bootloader v${build.version}`,
      tone: "accent",
    },
    { id: id++, text: "" },
    k(`commit ${info.commit}, built ${info.built}, region ${info.region}`),
    k(info.runtime),
    k(`host ${info.host}`),
    k(`timing ${info.timing}, first paint ${info.paint}`),
    k(`transfer ${info.transfer}`),
    k(`ua ${info.browser}`),
    k(`locale ${info.locale}`),
    k(`display ${info.display}`),
    k(`cpu ${info.cpu}`),
    k(`gpu ${info.gpu}`),
    k(`net ${info.net}`),
    k(`input ${info.touch}`),
    k(`storage ${info.storage}`),
    k(`fonts ${info.fonts}`),
    k(`index ${info.index}`),
    k(`page ${info.page}`),
    k(`motion prefers-reduced-motion: ${info.motion}, scheme ${info.scheme}`),
    k(`referrer ${info.referrer}`),
    k(`ip ${info.ip}`, "dim"),
    ok("Mounted /changelog."),
    ok("Started Release Index Service."),
    ok("Reached target robblack.dev."),
    { id: id++, text: "" },
    {
      id: id++,
      text: "type help for commands. esc or ` to close.",
      tone: "dim",
    },
  ];
}

function useMatrix(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  on: boolean,
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!on || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    const size = 14 * dpr;
    const cols = Math.ceil(canvas.width / size);
    const drops = Array.from({ length: cols }, () => Math.random() * -50);
    const glyphs = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ0123456789ABCDEF<>/{}[]=+-*";
    let raf = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(15, 18, 25, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${size}px ui-monospace, Menlo, monospace`;
      for (let i = 0; i < cols; i++) {
        const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
        ctx.fillStyle = Math.random() < 0.06 ? "#e7e4dc" : "#7fc98a";
        ctx.fillText(ch, i * size, drops[i] * size);
        if (drops[i] * size > canvas.height && Math.random() > 0.975)
          drops[i] = 0;
        drops[i] += 1;
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [canvasRef, on]);
}

export function Terminal({
  build,
  cssTimelines,
  onClose,
}: {
  build: BuildInfo;
  cssTimelines: boolean;
  onClose: () => void;
}) {
  const [lines, setLines] = useState<Line[]>([]);
  const [partial, setPartial] = useState("");
  const [booted, setBooted] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const [toggles, setToggles] = useState<Record<Toggle, boolean>>({
    wire: false,
    grid: false,
    band: false,
  });
  const [matrix, setMatrix] = useState(false);
  const [live, setLive] = useState<Record<string, string>>({});

  const infoRef = useRef<SysInfo | null>(null);
  const skipRef = useRef(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shellRef = useRef<HTMLElement>(null);
  const idRef = useRef(1000);
  const openedAt = useRef(performance.now());

  useMatrix(canvasRef, matrix);

  const print = useCallback((text: string, tone?: Line["tone"]) => {
    setLines((prev) => [...prev, { id: idRef.current++, text, tone }]);
  }, []);

  // Boot sequence, typed out. Any key skips to the end.
  useEffect(() => {
    const info = collect(build, cssTimelines);
    infoRef.current = info;
    const script = bootScript(build, info);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let cancelled = false;

    const run = async () => {
      for (const line of script) {
        if (cancelled) return;
        if (reduced || skipRef.current) {
          setLines((prev) => [...prev, line]);
          continue;
        }
        let shown = "";
        for (const ch of line.text) {
          if (cancelled) return;
          if (skipRef.current) break;
          shown += ch;
          setPartial(shown);
          await new Promise((r) => setTimeout(r, ch === " " ? 4 : 7));
        }
        setPartial("");
        setLines((prev) => [...prev, line]);
        if (!skipRef.current)
          await new Promise((r) =>
            setTimeout(r, line.tone === "ok" ? 140 : 40),
          );
      }
      setBooted(true);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [build, cssTimelines]);

  useEffect(() => {
    if (booted) inputRef.current?.focus();
  }, [booted]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on every new line
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, partial]);

  // Live panel and key handling.
  useEffect(() => {
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
      const top = window.innerHeight * 0.18;
      const bottom = window.innerHeight * 0.38;
      let release = "none";
      for (const el of Array.from(
        document.querySelectorAll<HTMLElement>(".release"),
      )) {
        const r = el.getBoundingClientRect();
        if (r.top < bottom && r.bottom > top) {
          release = el.querySelector("h3")?.textContent ?? el.id;
          break;
        }
      }
      const up = (performance.now() - openedAt.current) / 1000;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setLive({
        clock: new Date().toISOString().slice(11, 19),
        uptime: `${Math.floor(up / 60)}m ${String(Math.floor(up % 60)).padStart(2, "0")}s`,
        fps: String(fps),
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        scroll: `${Math.round(window.scrollY)}px (${max > 0 ? Math.round((window.scrollY / max) * 100) : 0}%)`,
        release,
        driver: cssTimelines ? "css" : "js",
        online: navigator.onLine ? "yes" : "no",
      });
    };
    sample();
    const interval = window.setInterval(sample, 500);
    window.addEventListener("scroll", sample, { passive: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (!booted) {
        skipRef.current = true;
        return;
      }
      if (
        e.target !== inputRef.current &&
        e.key.length === 1 &&
        !e.metaKey &&
        !e.ctrlKey
      )
        inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(interval);
      window.removeEventListener("scroll", sample);
      window.removeEventListener("keydown", onKey);
      for (const t of TOGGLES)
        document.documentElement.removeAttribute(`data-debug-${t}`);
    };
  }, [booted, cssTimelines, onClose]);

  const setToggle = (id: Toggle, value?: boolean) => {
    const next = value ?? !toggles[id];
    document.documentElement.toggleAttribute(`data-debug-${id}`, next);
    setToggles((prev) => ({ ...prev, [id]: next }));
    print(`${id} ${next ? "on" : "off"}`, "ok");
  };

  const run = (raw: string) => {
    const cmd = raw.trim();
    print(`${PROMPT} ${cmd}`, "accent");
    if (!cmd) return;
    setHistory((h) => [cmd, ...h].slice(0, 50));
    setCursor(-1);
    const [name, ...args] = cmd.split(/\s+/);
    const arg = args[0]?.toLowerCase();
    const flag = arg === "on" ? true : arg === "off" ? false : undefined;
    const info = infoRef.current ?? {};

    switch (name.toLowerCase()) {
      case "help":
      case "?":
        for (const l of [
          "help            this list",
          "wire [on|off]   outline every box",
          "grid [on|off]   twelve column overlay",
          "band [on|off]   the strip that lights the release index",
          "matrix          you know what this does",
          "neofetch        system summary",
          "ls              sections on this page",
          "cd <section>    scroll to a section",
          "cat changelog   every release, newest first",
          "version         current version",
          "uptime          how long the console has been open",
          "clear           clear the screen",
          "exit            close the console",
        ])
          print(l);
        break;
      case "wire":
      case "wireframe":
        setToggle("wire", flag);
        break;
      case "grid":
        setToggle("grid", flag);
        break;
      case "band":
        setToggle("band", flag);
        break;
      case "matrix":
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          print("reduced motion is on. the matrix respects that.", "dim");
          break;
        }
        setMatrix((m) => {
          print(m ? "there is no spoon." : "wake up.", "dim");
          return !m;
        });
        break;
      case "neofetch":
      case "sysinfo":
        print(`guest@${location.host}`, "accent");
        print("-".repeat(24), "dim");
        for (const key of [
          "commit",
          "built",
          "region",
          "runtime",
          "host",
          "browser",
          "locale",
          "display",
          "cpu",
          "gpu",
          "net",
          "storage",
          "index",
          "page",
        ])
          print(`${key.padEnd(9)} ${info[key] ?? "n/a"}`);
        break;
      case "ls":
        for (const s of Array.from(
          document.querySelectorAll<HTMLElement>("main section[id]"),
        ))
          print(
            `${s.id.padEnd(14)} ${s.querySelector("h1, h2")?.textContent ?? ""}`,
          );
        break;
      case "cd": {
        const target = document.getElementById(arg ?? "");
        if (target) {
          const below = (shellRef.current?.offsetHeight ?? 0) + 16;
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - below,
            behavior: "instant",
          });
          print(`/${arg}`);
        } else print(`cd: no such section: ${arg ?? ""}`, "warn");
        break;
      }
      case "cat":
        if (/changelog/i.test(arg ?? "")) {
          for (const el of Array.from(
            document.querySelectorAll<HTMLElement>(".release"),
          )) {
            print(
              `${(el.querySelector("h3")?.textContent ?? "").padEnd(14)} ${el.querySelector("p")?.textContent ?? ""}`,
            );
          }
        } else print(`cat: ${arg ?? ""}: no such file`, "warn");
        break;
      case "version":
        print(`v${build.version} (${build.commit})`);
        break;
      case "uptime":
        print(live.uptime ?? "0s");
        break;
      case "whoami":
        print("guest");
        break;
      case "sudo":
        print(
          "guest is not in the sudoers file. This incident will be reported.",
          "warn",
        );
        break;
      case "rm":
        print("no.", "warn");
        break;
      case "clear":
      case "cls":
        setLines([]);
        break;
      case "exit":
      case "quit":
      case "q":
        onClose();
        break;
      default:
        print(`command not found: ${name}. try help.`, "warn");
    }
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "`" || e.key === "~") {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === "Enter") {
      run(input);
      setInput("");
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(cursor + 1, history.length - 1);
      setCursor(next);
      setInput(history[next] ?? "");
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.max(cursor - 1, -1);
      setCursor(next);
      setInput(next === -1 ? "" : (history[next] ?? ""));
    }
    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  const toneClass = (tone?: Line["tone"]) =>
    tone === "dim"
      ? "text-added/50"
      : tone === "ok"
        ? "text-added"
        : tone === "warn"
          ? "text-deprecated"
          : tone === "accent"
            ? "text-accent"
            : "text-added/85";

  return createPortal(
    <>
      <section
        ref={shellRef}
        aria-label="Console"
        className="terminal mono fixed inset-x-0 top-0 z-50 flex h-[70vh] max-h-[680px] flex-col border-added/25 border-b bg-ink/95 text-[12px] text-added leading-[1.55] shadow-2xl backdrop-blur-md"
      >
        <canvas
          ref={canvasRef}
          className={`pointer-events-none absolute inset-0 h-full w-full ${matrix ? "opacity-40" : "opacity-0"}`}
        />
        <div className="relative flex min-h-0 flex-1">
          <div
            ref={outputRef}
            className="min-w-0 flex-1 overflow-y-auto px-4 pt-3 pb-2 sm:px-6"
          >
            {lines.map((l) => (
              <div
                key={l.id}
                className={`whitespace-pre-wrap break-words ${toneClass(l.tone)}`}
              >
                {l.text || " "}
              </div>
            ))}
            {partial ? (
              <div className="whitespace-pre-wrap text-added/85">
                {partial}
                <span className="cursor" />
              </div>
            ) : null}
            {booted ? (
              <div className="flex items-baseline gap-2">
                <span className="text-accent">{PROMPT}</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onInputKey}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  aria-label="Command"
                  className="min-w-0 flex-1 border-0 bg-transparent p-0 text-added caret-added outline-none"
                />
              </div>
            ) : null}
          </div>
          <aside className="hidden w-56 shrink-0 border-added/20 border-l px-4 pt-3 text-added/80 md:block">
            <div className="mb-2 text-accent">live</div>
            <dl className="space-y-0.5">
              {Object.entries(live).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3">
                  <dt className="text-added/50">{k}</dt>
                  <dd className="truncate text-right">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3 mb-1 text-accent">flags</div>
            <dl className="space-y-0.5">
              {TOGGLES.map((t) => (
                <div key={t} className="flex justify-between gap-3">
                  <dt className="text-added/50">{t}</dt>
                  <dd>{toggles[t] ? "on" : "off"}</dd>
                </div>
              ))}
              <div className="flex justify-between gap-3">
                <dt className="text-added/50">matrix</dt>
                <dd>{matrix ? "on" : "off"}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>
      {toggles.grid ? <div aria-hidden="true" className="debug-grid" /> : null}
      {toggles.band ? <div aria-hidden="true" className="debug-band" /> : null}
    </>,
    document.body,
  );
}
