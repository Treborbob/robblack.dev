import { focusAreas, intro, person } from "@/lib/content";
import { currentVersion, yearsShipping } from "@/lib/version";

export function Hero() {
  const version = currentVersion();
  return (
    <section
      id="top"
      className="mx-auto max-w-6xl px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28"
    >
      <p
        className="eyebrow rise"
        style={{ "--delay": "0ms" } as React.CSSProperties}
      >
        {person.name} / release notes
      </p>

      <h1 className="display mt-6 text-[2.75rem] font-semibold sm:text-6xl lg:text-7xl">
        <span
          className="rise block"
          style={{ "--delay": "80ms" } as React.CSSProperties}
        >
          {intro.headline[0]}
        </span>
        <span
          className="rise block text-muted"
          style={{ "--delay": "180ms" } as React.CSSProperties}
        >
          {intro.headline[1]}
        </span>
      </h1>

      <dl
        className="rise mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm"
        style={{ "--delay": "300ms" } as React.CSSProperties}
      >
        <div className="flex items-center gap-2">
          <dt className="sr-only">Current version</dt>
          <dd className="version-pill">v{version}</dd>
        </div>
        <div className="mono flex items-center gap-2 text-muted">
          <dt className="sr-only">Status</dt>
          <dd className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-added"
            />
            stable
          </dd>
        </div>
        <span aria-hidden="true" className="text-faint">
          ·
        </span>
        <div className="mono text-muted">
          <dt className="sr-only">Years shipping</dt>
          <dd>{yearsShipping()} years in production</dd>
        </div>
        <span aria-hidden="true" className="text-faint">
          ·
        </span>
        <div className="mono text-muted">
          <dt className="sr-only">Location</dt>
          <dd>{person.location}</dd>
        </div>
      </dl>

      <div
        className="rise mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20"
        style={{ "--delay": "420ms" } as React.CSSProperties}
      >
        <div className="prose-block max-w-[58ch] text-lg leading-relaxed text-fg/90">
          {intro.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <p className="mono mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <a className="link" href={`mailto:${person.email}`}>
              {person.email}
            </a>
            <a
              className="link"
              href={person.github}
              rel="me noopener"
              target="_blank"
            >
              github
            </a>
            <a
              className="link"
              href={person.linkedin}
              rel="me noopener"
              target="_blank"
            >
              linkedin
            </a>
          </p>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="eyebrow">Current release</h2>
            <p className="mono text-xs text-faint">
              {person.currentRole} · {person.currentOrg}
            </p>
          </div>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {focusAreas.map((area) => (
              <li
                key={area.title}
                className="grid gap-1 py-4 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-6"
              >
                <h3 className="display-sm text-base font-medium">
                  {area.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {area.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
