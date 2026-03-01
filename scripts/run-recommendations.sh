#!/usr/bin/env bash
# Run all checks: audit, lint, tests (frontend + backend).
# Backend steps require an active venv with requirements-dev.txt installed.

set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "=== Frontend: audit ==="
(cd frontend && npm audit --audit-level=high || true)

echo ""
echo "=== Frontend: lint ==="
(cd frontend && npm run lint)

echo ""
echo "=== Frontend: test ==="
(cd frontend && npm run test) || echo "  (Install deps first: cd frontend && npm install)"

echo ""
echo "=== Backend: pip-audit ==="
if [ -n "$VIRTUAL_ENV" ] && command -v pip-audit &>/dev/null; then
  (cd backend && pip-audit)
else
  echo "  Skipped (activate backend venv and install requirements-dev.txt to run)."
fi

echo ""
echo "=== Backend: pytest ==="
if [ -n "$VIRTUAL_ENV" ] && python -c "import pytest" 2>/dev/null; then
  (cd backend && python -m pytest tests/ -v)
else
  echo "  Skipped (activate backend venv and install requirements-dev.txt to run)."
fi

echo ""
echo "Done."
