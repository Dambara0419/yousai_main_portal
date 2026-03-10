import { useState, useCallback } from 'react'
import { getFavoriteIds, addFavorite, removeFavorite } from '@/lib/favorites'

interface UseFavoritesResult {
  favoriteIds: string[]
  toggleFavorite: (id: string) => void
  isFavorited: (id: string) => boolean
}

export function useFavorites(): UseFavoritesResult {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => getFavoriteIds())

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => {
      if (prev.includes(id)) {
        removeFavorite(id)
        return prev.filter((fid) => fid !== id)
      } else {
        addFavorite(id)
        return [...prev, id]
      }
    })
  }, [])

  const isFavorited = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds]
  )

  return { favoriteIds, toggleFavorite, isFavorited }
}
