import { dependencies } from "@/lib/content";
import { Section } from "./section";

export function Dependencies() {
  const active = dependencies.filter((group) => !group.deprecated);
  const retired = dependencies.filter((group) => group.deprecated);

  return (
    <Section
      id="dependencies"
      file="package.json"
      title="Dependencies."
      lede="Pinned, not floating. No skill bars were harmed in the making of this list."
    >
      <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {active.map((group) => (
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

      {retired.map((group) => (
        <div key={group.name} className="mt-12 border-t border-line pt-6">
          <h3 className="mono text-sm font-medium text-removed">
            {group.name}
          </h3>
          <ul className="mono mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-faint">
            {group.packages.map((pkg) => (
              <li key={pkg} className="line-through decoration-faint/70">
                {pkg}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-faint">Retired, not forgotten.</p>
        </div>
      ))}
    </Section>
  );
}
