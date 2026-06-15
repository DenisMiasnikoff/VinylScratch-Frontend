'use client';

import { useState, useEffect, useCallback } from 'react';
import { getSongs, deleteSong, getApiError } from '@/lib/api';
import { useFavorites } from '@/hooks/useFavorites';
import { SongRow } from '@/components/songs/SongRow';
import { AddSongModal } from '@/components/songs/AddSongModal';
import { Button } from '@/components/layout/Button';
import type { Song } from '@/types';

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const { favoriteIds, toggleFavorite } = useFavorites();

  // Fetch on mount. setState calls happen after the await (in the promise
  // continuation), not synchronously in the effect body, so they don't
  // trigger the cascading-render lint. The `cancelled` guard avoids setting
  // state if the component unmounts mid-request.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getSongs();
        if (!cancelled) setSongs(data);
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

  // User-triggered refetch (Retry button). Safe to set state synchronously
  // here because it runs from an event handler, not an effect.
  const reloadSongs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setSongs(await getSongs());
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  function handleAdded(song: Song) {
    setSongs((prev) => [song, ...prev]);
  }

  async function handleDelete(id: string) {
    const prev = songs;
    setSongs((s) => s.filter((song) => song.id !== id)); // optimistic
    try {
      await deleteSong(id);
    } catch (err) {
      setSongs(prev); // roll back
      setError(getApiError(err));
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Your songs</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {songs.length} {songs.length === 1 ? 'track' : 'tracks'}
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)}>
          <span className="text-base leading-none">+</span> Add song
        </Button>
      </header>

      {loading && <SongListSkeleton />}

      {!loading && error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}{' '}
          <button onClick={reloadSongs} className="ml-1 font-medium underline">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && songs.length === 0 && <EmptyState onAdd={() => setShowAdd(true)} />}

      {!loading && !error && songs.length > 0 && (
        <div className="flex flex-col gap-0.5">
          {songs.map((song) => (
            <SongRow
              key={song.id}
              song={song}
              queue={songs}
              isFavorite={favoriteIds.has(song.id)}
              onToggleFavorite={toggleFavorite}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showAdd && (
        <AddSongModal onClose={() => setShowAdd(false)} onAdded={handleAdded} />
      )}
    </div>
  );
}

function SongListSkeleton() {
  return (
    <div className="flex flex-col gap-0.5">
      {Array.from({ length: 6 }).map((_, i) => (
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

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-2xl text-violet-500">
        ♫
      </div>
      <h2 className="text-lg font-semibold text-white">No songs yet</h2>
      <p className="mt-1 max-w-xs text-sm text-zinc-400">
        Add your first track to start building your library.
      </p>
      <div className="mt-5">
        <Button onClick={onAdd}>Add your first song</Button>
      </div>
    </div>
  );
}
