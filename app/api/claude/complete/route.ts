import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

const MODEL_MAP: Record<string, string> = {
  opus: 'claude-opus-4-6',
  sonnet: 'claude-sonnet-4-6',
  haiku: 'claude-haiku-4-5-20251001',
}

function getModelId(choice: string): string {
  const key = (choice || 'sonnet').trim().toLowerCase()
  return MODEL_MAP[key] ?? MODEL_MAP.sonnet
}

function cacheKey(prompt: string, model: string, system: string | null): string {
  const raw = JSON.stringify({ p: prompt, m: model, s: system ?? '' })
  return 'evsdance:claude:' + crypto.createHash('sha256').update(raw).digest('hex')
}

let redisClient: import('ioredis').default | null = null

async function getRedis() {
  if (redisClient) return redisClient
  try {
    const Redis = (await import('ioredis')).default
    const url = process.env.EVS_REDIS_URL ?? `redis://${process.env.EVS_REDIS_HOST ?? 'localhost'}:${process.env.EVS_REDIS_PORT ?? '6379'}/${process.env.EVS_REDIS_DB ?? '0'}`
    redisClient = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 1 })
    await redisClient.connect()
    return redisClient
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, model = 'sonnet', system_prompt = null, use_cache = true, max_tokens = 1024 } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
    }

    const modelId = getModelId(model)

    if (use_cache) {
      const redis = await getRedis()
      if (redis) {
        const ck = cacheKey(prompt, modelId, system_prompt)
        const cached = await redis.get(ck)
        if (cached) {
          return NextResponse.json({ text: JSON.parse(cached), model_used: modelId })
        }
      }
    }

    const apiKey = process.env.EVS_ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'EVS_ANTHROPIC_API_KEY is not set' }, { status: 400 })
    }

    const messages = [{ role: 'user', content: prompt }]
    const payload: Record<string, unknown> = { model: modelId, max_tokens: max_tokens, messages }
    if (system_prompt) payload.system = system_prompt

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const err = await response.text()
      return NextResponse.json({ error: `Claude API error: ${err}` }, { status: 502 })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text ?? ''

    if (use_cache && text) {
      const redis = await getRedis()
      if (redis) {
        const ck = cacheKey(prompt, modelId, system_prompt)
        await redis.set(ck, JSON.stringify(text), 'EX', 3600)
      }
    }

    return NextResponse.json({ text, model_used: modelId })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
