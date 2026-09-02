import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: 'Privacy policy',
  description:
    'Informativa sul trattamento dei dati personali del sito SNAMI Sezione Provinciale di Bologna.',
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Informativa"
        title="Privacy policy"
        lead="Come trattiamo i dati personali di chi visita il sito e di chi aderisce al sindacato."
      />

      <div className="wrap py-16">
        <div className="prose-snami">
          <h2>Titolare del trattamento</h2>
          <p>
            Il titolare del trattamento dei dati personali è {site.legalName}, con sede in{' '}
            {site.address}, codice fiscale {site.taxCode}. Per ogni richiesta relativa ai propri
            dati è possibile scrivere a <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>

          <h2>Dati raccolti</h2>
          <p>
            Il sito raccoglie i dati che l&apos;interessato fornisce volontariamente compilando il
            modulo di contatto o richiedendo l&apos;adesione al sindacato: nome, cognome, indirizzo
            email, settore di appartenenza e il contenuto del messaggio. L&apos;area riservata
            richiede inoltre le credenziali di accesso e i dati necessari a verificare la
            regolarità dell&apos;iscrizione.
          </p>

          <h2>Finalità e base giuridica</h2>
          <p>
            I dati sono trattati per rispondere alle richieste ricevute, per gestire il rapporto
            associativo e per erogare i servizi di consulenza riservati agli iscritti. La base
            giuridica è il consenso dell&apos;interessato per le richieste di contatto e
            l&apos;esecuzione del rapporto associativo per le finalità sindacali.
          </p>

          <h2>Conservazione</h2>
          <p>
            I dati sono conservati per il tempo necessario a gestire la richiesta e, per gli
            iscritti, per tutta la durata del rapporto associativo e per i successivi termini
            previsti dagli obblighi di legge.
          </p>

          <h2>Comunicazione a terzi</h2>
          <p>
            I dati non sono diffusi. Possono essere comunicati ai professionisti convenzionati che
            erogano le consulenze richieste dall&apos;iscritto e ai fornitori tecnici che gestiscono
            l&apos;infrastruttura del sito, nominati responsabili del trattamento.
          </p>

          <h2>Diritti dell&apos;interessato</h2>
          <p>
            L&apos;interessato può in ogni momento chiedere l&apos;accesso ai propri dati, la
            rettifica, la cancellazione, la limitazione del trattamento e la portabilità, oltre a
            opporsi al trattamento e a revocare il consenso prestato. Le richieste vanno inviate a{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a>. È inoltre possibile proporre reclamo
            al Garante per la protezione dei dati personali.
          </p>

          <h2>Cookie</h2>
          <p>
            Il sito utilizza esclusivamente cookie tecnici necessari al funzionamento della
            navigazione e dell&apos;area riservata. La preferenza sul tema chiaro o scuro è salvata
            nel browser dell&apos;utente e non viene trasmessa ad alcun server.
          </p>
        </div>
      </div>
    </>
  );
}
