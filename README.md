# Ev's Dance

**Ev's Dance** is a full-stack app that uses **Claude** (Opus, Sonnet, and Haiku) with model choice driven by the prompt you write. Built with **React**, **Python** (FastAPI), **PostgreSQL**, and **Redis** cache.

## Stack

- **Frontend:** React (Vite) + TypeScript
- **Backend:** Python, FastAPI
- **Database:** PostgreSQL
- **Cache:** Redis (for Claude response caching)
- **AI:** Anthropic Claude — choose **Opus** (most capable), **Sonnet** (balanced), or **Haiku** (fast) per request

## Quick start

### 1. Backend (Python)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env: set EVS_ANTHROPIC_API_KEY and DB/Redis if needed
```

Create the DB and run schema (optional, for storing prompts):

```bash
createdb evsdance
psql -d evsdance -f schema.sql
```

Start the API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Redis

Have Redis running locally (default: `localhost:6379`), or set `EVS_REDIS_HOST`, `EVS_REDIS_PORT`, etc. in `.env`.

### 3. Frontend (React)

If you see an `EPERM` error about the npm cache, fix it once (then run the commands below from **this project's** `frontend` folder):

```bash
sudo chown -R $(whoami) ~/.npm
```

Then start the Ev's Dance frontend from the **Ev's Dance** project:

```bash
cd /Users/buckafamily/evs-dance/frontend
npm install
npm run dev
```

**Ev's Dance app URL:** **http://localhost:5180**

Open that URL in your browser. If another app appears, make sure you ran `npm run dev` from `evs-dance/frontend` (not another project). To reset: stop any other dev server (Ctrl+C in its terminal), then run the commands above again.

## Model selection

In the UI you pick the model for each prompt:

- **Opus** — most capable; best for complex or nuanced tasks.
- **Sonnet** — balanced speed and quality.
- **Haiku** — fastest; good for simple or high-volume requests.

The backend maps these to current Anthropic model IDs (e.g. `claude-opus-4-6`, `claude-sonnet-4-6`, `claude-haiku-4-5-20251001`). Responses are cached in Redis when `use_cache` is true.

## API

- **POST /api/claude/complete**

  Body:

  ```json
  {
    "prompt": "Your prompt here",
    "model": "opus",
    "system_prompt": null,
    "use_cache": true,
    "max_tokens": 1024
  }
  ```

  `model` must be one of: `opus`, `sonnet`, `haiku`.

## Env (backend)

| Variable | Description |
|----------|-------------|
| `EVS_ANTHROPIC_API_KEY` | Required. Anthropic API key. |
| `EVS_POSTGRES_*` | Postgres connection (host, port, user, password, db). |
| `EVS_REDIS_*` | Redis connection (host, port, db, optional password). |

## License

MIT
