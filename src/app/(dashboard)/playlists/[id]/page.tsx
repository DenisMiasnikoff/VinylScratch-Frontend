'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  getPlaylists,
  getSongs,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getApiError,
} from '@/lib/api';
import { usePlayer } from '@/context/player-context';
import { useFavorites } from '@/hooks/useFavorites';
import { SongRow } from '@/components/songs/SongRow';
import { Button } from '@/components/layout/Button';
import type { Playlist, Song } from '@/types';

export default function PlaylistDetailPage() {
  const params = useParams();
  const playlistId = params.id as string;

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const { playSong } = usePlayer();
  const { favoriteIds, toggleFavorite } = useFavorites();

  
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const all = await getPlaylists();
        const found = all.find((p) => p.id === playlistId) ?? null;
        if (!cancelled) {
          setPlaylist(found);
          if (!found) setError('Playlist not found.');
        }
      } catch (err) {
        if (!cancelled) setError(getApiError(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [playlistId]);

  const songs: Song[] = playlist?.songs.map((ps) => ps.song) ?? [];

  function playAll() {
    if (songs.length) playSong(songs[0], songs);
  }

  async function handleRemove(songId: string) {
    if (!playlist) return;
    const prev = playlist;
    setPlaylist({
      ...playlist,
      songs: playlist.songs.filter((ps) => ps.songId !== songId),
    });
    try {
      await removeSongFromPlaylist(playlist.id, songId);
    } catch (err) {
      setPlaylist(prev);
      setError(getApiError(err));
    }
  }


  const refresh = useCallback(async () => {
    try {
      const all = await getPlaylists();
      setPlaylist(all.find((p) => p.id === playlistId) ?? null);
    } catch {
     
    }
  }, [playlistId]);

  return (
    <div className="mx-auto max-w-3xl">
      {loading && <DetailSkeleton />}

      {!loading && error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {!loading && !error && playlist && (
        <>
          <header className="mb-6 flex items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/40 to-zinc-900 text-4xl text-violet-300">
                ♫
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Playlist
                </p>
                <h1 className="text-2xl font-bold text-white">{playlist.name}</h1>
                <p className="mt-1 text-sm text-zinc-400">
                  {songs.length} {songs.length === 1 ? 'track' : 'tracks'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {songs.length > 0 && (
                <Button onClick={playAll}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play
                </Button>
              )}
              <Button variant="secondary" onClick={() => setShowAdd(true)}>
                <span className="text-base leading-none">+</span> Add songs
              </Button>
            </div>
          </header>

          {songs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 px-6 py-16 text-center">
              <h2 className="text-lg font-semibold text-white">
                This playlist is empty
              </h2>
              <p className="mt-1 max-w-xs text-sm text-zinc-400">
                Add songs from your library to get started.
              </p>
              <div className="mt-5">
                <Button onClick={() => setShowAdd(true)}>Add songs</Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {songs.map((song) => (
                <SongRow
                  key={song.id}
                  song={song}
                  queue={songs}
                  isFavorite={favoriteIds.has(song.id)}
                  onToggleFavorite={toggleFavorite}
                  onDelete={handleRemove} 
                  actionVariant="remove"
                />
              ))}
            </div>
          )}
        </>
      )}

      {showAdd && playlist && (
        <AddSongsModal
          playlistId={playlist.id}
          existingSongIds={new Set(playlist.songs.map((ps) => ps.songId))}
          onClose={() => setShowAdd(false)}
          onChanged={refresh}
        />
      )}
    </div>
  );
}


function AddSongsModal({
  playlistId,
  existingSongIds,
  onClose,
  onChanged,
}: {
  playlistId: string;
  existingSongIds: Set<string>;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [library, setLibrary] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const songs = await getSongs();
        if (!cancelled) setLibrary(songs);
      } catch {
       
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAdd(song: Song) {
    setBusy(song.id);
    try {
      await addSongToPlaylist(playlistId, song.id);
      setAdded((prev) => new Set(prev).add(song.id));
      onChanged();
    } catch {
     
    } finally {
      setBusy(null);
    }
  }

  const available = library.filter(
    (s) => !existingSongIds.has(s.id) && !added.has(s.id)
  );

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-md flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Add songs</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="-mr-2 flex-1 overflow-y-auto pr-2">
          {loading && <p className="py-8 text-center text-sm text-zinc-500">Loading…</p>}
          {!loading && available.length === 0 && (
            <p className="py-8 text-center text-sm text-zinc-500">
              No more songs to add.
            </p>
          )}
          {!loading &&
            available.map((song) => (
              <div
                key={song.id}
                className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-zinc-800/60"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white">{song.title}</p>
                  <p className="truncate text-xs text-zinc-400">
                    {song.artist || 'Unknown artist'}
                  </p>
                </div>
                <button
                  onClick={() => handleAdd(song)}
                  disabled={busy === song.id}
                  className="rounded-full bg-violet-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-violet-500 disabled:opacity-50"
                >
                  {busy === song.id ? 'Adding…' : 'Add'}
                </button>
              </div>
            ))}
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div>
      <div className="mb-6 flex items-end gap-4">
        <div className="h-24 w-24 animate-pulse rounded-xl bg-zinc-800" />
        <div className="space-y-2">
          <div className="h-3 w-16 animate-pulse rounded bg-zinc-800/70" />
          <div className="h-5 w-40 animate-pulse rounded bg-zinc-800" />
          <div className="h-3 w-20 animate-pulse rounded bg-zinc-800/70" />
        </div>
      </div>
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
    </div>
  );
}
