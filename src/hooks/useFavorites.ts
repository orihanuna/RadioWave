import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'radio-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  const toggleFavorite = useCallback((stationId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(stationId)) {
        next.delete(stationId);
      } else {
        next.add(stationId);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((stationId: string) => {
    return favorites.has(stationId);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
};
