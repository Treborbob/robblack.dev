interface SectionProps {
  id: string;
  file: string;
  title: string;
  lede?: string;
  children: React.ReactNode;
}

export function Section({ id, file, title, lede, children }: SectionProps) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-12">
      <div className="rule mb-10" />
      <div className="reveal mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">{file}</p>
          <h2 className="display mt-3 text-3xl font-semibold sm:text-4xl">
            {title}
          </h2>
        </div>
        {lede ? (
          <p className="max-w-[44ch] text-sm leading-relaxed text-muted">
            {lede}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
