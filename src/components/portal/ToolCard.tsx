import type { Tool } from '@/types'

interface ToolCardProps {
  tool: Tool
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
}

export function ToolCard({ tool, isFavorite, onToggleFavorite }: ToolCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onToggleFavorite(tool.id)
  }

  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col bg-white rounded-xl border border-gray-200 p-4 hover:border-brand-300 hover:shadow-md transition-all duration-200"
    >
      <button
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
        className="absolute top-3 right-3 text-lg leading-none hover:scale-110 transition-transform"
      >
        {isFavorite ? '★' : '☆'}
      </button>

      <div className="flex items-center gap-3 mb-3 pr-8">
        {tool.icon_url ? (
          <img
            src={tool.icon_url}
            alt=""
            className="w-10 h-10 rounded-lg object-contain flex-shrink-0 bg-gray-50"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
            <span className="text-brand-600 font-bold text-lg">{tool.title.charAt(0)}</span>
          </div>
        )}
        <h3 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-brand-700 transition-colors line-clamp-2">
          {tool.title}
        </h3>
      </div>

      {tool.description && (
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      )}
    </a>
  )
}
