import 'server-only';
import { cookies } from 'next/headers';
import { createWixClient, parseTokens, SESSION_COOKIE, type WixClient } from './core';

export {
  WIX_CLIENT_ID,
  SESSION_COOKIE,
  DOCUMENTS_COLLECTION,
  isWixConfigured,
  createWixClient,
  parseTokens,
} from './core';
export type { WixClient } from './core';

/**
 * Client per i contenuti pubblici (blog, piani). Non legge i cookie: così le
 * pagine che lo usano restano rigenerabili staticamente invece di diventare
 * dinamiche a ogni richiesta.
 */
export function getPublicWixClient(): WixClient {
  return createWixClient();
}

/** Client lato server: eredita la sessione del socio, se presente nel cookie. */
export async function getWixClient(): Promise<WixClient> {
  const store = await cookies();
  return createWixClient(parseTokens(store.get(SESSION_COOKIE)?.value));
}

/** Vero quando la richiesta arriva da un socio autenticato. */
export async function isLoggedIn(): Promise<boolean> {
  const store = await cookies();
  const tokens = parseTokens(store.get(SESSION_COOKIE)?.value);
  return Boolean(tokens?.refreshToken?.value);
}
