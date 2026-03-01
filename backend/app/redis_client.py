"""Redis async client and cache helpers."""

import json
from typing import Any

import redis.asyncio as redis

from app.config import get_settings

_client: redis.Redis | None = None


async def init_redis() -> redis.Redis:
    """Connect to Redis. Called once at startup."""
    global _client
    settings = get_settings()
    _client = redis.from_url(
        settings.redis_url,
        encoding="utf-8",
        decode_responses=True,
    )
    return _client


async def close_redis() -> None:
    """Close the Redis connection."""
    global _client
    if _client:
        await _client.aclose()
        _client = None


def _require_client() -> redis.Redis:
    if _client is None:
        raise RuntimeError("Redis not initialized — call init_redis() first")
    return _client


async def cache_get(key: str) -> Any | None:
    """Return a cached JSON value, or None if missing/invalid."""
    r = _require_client()
    raw = await r.get(key)
    if raw is None:
        return None
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return None


async def cache_set(key: str, value: Any, ttl_seconds: int = 3600) -> None:
    """Store a JSON value with an optional TTL."""
    r = _require_client()
    await r.set(key, json.dumps(value), ex=ttl_seconds)


async def cache_delete(key: str) -> None:
    """Remove a key from cache."""
    r = _require_client()
    await r.delete(key)
