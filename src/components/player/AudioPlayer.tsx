'use client';

import { usePlayer } from '@/context/player-context';
import { formatTime } from '@/lib/format';

export function AudioPlayer() {
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    volume,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
  } = usePlayer();

  
  if (!currentSong) return null;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-violet-800 text-lg">
            ♫
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {currentSong.title}
            </p>
            <p className="truncate text-xs text-zinc-400">
              {currentSong.artist || 'Unknown artist'}
            </p>
          </div>
        </div>

        
        <div className="flex flex-[2] flex-col items-center gap-1">
          <div className="flex items-center gap-4">
            <button
              onClick={prev}
              aria-label="Previous"
              className="text-zinc-400 transition-colors hover:text-white"
            >
              <IconPrev />
            </button>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-zinc-950 transition-transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? <IconPause /> : <IconPlay />}
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="text-zinc-400 transition-colors hover:text-white"
            >
              <IconNext />
            </button>
          </div>

          <div className="flex w-full max-w-md items-center gap-2">
            <span className="w-9 text-right text-[11px] tabular-nums text-zinc-400">
              {formatTime(progress)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={progress}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="Seek"
              className="player-range h-1 flex-1 cursor-pointer"
              style={rangeStyle(progress, duration)}
            />
            <span className="w-9 text-[11px] tabular-nums text-zinc-400">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        
        <div className="hidden flex-1 items-center justify-end gap-2 sm:flex">
          <IconVolume muted={volume === 0} />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
            className="player-range h-1 w-24 cursor-pointer"
            style={rangeStyle(volume, 1)}
          />
        </div>
      </div>
    </footer>
  );
}


function rangeStyle(value: number, max: number): React.CSSProperties {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return {
    background: `linear-gradient(to right, #7c3aed ${pct}%, #3f3f46 ${pct}%)`,
    borderRadius: '9999px',
    appearance: 'none',
    WebkitAppearance: 'none',
  };
}


function IconPlay() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function IconPause() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
    </svg>
  );
}
function IconPrev() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 6h2v12H6zM20 6v12L9 12z" />
    </svg>
  );
}
function IconNext() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16 6h2v12h-2zM4 6l11 6L4 18z" />
    </svg>
  );
}
function IconVolume({ muted }: { muted: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-zinc-400"
      aria-hidden
    >
      <path d="M3 10v4h4l5 5V5L7 10H3z" />
      {!muted && (
        <path
          d="M16 8a4 4 0 010 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
