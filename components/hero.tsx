import { focusAreas, intro, person } from "@/lib/content";
import { currentVersion, yearsShipping } from "@/lib/version";
import { Phosphor } from "./phosphor";

export function Hero() {
  const version = currentVersion();
  const years = yearsShipping();
  return (
    <section id="top" className="relative">
      <Phosphor />
      <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-16 sm:px-8 sm:pt-24 sm:pb-20">
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
          className="rise mono mt-10 flex flex-col items-start gap-y-2 text-sm text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 lg:gap-x-3 lg:[&>div+div]:before:mr-3 lg:[&>div+div]:before:text-faint lg:[&>div+div]:before:content-['·']"
          style={{ "--delay": "300ms" } as React.CSSProperties}
        >
          <div className="flex items-center gap-3 whitespace-nowrap">
            <dt className="sr-only">Current version</dt>
            <dd className="version-pill">v{version}</dd>
            <dt className="sr-only">Status</dt>
            <dd className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-added"
              />
              stable
            </dd>
          </div>
          <div className="whitespace-nowrap">
            <dt className="sr-only">Current role</dt>
            <dd className="inline text-fg">
              {person.currentRole} · {person.currentOrg}
            </dd>
          </div>
          <div className="whitespace-nowrap">
            <dt className="sr-only">Years shipping</dt>
            <dd className="inline">{years} years in production</dd>
          </div>
          <div className="whitespace-nowrap">
            <dt className="sr-only">Location</dt>
            <dd className="inline">{person.location}</dd>
          </div>
        </dl>

        <div
          className="rise mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20"
          style={{ "--delay": "420ms" } as React.CSSProperties}
        >
          <div className="prose-block max-w-[58ch] text-lg leading-relaxed text-fg/90">
            {intro.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>
                {paragraph.replace("{years}", String(years))}
              </p>
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
                {person.githubLabel}
              </a>
              <a
                className="link"
                href={person.linkedin}
                rel="me noopener"
                target="_blank"
              >
                {person.linkedinLabel}
              </a>
            </p>
          </div>

          <div>
            <h2 className="eyebrow whitespace-nowrap">Current release</h2>
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
      </div>
    </section>
  );
}
