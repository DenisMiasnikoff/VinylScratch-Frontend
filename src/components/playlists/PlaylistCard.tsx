'use client';

import Link from 'next/link';
import { usePlayer } from '@/context/player-context';
import type { Playlist } from '@/types';

export function PlaylistCard({
  playlist,
  onDelete,
}: {
  playlist: Playlist;
  onDelete: (id: string) => void;
}) {
  const { playSong } = usePlayer();
  const songs = playlist.songs.map((ps) => ps.song);
  const count = songs.length;

  function handlePlayAll(e: React.MouseEvent) {
    e.preventDefault(); 
    if (songs.length) playSong(songs[0], songs);
  }

  return (
    <Link
      href={`/playlists/${playlist.id}`}
      className="group relative flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-colors hover:bg-zinc-800/60"
    >
      
      <div className="relative flex aspect-square items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/30 to-zinc-900 text-4xl text-violet-300">
        ♫
       
        {count > 0 && (
          <button
            onClick={handlePlayAll}
            aria-label={`Play ${playlist.name}`}
            className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white opacity-0 shadow-lg transition group-hover:opacity-100 hover:scale-105"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate font-medium text-white">{playlist.name}</p>
        <p className="text-xs text-zinc-400">
          {count} {count === 1 ? 'track' : 'tracks'}
        </p>
      </div>

     
      <button
        onClick={(e) => {
          e.preventDefault();
          onDelete(playlist.id);
        }}
        aria-label={`Delete ${playlist.name}`}
        className="absolute right-3 top-3 rounded-md bg-zinc-950/60 p-1.5 text-zinc-400 opacity-0 transition hover:text-red-400 focus:opacity-100 group-hover:opacity-100"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
        </svg>
      </button>
    </Link>
  );
}
