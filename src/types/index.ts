export interface Category {
  id: string
  name: string
  sort_order: number
}

export interface Tool {
  id: string
  category_id: string
  title: string
  description: string
  url: string
  icon_url: string | null
}

export interface ToolsByCategory {
  category: Category
  tools: Tool[]
}
