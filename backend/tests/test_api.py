"""Tests for Ev's Dance API endpoints."""

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def client(app):
    return TestClient(app)


def test_root_returns_app_info(client: TestClient):
    r = client.get("/")
    assert r.status_code == 200
    data = r.json()
    assert "app" in data
    assert data["docs"] == "/docs"


def test_health_returns_ok(client: TestClient):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}
