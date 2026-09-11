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
  node?: React.ReactNode;
}

type SysInfo = Record<string, string>;

const PROMPT = "guest@robblack.dev:~$";
const CODENAME = "Warty Warthog";

/** Console state outlives the component, so closing and reopening resumes. */
const session = {
  lines: [] as Line[],
  history: [] as string[],
  booted: false,
  toggles: { wire: false, grid: false, band: false } as Record<Toggle, boolean>,
  matrix: false,
  openedAt: 0,
  nextId: 1,
};

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
    if (gl) {
      // Firefox exposes the real renderer via RENDERER and deprecates the
      // extension; Chromium still needs the extension for the unmasked name.
      const firefox = /firefox/i.test(navigator.userAgent);
      const ext = firefox ? null : gl.getExtension("WEBGL_debug_renderer_info");
      gpu = String(
        ext
          ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
          : gl.getParameter(gl.RENDERER),
      );
    }
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
    resolution: `${window.innerWidth}x${window.innerHeight} @${window.devicePixelRatio}x`,
    cpu: `${navigator.hardwareConcurrency ?? "?"} cores`,
    memory: nav.deviceMemory ? `${nav.deviceMemory} GB` : "undisclosed",
    gpu,
    net: `${nav.connection?.effectiveType ?? "unknown"}${nav.connection?.rtt != null ? `, rtt ${nav.connection.rtt}ms` : ""}${nav.connection?.downlink != null ? `, ${nav.connection.downlink} Mbps` : ""}, ${navigator.onLine ? "online" : "offline"}`,
    touch: `${navigator.maxTouchPoints} touch points`,
    storage: `localStorage ${storage}, cookies ${navigator.cookieEnabled ? "enabled" : "disabled"}`,
    fonts: fonts.join(", ") || "system fallback",
    index: cssTimelines
      ? "scroll-driven timelines supported"
      : "scroll-driven timelines unsupported, js fallback armed",
    releases: String(document.querySelectorAll(".release").length),
    changes: String(document.querySelectorAll(".kind").length),
    words: String(
      (document.querySelector("main")?.innerText ?? "").trim().split(/\s+/)
        .length,
    ),
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
  const k = (text: string, tone?: Line["tone"]) => {
    t += 0.0004 + Math.random() * 0.0011;
    return { id: session.nextId++, text: `[${pad(t)}] ${text}`, tone };
  };
  const ok = (text: string) => ({
    id: session.nextId++,
    text: `[  OK  ] ${text}`,
    tone: "ok" as const,
  });
  const plain = (text: string, tone?: Line["tone"]) => ({
    id: session.nextId++,
    text,
    tone,
  });
  return [
    plain(`robblack.dev bootloader v${build.version}`, "accent"),
    plain(""),
    k(`commit ${info.commit}, built ${info.built}, region ${info.region}`),
    k(info.runtime),
    k(`host ${info.host}`),
    k(`timing ${info.timing}, first paint ${info.paint}`),
    k(`transfer ${info.transfer}`),
    k(`ua ${info.browser}`),
    k(`locale ${info.locale}`),
    k(`display ${info.display}`),
    k(`cpu ${info.cpu}, memory ${info.memory}`),
    k(`gpu ${info.gpu}`),
    k(`net ${info.net}`),
    k(`input ${info.touch}`),
    k(`storage ${info.storage}`),
    k(`fonts ${info.fonts}`),
    k(`index ${info.index}`),
    k(
      `page ${info.releases} releases, ${info.changes} changes, ${info.words} words`,
    ),
    k(`motion prefers-reduced-motion: ${info.motion}, scheme ${info.scheme}`),
    k(`referrer ${info.referrer}`),
    k(`ip ${info.ip}`, "dim"),
    ok("Mounted /changelog."),
    ok("Started Release Index Service."),
    ok("Reached target robblack.dev."),
    plain(""),
    plain("type help for commands. esc or ` to close.", "dim"),
  ];
}

const LOGO = [
  " ██████╗ ██████╗ ",
  " ██╔══██╗██╔══██╗",
  " ██████╔╝██████╔╝",
  " ██╔══██╗██╔══██╗",
  " ██║  ██║██████╔╝",
  " ╚═╝  ╚═╝╚═════╝ ",
];

const TRAIN = [
  "      ====        ________                ___________ ",
  "  _D _|  |_______/        \\__I_I_____===__|_________| ",
  "   |(_)---  |   H\\________/ |   |        =|___ ___|   ",
  "   /     |  |   H  |  |     |   |         ||_| |_||   ",
  "  |      |  |   H  |__--------------------| [___] |   ",
  "  | ________|___H__/__|_____/[][]~\\_______|       |   ",
  "  |/ |   |-----------I_____I [][] []  D   |=======|__ ",
  "__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__ ",
  " |/-=|___|=    ||    ||    ||    |_____/~\\___/        ",
  "  \\_/      \\O=====O=====O=====O_/      \\_/            ",
];

