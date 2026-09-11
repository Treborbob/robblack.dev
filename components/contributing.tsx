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
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_17rem] lg:gap-8">
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
        <div
          className="rounded-lg border p-6"
          style={{
            background:
              "color-mix(in oklab, var(--color-accent) 6%, var(--color-panel))",
            borderColor:
              "color-mix(in oklab, var(--color-accent) 28%, var(--color-line))",
          }}
        >
          <h3 className="eyebrow text-accent">Open to</h3>
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
