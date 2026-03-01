# Ev's Dance – Vulnerability & Test Report

**Generated:** Recommendations after running vulnerability checks and adding unit test support.

---

## 1. Vulnerability assessment

### Frontend (npm)

- **`npm audit`:** **0 vulnerabilities** (info / low / moderate / high / critical).
- **Action:** None required. Re-run periodically: `cd frontend && npm audit`.

### Backend (Python)

- **pip-audit** was not run in this environment (install/permission limits).
- **Action:** Run locally in a virtual environment:
  ```bash
  cd backend
  python3 -m venv .venv
  source .venv/bin/activate   # or `.venv\Scripts\activate` on Windows
  pip install -r requirements.txt pip-audit
  pip-audit
  ```
- Optionally pin versions in `requirements.txt` and re-run `pip-audit` after upgrades.

---

## 2. Lint (ESLint) – fixed

The following were fixed so `npm run lint` passes:

1. **Unused variable** — Removed `PARKING_LOT_WIDTH_PCT` (it was never used).
2. **React: setState in effect** — The effect that runs when the van enters/leaves the parking lot was calling `setState` synchronously, which can cause cascading renders. All `setState` calls from that effect are now deferred with `setTimeout(..., 0)`.

**Command:** `cd frontend && npm run lint`

---

## 3. Unit tests – added

- **Scripts in `frontend/package.json`:**
  - `npm run test` – run tests once.
  - `npm run test:watch` – run tests in watch mode.
- **Dependencies (dev):** `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`.
- **Config:** `vite.config.ts` – `test` block with `environment: 'jsdom'`, `globals: true`, and `setupFiles`.
- **Tests:** `StoreFront.test.tsx`, `Draggable.test.tsx`, `DanceStudioDoors.test.tsx`.
- **Backend tests:** `backend/tests/` with pytest for `/` and `/health`.
- **CI:** `.github/workflows/ci.yml` runs frontend lint + test + audit and backend pip-audit + pytest.

**To run tests:**

```bash
cd frontend && npm install && npm run test
cd backend && .venv/bin/pytest tests/ -v
```

---

## 4. Run everything locally

- **Script:** `bash scripts/run-recommendations.sh` (frontend runs; backend runs only if venv is active and dev deps installed).
- **Backend venv:**
  `cd backend && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt -r requirements-dev.txt`
  Then: `.venv/bin/pip-audit` and `.venv/bin/pytest tests/ -v`.
