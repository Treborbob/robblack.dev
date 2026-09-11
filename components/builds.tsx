import { projects } from "@/lib/content";
import { Section } from "./section";

export function Builds() {
  return (
    <Section
      id="builds"
      file="BUILDS"
      title="Recent builds."
      lede="What is currently running for Paramount Visas."
    >
      <ol className="space-y-14">
        {projects.map((project) => (
          <li
            key={project.name}
            className="reveal grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10"
          >
            <div>
              <h3 className="display-sm text-2xl font-medium">
                {project.name}
              </h3>
              <p className="mono mt-1 text-xs text-muted">{project.label}</p>
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
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