const DISTROS = [
  ["1997", "Red Hat Linux 4", "first install. a lot of floppies."],
  ["1998", "ZipSlack", "Slackware on a 100 MB Zip disk. it fit. just."],
  [
    "2000",
    "Mandrake 7",
    "KDE, a graphical installer, and no idea what to do next.",
  ],
  ["2003", "SUSE", "YaST was magic. the box was enormous."],
  [
    "2004",
    "Ubuntu 4.10 Warty Warthog",
    "the first one. daily driven for a while.",
  ],
  ["2005", "Ubuntu 5.04 Hoary Hedgehog", "the one that stuck in memory."],
];

const FORTUNES = [
  "It was 2000. It made sense at the time.",
  "Initial commit. No tests. We were young.",
  "Someone has to standardise the laptops.",
  "The syndication partner made more.",
  "Not proud. Very effective.",
  "Git. Just started using it.",
  "Side hustles have lifecycles too.",
  "The judgement is not.",
  "Start from yes, then work out how, then say what it will cost.",
];

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
    let frame = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      frame += 1;
      if (frame % 3 !== 0) return; // about 20 steps a second, not 60
      ctx.fillStyle = "rgba(15, 18, 25, 0.16)";
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
  const [lines, setLines] = useState<Line[]>(session.lines);
  const [partial, setPartial] = useState("");
  const [booted, setBooted] = useState(session.booted);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>(session.history);
  const [cursor, setCursor] = useState(-1);
  const [toggles, setToggles] = useState(session.toggles);
  const [matrix, setMatrix] = useState(session.matrix);
  const [live, setLive] = useState<Record<string, string>>({});
  const [bootKey, setBootKey] = useState(0);

  const infoRef = useRef<SysInfo | null>(null);
  const skipRef = useRef(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shellRef = useRef<HTMLElement>(null);
  const restoredRef = useRef(false);

  useMatrix(canvasRef, matrix);

  // Keep the module session in step so the next open resumes here.
  useEffect(() => {
    session.lines = lines;
    session.history = history;
    session.booted = booted;
    session.toggles = toggles;
    session.matrix = matrix;
  }, [lines, history, booted, toggles, matrix]);

  const print = useCallback(
    (text: string, tone?: Line["tone"], node?: React.ReactNode) => {
      setLines((prev) => [...prev, { id: session.nextId++, text, tone, node }]);
    },
    [],
  );

  // Boot once per session. Any key skips to the end. `reboot` runs it again.
  useEffect(() => {
    const info = collect(build, cssTimelines);
    infoRef.current = info;
    if (session.booted && bootKey === 0) {
      if (!session.openedAt) session.openedAt = performance.now();
      if (!restoredRef.current) {
        restoredRef.current = true;
        print("session restored. type help for commands.", "dim");
      }
      return;
    }
    session.openedAt = performance.now();
    skipRef.current = false;
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
  }, [build, cssTimelines, bootKey, print]);

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
      const up = (performance.now() - session.openedAt) / 1000;
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
        // The Enter that submitted `reboot` is still bubbling; ignore it.
        if (e.target instanceof HTMLInputElement || e.key === "Enter") return;
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
    };
  }, [booted, cssTimelines, onClose]);

  const setToggle = (id: Toggle, value?: boolean) => {
    const next = value ?? !toggles[id];
    document.documentElement.toggleAttribute(`data-debug-${id}`, next);
    setToggles((prev) => ({ ...prev, [id]: next }));
    print(`${id} ${next ? "on" : "off"}`, "ok");
  };

  const uptimeText = () => {
    const up = (performance.now() - session.openedAt) / 1000;
    return `${Math.floor(up / 60)}m ${String(Math.floor(up % 60)).padStart(2, "0")}s`;
  };

  const neofetch = () => {
    const info = infoRef.current ?? {};
    const rows: [string, string][] = [
      ["OS", `robblack.dev ${build.version.slice(0, 5)} "${CODENAME}"`],
      [
        "Host",
        `${info.region === "local" ? "localhost" : "Vercel"} (${info.commit})`,
      ],
      ["Kernel", `next ${build.next}`],
      ["Uptime", uptimeText()],
      ["Packages", `${info.releases} releases, ${info.changes} changes`],
      ["Shell", "guest (backtick)"],
      ["Resolution", info.resolution ?? "n/a"],
      ["DE", "Bricolage Grotesque"],
      ["WM", "Tailwind 4"],
      ["Terminal", `${info.browser ?? "unknown"}`],
      ["CPU", info.cpu ?? "n/a"],
      ["GPU", info.gpu ?? "n/a"],
      ["Memory", info.memory ?? "n/a"],
    ];
    const bars = [
      "#0f1219",
      "#e27878",
      "#7fc98a",
      "#e7a94f",
      "#74b0ea",
      "#b9a0f2",
      "#8e96a6",
      "#e7e4dc",
    ];
    const text = [
      `guest@robblack.dev`,
      ...rows.map(([k, v]) => `${k}: ${v}`),
    ].join("\n");
    print(
      text,
      undefined,
      <div className="flex gap-6">
        <pre className="text-accent leading-[1.2]">{LOGO.join("\n")}</pre>
        <div>
          <div className="text-accent">guest@robblack.dev</div>
          <div className="text-added/50">{"-".repeat(18)}</div>
          {rows.map(([k, v]) => (
            <div key={k}>
              <span className="text-accent">{k}</span>
              <span className="text-added/85">: {v}</span>
            </div>
          ))}
          <div className="mt-2 flex">
            {bars.map((c) => (
              <span
                key={c}
                className="inline-block h-[1.2em] w-[3ch]"
                style={{ background: c }}
              />
            ))}
          </div>
          <div className="flex opacity-60">
            {bars.map((c) => (
              <span
                key={c}
                className="inline-block h-[1.2em] w-[3ch]"
                style={{ background: c }}
              />
            ))}
          </div>
        </div>
      </div>,
    );
  };

  const run = (raw: string) => {
    const cmd = raw.trim();
    print(`${PROMPT} ${cmd}`, "accent");
    if (!cmd) return;
    setHistory((h) => [cmd, ...h].slice(0, 50));
    setCursor(-1);
    const [name, ...args] = cmd.split(/\s+/);
    const arg = args[0]?.toLowerCase();
    const rest = args.join(" ");
    const flag = arg === "on" ? true : arg === "off" ? false : undefined;
    const info = infoRef.current ?? {};
    const lower = name.toLowerCase();

    switch (lower) {
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
          "reboot          run the boot sequence again",
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
        print(matrix ? "there is no spoon." : "wake up.", "dim");
        setMatrix((m) => !m);
        break;
      case "neofetch":
      case "screenfetch":
      case "sysinfo":
        neofetch();
        break;
      case "ls":
        if (
          args.includes("-la") ||
          args.includes("-l") ||
          args.includes("-a")
        ) {
          print("drwxr-xr-x  guest  guest  changelog");
          print("drwxr-xr-x  guest  guest  builds");
          print("drwxr-xr-x  guest  guest  dependencies");
          print("drwxr-xr-x  guest  guest  contributing");
          print("-rw-------  rob    rob    .plans", "dim");
          break;
        }
        for (const s of Array.from(
          document.querySelectorAll<HTMLElement>("main section[id]"),
        ))
          print(
            `${s.id.padEnd(14)} ${s.querySelector("h1, h2")?.textContent ?? ""}`,
          );
        break;
      case "cd": {
        if (!arg || arg === "~" || arg === "..") {
          window.scrollTo({ top: 0, behavior: "instant" });
          print("/");
          break;
        }
        const target = document.getElementById(arg);
        if (target) {
          const below = (shellRef.current?.offsetHeight ?? 0) + 16;
          window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - below,
            behavior: "instant",
          });
          print(`/${arg}`);
        } else print(`cd: no such section: ${arg}`, "warn");
        break;
      }
      case "pwd":
        print("/home/guest");
        break;
      case "cat":
        if (/changelog/i.test(arg ?? "")) {
          for (const el of Array.from(
            document.querySelectorAll<HTMLElement>(".release"),
          ))
            print(
              `${(el.querySelector("h3")?.textContent ?? "").padEnd(14)} ${el.querySelector("p")?.textContent ?? ""}`,
            );
        } else if (/passwd|shadow/i.test(arg ?? ""))
          print("cat: nice try.", "warn");
        else if (/\.plans?/i.test(arg ?? ""))
          print("cat: .plans: permission denied. ask rob.", "warn");
        else print(`cat: ${arg ?? ""}: no such file`, "warn");
        break;
      case "git":
        if (arg === "log") {
          for (const el of Array.from(
            document.querySelectorAll<HTMLElement>(".release"),
          ))
            print(
              `${(el.querySelector("h3")?.textContent ?? "").padEnd(14)} ${el.querySelector("p")?.textContent ?? ""}`,
            );
        } else if (arg === "status") {
          print("On branch main");
          print("nothing to commit, working tree clean. for once.");
        } else if (arg === "blame") print("rob. always rob.");
        else print(`git ${arg ?? ""}: try log, status or blame.`, "dim");
        break;
      case "version":
        print(`v${build.version} (${build.commit})`);
        break;
      case "uname":
        print(
          `robblack.dev ${build.version}-vercel #${build.commit} SMP ${info.built ?? ""} x86_64 GNU/Next`,
        );
        break;
      case "uptime":
        print(uptimeText());
        break;
      case "date":
        print(new Date().toString());
        break;
      case "whoami":
        print("guest");
        break;
      case "who":
      case "w":
        print("guest    tty1    now   (you)");
        print("rob      tty0    1998  (still here)");
        break;
      case "echo":
        print(rest);
        break;
      case "history": {
        const past = history.slice().reverse();
        for (let i = 0; i < past.length; i++)
          print(`${String(i + 1).padStart(4)}  ${past[i]}`);
        break;
      }
      case "man":
        print(`No manual entry for ${arg ?? "man"}. try help.`, "dim");
        break;
      case "sudo":
        print(
          "guest is not in the sudoers file. This incident will be reported.",
          "warn",
        );
        break;
      case "su":
        print(
          "su: authentication failure. it was never going to be 'password'.",
          "warn",
        );
        break;
      case "rm":
        print(/-rf/.test(rest) ? "no. and I saw that." : "no.", "warn");
        break;
      case "vim":
      case "vi":
        print("you would never leave. declined.", "warn");
        break;
      case "emacs":
        print("not enough memory. or fingers.", "warn");
        break;
      case "nano":
        print("fine. but not here.", "dim");
        break;
      case "top":
      case "htop":
      case "ps":
        print("  PID  %CPU  %MEM  COMMAND");
        print("    1   0.1   1.2  next");
        print("    2   0.4   3.0  react");
        print("    3   0.0   0.4  tailwind");
        print("    4   2.1   0.9  changelog");
        print("    5   0.0   0.0  jquery  <defunct>", "dim");
        break;
      case "df":
        navigator.storage?.estimate?.().then((e) => {
          const used = ((e.usage ?? 0) / 1024 / 1024).toFixed(1);
          const quota = ((e.quota ?? 0) / 1024 / 1024 / 1024).toFixed(1);
          print(`Filesystem   Size   Used  Mounted on`);
          print(`origin      ${quota.padStart(4)}G ${used.padStart(6)}M  /`);
        });
        break;
      case "free":
        print(`              total   used`);
        print(`Mem:      ${(info.memory ?? "n/a").padStart(9)}   some`);
        break;
      case "ping":
        print(`PONG ${arg ?? "robblack.dev"}: time=0.1 ms (it is right here)`);
        break;
      case "ssh":
      case "telnet":
        print("connection refused. politely.", "warn");
        break;
      case "curl":
      case "wget":
        print("you are already here.", "dim");
        break;
      case "npm":
      case "pnpm":
      case "yarn":
        print("already up to date. 0 vulnerabilities. we checked.");
        break;
      case "docker":
        print("it works on my machine.", "dim");
        break;
      case "make":
        print(
          arg
            ? `make: *** No rule to make target '${rest}'. Stop.`
            : "make: *** No targets. Stop.",
          "warn",
        );
        break;
      case "coffee":
      case "tea":
        print("418 I'm a teapot.", "warn");
        break;
      case "hack":
        print(
          /planet/i.test(rest)
            ? "HACK THE PLANET."
            : "mess with the best, die like the rest.",
          "accent",
        );
        break;
      case "neo":
      case "wake":
        print("follow the white rabbit.", "dim");
        break;
      case "xyzzy":
      case "plugh":
        print("nothing happens.", "dim");
        break;
      case "42":
        print("so long, and thanks for all the fish.", "dim");
        break;
      case "hello":
      case "hi":
      case "hey":
        print("hello. type help.");
        break;
      case "fortune":
        print(FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);
        break;
      case "cowsay": {
        const msg = rest || "moo";
        print(` ${"_".repeat(msg.length + 2)}`);
        print(`< ${msg} >`);
        print(` ${"-".repeat(msg.length + 2)}`);
        print("        \\   ^__^");
        print("         \\  (oo)\\_______");
        print("            (__)\\       )\\/\\");
        print("                ||----w |");
        print("                ||     ||");
        break;
      }
      case "sl":
        for (const l of TRAIN) print(l, "accent");
        print("you meant ls. everyone does.", "dim");
        break;
      case "distros":
      case "lineage":
        print("distributions, as remembered. dates approximate.", "dim");
        for (const [year, name, note] of DISTROS)
          print(`${year}  ${name.padEnd(28)} ${note}`);
        break;
      case "konami":
        print(
          "up up down down left right left right b a. you are already here.",
          "dim",
        );
        break;
      case "reboot":
      case "restart":
        setLines([]);
        setBooted(false);
        setBootKey((k) => k + 1);
        break;
      case "shutdown":
      case "poweroff":
      case "halt":
        print("the system is going down for halt NOW.", "warn");
        window.setTimeout(onClose, 500);
        break;
      case "clear":
      case "cls":
        setLines([]);
        break;
      case "exit":
      case "quit":
      case "q":
      case "logout":
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
                {l.node ?? (l.text || " ")}
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
