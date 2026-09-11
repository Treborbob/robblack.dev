import { person } from "@/lib/content";
import { currentVersion } from "@/lib/version";

const nav = [
  { href: "#changelog", label: "Changelog" },
  { href: "#builds", label: "Builds" },
  { href: "#dependencies", label: "Dependencies" },
  { href: "#contributing", label: "Contributing" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-3 sm:px-8">
        <a href="#top" className="mono flex items-center gap-3 text-sm text-fg">
          <span className="font-medium">
            {person.name.toLowerCase().replace(" ", "")}
          </span>
          <span className="text-faint">/</span>
          <span className="text-muted">CHANGELOG.md</span>
          <span className="hidden text-faint sm:inline">
            v{currentVersion()}
          </span>
        </a>
        <nav
          aria-label="Sections"
          className="hidden items-center gap-6 md:flex"
        >
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition-colors hover:text-fg"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <nav
        aria-label="Sections"
        className="mono flex gap-5 overflow-x-auto px-5 pb-2.5 text-xs uppercase tracking-wider md:hidden"
      >
        {nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="shrink-0 text-muted transition-colors hover:text-fg"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
