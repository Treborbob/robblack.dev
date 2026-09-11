import { contributing, openTo } from "@/lib/content";
import { Section } from "./section";

export function Contributing() {
  return (
    <Section
      id="contributing"
      file="CONTRIBUTING.md"
      title="How to work with me."
      lede="For hiring managers, tech leads and anyone about to send the calendar invite."
    >
      <div className="grid gap-12 lg:grid-cols-3 lg:gap-10">
        {contributing.map((block) => (
          <div key={block.title}>
            <h3 className="display-sm text-xl font-medium">{block.title}</h3>
            <ul className="mt-4 space-y-3 border-l border-line pl-5 text-sm leading-relaxed text-fg/90">
              {block.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        ))}
        <div className="rounded-lg border border-line bg-panel p-6">
          <h3 className="eyebrow">Open to</h3>
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed">
            {openTo.map((role) => (
              <li key={role} className="flex items-baseline gap-3">
                <span aria-hidden="true" className="mono text-added">
                  +
                </span>
                {role}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
