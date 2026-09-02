import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import DocumentArchive from '@/components/DocumentArchive';
import { getCurrentMember } from '@/lib/wix/member';
import { getReservedDocuments } from '@/lib/wix/documents';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Archivio documenti',
  robots: { index: false, follow: false },
};

export default async function DocumentiPage() {
  const member = await getCurrentMember();
  if (!member) redirect('/area-soci');

  const { documents, error } = await getReservedDocuments();

  return (
    <>
      <PageHeader
        eyebrow="Area riservata"
        title="Archivio documenti"
        lead="Accordi, circolari, verbali e modulistica. Cerca per parola chiave oppure filtra per categoria e settore."
      />

      <div className="wrap py-14">
        <Link href="/area-soci" className="text-sm font-semibold text-[var(--accent)]">
          ← Torna all&apos;area soci
        </Link>

        <div className="mt-8">
          {error === 'unavailable' ? (
            <div className="surface p-10">
              <h2 className="text-lg font-semibold">Archivio non ancora collegato</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--ink-muted)]">
                La collection CMS che ospita i documenti riservati non è raggiungibile. Chi
                amministra il sito trova la procedura di attivazione in <code>README.md</code>,
                sezione «Archivio documenti riservato».
              </p>
            </div>
          ) : (
            <DocumentArchive documents={documents} />
          )}
        </div>
      </div>
    </>
  );
}
