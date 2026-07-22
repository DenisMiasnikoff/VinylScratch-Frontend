'use client';

import { useState } from 'react';
import { PlayerProvider } from '@/context/player-context';
import { Sidebar } from '@/components/layout/Sidebar';
import { AudioPlayer } from '@/components/player/AudioPlayer';

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <PlayerProvider>
      <div className="flex h-screen overflow-hidden bg-zinc-950">
        <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          
          <header className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3 md:hidden">
            <button
              onClick={() => setNavOpen(true)}
              aria-label="Open menu"
              className="rounded-md p-1 text-zinc-300 hover:text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="flex items-center gap-2 font-bold text-white">
              <span className="text-violet-500">♫</span> VinylScratch
            </span>
          </header>

          <main className="flex-1 overflow-y-auto px-4 py-6 pb-28 sm:px-6">
            {children}
          </main>
        </div>
      </div>
      <AudioPlayer />
    </PlayerProvider>
  );
}
