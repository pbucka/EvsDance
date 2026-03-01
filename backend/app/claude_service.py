"""Claude API integration with model selection (Opus, Sonnet, Haiku)."""

import hashlib
import json

from anthropic import Anthropic, APIError

from app.config import get_settings
from app.redis_client import cache_get, cache_set

MODEL_MAP: dict[str, str] = {
    "opus": "claude-opus-4-6",
    "sonnet": "claude-sonnet-4-6",
    "haiku": "claude-haiku-4-5-20251001",
}

DEFAULT_MODEL = "sonnet"


def get_model_id(choice: str) -> str:
    """Resolve a friendly name ('opus', 'sonnet', 'haiku') to its Anthropic model ID."""
    key = (choice or DEFAULT_MODEL).strip().lower()
    return MODEL_MAP.get(key, MODEL_MAP[DEFAULT_MODEL])


def _cache_key(prompt: str, model: str, system: str | None) -> str:
    raw = json.dumps({"p": prompt, "m": model, "s": system or ""}, sort_keys=True)
    return "evsdance:claude:" + hashlib.sha256(raw.encode()).hexdigest()


async def complete(
    prompt: str,
    model_choice: str = DEFAULT_MODEL,
    system_prompt: str | None = None,
    use_cache: bool = True,
    cache_ttl: int = 3600,
    max_tokens: int = 1024,
) -> str:
    """
    Send a prompt to Claude using the selected model.

    When caching is enabled, identical prompt+model+system combinations
    are served from Redis if a cached response exists.
    """
    model_id = get_model_id(model_choice)

    if use_cache:
        ck = _cache_key(prompt, model_id, system_prompt)
        cached = await cache_get(ck)
        if isinstance(cached, str):
            return cached

    settings = get_settings()
    if not settings.anthropic_api_key:
        raise ValueError("EVS_ANTHROPIC_API_KEY is not set")

    client = Anthropic(api_key=settings.anthropic_api_key)

    kwargs: dict = {
        "model": model_id,
        "max_tokens": max_tokens,
        "messages": [{"role": "user", "content": prompt}],
    }
    if system_prompt:
        kwargs["system"] = system_prompt

    try:
        response = client.messages.create(**kwargs)
        text = response.content[0].text if response.content else ""
    except APIError as exc:
        raise RuntimeError(f"Claude API error: {exc}") from exc

    if use_cache and text:
        await cache_set(ck, text, ttl_seconds=cache_ttl)

    return text
