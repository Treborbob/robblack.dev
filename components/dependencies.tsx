import { dependencies } from "@/lib/content";
import { Section } from "./section";

export function Dependencies() {
  return (
    <Section
      id="dependencies"
      file="package.json"
      title="Dependencies."
      lede="Pinned, not floating. No skill bars were harmed in the making of this list."
    >
      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {dependencies.map((group) => (
          <div key={group.name}>
            <h3 className="mono text-sm font-medium text-accent">
              {group.name}
            </h3>
            <ul className="mono mt-3 space-y-1.5 text-sm text-muted">
              {group.packages.map((pkg) => (
                <li key={pkg} className="flex items-baseline gap-2">
                  <span aria-hidden="true" className="text-faint">
                    –
                  </span>
                  {pkg}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
