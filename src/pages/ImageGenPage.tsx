import { useState } from 'react'
import { PromptInput } from '@/components/image-gen/PromptInput'
import { ImageDropzone } from '@/components/image-gen/ImageDropzone'
import { GeneratedImageDisplay } from '@/components/image-gen/GeneratedImageDisplay'

interface UploadedImage {
  base64: string
  mimeType: string
  previewUrl: string
}

interface GenerateResponse {
  imageBase64: string
  mimeType: string
}

export function ImageGenPage() {
  const [prompt, setPrompt] = useState('')
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null)
  const [generatedImage, setGeneratedImage] = useState<{ base64: string; mimeType: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const body: Record<string, string> = { prompt: prompt.trim() }
      if (uploadedImage) {
        body.imageBase64 = uploadedImage.base64
        body.mimeType = uploadedImage.mimeType
      }

      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`APIエラー (${res.status}): ${text}`)
      }

      const data = await res.json() as GenerateResponse
      setGeneratedImage({ base64: data.imageBase64, mimeType: data.mimeType })
    } catch (err) {
      setError(err instanceof Error ? err.message : '画像生成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI画像生成</h1>
        <p className="text-sm text-gray-500 mt-1">
          プロンプトを入力して、Gemini AIに画像を生成させましょう。参考画像を追加することもできます。
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <PromptInput
          prompt={prompt}
          onChange={setPrompt}
          onSubmit={() => void handleGenerate()}
          loading={loading}
        />

        <ImageDropzone
          onImageSelected={setUploadedImage}
          uploadedImage={uploadedImage}
        />
      </div>

      {(loading || generatedImage || error) && (
        <div className="mt-6">
          <GeneratedImageDisplay
            loading={loading}
            imageBase64={generatedImage?.base64 ?? null}
            imageMimeType={generatedImage?.mimeType ?? 'image/png'}
            error={error}
          />
        </div>
      )}
    </div>
  )
}
