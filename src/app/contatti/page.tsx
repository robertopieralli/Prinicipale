import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { sectors, services, site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Contatti',
  description:
    'Scrivi alla segreteria della sezione provinciale SNAMI di Bologna: sede, email e riferimenti per iscrizioni e consulenze.',
};

export default function ContattiPage() {
  return (
    <>
      <PageHeader
        eyebrow="Segreteria provinciale"
        title="Contatti"
        lead="Iscrizioni, consulenze, vertenze aziendali: scrivi alla segreteria indicando il tuo settore. Smistiamo la richiesta al delegato competente."
      />

      <div className="wrap grid gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="surface p-8 md:p-10">
          <h2 className="text-xl font-semibold tracking-tight">Scrivi alla sezione</h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
            Compila i campi: il modulo apre il tuo programma di posta con il messaggio già
            impostato, così la richiesta arriva completa alla segreteria.
          </p>

          <form action={`mailto:${site.email}`} method="post" encType="text/plain" className="mt-8 grid gap-5">
            <div className="grid gap-2">
              <label htmlFor="nome" className="text-sm font-medium">
                Nome e cognome
              </label>
              <input
                id="nome"
                name="Nome"
                required
                autoComplete="name"
                className="rounded-xl border bg-[var(--bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--line-strong)]"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="Email"
                type="email"
                required
                autoComplete="email"
                className="rounded-xl border bg-[var(--bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--line-strong)]"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="settore" className="text-sm font-medium">
                Settore di appartenenza
              </label>
              <select
                id="settore"
                name="Settore"
                className="rounded-xl border bg-[var(--bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--line-strong)]"
              >
                <option value="">Seleziona…</option>
                {sectors.map((sector) => (
                  <option key={sector.slug} value={sector.name}>
                    {sector.name}
                  </option>
                ))}
                <option value="Non ancora iscritto">Non sono ancora iscritto</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="oggetto" className="text-sm font-medium">
                Motivo del contatto
              </label>
              <select
                id="oggetto"
                name="Oggetto"
                className="rounded-xl border bg-[var(--bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--line-strong)]"
              >
                <option value="Iscrizione">Iscrizione al sindacato</option>
                {services.map((service) => (
                  <option key={service.slug} value={service.name}>
                    {service.name}
                  </option>
                ))}
                <option value="Altro">Altro</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="messaggio" className="text-sm font-medium">
                Messaggio
              </label>
              <textarea
                id="messaggio"
                name="Messaggio"
                rows={6}
                required
                className="rounded-xl border bg-[var(--bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--line-strong)]"
              />
            </div>

            <button
              type="submit"
              className="justify-self-start rounded-full bg-[var(--brand)] px-7 py-3.5 text-sm font-semibold text-[var(--brand-ink)] transition hover:opacity-90"
            >
              Invia il messaggio
            </button>
          </form>
        </section>

        <aside className="space-y-5">
          <div className="surface p-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
              Sede
            </h2>
            <address className="mt-4 space-y-1.5 text-sm not-italic leading-relaxed text-[var(--ink-muted)]">
              <p className="font-medium text-[var(--ink)]">{site.legalName}</p>
              <p>{site.address}</p>
              <p>Codice fiscale {site.taxCode}</p>
            </address>
            <a
              href={`mailto:${site.email}`}
              className="mt-6 inline-block font-semibold text-[var(--accent)]"
            >
              {site.email}
            </a>
          </div>

          <div className="surface p-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
              Seguici
            </h2>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="text-[var(--ink-muted)] transition hover:text-[var(--ink)]">
                Facebook ↗
              </a>
              <a href={site.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--ink-muted)] transition hover:text-[var(--ink)]">
                LinkedIn ↗
              </a>
            </div>
          </div>

          <div className="surface p-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--ink-faint)]">
              Le altre sedi SNAMI
            </h2>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              {site.related.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--ink-muted)] transition hover:text-[var(--ink)]"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
