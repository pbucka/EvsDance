const API_BASE = import.meta.env.VITE_API_URL || ''

export type ModelChoice = 'opus' | 'sonnet' | 'haiku'

export interface CompleteRequest {
  prompt: string
  model: ModelChoice
  system_prompt?: string | null
  use_cache?: boolean
  max_tokens?: number
}

export interface CompleteResponse {
  text: string
  model_used: string
}

export async function complete(request: CompleteRequest): Promise<CompleteResponse> {
  const res = await fetch(`${API_BASE}/api/claude/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: request.prompt,
      model: request.model,
      system_prompt: request.system_prompt ?? null,
      use_cache: request.use_cache ?? true,
      max_tokens: request.max_tokens ?? 1024,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    const message = Array.isArray(err.detail)
      ? err.detail.map((d: { msg?: string }) => d.msg).join(', ')
      : err.detail || `HTTP ${res.status}`
    throw new Error(message)
  }

  return res.json()
}
