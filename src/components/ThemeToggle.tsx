'use client';

import { useEffect, useState } from 'react';

type Mode = 'light' | 'dark';

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode | null>(null);

  useEffect(() => {
    const stored = (() => {
      try {
        return window.localStorage.getItem('snami-theme') as Mode | null;
      } catch {
        return null;
      }
    })();
    // Il sito è su base bianca: si parte sempre dal chiaro, e lo scuro resta
    // una scelta esplicita di chi naviga.
    const initial: Mode = stored ?? 'light';
    setMode(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  function toggle() {
    const next: Mode = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem('snami-theme', next);
    } catch {
      /* modalità privata: la preferenza vale solo per questa visita */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === 'dark' ? 'Passa al tema chiaro' : 'Passa al tema scuro'}
      className="grid h-10 w-10 place-items-center rounded-full border text-[var(--ink-muted)] transition hover:text-[var(--ink)]"
    >
      <span aria-hidden className="text-sm">{mode === 'dark' ? '☀' : '☾'}</span>
    </button>
  );
}
