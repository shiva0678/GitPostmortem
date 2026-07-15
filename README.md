# GitPostmortem

**AI-powered repository intelligence.** GitPostmortem analyses your GitHub repository's commit history and surfaces recurring failure patterns, code hotspots, blind spots, and actionable code-review rules — all powered by the Gemini AI API.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Local Development Setup](#local-development-setup)
- [Running the Project](#running-the-project)
- [Environment Variables](#environment-variables)
- [Production Build](#production-build)
- [Deployment](#deployment)
  - [Frontend — Vercel](#frontend--vercel)
  - [Backend — Render](#backend--render)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Minimum Version | Check |
|---|---|---|
| Node.js | 18.x | `node --version` |
| npm | 9.x | `npm --version` |
| Python | 3.10+ | `python --version` |
| Git | any | `git --version` |

---

## Project Structure

```
GitPostmortem/
├── src/                    # React + Vite frontend
│   ├── pages/              # Landing, LoadingScreen, Dashboard
│   ├── components/         # UI components (common + dashboard)
│   ├── services/
│   │   └── api.js          # Centralised API client (fetch, retry, timeout)
│   └── utils/
│       └── validateResponse.js  # Backend response validator
├── backend/                # FastAPI backend
│   ├── main.py             # API routes
│   ├── github_service.py   # GitHub REST API client
│   ├── analyzer.py         # Gemini AI analysis
│   ├── models.py           # Pydantic schemas
│   └── requirements.txt    # Python dependencies
├── vite.config.js          # Vite config + dev proxy
├── .env.example            # Environment variable reference
└── vercel.json             # Vercel production deployment config
```

---

## Local Development Setup

### Step 1 — Clone the repository

```bash
git clone https://github.com/your-username/gitpostmortem.git
cd gitpostmortem
```

### Step 2 — Install frontend dependencies

```bash
npm install
```

### Step 3 — Set up the Python virtual environment

```bash
# Windows
python -m venv backend/venv
backend\venv\Scripts\activate

# macOS / Linux
python3 -m venv backend/venv
source backend/venv/bin/activate
```

### Step 4 — Install backend dependencies

```bash
pip install -r backend/requirements.txt
```

### Step 5 — Configure environment variables

**Frontend** (`.env.local` in the project root):

```bash
cp .env.example .env.local
```

The default value works out of the box for local development — the Vite proxy forwards `/api/*` to `localhost:8000` automatically:

```env
VITE_API_URL=/api/analyze
```

**Backend** (`backend/.env`):

```bash
cp .env.example backend/.env
```

Then open `backend/.env` and fill in your API keys:

```env
GITHUB_TOKEN=ghp_your_github_personal_access_token
GEMINI_API_KEY=your_google_gemini_api_key
HOST=0.0.0.0
PORT=8000
ENV=development
```

> **Getting API Keys**
> - **GitHub Token**: <https://github.com/settings/tokens> — grant `public_repo` scope (add `repo` for private repositories).
> - **Gemini API Key**: <https://aistudio.google.com/app/apikey>
>
> The app works without keys — GitHub falls back to 60 req/hr (unauthenticated) and the AI falls back to rule-based heuristics — but results will be limited.

---

## Running the Project

### Run both frontend and backend together (recommended)

```bash
npm run dev:full
```

This starts:
- **Frontend** at `http://localhost:5173`
- **Backend** at `http://localhost:8000`

The Vite dev proxy forwards all `/api/*` requests to the backend automatically — no CORS issues in development.

### Run individually

```bash
# Frontend only
npm run dev

# Backend only (activate venv first)
npm run backend
```

### Verify the backend is healthy

```bash
curl http://localhost:8000/health
# Expected: {"status":"healthy"}
```

### Test the analyze endpoint

```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"repoUrl":"https://github.com/facebook/react"}'
```

---

## Environment Variables

See [`.env.example`](.env.example) for the full reference with descriptions.

| Variable | Location | Required | Description |
|---|---|---|---|
| `VITE_API_URL` | `.env.local` | No | Backend endpoint URL. Defaults to `/api/analyze` (dev proxy). |
| `GITHUB_TOKEN` | `backend/.env` | Recommended | GitHub PAT — raises rate limit from 60 to 5,000 req/hr. |
| `GEMINI_API_KEY` | `backend/.env` | Recommended | Enables AI-powered analysis. Falls back to heuristics without it. |
| `HOST` | `backend/.env` | No | Server bind host. Default: `0.0.0.0`. |
| `PORT` | `backend/.env` | No | Server bind port. Default: `8000`. |
| `ENV` | `backend/.env` | No | `development` or `production`. Affects logging. |

---

## Production Build

```bash
# Build the frontend
npm run build

# Preview the production build locally
npm run preview
```

The built files are output to `dist/`. In production, set `VITE_API_URL` to your deployed backend URL before building:

```bash
VITE_API_URL=https://your-backend.onrender.com/api/analyze npm run build
```

---

## Deployment

### Frontend — Vercel

1. Push the repository to GitHub.
2. Import the project at <https://vercel.com/new>.
3. Set the **Root Directory** to the project root (where `package.json` lives).
4. Add environment variable in the Vercel dashboard:
   ```
   VITE_API_URL = https://your-backend.onrender.com/api/analyze
   ```
5. Deploy. The included `vercel.json` rewrites `/api/*` requests to the Render backend.

### Backend — Render

1. Create a new **Web Service** at <https://render.com>.
2. Connect your GitHub repository.
3. Set **Root Directory** to `backend`.
4. Set **Runtime** to `Python 3`.
5. Set **Build Command**:
   ```bash
   pip install -r requirements.txt
   ```
6. Set **Start Command**:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
7. Add environment variables in the Render dashboard:
   ```
   GITHUB_TOKEN  = ghp_your_token
   GEMINI_API_KEY = your_gemini_key
   ENV           = production
   ```
8. Update `CORS` origins in `backend/main.py` to include your Vercel domain when moving to production.

---

## API Reference

### `GET /health`

Health check.

```json
{ "status": "healthy" }
```

### `POST /api/analyze`

Analyse a GitHub repository.

**Request body:**

```json
{ "repoUrl": "https://github.com/owner/repo" }
```

**Response:**

```json
{
  "repository_summary": { "repo_name": "...", "total_commits": 0, "contributors": 0, "most_modified_module": "" },
  "timeline": [{ "date": "2024-01-01", "commits": 5 }],
  "hotspots": [{ "module": "src/core.js" }],
  "failure_patterns": [{ "title": "...", "severity": "high", "occurrences": 3 }],
  "blind_spots": ["Coverage gap in error boundaries"],
  "code_review_rules": ["Require tests for all hotspot files"],
  "risk_assessment": { "score": 72, "level": "High" }
}
```

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| `Cannot reach the analysis backend` | Backend not running | Run `npm run dev:full` or `npm run backend` |
| `GitHub API rate limit exceeded` | No `GITHUB_TOKEN` set | Add token to `backend/.env` |
| `The Gemini AI analysis failed` | No `GEMINI_API_KEY` | Add key to `backend/.env` — dashboard shows heuristic results |
| `Repository not found` | Private repo or typo | Check URL; use `public_repo` scope on GitHub token |
| Frontend shows mock data | API returned error | Check backend logs with `npm run backend` |
| `ModuleNotFoundError` on backend start | venv not activated | Run `backend\venv\Scripts\activate` (Windows) |
| CORS error in browser console | Backend CORS config | Ensure `allow_origins` in `main.py` includes your frontend origin |
