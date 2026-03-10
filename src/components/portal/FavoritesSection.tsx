import type { Tool } from '@/types'
import { ToolGrid } from './ToolGrid'

interface FavoritesSectionProps {
  allTools: Tool[]
  favoriteIds: string[]
  onToggleFavorite: (id: string) => void
}

export function FavoritesSection({ allTools, favoriteIds, onToggleFavorite }: FavoritesSectionProps) {
  if (favoriteIds.length === 0) return null

  const favoriteTools = favoriteIds
    .map((id) => allTools.find((t) => t.id === id))
    .filter((t): t is Tool => t !== undefined)

  if (favoriteTools.length === 0) return null

  return (
    <section className="bg-amber-50 border border-amber-200 rounded-xl p-4">
      <h2 className="text-base font-semibold text-amber-700 mb-3 flex items-center gap-2">
        <span>★</span>
        お気に入り
        <span className="text-xs font-normal text-amber-500">({favoriteTools.length})</span>
      </h2>
      <ToolGrid tools={favoriteTools} favoriteIds={favoriteIds} onToggleFavorite={onToggleFavorite} />
    </section>
  )
}
