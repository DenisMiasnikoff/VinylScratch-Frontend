'use client';

import { usePlayer } from '@/context/player-context';
import { formatTime } from '@/lib/format';
import type { Song } from '@/types';

type SongRowProps = {
  song: Song;
  queue: Song[]; // what to play through when this row is clicked
  isFavorite: boolean;
  onToggleFavorite: (songId: string) => void;
  onDelete: (songId: string) => void;
};

export function SongRow({
  song,
  queue,
  isFavorite,
  onToggleFavorite,
  onDelete,
}: SongRowProps) {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();

  const isCurrent = currentSong?.id === song.id;
  const showPause = isCurrent && isPlaying;

  function handlePlay() {
    if (isCurrent) togglePlay();
    else playSong(song, queue);
  }

  return (
    <div
      className={[
        'group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
        isCurrent ? 'bg-zinc-800/60' : 'hover:bg-zinc-900',
      ].join(' ')}
    >
      {/* Play / pause */}
      <button
        onClick={handlePlay}
        aria-label={showPause ? 'Pause' : `Play ${song.title}`}
        className={[
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition',
          isCurrent
            ? 'bg-violet-600 text-white'
            : 'bg-zinc-800 text-zinc-300 group-hover:bg-zinc-700 group-hover:text-white',
        ].join(' ')}
      >
        {showPause ? <IconPause /> : <IconPlay />}
      </button>

      {/* Title + artist */}
      <div className="min-w-0 flex-1">
        <p
          className={[
            'truncate text-sm font-medium',
            isCurrent ? 'text-violet-400' : 'text-white',
          ].join(' ')}
        >
          {song.title}
        </p>
        <p className="truncate text-xs text-zinc-400">
          {song.artist || 'Unknown artist'}
        </p>
      </div>

      {/* Duration (if known) */}
      {song.duration != null && (
        <span className="hidden w-10 text-right text-xs tabular-nums text-zinc-500 sm:block">
          {formatTime(song.duration)}
        </span>
      )}

      {/* Favorite */}
      <button
        onClick={() => onToggleFavorite(song.id)}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        className={[
          'shrink-0 rounded-md p-1.5 transition-colors',
          isFavorite
            ? 'text-violet-500 hover:text-violet-400'
            : 'text-zinc-500 hover:text-white',
        ].join(' ')}
      >
        <IconHeart filled={isFavorite} />
      </button>

      {/* Delete (appears on hover) */}
      <button
        onClick={() => onDelete(song.id)}
        aria-label={`Delete ${song.title}`}
        className="shrink-0 rounded-md p-1.5 text-zinc-500 opacity-0 transition hover:text-red-400 focus:opacity-100 group-hover:opacity-100"
      >
        <IconTrash />
      </button>
    </div>
  );
}

function IconPlay() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function IconPause() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
    </svg>
  );
}
function IconHeart({ filled }: { filled: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
    </svg>
  );
}
