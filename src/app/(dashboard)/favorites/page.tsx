'use client';

import { useState, useEffect, useCallback } from 'react';
import { getFavorites, deleteSong, getApiError } from '@/lib/api';
import { useFavorites } from '@/hooks/useFavorites';
import { SongRow } from '@/components/songs/SongRow';
import type { Song } from '@/types';

export default function FavoritesPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { favoriteIds, toggleFavorite } = useFavorites();

  // Fetch on mount. setState only after await, so no cascading-render lint.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const favs = await getFavorites();
        if (!cancelled) setSongs(favs.map((f) => f.song));
      } catch (err) {
        if (!cancelled) setError(getApiError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const favs = await getFavorites();
      setSongs(favs.map((f) => f.song));
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // When a song is unfavorited from this page, drop it from the list too.
  function handleToggleFavorite(songId: string) {
    toggleFavorite(songId);
    setSongs((prev) => prev.filter((s) => s.id !== songId));
  }

  async function handleDelete(id: string) {
    const prev = songs;
    setSongs((s) => s.filter((song) => song.id !== id));
    try {
      await deleteSong(id);
    } catch (err) {
      setSongs(prev);
      setError(getApiError(err));
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white">Favorites</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {songs.length} {songs.length === 1 ? 'track' : 'tracks'}
        </p>
      </header>

      {loading && <ListSkeleton />}

      {!loading && error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}{' '}
          <button onClick={reload} className="ml-1 font-medium underline">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && songs.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-2xl text-violet-500">
            ♥
          </div>
          <h2 className="text-lg font-semibold text-white">No favorites yet</h2>
          <p className="mt-1 max-w-xs text-sm text-zinc-400">
            Tap the heart on any song to save it here.
          </p>
        </div>
      )}

      {!loading && !error && songs.length > 0 && (
        <div className="flex flex-col gap-0.5">
          {songs.map((song) => (
            <SongRow
              key={song.id}
              song={song}
              queue={songs}
              isFavorite={favoriteIds.has(song.id)}
              onToggleFavorite={handleToggleFavorite}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
          <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-zinc-800" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-1/3 animate-pulse rounded bg-zinc-800" />
            <div className="h-2.5 w-1/4 animate-pulse rounded bg-zinc-800/70" />
          </div>
        </div>
      ))}
    </div>
  );
}
