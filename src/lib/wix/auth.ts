import { cookies } from 'next/headers';

export const OAUTH_COOKIE = 'snami_oauth';
export const SESSION_COOKIE = 'snami_session';

const baseCookie = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
};

/** Dati PKCE della richiesta di login: vivono il tempo di un giro di OAuth. */
export async function storeOAuthData(data: unknown) {
  (await cookies()).set(OAUTH_COOKIE, JSON.stringify(data), { ...baseCookie, maxAge: 60 * 10 });
}

export async function readOAuthData<T>(): Promise<T | null> {
  const raw = (await cookies()).get(OAUTH_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function clearOAuthData() {
  (await cookies()).delete(OAUTH_COOKIE);
}

/**
 * I token del socio restano in un cookie httpOnly: il refresh token non passa
 * mai dal JavaScript della pagina.
 */
export async function storeSession(tokens: unknown) {
  (await cookies()).set(SESSION_COOKIE, JSON.stringify(tokens), {
    ...baseCookie,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export function siteUrl(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, '');
  return new URL(request.url).origin;
}
