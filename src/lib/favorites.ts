const STORAGE_KEY = 'portal_favorites'

export function getFavoriteIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as string[]
  } catch {
    return []
  }
}

export function addFavorite(id: string): void {
  const ids = getFavoriteIds()
  if (!ids.includes(id)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids, id]))
  }
}

export function removeFavorite(id: string): void {
  const ids = getFavoriteIds().filter((fid) => fid !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export function isFavorite(id: string): boolean {
  return getFavoriteIds().includes(id)
}
