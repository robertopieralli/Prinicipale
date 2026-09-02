'use client';

import { useMemo, useState } from 'react';
import type { ReservedDocument } from '@/lib/wix/documents';

function formatDate(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
}

export default function DocumentArchive({ documents }: { documents: ReservedDocument[] }) {
  const [term, setTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sector, setSector] = useState('');

  const categories = useMemo(
    () => [...new Set(documents.map((d) => d.category).filter(Boolean))].sort(),
    [documents],
  );
  const sectors = useMemo(
    () => [...new Set(documents.map((d) => d.sector).filter(Boolean))].sort(),
    [documents],
  );

  const filtered = useMemo(() => {
    const needle = term.trim().toLowerCase();
    return documents.filter((doc) => {
      if (category && doc.category !== category) return false;
      if (sector && doc.sector !== sector) return false;
      if (!needle) return true;
      return `${doc.title} ${doc.description} ${doc.category} ${doc.sector}`
        .toLowerCase()
        .includes(needle);
    });
  }, [documents, term, category, sector]);

  const filtersActive = Boolean(term || category || sector);

  return (
    <>
      <div className="surface grid gap-4 p-6 md:grid-cols-[1.6fr_1fr_1fr]">
        <div className="grid gap-2">
          <label htmlFor="cerca" className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            Cerca
          </label>
          <input
            id="cerca"
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Titolo, argomento, riferimento…"
            className="rounded-xl border bg-[var(--bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--line-strong)]"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="categoria" className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            Categoria
          </label>
          <select
            id="categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl border bg-[var(--bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--line-strong)]"
          >
            <option value="">Tutte</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label htmlFor="settore" className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--ink-faint)]">
            Settore
          </label>
          <select
            id="settore"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="rounded-xl border bg-[var(--bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--line-strong)]"
          >
            <option value="">Tutti</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-6 text-sm text-[var(--ink-faint)]" role="status">
        {filtered.length} document{filtered.length === 1 ? 'o' : 'i'}
        {filtersActive ? ' trovati con i filtri attivi' : ' in archivio'}
      </p>

      {filtered.length ? (
        <ul className="mt-6 grid gap-4">
          {filtered.map((doc) => (
            <li key={doc.id} className="surface card-hover flex flex-wrap items-start gap-5 p-6">
              <span aria-hidden className="text-2xl">📄</span>
              <div className="min-w-56 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full bg-[var(--bg-sunken)] px-3 py-1 font-semibold text-[var(--ink-muted)]">
                    {doc.category}
                  </span>
                  {doc.sector ? (
                    <span className="rounded-full border px-3 py-1 text-[var(--ink-faint)]">
                      {doc.sector}
                    </span>
                  ) : null}
                  {doc.publishedAt ? (
                    <span className="text-[var(--ink-faint)]">{formatDate(doc.publishedAt)}</span>
                  ) : null}
                  {doc.fileName ? (
                    <span className="text-[var(--ink-faint)]">{doc.fileName}</span>
                  ) : null}
                </div>
                <h2 className="mt-3 text-base font-semibold">{doc.title}</h2>
                {doc.description ? (
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ink-muted)]">
                    {doc.description}
                  </p>
                ) : null}
              </div>
              {doc.fileUrl ? (
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-[var(--brand-ink)]"
                >
                  Scarica
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="surface mt-6 p-8 text-sm text-[var(--ink-muted)]">
          Nessun documento corrisponde ai criteri scelti.
        </p>
      )}
    </>
  );
}
