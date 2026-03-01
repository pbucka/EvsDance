"""Pytest fixtures for Ev's Dance backend tests."""

from unittest.mock import AsyncMock, patch

import pytest


@pytest.fixture
def app():
    """Create a FastAPI test app with mocked DB/Redis so tests run without real services."""
    with (
        patch("app.main.init_db", new_callable=AsyncMock),
        patch("app.main.init_redis", new_callable=AsyncMock),
        patch("app.main.close_db", new_callable=AsyncMock),
        patch("app.main.close_redis", new_callable=AsyncMock),
    ):
        from app.main import create_app

        return create_app()
