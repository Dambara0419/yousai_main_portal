import type { Tool, Category } from '@/types'
import { ToolGrid } from './ToolGrid'

interface CategorySectionProps {
  category: Category
  tools: Tool[]
  favoriteIds: string[]
  onToggleFavorite: (id: string) => void
}

export function CategorySection({ category, tools, favoriteIds, onToggleFavorite }: CategorySectionProps) {
  if (tools.length === 0) return null

  return (
    <section>
      <h2 className="text-base font-semibold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-2">
        <span className="w-1 h-5 bg-brand-500 rounded-full inline-block" />
        {category.name}
        <span className="text-xs font-normal text-gray-400">({tools.length})</span>
      </h2>
      <ToolGrid tools={tools} favoriteIds={favoriteIds} onToggleFavorite={onToggleFavorite} />
    </section>
  )
}
