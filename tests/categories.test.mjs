/**
 * Verifica la normalizzazione delle categorie sul payload reale letto
 * dall'API del sito Wix di SNAMI Bologna.
 * Esecuzione: npm test
 */
import assert from 'node:assert/strict';
import { groupCategories } from '../.test-build/categories.js';

// Estratto fedele della risposta di /blog/v3/categories/query del sito.
const wixCategories = [
  { _id: 'c6c76a57', label: 'Pediatria di Libera Scelt', postCount: 60 },
  { _id: 'bf94c761', label: 'Pediatria di Libera Scelt', postCount: 25 },
  { _id: '21fe8d18', label: 'Pediatria di Libera Scelt', postCount: 0 },
  { _id: '6c1c5785', label: 'Medicina dei Servizi', postCount: 81 },
  { _id: 'ebee84b4', label: 'Medicina dei Servizi', postCount: 36 },
  { _id: '78ae7379', label: 'Medicina dei Servizi', postCount: 1 },
  { _id: 'df4ad9e5', label: 'Assistenza Primaria', postCount: 170, description: 'Per modificare questo titolo vai su Impostazioni > Categorie' },
  { _id: 'b136c31a', label: 'Assistenza Primaria', postCount: 69, description: 'Per modificare questo titolo vai su Impostazioni > Categorie' },
  { _id: '050080b5', label: 'Assistenza Primaria', postCount: 1 },
  { _id: '5302f2e3', label: 'Continuità Assistenziale', postCount: 157 },
  { _id: '34ed98b8', label: 'Continuità Assistenziale', postCount: 69 },
  { _id: '1122df43', label: 'Emergenza Territoriale', postCount: 171, description: 'Comunica ai visitatori il genere di post che troveranno sotto questa categoria.' },
  { _id: '9f84e237', label: 'Emergenza Territoriale', postCount: 85 },
  { _id: '99d2c8da', label: 'Specialistica Ambulatoria', postCount: 43 },
  { _id: '04b5afec', label: 'Specialistica Ambulatoria', postCount: 18 },
  { _id: '8518be77', label: 'Bologna', postCount: 0, description: 'Notizie da SNAMI Bologna' },
  { _id: '2227ecda', label: 'Medici Dipendenti SSN', postCount: 48 },
  { _id: '332dd6f3', label: 'Medici Dipendenti SSN', postCount: 22 },
];

const result = groupCategories(wixCategories);
const bySlug = Object.fromEntries(result.map((c) => [c.slug, c]));

// 18 voci duplicate su Wix diventano 8 categorie reali.
assert.equal(result.length, 8, 'le categorie duplicate non sono state accorpate');

// I tre id di "Assistenza Primaria" confluiscono in una sola voce.
assert.equal(bySlug['assistenza-primaria'].ids.length, 3);
assert.equal(bySlug['assistenza-primaria'].postCount, 240, 'i conteggi non sono sommati');

// Le etichette troncate dall'editor Wix vengono corrette.
assert.equal(bySlug['pediatria-di-libera-scelta'].label, 'Pediatria di Libera Scelta');
assert.equal(bySlug['specialistica-ambulatoriale'].label, 'Specialistica Ambulatoriale');

// Gli accenti diventano slug ASCII stabili.
assert.ok(bySlug['continuita-assistenziale'], 'accento non normalizzato nello slug');
assert.equal(bySlug['continuita-assistenziale'].postCount, 226);

// Le descrizioni segnaposto del tema Wix non arrivano in pagina.
assert.equal(bySlug['assistenza-primaria'].description, null);
assert.equal(bySlug['emergenza-territoriale'].description, null);

// Una descrizione vera viene invece mantenuta.
assert.equal(bySlug['bologna'].description, 'Notizie da SNAMI Bologna');

// Ordinamento per numero di post, decrescente.
assert.deepEqual(
  result.map((c) => c.postCount),
  [...result.map((c) => c.postCount)].sort((a, b) => b - a),
);

console.log(`✓ ${wixCategories.length} categorie Wix → ${result.length} categorie pulite`);
for (const c of result) {
  console.log(`  ${c.slug.padEnd(28)} ${String(c.postCount).padStart(4)} post  (${c.ids.length} id Wix accorpati)`);
}
