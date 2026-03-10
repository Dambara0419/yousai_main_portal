import { useMemo } from 'react'
import { useTools } from '@/hooks/useTools'
import { useFavorites } from '@/hooks/useFavorites'
import { FavoritesSection } from '@/components/portal/FavoritesSection'
import { CategorySection } from '@/components/portal/CategorySection'

interface PortalPageProps {
  searchQuery: string
}

export function PortalPage({ searchQuery }: PortalPageProps) {
  const { data, allTools, loading, error } = useTools()
  const { favoriteIds, toggleFavorite } = useFavorites()

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data
    const q = searchQuery.toLowerCase()
    return data
      .map((item) => ({
        ...item,
        tools: item.tools.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description?.toLowerCase().includes(q)
        ),
      }))
      .filter((item) => item.tools.length > 0)
  }, [data, searchQuery])

  const filteredAllTools = useMemo(() => {
    if (!searchQuery.trim()) return allTools
    const q = searchQuery.toLowerCase()
    return allTools.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
    )
  }, [allTools, searchQuery])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-brand-500 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-500 text-sm">ツールを読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto py-24 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-lg font-semibold text-gray-800 mb-2">データの取得に失敗しました</h2>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {!searchQuery && (
        <FavoritesSection
          allTools={allTools}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />
      )}

      {searchQuery && filteredAllTools.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500">「{searchQuery}」に一致するツールが見つかりませんでした</p>
        </div>
      )}

      {filteredData.map(({ category, tools }) => (
        <CategorySection
          key={category.id}
          category={category}
          tools={tools}
          favoriteIds={favoriteIds}
          onToggleFavorite={toggleFavorite}
        />
      ))}

      {data.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-500">ツールがまだ登録されていません</p>
          <p className="text-sm text-gray-400 mt-1">Supabaseのダッシュボードからツールを追加してください</p>
        </div>
      )}
    </div>
  )
}
