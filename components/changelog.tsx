import { type Release, releases } from "@/lib/content";
import { RouletteWord } from "./roulette-trigger";
import { Section } from "./section";

const kindLabel: Record<Release["changes"][number]["kind"], string> = {
  added: "Added",
  changed: "Changed",
  deprecated: "Deprecated",
  removed: "Removed",
  fixed: "Fixed",
  note: "Note",
};

function anchorFor(release: Release) {
  return `v${release.version.replace(/[^0-9a-z]+/gi, "-")}`;
}

/** One word on the page is not what it seems. */
function withEgg(text: string) {
  const word = "roulette";
  const at = text.indexOf(word);
  if (at === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      <RouletteWord>{word}</RouletteWord>
      {text.slice(at + word.length)}
    </>
  );
}

export function Changelog() {
  const scope = releases.map((_, i) => `--r${i}`).join(", ");
  return (
    <Section
      id="changelog"
      file="CHANGELOG.md"
      title="Every release, newest first."
      lede="Calendar versioned. One rollback, and it was on purpose."
    >
      <div
        className="changelog-scope grid gap-12 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16"
        style={{ "--scope": scope } as React.CSSProperties}
      >
        <nav aria-label="Release index" className="hidden lg:block">
          <ol className="mono sticky top-24 space-y-2 text-xs">
            {releases.map((release, i) => (
              <li key={release.version}>
                <a
                  href={`#${anchorFor(release)}`}
                  className="index-link flex items-baseline gap-3 text-muted transition-colors hover:text-fg"
                  style={{ "--tl": `--r${i}` } as React.CSSProperties}
                >
                  <span className="w-[7rem] shrink-0">v{release.version}</span>
                  <span className="truncate">{release.org}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <ol className="space-y-14">
          {releases.map((release, i) => (
            <li
              key={release.version}
              id={anchorFor(release)}
              className="release reveal scroll-mt-24"
              style={{ "--tl": `--r${i}` } as React.CSSProperties}
            >
              <article>
                <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="mono text-xl font-medium text-fg">
                    v{release.version}
                  </h3>
                  <time
                    dateTime={release.dateTime}
                    className="mono text-sm text-muted"
                  >
                    {release.date}
                  </time>
                </header>
                <p className="display-sm mt-2 text-2xl font-medium">
                  {release.org}
                  <span className="text-muted"> · {release.role}</span>
                </p>
                <ul className="mt-6 space-y-3 border-l border-line pl-5">
                  {release.changes.map((change) => (
                    <li
                      key={change.text.slice(0, 32)}
                      className="grid gap-1 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-4"
                    >
                      <span
                        className={`kind kind-${change.kind} self-start pt-[0.35rem]`}
                      >
                        {kindLabel[change.kind]}
                      </span>
                      <p
                        className={`max-w-[62ch] leading-relaxed ${change.kind === "note" ? "text-muted" : "text-fg/90"}`}
                      >
                        {withEgg(change.text)}
                      </p>
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
