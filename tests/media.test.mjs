/**
 * Verifica che gli URI del CMS diventino link davvero apribili dal browser.
 * Esecuzione: npm test
 */
import assert from 'node:assert/strict';
import { wixDocument, wixImage } from '../.test-build/media.js';

// Formato con cui il campo DOCUMENT del CMS restituisce un allegato.
const uri = 'wix:document://v1/ugd/c87410_1f4a9b2c3d4e5f6a7b8c9d0e1f2a3b4c.pdf/Circolare%20AUSL.pdf';
const doc = wixDocument(uri);

assert.ok(doc, 'URI del documento non risolto');
assert.ok(doc.url.startsWith('https://'), `URL non navigabile: ${doc.url}`);
assert.ok(!doc.url.includes('wix:document'), 'lo schema wix: non è stato tradotto');
assert.equal(doc.filename, 'Circolare AUSL.pdf', 'nome file non decodificato');

// Un link già assoluto passa invariato.
assert.deepEqual(wixDocument('https://esempio.it/a.pdf'), { url: 'https://esempio.it/a.pdf' });

// Valori vuoti o inattesi non devono generare href rotti.
assert.equal(wixDocument(null), null);
assert.equal(wixDocument(''), null);
assert.equal(wixDocument('non-un-uri'), null);

// Le copertine del blog arrivano in due formati diversi: entrambi navigabili.
assert.ok(wixImage('https://static.wixstatic.com/media/abc~mv2.png').startsWith('https://'));
assert.ok(wixImage('c87410_abc~mv2.png').startsWith('https://static.wixstatic.com/media/'));
assert.equal(wixImage(null), null);

console.log(`✓ documento risolto → ${doc.url}`);
console.log(`✓ nome file        → ${doc.filename}`);
