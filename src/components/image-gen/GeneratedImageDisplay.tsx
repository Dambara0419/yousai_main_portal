interface GeneratedImageDisplayProps {
  loading: boolean
  imageBase64: string | null
  imageMimeType: string
  error: string | null
}

export function GeneratedImageDisplay({ loading, imageBase64, imageMimeType, error }: GeneratedImageDisplayProps) {
  if (!loading && !imageBase64 && !error) return null

  const handleDownload = () => {
    if (!imageBase64) return
    const link = document.createElement('a')
    link.href = `data:${imageMimeType};base64,${imageBase64}`
    link.download = `generated-image-${Date.now()}.${imageMimeType.split('/')[1] ?? 'png'}`
    link.click()
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">生成結果</h3>
        {imageBase64 && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-800 font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            ダウンロード
          </button>
        )}
      </div>

      <div className="p-4 min-h-48 flex items-center justify-center bg-gray-900">
        {loading && (
          <div className="text-center">
            <svg className="animate-spin h-10 w-10 text-brand-400 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-gray-400">Geminiが画像を生成中です...</p>
            <p className="text-xs text-gray-500 mt-1">しばらくお待ちください</p>
          </div>
        )}

        {!loading && error && (
          <div className="text-center text-red-400">
            <div className="text-3xl mb-2">⚠️</div>
            <p className="text-sm font-medium">エラーが発生しました</p>
            <p className="text-xs mt-1 text-red-300 max-w-xs">{error}</p>
          </div>
        )}

        {!loading && imageBase64 && (
          <img
            src={`data:${imageMimeType};base64,${imageBase64}`}
            alt="AIが生成した画像"
            className="max-w-full max-h-[600px] rounded-lg object-contain"
          />
        )}
      </div>
    </div>
  )
}
