import { getWixClient, isWixConfigured, DOCUMENTS_COLLECTION } from './client';
import { wixDocument } from './media';

export type ReservedDocument = {
  id: string;
  title: string;
  description: string;
  category: string;
  sector: string;
  fileUrl: string | null;
  fileName: string | null;
  publishedAt: string | null;
};

/**
 * L'archivio riservato vive in una collection CMS del sito Wix, così la
 * segreteria continua a caricare circolari e modulistica dal pannello che già
 * conosce. I permessi della collection sono impostati su "solo membri": se la
 * richiesta non porta una sessione valida, Wix risponde con un errore di
 * autorizzazione e qui restituiamo una lista vuota.
 */
export async function getReservedDocuments(): Promise<{
  documents: ReservedDocument[];
  error: 'unauthorized' | 'unavailable' | null;
}> {
  if (!isWixConfigured()) return { documents: [], error: 'unavailable' };

  try {
    const client = await getWixClient();
    const res = await client.items
      .query(DOCUMENTS_COLLECTION)
      .descending('_createdDate')
      .limit(100)
      .find();

    const documents = res.items.map((item: Record<string, any>) => {
      const file = wixDocument(item.file ?? item.allegato ?? null);
      return {
        id: item._id,
        title: (item.titolo ?? item.title ?? 'Documento').trim(),
        description: (item.descrizione ?? item.description ?? '').trim(),
        category: (item.categoria ?? item.category ?? 'Documenti').trim(),
        sector: (item.settore ?? item.sector ?? '').trim(),
        fileUrl: file?.url ?? null,
        fileName: file?.filename ?? null,
        publishedAt: item.data ?? item._createdDate ?? null,
      };
    });

    return { documents, error: null };
  } catch (error) {
    const message = String((error as Error)?.message ?? error).toLowerCase();
    const unauthorized = message.includes('permission') || message.includes('unauthorized') || message.includes('forbidden');
    if (!unauthorized) {
      console.error('[snami] lettura archivio riservato non riuscita:', error);
    }
    return { documents: [], error: unauthorized ? 'unauthorized' : 'unavailable' };
  }
}
