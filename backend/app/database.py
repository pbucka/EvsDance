"""PostgreSQL async connection pool and query helpers."""

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import asyncpg

from app.config import get_settings

_pool: asyncpg.Pool | None = None


async def init_db() -> asyncpg.Pool:
    """Create the connection pool. Called once at startup."""
    global _pool
    settings = get_settings()
    _pool = await asyncpg.create_pool(
        settings.database_url,
        min_size=2,
        max_size=10,
        command_timeout=60,
    )
    return _pool


async def close_db() -> None:
    """Gracefully shut down the pool."""
    global _pool
    if _pool:
        await _pool.close()
        _pool = None


def _require_pool() -> asyncpg.Pool:
    if _pool is None:
        raise RuntimeError("Database pool not initialized — call init_db() first")
    return _pool


@asynccontextmanager
async def get_connection() -> AsyncGenerator[asyncpg.Connection, None]:
    pool = _require_pool()
    async with pool.acquire() as conn:
        yield conn


async def execute_query(query: str, *args: object) -> list[asyncpg.Record]:
    async with get_connection() as conn:
        return await conn.fetch(query, *args)


async def execute_command(query: str, *args: object) -> str:
    async with get_connection() as conn:
        return await conn.execute(query, *args)
