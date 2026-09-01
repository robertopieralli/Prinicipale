import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Videoteca',
  description:
    'Interventi pubblici, assemblee e approfondimenti video della sezione provinciale SNAMI di Bologna.',
};

/**
 * I video restano ospitati sui canali social della sezione. Qui teniamo
 * l'indice: la segreteria aggiunge una voce a questo elenco quando pubblica un
 * nuovo intervento.
 */
const videos = [
  {
    title: 'Riflessioni su ruolo unico e riordino della medicina territoriale',
    description:
      "Un'analisi di cosa cambia davvero per i medici con l'introduzione del ruolo unico e la riorganizzazione dell'assistenza territoriale in Emilia-Romagna.",
  },
  {
    title: 'Intervento al congresso sull’Emergenza Urgenza — Firenze',
    description:
      "La posizione dello SNAMI sulla medicalizzazione dei mezzi di soccorso avanzato e sul ruolo del medico nell'emergenza territoriale.",
  },
];

export default function VideotecaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Archivio video"
        title="Videoteca"
        lead="Interventi pubblici, assemblee e approfondimenti dei delegati della sezione provinciale."
      />

      <div className="wrap py-16">
        <div className="grid gap-5 md:grid-cols-2">
          {videos.map((video) => (
            <article key={video.title} className="surface overflow-hidden">
              <div className="mesh relative grid aspect-video place-items-center bg-[var(--bg-sunken)]">
                <span aria-hidden className="text-4xl opacity-40">▶</span>
              </div>
              <div className="p-7">
                <h2 className="text-lg font-semibold tracking-tight">{video.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">
                  {video.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="surface mt-12 flex flex-wrap items-center justify-between gap-6 p-8">
          <p className="max-w-xl text-sm leading-relaxed text-[var(--ink-muted)]">
            I video integrali e le dirette delle assemblee sono pubblicati sulla pagina Facebook
            della sezione provinciale.
          </p>
          <a
            href={site.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-[var(--brand-ink)]"
          >
            Vai alla pagina Facebook
          </a>
        </div>
      </div>
    </>
  );
}
