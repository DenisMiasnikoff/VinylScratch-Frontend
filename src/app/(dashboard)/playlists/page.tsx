'use client';

import { useState, useEffect, useCallback, FormEvent } from 'react';
import { getPlaylists, createPlaylist, deletePlaylist, getApiError } from '@/lib/api';
import { PlaylistCard } from '@/components/playlists/PlaylistCard';
import { Input } from '@/components/layout/Input';
import { Button } from '@/components/layout/Button';
import type { Playlist } from '@/types';

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getPlaylists();
        if (!cancelled) setPlaylists(data);
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
      setPlaylists(await getPlaylists());
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  function handleCreated(p: Playlist) {
    
    setPlaylists((prev) => [{ ...p, songs: p.songs ?? [] }, ...prev]);
  }

  async function handleDelete(id: string) {
    const prev = playlists;
    setPlaylists((p) => p.filter((pl) => pl.id !== id));
    try {
      await deletePlaylist(id);
    } catch (err) {
      setPlaylists(prev);
      setError(getApiError(err));
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Playlists</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'}
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)}>
          <span className="text-base leading-none">+</span> New playlist
        </Button>
      </header>

      {loading && <GridSkeleton />}

      {!loading && error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}{' '}
          <button onClick={reload} className="ml-1 font-medium underline">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && playlists.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-2xl text-violet-500">
            ♫
          </div>
          <h2 className="text-lg font-semibold text-white">No playlists yet</h2>
          <p className="mt-1 max-w-xs text-sm text-zinc-400">
            Create a playlist to organize your songs.
          </p>
          <div className="mt-5">
            <Button onClick={() => setShowCreate(true)}>Create a playlist</Button>
          </div>
        </div>
      )}

      {!loading && !error && playlists.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {playlists.map((p) => (
            <PlaylistCard key={p.id} playlist={p} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showCreate && (
        <CreatePlaylistModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}

function CreatePlaylistModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (p: Playlist) => void;
}) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const p = await createPlaylist(name.trim());
      onCreated(p);
      onClose();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-5 text-lg font-semibold text-white">New playlist</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My playlist"
            required
            autoFocus
          />
          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}
          <div className="mt-1 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {loading ? 'Creating…' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="aspect-square animate-pulse rounded-lg bg-zinc-800" />
          <div className="mt-3 h-3 w-2/3 animate-pulse rounded bg-zinc-800" />
          <div className="mt-2 h-2.5 w-1/3 animate-pulse rounded bg-zinc-800/70" />
        </div>
      ))}
    </div>
  );
}
