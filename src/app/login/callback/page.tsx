'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createWixClient } from '@/lib/wix/core';

export default function LoginCallbackPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function completeLogin() {
      try {
        const client = createWixClient();
        const returned = client.auth.parseFromUrl();

        if (returned.error) {
          if (!cancelled) setError(returned.errorDescription ?? 'Accesso non riuscito.');
          return;
        }

        const res = await fetch('/api/auth/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: returned.code, state: returned.state }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          if (!cancelled) setError(body.error ?? 'Accesso non riuscito.');
          return;
        }

        // Ricarichiamo dal server così l'area riservata parte già autenticata.
        const target = new URL(window.location.href).searchParams.get('ritorno') ?? '/area-soci';
        window.location.replace(target.startsWith('/') ? target : '/area-soci');
      } catch {
        if (!cancelled) setError('Accesso non riuscito. Riprova.');
      }
    }

    completeLogin();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="wrap grid min-h-[60vh] place-items-center py-24">
      <div className="surface max-w-md p-10 text-center">
        {error ? (
          <>
            <h1 className="text-xl font-semibold">Accesso non riuscito</h1>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-muted)]">{error}</p>
            <Link
              href="/area-soci"
              className="mt-7 inline-block rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-[var(--brand-ink)]"
            >
              Torna all&apos;area soci
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold">Accesso in corso…</h1>
            <p className="mt-3 text-sm text-[var(--ink-muted)]">
              Stiamo verificando le credenziali, un istante.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
