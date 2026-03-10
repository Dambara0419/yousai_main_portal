import { useRef, useState } from 'react'

interface UploadedImage {
  base64: string
  mimeType: string
  previewUrl: string
}

interface ImageDropzoneProps {
  onImageSelected: (image: UploadedImage | null) => void
  uploadedImage: UploadedImage | null
}

export function ImageDropzone({ onImageSelected, uploadedImage }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      const base64 = dataUrl.split(',')[1]
      onImageSelected({
        base64,
        mimeType: file.type,
        previewUrl: dataUrl,
      })
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onImageSelected(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        参考画像（任意）
      </label>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${
          isDragging
            ? 'border-brand-400 bg-brand-50'
            : 'border-gray-300 hover:border-brand-300 hover:bg-gray-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {uploadedImage ? (
          <div className="flex items-center gap-4">
            <img
              src={uploadedImage.previewUrl}
              alt="参考画像プレビュー"
              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700">画像がアップロードされています</p>
              <p className="text-xs text-gray-400 mt-1">{uploadedImage.mimeType}</p>
            </div>
            <button
              onClick={handleClear}
              className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
              削除
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-3xl mb-2">🖼️</div>
            <p className="text-sm text-gray-500">
              クリックまたはドラッグ＆ドロップで画像をアップロード
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP など</p>
          </div>
        )}
      </div>
    </div>
  )
}
