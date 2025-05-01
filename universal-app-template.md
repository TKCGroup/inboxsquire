# Universal App Template – Opinionated Stack for Tyler & Coding Agents

> **Purpose:** Hand this file (or copy‑paste sections) into any new repo’s README to bootstrap projects with your preferred tooling, structure, and dev workflows.

---

## 0. TL;DR Cheat‑Sheet
| Layer | Default Choice | Fallback / Notes |
|-------|---------------|------------------|
| **DB/Auth/Edge** | **Supabase** | If agentic background jobs > Edge → use Firebase + GCP Cloud Functions |
| **Hosting** | **Vercel** (auto CI/CD) | Cloudflare Pages for static micros; DNS always Cloudflare |
| **Frontend** | React + **Vite** + TS | Next.js if we need file‑based routing / SSR |
| **Styling** | **Tailwind CSS** + shadcn/ui | MUI for heavy dashboards if needed |
| **Charts** | Recharts | Visx, Highcharts optional |
| **Animations** | Framer Motion (default) | GSAP, Lenis for scroll/parallax |
| **AI / Agents** | Python (LangChain, LangGraph) | Node.js if unavoidable |

---

## 1. Directory Layout (Monorepo)
```txt
repo-root/
├─ .github/workflows/          # CI pipelines (build, test, deploy)
├─ apps/
│   ├─ web/                    # Vite(TS) frontend PWA
│   │   ├─ src/
│   │   │   ├─ components/
│   │   │   │   └─ Button/index.tsx  # pattern: folder + index.tsx
│   │   │   ├─ pages/          # if using React‑Router or Next replacement
│   │   │   ├─ hooks/
│   │   │   └─ lib/
│   └─ mobile/                 # Expo React‑Native if required
├─ functions/                  # Serverless back‑end (Edge or GCP)
│   ├─ python/                 # agentic scripts
│   │   ├─ reformat_agent/
│   │   │   ├─ app.py
│   │   │   ├─ requirements.txt
│   │   │   └─ Dockerfile
│   └─ node/                   # Supabase edge functions (minimal)
├─ infra/
│   ├─ supabase/               # sql, seed
│   └─ terraform/              # optional cloud config
├─ package.json                # root scripts – always runnable here
├─ vite.config.ts              # shared config for apps/web
└─ README.md                   # copy of this template
```

## 2. Universal `package.json` Scripts
```json
{
  "scripts": {
    "clean": "git clean -Xfd && rm -rf node_modules",
    "install": "npm ci",
    "build": "turbo run build --filter=apps/...",
    "dev": "turbo run dev --parallel",
    "lint": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write ."
  }
}
```
*Run from repo‑root. Agents never `cd`.*

## 3. Python Standards
```bash
# Create venv at project root
python -m venv .venv
source .venv/bin/activate
pip install -r functions/python/requirements.txt
```
*Each agentic microservice keeps its own `requirements.txt` + `Dockerfile`. Use `langchain==<lock>`.*

## 4. Dev-Prod Parity Rules
1. **No dev databases.** Always point to production Supabase URL with `SERVICE_ROLE` ref limited via RLS.  
2. Use `.env.local` for secrets; never commit.  
3. Feature flags → Supabase `config` table.

## 5. CI / CD (GitHub Actions)
```yaml
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: {node-version: '20'}
      - run: npm ci
      - run: npm run build
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/actions@v2
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          org-id: ${{ secrets.VERCEL_ORG }}
          project-id: ${{ secrets.VERCEL_PROJECT }}
```

## 6. Frontend Conventions
* Mobile‑first in Tailwind (`md:` breakpoints upward).  
* shadcn/ui as default components; if missing, create custom + tailwind merging style.  
* Use **Framer Motion** for enters/exits, **Lenis** for smooth scroll, **@react-spring/parallax** for big hero sections.

## 7. Testing & Linting
* **Vitest** + React Testing Library.  
* **Playwright** for E2E across mobile & desktop widths.

## 8. Onboarding Sequence (Runbooks)
1. `npm i -g supabase`  
2. `supabase init` & `supabase db start` (optional local db)  
3. clone repo → `npm run install` → `npm run dev`

## 9. Placeholders / To‑Decide
- `backend/python/langgraph` BYO Docker or Cloud Run?  
- Are we standardising `apps/` vs `packages/` monorepo style?  
- Dashboard theming system (light/dark) – choose one.  

---

*Drop this file into every new repo → update sections, delete what doesn’t apply.*

