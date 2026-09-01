/**
 * Normalizzazione delle categorie del blog. Logica pura, senza dipendenze:
 * sta in un modulo a sé per poter essere verificata in isolamento.
 */

export type BlogCategory = {
  id: string;
  /** Tutti gli id Wix che confluiscono in questa categoria (vedi normalizzazione). */
  ids: string[];
  label: string;
  slug: string;
  description: string | null;
  postCount: number;
};

export type RawCategory = {
  _id?: string | null;
  label?: string | null;
  slug?: string | null;
  description?: string | null;
  postCount?: number | null;
};

/**
 * Il blog Wix si porta dietro categorie duplicate due o tre volte
 * ("assistenza-primaria", "-1", "-2"): un residuo delle migrazioni passate che
 * spezzava navigazione e SEO. Qui le raggruppiamo per etichetta, esponiamo uno
 * slug pulito e sommiamo i contatori, mantenendo tutti gli id originali per
 * poter continuare a interrogare Wix.
 */
function canonicalSlug(label: string): string {
  return label
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Etichette abbreviate dall'editor Wix, riportate alla forma corretta. */
const LABEL_FIXES: Record<string, string> = {
  'pediatria di libera scelt': 'Pediatria di Libera Scelta',
  'specialistica ambulatoria': 'Specialistica Ambulatoriale',
};

/** Descrizioni segnaposto lasciate dal tema Wix: da non mostrare mai in pagina. */
const PLACEHOLDER_DESCRIPTIONS = [
  'per modificare questo titolo vai su impostazioni',
  'comunica ai visitatori il genere di post',
];

function isPlaceholder(description: string | null | undefined): boolean {
  if (!description) return true;
  const lower = description.toLowerCase();
  return PLACEHOLDER_DESCRIPTIONS.some((p) => lower.includes(p));
}

export function groupCategories(raw: RawCategory[]): BlogCategory[] {
  const grouped = new Map<string, BlogCategory>();

  for (const cat of raw) {
    const rawLabel = (cat.label ?? '').trim();
    if (!rawLabel || !cat._id) continue;
    const label = LABEL_FIXES[rawLabel.toLowerCase()] ?? rawLabel;
    const slug = canonicalSlug(label);
    const existing = grouped.get(slug);

    if (existing) {
      existing.ids.push(cat._id);
      existing.postCount += cat.postCount ?? 0;
      if (!existing.description && !isPlaceholder(cat.description)) {
        existing.description = cat.description ?? null;
      }
    } else {
      grouped.set(slug, {
        id: cat._id,
        ids: [cat._id],
        label,
        slug,
        description: isPlaceholder(cat.description) ? null : (cat.description ?? null),
        postCount: cat.postCount ?? 0,
      });
    }
  }

  return [...grouped.values()].sort((a, b) => b.postCount - a.postCount);
}

