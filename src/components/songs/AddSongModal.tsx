'use client';

import { useState, FormEvent } from 'react';
import { Input } from '../../components/layout/Input';
import { Button } from '../../components/layout/Button';
import { createSong, getApiError } from '@/lib/api';
import type { Song } from '@/types';

// Public domain / CC sample audio for quick testing so you can hear playback
// immediately. Replace or remove before shipping real content.
const SAMPLES = [
  {
    label: 'SoundHelix 1',
    title: 'SoundHelix Song 1',
    artist: 'SoundHelix',
    fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    label: 'SoundHelix 2',
    title: 'SoundHelix Song 2',
    artist: 'SoundHelix',
    fileUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
];

export function AddSongModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: (song: Song) => void;
}) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function applySample(s: (typeof SAMPLES)[number]) {
    setTitle(s.title);
    setArtist(s.artist);
    setFileUrl(s.fileUrl);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const song = await createSong({
        title: title.trim(),
        artist: artist.trim() || undefined,
        fileUrl: fileUrl.trim(),
      });
      onAdded(song);
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
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Add a song</h2>
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Song title"
            required
          />
          <Input
            label="Artist"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artist (optional)"
          />
          <Input
            label="Audio URL"
            type="url"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
            placeholder="https://example.com/song.mp3"
            required
          />

          {/* Quick-fill samples */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-500">Try a sample:</span>
            {SAMPLES.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => applySample(s)}
                className="rounded-full border border-zinc-700 px-2.5 py-1 text-xs text-zinc-300 transition hover:border-violet-600 hover:text-white"
              >
                {s.label}
              </button>
            ))}
          </div>

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
              {loading ? 'Adding…' : 'Add song'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
