import type { Tool } from '@/types'
import { ToolCard } from './ToolCard'

interface ToolGridProps {
  tools: Tool[]
  favoriteIds: string[]
  onToggleFavorite: (id: string) => void
}

export function ToolGrid({ tools, favoriteIds, onToggleFavorite }: ToolGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          isFavorite={favoriteIds.includes(tool.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  )
}
