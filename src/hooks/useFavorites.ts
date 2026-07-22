'use client';

import { useState, useEffect, useCallback } from 'react';
import { getFavorites, addFavorite, removeFavorite } from '@/lib/api';

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