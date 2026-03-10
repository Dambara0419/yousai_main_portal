interface PromptInputProps {
  prompt: string
  onChange: (value: string) => void
  onSubmit: () => void
  loading: boolean
}

export function PromptInput({ prompt, onChange, onSubmit, loading }: PromptInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !loading) {
      onSubmit()
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        プロンプト
        <span className="text-red-500 ml-1">*</span>
      </label>
      <textarea
        value={prompt}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="生成したい画像の説明を入力してください（例：夕暮れの富士山、水彩画風）"
        rows={4}
        disabled={loading}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
      />
      <p className="text-xs text-gray-400 mt-1">⌘+Enter または Ctrl+Enter で送信</p>

      <button
        onClick={onSubmit}
        disabled={loading || prompt.trim() === ''}
        className="mt-3 w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            生成中...
          </span>
        ) : (
          '画像を生成'
        )}
      </button>
    </div>
  )
}
