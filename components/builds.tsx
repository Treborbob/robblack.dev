import Image from "next/image";
import { projectOrigins, projects } from "@/lib/content";
import { formatDate, type RepoFacts, repoFacts } from "@/lib/github";
import { Section } from "./section";

export async function Builds() {
  const facts = new Map<string, RepoFacts | null>();
  await Promise.all(
    projects
      .filter((p) => p.repo)
      .map(async (p) => {
        facts.set(p.name, await repoFacts(p.repo as string));
      }),
  );

  return (
    <Section
      id="builds"
      file="BUILDS"
      title="Recent builds."
      lede="What I've been working on."
    >
      <ol className="space-y-14">
        {projects.map((project) => {
          const repo = facts.get(project.name) ?? null;
          return (
            <li
              key={project.name}
              className="reveal grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10"
            >
              <div>
                <div className="flex items-center gap-3">
                  {project.icon ? (
                    <Image
                      src={project.icon}
                      alt=""
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                  ) : null}
                  <h3 className="display-sm text-2xl font-medium">
                    {project.name}
                  </h3>
                </div>
                <p className="mono mt-1 text-xs text-muted">{project.label}</p>
                <p className="mt-3">
                  <span className={`origin origin-${project.origin}`}>
                    {projectOrigins[project.origin]}
                  </span>
                </p>
                {project.repo ? (
                  <p className="mono mt-3 text-xs">
                    <a className="link" href={project.repo}>
                      Source on GitHub
                    </a>
                  </p>
                ) : null}
              </div>
              <div>
                <p className="max-w-[64ch] leading-relaxed text-fg/90">
                  {project.description}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <li key={item} className="tag">
                      {item}
                    </li>
                  ))}
                </ul>
                {repo ? <Facts facts={repo} /> : null}
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}

/** Live-ish facts from the public repo, stamped at build time. */
function Facts({ facts }: { facts: RepoFacts }) {
  const summary = [
    facts.commits !== null ? `${facts.commits} commits` : null,
    facts.ci ? `CI ${facts.ci}` : null,
    facts.licence ? `${facts.licence} licence` : null,
  ].filter(Boolean);

  return (
    <div className="mono mt-6 text-xs text-muted">
      {facts.languages.length > 0 ? (
        <>
          <div className="lang-bar" aria-hidden="true">
            {facts.languages.map((l) => (
              <span
                key={l.name}
                style={{ width: `${l.share}%`, background: l.colour }}
              />
            ))}
          </div>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {facts.languages.map((l) => (
              <span key={l.name}>
                <span
                  className="lang-dot"
                  style={{ background: l.colour }}
                  aria-hidden="true"
                />
                {l.name} {l.share}%
              </span>
            ))}
          </p>
        </>
      ) : null}
      {facts.latest ? (
        <p className="mt-4 leading-relaxed">
          <a className="link text-accent" href={facts.latest.url}>
            {facts.latest.sha}
          </a>{" "}
          <span className="text-fg/80">{facts.latest.message}</span>{" "}
          <span className="text-faint">{formatDate(facts.latest.date)}</span>
        </p>
      ) : null}
      {summary.length > 0 ? (
        <p className="mt-1 text-faint">{summary.join(" · ")}</p>
      ) : null}
    </div>
  );
}
