'use client';

import { useState, useEffect, useCallback } from 'react';
import { getFavorites, addFavorite, removeFavorite } from '@/lib/api';

// Tracks which song IDs are favorited so any list can show the correct
// heart state and toggle it optimistically.
export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    getFavorites()
      .then((favs) => {
        if (active) setFavoriteIds(new Set(favs.map((f) => f.songId)));
      })
      .catch(() => {
        // Non-fatal: favorites just show as empty if this fails.
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const toggleFavorite = useCallback(
    async (songId: string) => {
      const isFav = favoriteIds.has(songId);
      // Optimistic update.
      setFavoriteIds((prev) => {
        const nextSet = new Set(prev);
        if (isFav) nextSet.delete(songId);
        else nextSet.add(songId);
        return nextSet;
      });
      try {
        if (isFav) await removeFavorite(songId);
        else await addFavorite(songId);
      } catch {
        // Roll back on failure.
        setFavoriteIds((prev) => {
          const nextSet = new Set(prev);
          if (isFav) nextSet.add(songId);
          else nextSet.delete(songId);
          return nextSet;
        });
      }
    },
    [favoriteIds]
  );

  return { favoriteIds, toggleFavorite, loaded };
}