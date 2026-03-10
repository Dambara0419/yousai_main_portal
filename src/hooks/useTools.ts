import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Category, Tool, ToolsByCategory } from '@/types'

interface UseToolsResult {
  data: ToolsByCategory[]
  allTools: Tool[]
  loading: boolean
  error: string | null
}

export function useTools(): UseToolsResult {
  const [data, setData] = useState<ToolsByCategory[]>([])
  const [allTools, setAllTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, toolsRes] = await Promise.all([
          supabase.from('categories').select('*').order('sort_order', { ascending: true }),
          supabase.from('tools').select('*'),
        ])

        if (categoriesRes.error) throw categoriesRes.error
        if (toolsRes.error) throw toolsRes.error

        const categories = categoriesRes.data as Category[]
        const tools = toolsRes.data as Tool[]

        const grouped: ToolsByCategory[] = categories.map((cat) => ({
          category: cat,
          tools: tools.filter((t) => t.category_id === cat.id),
        }))

        setData(grouped)
        setAllTools(tools)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'データの取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [])

  return { data, allTools, loading, error }
}
