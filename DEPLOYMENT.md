# ErgonoAI Production Deployment Guide (Vercel + Supabase)

This document provides a comprehensive guide for deploying **ErgonoAI** to production on **Vercel** with **Supabase** and **Groq AI**.

---

## 1. Architecture Overview

- **Framework**: Next.js 16 (App Router)
- **Frontend / Hosting**: Vercel
- **Database & Auth**: Supabase (PostgreSQL + RLS + Supabase Auth + Storage)
- **AI Engine**: Groq API (`llama-3.3-70b-versatile` / `llama3-70b-8192`)
- **Styling**: Tailwind CSS v4

---

## 2. Environment Variables Checklist

Configure these environment variables in your Vercel Project Settings (**Settings -> Environment Variables**):

| Variable Name | Environment | Description | Public / Secret |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | All (Prod/Preview/Dev) | Your Supabase project URL | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All (Prod/Preview/Dev) | Your Supabase anon public API key | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Production Only | Supabase Service Role Key (server-only) | Secret |
| `GROQ_API_KEY` | Production / Server | Groq AI API key (`gsk_...`) | Secret |
| `NEXT_PUBLIC_APP_URL` | Production | Primary domain (e.g., `https://ergonoai.vercel.app`) | Public |
| `NODE_ENV` | Production | Set to `production` | Public |

> [!CAUTION]
> Never expose `SUPABASE_SERVICE_ROLE_KEY` or `GROQ_API_KEY` to client components. Keep them restricted to server environments.

---

## 3. Deploying to Vercel Step-by-Step

### Step 1: Connect Repository
1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository (`frontend-development`).

### Step 2: Configure Framework & Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `./`
- **Build Command**: `pnpm build` (or `npm run build`)
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

### Step 3: Add Environment Variables
Add the environment variables listed in Section 2 above into the Vercel setup interface.

### Step 4: Deploy
Click **Deploy**. Vercel will build and publish your application.

---

## 4. Supabase Setup & Configuration

### A. Auth Redirect URLs
In Supabase Dashboard (**Authentication -> URL Configuration**):
- **Site URL**: `https://your-domain.vercel.app`
- **Redirect URLs**:
  - `https://your-domain.vercel.app/**`
  - `https://your-domain.vercel.app/login`
  - `https://your-domain.vercel.app/verify-email`
  - `https://your-domain.vercel.app/reset-password`
  - `http://localhost:3000/**` (for local development)

### B. Row Level Security (RLS)
Ensure Row Level Security is enabled on all PostgreSQL tables in Supabase:
- `organizations`
- `organization_members`
- `employee_profiles`
- `departments`
- `assessment_responses`
- `hazard_checklist`
- `hazard_observations`
- `ai_recommendations`
- `audit_logs`

---

## 5. Groq AI Integration Setup

1. Sign up at [Groq Console](https://console.groq.com).
2. Generate an API Key under **API Keys**.
3. Add `GROQ_API_KEY` to Vercel environment variables.
4. Verify connectivity using the health endpoint: `https://your-domain.vercel.app/api/ai/health`.

---

## 6. Pre-Flight Verification Commands

Before creating a release, run the following verification sequence locally:

```bash
# 1. Install clean dependencies
pnpm install

# 2. Run ESLint check
pnpm lint

# 3. Perform strict TypeScript check
npx tsc --noEmit

# 4. Perform Next.js production build
pnpm build
```

All four steps must finish with **0 errors**.

---

## 7. Troubleshooting & Common Issues

| Issue | Root Cause | Solution |
| :--- | :--- | :--- |
| `401 Unauthorized` on AI APIs | Missing Supabase session cookie | Ensure user is logged in before calling `/api/ai/*`. |
| `500 Configuration Error` on AI APIs | `GROQ_API_KEY` missing in Vercel | Add `GROQ_API_KEY` in Vercel project settings and redeploy. |
| Auth redirect goes to localhost | Supabase Auth Site URL set to localhost | Update Supabase Auth Site URL to production domain. |
| TypeScript build error | Mismatched types or strict null access | Run `npx tsc --noEmit` locally to locate and fix. |

---

## 8. Rollback Strategy

If an issue occurs in production:
1. In Vercel Dashboard, navigate to **Deployments**.
2. Locate the last known working deployment.
3. Click the `...` menu and select **Promote to Production**.
