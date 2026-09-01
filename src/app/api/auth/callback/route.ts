import { NextResponse } from 'next/server';
import { createWixClient, isWixConfigured } from '@/lib/wix/client';
import { clearOAuthData, readOAuthData, storeSession } from '@/lib/wix/auth';

export const dynamic = 'force-dynamic';

type OAuthData = Parameters<ReturnType<typeof createWixClient>['auth']['getMemberTokens']>[2];

/**
 * Lo scambio del codice avviene qui e non nel browser: i dati PKCE stanno in un
 * cookie httpOnly e i token non toccano mai il JavaScript della pagina.
 */
export async function POST(request: Request) {
  if (!isWixConfigured()) {
    return NextResponse.json({ error: 'Collegamento a Wix non configurato.' }, { status: 503 });
  }

  let payload: { code?: string; state?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida.' }, { status: 400 });
  }

  const oAuthData = await readOAuthData<OAuthData>();
  if (!payload.code || !payload.state || !oAuthData) {
    return NextResponse.json({ error: 'Sessione di login scaduta.' }, { status: 400 });
  }

  try {
    const client = createWixClient();
    const tokens = await client.auth.getMemberTokens(payload.code, payload.state, oAuthData);
    await storeSession(tokens);
    await clearOAuthData();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[snami] scambio token non riuscito:', error);
    await clearOAuthData();
    return NextResponse.json({ error: 'Accesso non riuscito.' }, { status: 401 });
  }
}
