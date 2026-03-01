const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

interface ClaudeResponse {
  text: string
  model_used: string
}

export async function complete(
  prompt: string,
  options?: {
    model?: 'opus' | 'sonnet' | 'haiku'
    system_prompt?: string
    use_cache?: boolean
    max_tokens?: number
  },
): Promise<ClaudeResponse> {
  const res = await fetch(`${API_BASE}/api/claude/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, ...options }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? 'API request failed')
  }
  return res.json()
}
