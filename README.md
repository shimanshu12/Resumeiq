# ResumeIQ — AI Resume Keyword Analyzer

A full-stack ATS resume analyzer: upload a resume and a job description, get
an instant ATS score, see exactly which keywords are missing, and download a
polished PDF report.

```
resumeiq/
├── frontend/   React (Vite) + Tailwind + Framer Motion SaaS UI
├── backend/    Node.js + Express parsing/matching/scoring engine
└── database/   Supabase Postgres schema, RLS policies, storage bucket
```

## How it works

1. **Frontend** — glassmorphism auth, animated landing page, dashboard with
   charts, a drag-and-drop upload flow, a searchable reports table, and a
   full report view with a PDF export button.
2. **Backend** — extracts text from PDF/DOCX (`pdf-parse`, `mammoth`),
   cleans and tokenizes it (`natural`), extracts and categorizes keywords
   (`keyword-extractor` + `compromise` + a curated skills dictionary),
   fuzzy-matches resume vs. job-description keywords (`string-similarity`),
   computes the ATS score, and generates suggestions and a PDF report
   (`pdfkit`).
3. **Supabase** — Auth (email/password + Google OAuth), Postgres (`users`,
   `reports` tables with row-level security), and Storage (private
   `resumes` bucket, one folder per user).

## Prerequisites

- Node.js 18+
- A free [Supabase](https://supabase.com) project

## 1. Set up Supabase

1. Create a new Supabase project.
2. In the SQL editor, run `database/schema.sql`. This creates the `users`
   and `reports` tables, row-level security policies, a trigger that
   mirrors new `auth.users` into `public.users`, and the `resumes` storage
   bucket with per-user access policies.
3. Under **Authentication → Providers**, enable **Email** and **Google**.
   For Google, follow Supabase's guide to add your OAuth client ID/secret
   and set the redirect URL to `https://<your-project-ref>.supabase.co/auth/v1/callback`.
4. Grab your **Project URL**, **anon public key**, and **service role key**
   from **Project Settings → API** — you'll need them in step 2 and 3.

## 2. Run the backend

```bash
cd backend
cp .env.example .env
# fill in SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
npm install
npm run dev
```

The API runs on `http://localhost:5000` by default. Check `GET /api/health`
to confirm it's up.

## 3. Run the frontend

```bash
cd frontend
cp .env.example .env
# fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

## Environment variables

**backend/.env**
| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on |
| `CLIENT_ORIGIN` | Frontend origin, for CORS |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key — server only, never expose this |
| `SUPABASE_RESUME_BUCKET` | Storage bucket name (default `resumes`) |

**frontend/.env**
| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Public anon key — safe to expose client-side |
| `VITE_API_BASE_URL` | Backend API base URL (e.g. `http://localhost:5000/api`) |

## Notes on the matching engine

- **Keyword match %** — every ranked keyword extracted from the job
  description, checked against the resume's extracted keywords (with fuzzy
  matching for near-spellings like "postgres" vs "postgresql").
- **Skill match %** — the same comparison restricted to hard-skill
  categories (languages, frameworks, libraries, databases, cloud, tools).
- **Experience match %** — heuristic based on "N years" mentions in both
  documents.
- **Education match %** — checks whether the resume mentions the
  degree/field the job description asks for.
- **Overall ATS score** — a weighted blend: 35% keyword, 35% skill, 15%
  experience, 15% education.

This is a transparent, rules-based approximation of how real ATS keyword
scanners behave — not a black box. The weighting lives in
`backend/src/services/matchingService.js` if you want to tune it, and the
skills dictionary lives in `backend/src/utils/skillsDictionary.js` if you
want to extend it.

## Deployment

- **Frontend**: any static host (Vercel, Netlify) — `npm run build` outputs
  to `frontend/dist`.
- **Backend**: any Node host (Render, Railway, Fly.io) — set the same env
  vars as `.env.example`.
- Update `VITE_API_BASE_URL` (frontend) and `CLIENT_ORIGIN` (backend) to
  your deployed URLs.

## Tech stack

React 18 · Vite · Tailwind CSS · Framer Motion · React Router · Chart.js ·
React Dropzone · Axios · Node.js · Express · Supabase (Auth/Postgres/Storage) ·
pdf-parse · mammoth · natural · compromise · keyword-extractor ·
string-similarity · multer · pdfkit
