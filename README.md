# ResumeCraft — AI ATS Resume Builder

> A lean, production-ready AI ATS resume builder inspired by **Rezi** ($272k/mo), powered by the open-source **RenderCV** (Typst) typography engine, **Next.js 15**, and **Google Gemini AI**.

---

## Features

- **Resume Score Gauge (Deterministic):** Real-time 0–100 ATS readiness score calculated instantly as you type via a pure scoring engine (150+ action verbs, metric quantification, section completeness) without expensive or slow LLM calls.
- **AI Keyword Targeting:** Interactive missing-keyword assistant that identifies keywords absent from your resume and drafts custom Google XYZ bullet points for selected roles using Gemini.
- **Auto Adjust (One-Click Reflow):** Intelligent pagination solver that algorithmically searches margins, font sizes, and section spacing to reflow multi-page overflows into exactly 1 page.
- **AI Cover Letter Writer:** Custom 3–4 paragraph prose generator connecting candidate background, achievements, and tone to specific target roles and job descriptions.
- **9 Gold-Standard ATS Templates:** Powered by RenderCV v2.8 (`engineeringresumes`, `harvard`, `sb2nov`, `classic`, `moderncv`, `ember`, `ink`, `opal`, `engineeringclassic`).
- **Google XYZ Formula Bullet Rewriting:** Instant bullet point enhancement using Google's formula: *"Accomplished [X] as measured by [Y], by doing [Z]"*.
- **Job Description Matcher & ATS Score:** Paste any target job description to calculate an ATS Match Score (0–100%) and uncover missing keywords.
- **Split-Screen Live Preview:** Instant typography feedback as you type, with live template switching.
- **Multi-Version Dashboard:** Create, duplicate, tailor, and organize multiple resume versions for different roles.
- **RenderCV Typst Vector PDF Export:** Compiles true mathematical vector PDFs that applicant tracking systems parse with 100% fidelity.
- **Stripe Monetization:** Ready-to-go test-mode Stripe checkout ($19/mo Pro subscription or $9 30-day pass).
- **Zero AI Slop:** Built with the Outfit font, sharp borders, clean spacing, and modern minimalism.

---

## System Architecture

```
┌───────────────────────────┐      ┌──────────────────────────┐      ┌─────────────────────────┐
│  Next.js 15 (App Router)  │─────▶│  Gemini AI API           │      │  Supabase               │
│  - Guided editor UI       │      │  (rewrite / tailor)      │      │  - Auth (Email/OAuth)   │
│  - Instant HTML preview   │      └──────────────────────────┘      │  - Database (resumes)   │
│  - Dashboard & Versions   │                                        │  - Storage (cached PDFs)│
│  - Stripe checkout        │◀──────────────────────────────────────▶│                         │
└─────────────┬─────────────┘                                        └─────────────────────────┘
              │ HTTP (JSON/YAML payload)
              ▼
┌───────────────────────────┐
│  RenderCV Service (Python) │  Stateless FastAPI microservice running on port 8000
│  - Converts JSON → YAML   │  rendercv[full]==2.8.* + Typst bundled
│  - Executes rendercv CLI  │  Dockerized for Fly.io / Railway / Render
│  - Streams back PDF bytes │  Local: `uv run uvicorn main:app --port 8000`
└───────────────────────────┘
```

---

## Prerequisites

- **Node.js**: `v20.x` or higher
- **Python / uv**: `Python 3.10+` (or `uv` package manager installed via `winget install astral-sh.uv` or `curl -LsSf https://astral.sh/uv/install.sh | sh`)

---

## Environment Variables

Create `.env.local` in the root of the project:

```env
# RenderCV Backend Microservice
RENDERCV_SERVICE_URL=http://127.0.0.1:8000

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Supabase (Auth + Database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe (Test Mode)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Local Development (Quickstart)

Run the application locally in two terminals:

### Terminal 1: Start the RenderCV Microservice
```bash
cd render-service
uv run --with fastapi --with uvicorn --with "rendercv[full]==2.8.*" --with pyyaml --with python-multipart --with phonenumbers uvicorn main:app --host 127.0.0.1 --port 8000
```
*Health check: Verify `http://127.0.0.1:8000/health` returns `{"status":"ok"}`.*

### Terminal 2: Start the Next.js Frontend
```bash
npm run dev
```
Open [**http://localhost:3000**](http://localhost:3000) in your browser.

---

## Production Deployment

### 1. Deploy RenderCV Microservice (Fly.io / Railway / Render)
The `render-service` folder includes a multi-stage Dockerfile:

```bash
cd render-service

# Deploying to Fly.io:
fly launch --name resumecraft-rendercv
fly deploy
```
Copy your production service URL (e.g. `https://resumecraft-rendercv.fly.dev`).

### 2. Deploy Next.js App (Vercel)
1. Push this repository to GitHub.
2. Import project into Vercel.
3. Add environment variables:
   - `RENDERCV_SERVICE_URL`: Set to your deployed RenderCV service URL (e.g. `https://resumecraft-rendercv.fly.dev`).
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - `STRIPE_SECRET_KEY` & `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
4. Click **Deploy**.

---

## License & Credits
- Built with **RenderCV** by Sina Atalay (MIT License).
- UI and Product Architecture designed for ResumeCraft.
