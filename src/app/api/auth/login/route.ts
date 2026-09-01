import { NextResponse } from 'next/server';
import { createWixClient, isWixConfigured } from '@/lib/wix/client';
import { siteUrl, storeOAuthData } from '@/lib/wix/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const origin = siteUrl(request);

  if (!isWixConfigured()) {
    return NextResponse.redirect(`${origin}/area-soci?errore=configurazione`);
  }

  const requested = new URL(request.url).searchParams.get('ritorno') ?? '/area-soci';
  // Solo percorsi interni: evita che un redirect aperto porti altrove.
  const returnTo = requested.startsWith('/') && !requested.startsWith('//') ? requested : '/area-soci';

  try {
    const client = createWixClient();
    const oAuthData = client.auth.generateOAuthData(
      `${origin}/login/callback`,
      `${origin}${returnTo}`,
    );
    await storeOAuthData(oAuthData);

    const { authUrl } = await client.auth.getAuthUrl(oAuthData);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('[snami] avvio del login non riuscito:', error);
    return NextResponse.redirect(`${origin}/area-soci?errore=login`);
  }
}
