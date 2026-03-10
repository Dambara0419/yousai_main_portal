import type { PagesFunction } from '@cloudflare/workers-types'

interface Env {
  GEMINI_API_KEY: string
}

interface RequestBody {
  prompt: string
  imageBase64?: string
  mimeType?: string
}

interface GeminiPart {
  text?: string
  inlineData?: {
    mimeType: string
    data: string
  }
}

interface GeminiCandidate {
  content: {
    parts: GeminiPart[]
  }
}

interface GeminiResponse {
  candidates: GeminiCandidate[]
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const apiKey = context.env.GEMINI_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY が設定されていません' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Content-Type 検証
  const contentType = context.request.headers.get('Content-Type') ?? ''
  if (!contentType.includes('application/json')) {
    return new Response('Content-Type must be application/json', { status: 400 })
  }

  let body: RequestBody
  try {
    body = await context.request.json<RequestBody>()
  } catch {
    return new Response('Invalid JSON body', { status: 400 })
  }

  const { prompt, imageBase64, mimeType } = body

  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return new Response('prompt は必須です', { status: 400 })
  }

  // Gemini API リクエスト構築
  const parts: GeminiPart[] = []

  // 参考画像がある場合は先に追加
  if (imageBase64 && mimeType) {
    parts.push({
      inlineData: {
        mimeType,
        data: imageBase64,
      },
    })
  }

  parts.push({ text: prompt })

  const geminiRequestBody = {
    contents: [
      {
        role: 'user',
        parts,
      },
    ],
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  }

  const GEMINI_MODEL = 'gemini-3.1-flash-image-preview'
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`

  let geminiRes: Response
  try {
    geminiRes = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiRequestBody),
    })
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Gemini APIへの接続に失敗しました', detail: String(err) }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (!geminiRes.ok) {
    const errText = await geminiRes.text()
    return new Response(
      JSON.stringify({ error: `Gemini APIエラー (${geminiRes.status})`, detail: errText }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const geminiData = await geminiRes.json<GeminiResponse>()

  // レスポンスから画像パーツを抽出
  const parts_out = geminiData.candidates?.[0]?.content?.parts ?? []
  const imagePart = parts_out.find(
    (p) => p.inlineData?.mimeType?.startsWith('image/')
  )

  if (!imagePart?.inlineData) {
    // テキストパーツも確認してエラーメッセージを表示
    const textPart = parts_out.find((p) => p.text)
    return new Response(
      JSON.stringify({
        error: '画像が生成されませんでした',
        detail: textPart?.text ?? 'レスポンスに画像データが含まれていません',
      }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({
      imageBase64: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  )
}

// GET/その他メソッドは拒否
export const onRequest: PagesFunction<Env> = async () => {
  return new Response('Method Not Allowed', { status: 405 })
}
