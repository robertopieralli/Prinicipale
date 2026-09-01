import { createClient, OAuthStrategy, type Tokens } from '@wix/sdk';
import { posts, categories } from '@wix/blog';
import { plansV3, orders } from '@wix/pricing-plans';
import { members } from '@wix/members';
import { items } from '@wix/data';

/**
 * Parte "isomorfa" del collegamento a Wix: gira sia sul server sia nel
 * browser. Tutto ciò che tocca i cookie sta invece in `client.ts`, che è
 * riservato ai Server Component.
 */

export const WIX_CLIENT_ID = process.env.NEXT_PUBLIC_WIX_CLIENT_ID ?? '';
export const SESSION_COOKIE = 'snami_session';
export const DOCUMENTS_COLLECTION = process.env.WIX_DOCUMENTS_COLLECTION || 'DocumentiRiservati';

/**
 * Il sito è progettato per partire anche senza credenziali Wix: in quel caso le
 * sezioni alimentate dal CMS restano vuote e mostrano un avviso, invece di far
 * fallire il render. Vedi README > "Collegare Wix".
 */
export function isWixConfigured(): boolean {
  return WIX_CLIENT_ID.trim().length > 0;
}

const wixModules = { posts, categories, plansV3, orders, members, items };

export type WixClient = ReturnType<typeof createWixClient>;

export function createWixClient(tokens?: Tokens) {
  return createClient({
    modules: wixModules,
    auth: OAuthStrategy({ clientId: WIX_CLIENT_ID, tokens }),
  });
}

export function parseTokens(raw: string | undefined): Tokens | undefined {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as Tokens;
    return parsed?.refreshToken?.value ? parsed : undefined;
  } catch {
    return undefined;
  }
}
