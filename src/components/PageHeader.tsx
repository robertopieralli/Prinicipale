export default function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="grain relative overflow-hidden border-b">
      <div className="mesh" aria-hidden />
      <div className="wrap relative py-16 md:py-24">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display mt-4 max-w-3xl text-4xl md:text-6xl">{title}</h1>
        {lead ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--ink-muted)]">{lead}</p>
        ) : null}
      </div>
    </section>
  );
}
