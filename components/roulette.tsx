"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** European wheel, clockwise from the zero. */
const ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];
const RED = new Set([
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
]);
const STEP = (Math.PI * 2) / ORDER.length;
const TOP = -Math.PI / 2;

type Bet = "red" | "black" | "zero";
const STAKE = 10;
const START = 100;
const KEY = "robblack.chips";

function colourOf(n: number): Bet {
  if (n === 0) return "zero";
  return RED.has(n) ? "red" : "black";
}

function outcome(bet: Bet, n: number): number {
  const c = colourOf(n);
  if (bet === "zero") return n === 0 ? STAKE * 35 : -STAKE;
  return c === bet ? STAKE : -STAKE;
}

function readChips(): number {
  try {
    const v = Number(window.localStorage.getItem(KEY));
    return Number.isFinite(v) && v > 0 ? v : START;
  } catch {
    return START;
  }
}

function writeChips(n: number) {
  try {
    window.localStorage.setItem(KEY, String(n));
  } catch {
    // Private mode. The house will forget you.
  }
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeOutQuint = (t: number) => 1 - (1 - t) ** 5;

interface Palette {
  ink: string;
  panel: string;
  line: string;
  fg: string;
  muted: string;
  accent: string;
  red: string;
  green: string;
  black: string;
}

function readPalette(): Palette {
  const css = getComputedStyle(document.documentElement);
  const v = (name: string, fallback: string) =>
    css.getPropertyValue(name).trim() || fallback;
  return {
    ink: v("--color-ink", "#0f1219"),
    panel: v("--color-panel", "#151923"),
    line: v("--color-line-strong", "#343b4b"),
    fg: v("--color-fg", "#e7e4dc"),
    muted: v("--color-muted", "#8e96a6"),
    accent: v("--color-accent", "#f0b35b"),
    red: v("--color-removed", "#e27878"),
    green: v("--color-added", "#7fc98a"),
    black: v("--color-line", "#252b38"),
  };
}

function draw(
  canvas: HTMLCanvasElement,
  p: Palette,
  wheel: number,
  ball: { angle: number; radius: number } | null,
  highlight: number | null,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const size = canvas.width;
  const c = size / 2;
  const outer = c - 6;
  const rim = outer - 10;
  const inner = rim * 0.62;

  ctx.clearRect(0, 0, size, size);

  // Rim
  ctx.beginPath();
  ctx.arc(c, c, outer, 0, Math.PI * 2);
  ctx.fillStyle = p.panel;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = p.line;
  ctx.stroke();

  // Pockets
  ORDER.forEach((n, i) => {
    const a0 = wheel + i * STEP - STEP / 2;
    const a1 = a0 + STEP;
    ctx.beginPath();
    ctx.arc(c, c, rim, a0, a1);
    ctx.arc(c, c, inner, a1, a0, true);
    ctx.closePath();
    const kind = colourOf(n);
    ctx.fillStyle =
      kind === "zero" ? p.green : kind === "red" ? p.red : p.black;
    if (highlight === i) ctx.fillStyle = p.accent;
    ctx.fill();
    ctx.strokeStyle = p.line;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Number
    const mid = wheel + i * STEP;
    ctx.save();
    ctx.translate(
      c + Math.cos(mid) * (rim - 14),
      c + Math.sin(mid) * (rim - 14),
    );
    ctx.rotate(mid + Math.PI / 2);
    ctx.fillStyle = highlight === i ? p.ink : p.fg;
    ctx.font = `600 ${Math.round(size * 0.036)}px ui-monospace, Menlo, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(n), 0, 0);
    ctx.restore();
  });

  // Hub
  ctx.beginPath();
  ctx.arc(c, c, inner - 4, 0, Math.PI * 2);
  ctx.fillStyle = p.panel;
  ctx.fill();
  ctx.strokeStyle = p.line;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(c, c, inner * 0.18, 0, Math.PI * 2);
  ctx.fillStyle = p.accent;
  ctx.fill();

  // Marker at the top
  ctx.beginPath();
  ctx.moveTo(c - 6, 2);
  ctx.lineTo(c + 6, 2);
  ctx.lineTo(c, 12);
  ctx.closePath();
  ctx.fillStyle = p.accent;
  ctx.fill();

  // Ball
  if (ball) {
    ctx.beginPath();
    ctx.arc(
      c + Math.cos(ball.angle) * ball.radius,
      c + Math.sin(ball.angle) * ball.radius,
      size * 0.018,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = p.fg;
    ctx.fill();
  }
}

export function Roulette({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const paletteRef = useRef<Palette | null>(null);
  const wheelRef = useRef(0);
  const frameRef = useRef(0);

  const [chips, setChips] = useState(START);
  const [bet, setBet] = useState<Bet>("red");
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ n: number; delta: number } | null>(
    null,
  );
  const [spins, setSpins] = useState(0);

  const render = useCallback(
    (
      ball: { angle: number; radius: number } | null,
      highlight: number | null,
    ) => {
      const canvas = canvasRef.current;
      const p = paletteRef.current;
      if (canvas && p) draw(canvas, p, wheelRef.current, ball, highlight);
    },
    [],
  );

  useEffect(() => {
    paletteRef.current = readPalette();
    setChips(readChips());
    const canvas = canvasRef.current;
    if (canvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const css = canvas.clientWidth;
      canvas.width = Math.round(css * dpr);
      canvas.height = Math.round(css * dpr);
    }
    render(
      { angle: TOP, radius: (canvasRef.current?.width ?? 300) / 2 - 22 },
      null,
    );
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(frameRef.current);
    };
  }, [onClose, render]);

  const spin = () => {
    if (spinning || chips < STAKE) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSpinning(true);
    setResult(null);

    const win = Math.floor(Math.random() * ORDER.length);
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const duration = reduced ? 400 : 4200;

    const start = wheelRef.current;
    // Pocket `win` must finish under the marker at the top.
    let target = TOP - win * STEP;
    while (target < start + Math.PI * 2 * 4) target += Math.PI * 2;

    const size = canvas.width;
    const rOuter = size / 2 - 22;
    const rPocket =
      (size / 2 - 16) * 0.62 + (size / 2 - 16 - (size / 2 - 16) * 0.62) * 0.55;
    const ballTurns = Math.PI * 2 * 7;
    const t0 = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      wheelRef.current = start + (target - start) * easeOutCubic(t);
      // Ball runs the other way, slows faster than the wheel, then drops in.
      const ballAngle = TOP - ballTurns * (1 - easeOutQuint(t));
      const drop = Math.max(0, (t - 0.72) / 0.28);
      const radius = rOuter - (rOuter - rPocket) * easeOutCubic(drop);
      // Once dropped, the ball rides the pocket.
      const riding = t > 0.94;
      const ball = riding
        ? { angle: wheelRef.current + win * STEP, radius: rPocket }
        : { angle: ballAngle, radius };
      render(ball, t === 1 ? win : null);
      if (t < 1) {
        frameRef.current = requestAnimationFrame(step);
        return;
      }
      const n = ORDER[win];
      const delta = outcome(bet, n);
      const next = Math.max(0, chips + delta);
      setChips(next);
      writeChips(next);
      setResult({ n, delta });
      setSpins((s) => s + 1);
      setSpinning(false);
    };
    frameRef.current = requestAnimationFrame(step);
  };

  const topUp = () => {
    setChips(START);
    writeChips(START);
    setResult(null);
  };

  const broke = chips < STAKE;
  const bets: { id: Bet; label: string; odds: string }[] = [
    { id: "red", label: "Red", odds: "1:1" },
    { id: "black", label: "Black", odds: "1:1" },
    { id: "zero", label: "Zero", odds: "35:1" },
  ];

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/90 p-4 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="roulette-title"
          className="w-[min(92vw,24rem)] rounded-xl border border-line bg-panel p-5 shadow-2xl"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="roulette-title"
                className="display-sm text-lg font-medium"
              >
                Table 18.07
              </h2>
              <p className="mono mt-1 text-xs text-muted">
                European wheel · house edge 2.7%
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="mono rounded-md border border-line px-2 py-1 text-xs text-muted hover:text-fg"
            >
              esc
            </button>
          </div>

          <canvas
            ref={canvasRef}
            className="mx-auto mt-4 aspect-square w-full max-w-[16rem]"
            aria-label="Roulette wheel"
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="mono text-sm">
              <span className="text-muted">chips </span>
              <span
                className={`font-medium ${broke ? "text-removed" : "text-fg"}`}
              >
                {chips}
              </span>
            </div>
            <fieldset className="flex gap-2">
              <legend className="sr-only">Bet</legend>
              {bets.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  aria-pressed={bet === b.id}
                  disabled={spinning}
                  onClick={() => setBet(b.id)}
                  className={`tag cursor-pointer transition-colors ${bet === b.id ? "border-accent text-fg" : "hover:text-fg"}`}
                >
                  {b.label} <span className="text-faint">{b.odds}</span>
                </button>
              ))}
            </fieldset>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="mono min-h-[1.25rem] text-sm" aria-live="polite">
              {result
                ? `${result.n} ${colourOf(result.n)}. ${result.delta > 0 ? `+${result.delta}` : result.delta} chips.`
                : spinning
                  ? "No more bets."
                  : broke
                    ? "The house always wins. Ask any iGaming developer."
                    : `${STAKE} on ${bet}.`}
            </p>
            {broke ? (
              <button
                type="button"
                onClick={topUp}
                className="version-pill cursor-pointer text-sm"
              >
                Another {START}
              </button>
            ) : (
              <button
                type="button"
                onClick={spin}
                disabled={spinning}
                className="version-pill cursor-pointer text-sm disabled:cursor-wait disabled:opacity-60"
              >
                Spin
              </button>
            )}
          </div>

          {spins > 0 && !broke ? (
            <p className="mt-3 text-xs text-faint">
              Built roulette for a living once. This one pays out nothing, on
              purpose.
            </p>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
