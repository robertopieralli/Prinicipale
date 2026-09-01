import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createWixClient, isWixConfigured, parseTokens } from '@/lib/wix/client';
import { clearSession, siteUrl, SESSION_COOKIE } from '@/lib/wix/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const origin = siteUrl(request);
  const tokens = parseTokens((await cookies()).get(SESSION_COOKIE)?.value);
  await clearSession();

  if (!isWixConfigured() || !tokens) {
    return NextResponse.redirect(origin);
  }

  try {
    // Chiude anche la sessione lato Wix, non solo il cookie del sito.
    const client = createWixClient(tokens);
    const { logoutUrl } = await client.auth.logout(origin);
    return NextResponse.redirect(logoutUrl);
  } catch (error) {
    console.error('[snami] logout Wix non riuscito:', error);
    return NextResponse.redirect(origin);
  }
}
