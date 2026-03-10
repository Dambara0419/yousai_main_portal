import { Link, useLocation } from 'react-router-dom'

interface HeaderProps {
  searchQuery: string
  onSearch: (query: string) => void
}

export function Header({ searchQuery, onSearch }: HeaderProps) {
  const location = useLocation()
  const isPortal = location.pathname === '/'

  return (
    <header className="bg-brand-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
              <span className="bg-white text-brand-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-black">Y</span>
              <span>YouSai ポータル</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-sm">
              <Link
                to="/"
                className={`hover:text-brand-200 transition-colors ${location.pathname === '/' ? 'text-white font-semibold border-b-2 border-white pb-0.5' : 'text-brand-200'}`}
              >
                ツール一覧
              </Link>
              <Link
                to="/image-gen"
                className={`hover:text-brand-200 transition-colors ${location.pathname === '/image-gen' ? 'text-white font-semibold border-b-2 border-white pb-0.5' : 'text-brand-200'}`}
              >
                AI画像生成
              </Link>
            </nav>
          </div>

          {isPortal && (
            <div className="flex-1 max-w-sm ml-6">
              <input
                type="search"
                placeholder="ツールを検索..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-lg text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
