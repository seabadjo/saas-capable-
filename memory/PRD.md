# GUEGON — Product Requirements (PRD)

## Original Problem Statement
GUEGON is a SaaS platform that automates B2B prospect generation. The user defines their target, then the platform searches companies, enriches contacts, syncs them with their CRM, and launches automated prospecting campaigns.

- Slogan: "Automatisez votre prospection. Accélérez votre croissance."
- Brand: GUEGON
- Language: French
- Palette: #90C2E7, #22819A, #FEF7F8, #CDD4DD, #1F2937
- Typography: Poppins
- Style: SaaS premium, glassmorphism léger, coins arrondis 20px

## Architecture
- **Frontend**: React 19, React Router 7, Tailwind, shadcn/ui, sonner, lucide-react
- **Backend**: FastAPI, MongoDB (motor), JWT (httpOnly cookies), bcrypt
- **AI**: Claude Sonnet 4.5 via `emergentintegrations` + Emergent LLM key
- **Auth**: JWT custom (access 15 min + refresh 7 days)

## User Personas
1. **Solo SDR / Founder** — needs a quick way to find prospects and write emails.
2. **B2B Sales Team** — needs collaboration, CRM sync, and reporting.
3. **Specialized agencies** (lawyers, real estate, SaaS, marketing) — need vertical-tailored prospecting flows.

## Core Requirements (static)
- Lead Finder, Email Finder, Email Verification
- AI Personalization, Campaign Builder, Workflows
- CRM Sync (HubSpot, Salesforce, Pipedrive, Notion, Airtable)
- Team Workspace, API, Notifications
- Reports & Analytics
- Stripe billing (Starter / Pro / Enterprise)

## What's Been Implemented (Feb 2026 — MVP v1)
### Frontend
- Landing page (Hero, stats, features bento, solutions, how it works, CTA, footer)
- Pages: Features, Solutions, Pricing (3 plans), Contact (form)
- Auth pages: Login & Register (split-screen design)
- Protected Dashboard:
  - Sidebar layout + glass topbar
  - Overview (stats cards, funnel, activity)
  - Prospects (CRUD, modal form, statuses, scores)
  - Campaigns (CRUD list, channel email/linkedin)
  - AI Email generator (Claude Sonnet 4.5)
  - Settings (profile + upgrade banner)
- Custom GUEGON logo (SVG, G + arrow + nodes)
- Toast notifications via sonner
- Poppins font + design tokens, glassmorphism utility

### Backend
- JWT auth: register/login/logout/me/refresh with httpOnly cookies
- Bcrypt password hashing
- Admin seeding on startup
- MongoDB indexes (users.email unique, prospects/campaigns by user_id)
- Prospects CRUD (`/api/prospects`)
- Campaigns CRUD (`/api/campaigns`)
- AI email generation (`/api/ai/generate-email`) using Claude Sonnet 4.5
- Contact form endpoint (`/api/contact`)
- Stats overview (`/api/stats/overview`)

## Prioritized Backlog

### P0 (next iteration)
- Real Google Maps Places integration for Lead Finder
- Real email sending (Resend) + tracking
- Stripe billing & plans

### P1
- Real CRM integrations (HubSpot, Notion, Airtable OAuth)
- Workflow visual builder
- CSV import / export for prospects
- Email verification provider

### P2
- Team workspace & roles
- Public API + webhooks
- Slack / Discord notifications
- Forgot password flow + email link
- AI insights (analyze responses, score leads)
- Blog & documentation pages

## Mocked / Deferred
- All third-party integrations beyond Claude AI are **NOT YET CONNECTED** (Google Maps, HubSpot, Notion, Resend, Stripe, etc.)
- Email sending is **NOT IMPLEMENTED** in this MVP — campaign stats are 0 by default
- Workflows engine is **NOT YET IMPLEMENTED**

## Test Credentials
See `/app/memory/test_credentials.md`
