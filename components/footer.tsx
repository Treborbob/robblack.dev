import { person } from "@/lib/content";
import { currentVersion } from "@/lib/version";

export function Footer() {
  const year = new Date().getUTCFullYear();
  return (
    <footer className="mx-auto max-w-6xl px-5 pt-8 pb-16 sm:px-8">
      <div className="rule mb-8" />
      <div className="mono flex flex-col gap-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {person.name} · v{currentVersion()}
        </p>
        <p className="flex flex-wrap gap-x-5 gap-y-2">
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
      <p className="mono mt-6 text-xs text-faint">
        Built with Next.js and Tailwind, deployed on Vercel. No tracking, no
        cookies, no skill bars.
      </p>
    </footer>
  );
}
