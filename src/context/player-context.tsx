'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import type { Song } from '@/types';

type PlayerContextValue = {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number; // seconds elapsed
  duration: number; // seconds total (from audio metadata)
  volume: number; // 0..1
  // actions
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Holds the latest "advance to next track on end" logic so the audio
  // 'ended' listener (attached once on mount) always calls the current version.
  const onEndedRef = useRef<() => void>(() => {});

  const [queue, setQueue] = useState<Song[]>([]);
  const [index, setIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);

  // Derived, not stored: the current track is just the queue position.
  // Computing it during render avoids a setState-in-effect on every load.
  const currentSong: Song | null =
    index >= 0 && index < queue.length ? queue[index] : null;

  // Create the single audio element once, on the client.
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onTime = () => setProgress(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onLoadStart = () => setProgress(0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => onEndedRef.current();

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('loadstart', onLoadStart);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('loadstart', onLoadStart);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, []);

  // When the track position changes, point the audio element at the new
  // source and play it. This effect only touches the external system
  // (the audio element) — progress/duration/playing state are driven by
  // the element's own events above, so no setState happens in this body.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.src = currentSong.fileUrl;
    audio.play().catch(() => {
      // Autoplay can be blocked or the URL can be bad — the 'pause'
      // event won't fire for a load failure, so reflect it directly.
      setIsPlaying(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong?.id]);

  // Keep the 'ended' behavior current: advance to the next track if one
  // exists, otherwise stop. Lives in its own effect, updated when the queue
  // position changes — so the once-attached listener always does the right thing.
  useEffect(() => {
    onEndedRef.current = () => {
      if (index < queue.length - 1) {
        setIndex((i) => i + 1);
      } else {
        setIsPlaying(false);
      }
    };
  }, [index, queue.length]);

  const playSong = useCallback((song: Song, q?: Song[]) => {
    const nextQueue = q && q.length ? q : [song];
    const startIndex = Math.max(
      0,
      nextQueue.findIndex((s) => s.id === song.id)
    );
    setQueue(nextQueue);
    setIndex(startIndex);
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    if (audio.paused) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [currentSong]);

  const next = useCallback(() => {
    setIndex((i) => (i < queue.length - 1 ? i + 1 : i));
  }, [queue.length]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    // If more than 3s in, restart current track instead of going back.
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    setIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setProgress(seconds);
  }, []);

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current;
    const clamped = Math.min(1, Math.max(0, v));
    if (audio) audio.volume = clamped;
    setVolumeState(clamped);
  }, []);

  // Keyboard shortcuts: space = play/pause, arrows = seek 5s, shift+arrows = prev/next.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;
      if (typing || !currentSong) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        if (e.shiftKey) next();
        else seek(Math.min(duration, progress + 5));
      } else if (e.code === 'ArrowLeft') {
        if (e.shiftKey) prev();
        else seek(Math.max(0, progress - 5));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentSong, togglePlay, next, prev, seek, progress, duration]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        progress,
        duration,
        volume,
        playSong,
        togglePlay,
        next,
        prev,
        seek,
        setVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within a PlayerProvider');
  return ctx;
}
