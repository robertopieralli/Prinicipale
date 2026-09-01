import { media } from '@wix/sdk';

/**
 * Le immagini del blog arrivano come URL `wix:image://...` oppure come URL
 * static.wixstatic.com già risolti. Normalizziamo entrambi i casi e chiediamo a
 * Wix una versione ritagliata alla misura che serve davvero.
 */
export function wixImage(
  source: string | undefined | null,
  width = 1200,
  height = 675,
): string | null {
  if (!source) return null;
  try {
    if (source.startsWith('wix:image://')) {
      return media.getScaledToFillImageUrl(source, width, height, {});
    }
    if (source.startsWith('https://static.wixstatic.com')) {
      return source;
    }
    if (/^[\w-]+\.(jpe?g|png|webp|gif)$/i.test(source) || source.includes('~mv2')) {
      return `https://static.wixstatic.com/media/${source}`;
    }
    return source;
  } catch {
    return null;
  }
}

/**
 * Il campo DOCUMENT del CMS restituisce un URI `wix:document://…`, che il
 * browser non sa aprire. Va tradotto nell'URL di download vero prima di
 * finire in un href.
 */
export function wixDocument(
  source: string | { url?: string } | undefined | null,
): { url: string; filename?: string } | null {
  const raw = typeof source === 'string' ? source : source?.url;
  if (!raw) return null;
  if (raw.startsWith('http://') || raw.startsWith('https://')) return { url: raw };
  if (!raw.startsWith('wix:document://')) return null;
  try {
    const resolved = media.getDocumentUrl(raw);
    return { url: resolved.url, filename: resolved.filename };
  } catch {
    return null;
  }
}
