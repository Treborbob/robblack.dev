"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { currentVersion } from "@/lib/version";

const Roulette = dynamic(() => import("./roulette").then((m) => m.Roulette), {
  ssr: false,
});

declare global {
  interface Window {
    roulette?: () => void;
    __rbHinted?: boolean;
  }
}

/**
 * Wraps one word in the changelog. Looks like text, opens a roulette table.
 * Also registers window.roulette() and leaves a note in the console for the
 * kind of person who opens it.
 */
export function RouletteWord({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.roulette = () => setOpen(true);
    if (!window.__rbHinted) {
      window.__rbHinted = true;
      console.log(
        `%cv${currentVersion()}%c  Every release, newest first.\n` +
          "There is a table somewhere on this page. Or type roulette() here.",
        "color:#f0b35b;font-family:monospace;font-weight:600",
        "color:inherit",
      );
    }
    return () => {
      window.roulette = undefined;
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="roulette (press to play)"
        className="cursor-pointer appearance-none border-0 bg-transparent p-0 font-[inherit] text-[length:inherit] text-inherit"
      >
        {children}
      </button>
      {open ? <Roulette onClose={() => setOpen(false)} /> : null}
    </>
  );
}
