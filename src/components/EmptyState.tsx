import Link from 'next/link';

/**
 * Mostrato quando il collegamento a Wix non è ancora configurato: meglio
 * spiegare cosa manca che lasciare una pagina bianca.
 */
export default function EmptyState({
  title,
  message,
  actionHref,
  actionLabel,
}: {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="surface p-10 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--ink-muted)]">{message}</p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-6 inline-block rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-[var(--brand-ink)]"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
