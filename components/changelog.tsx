import { type Release, releases } from "@/lib/content";
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
  return `v${(release.rangeLabel ?? release.version).replace(/[^0-9a-z]+/gi, "-")}`;
}

export function Changelog() {
  return (
    <Section
      id="changelog"
      file="CHANGELOG.md"
      title="Every release, newest first."
      lede="Major version is years since 1999. Minor is the month. Patches are unreleased."
    >
      <div className="grid gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="Release index" className="hidden lg:block">
          <ol className="mono sticky top-24 space-y-2 text-xs">
            {releases.map((release) => (
              <li key={release.version}>
                <a
                  href={`#${anchorFor(release)}`}
                  className="group flex items-baseline gap-3 text-muted transition-colors hover:text-fg"
                >
                  <span className="w-[6rem] shrink-0 text-accent/80 group-hover:text-accent">
                    v{release.rangeLabel ?? release.version}
                  </span>
                  <span className="truncate">{release.org}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <ol className="space-y-14">
          {releases.map((release) => (
            <li
              key={release.version}
              id={anchorFor(release)}
              className="reveal scroll-mt-24"
            >
              <article>
                <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="mono text-xl font-medium text-accent">
                    v{release.rangeLabel ?? release.version}
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
                      <span className={`kind kind-${change.kind} pt-[0.2rem]`}>
                        {kindLabel[change.kind]}
                      </span>
                      <p
                        className={`max-w-[62ch] leading-relaxed ${change.kind === "note" ? "text-muted" : "text-fg/90"}`}
                      >
                        {change.text}
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
