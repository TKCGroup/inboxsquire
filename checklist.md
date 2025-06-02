# Squire Project Checklist

> High-level milestones for the Gmail/Chrome Extension project.

---

## Phase 0: Setup & Scaffolding (Completed)

- [x] Read seed documentation (`universal-app-template.md`, `demo_scoring_agent_context.md.md`)
- [x] Install JS dependencies (`npm install`)
- [x] Prepare Python environment (`.venv` created)
- [-] Verify MCP servers (`.cursor/mcp.json` not found - *to be addressed if needed*)
- [x] Create monorepo structure (`apps/`, `functions/`, `infra/`)
- [x] Create root `package.json` with `turbo`
- [x] Create `checklist.md` (this file)
- [x] Create `progress_log.md`
- [x] Define initial `infra/supabase` setup (schema, RLS)

## Phase 1: Spike (Proof-of-Concept)

*Goal: Validate core LLM classification & SMS loop.* (Target: 1 week)

- [x] Set up basic Chrome Extension (MV3) structure in `apps/extension`.
- [x] Implement background service worker to fetch Gmail emails.
- [x] Create `functions/python/classify_email` service.
    - [x] Define basic `classify_email` prompt for OpenAI.
    - [x] Set up `requirements.txt` and `Dockerfile`.
- [x] Set up Twilio account and basic SMS sending function in `functions/node/sms_handler`.
- [x] Implement basic end-to-end flow: Email fetch -> Classification -> SMS send.
- [x] Set up basic Supabase tables in `infra/supabase` for logging.

## Phase 2: Alpha (Internal Dogfooding)

*Goal: Build out core data handling, dashboard, and daily digest.* (Target: 2-3 weeks)

- [x] **Data Model:** Define and implement Supabase tables (`infra/supabase`) for users, emails, classifications, actions, settings, daily stats.
- [/] **Auth:** Implement Gmail API OAuth flow in the extension (`apps/extension`) (Partially done: Manifest & basic background script setup).
- [ ] **Extension Logic:**
    - [x] Implement email pre-processing logic.
    - [x] Refine `classify_email` function (`functions/python/classify_email`) (function calling, confidence score).
    - [x] Implement core agent actions triggered by classification: Auto-labeling (`/Exec Scout/{bucket}`), Archive, Delete, Move. (Basic actions implemented; draft/forward handling TODO)
    - [x] Implement "Draft Response" action (saves draft reference/content to Supabase).
- [/] **Web App (`apps/web`):**
    - [x] Set up basic Next.js app structure.
    - [x] Integrate standalone landing page components & fix styling/hydration issues.
    - [x] Build Prospect Intake Form (`/prospect-intake`) for lead qualification without discovery calls.
    - [x] Build Admin Prospect Management page (`/admin/prospects`) with lead scoring and status tracking.
    - [ ] Build User Dashboard (`/dashboard`) to display classified emails, actions taken, and daily summary stats.
    - [ ] Build basic Settings page (`/settings`) - placeholder for notification preferences.
    - [x] **FORMS SYSTEM (Phase 1):** Token-based forms for requirements gathering
        - [x] Database schema and migration (`20250102120000_create_forms_tables.sql`)
        - [x] API routes for forms CRUD and public access (`/api/forms/*`)
        - [x] Forms dashboard for management (`/dashboard/forms`)
        - [x] Public form rendering (`/forms/[token]`)
        - [x] Dynamic form renderer component with multi-step navigation
        - [x] Form templates system foundation
        - [x] Analytics and submission tracking
        - [x] "Powered by InboxSquire" viral marketing integration
- [ ] **Backend/Digest:**
    - [ ] Create logic (e.g., Supabase Edge Function) to generate daily digest data.
    - [ ] Integrate SendGrid to email the daily digest.

## Phase 3: Beta (Invite-Only)

*Goal: Prepare for external beta testers with core functionality and feedback mechanisms.* (Target: Month 2)

- [/] **Setup Deployment:**
    - [x] Initialize Git repository.
    - [x] Configure Vercel deployment (`vercel.json` for monorepo).
    - [x] **Forms System Production Ready** - Core forms functionality complete
    - [x] **Build Ready for Deployment** - `npm run build` succeeds, all errors resolved
    - [ ] **Deploy to Production via Vercel + GitHub CICD:**
        - [ ] Connect GitHub repository to Vercel
        - [ ] Configure production environment variables  
        - [ ] Set up Supabase production database
        - [ ] Configure custom domain (`inboxsquire.com`)
        - [ ] Test production deployment
        - [ ] Set up monitoring and error tracking
    - [ ] Deploy initial landing page + forms system to production domain.
- [ ] **Refinement & Features:**
    - [ ] Refine Dashboard UI/UX based on internal feedback.
    - [ ] Fully implement UI for reviewing, editing, and sending drafted responses from the Dashboard.
    - [ ] Implement "Respond Immediately" agent action (if deemed safe/reliable).
    - [ ] Implement Altbot Handoff logic.
    - [ ] Implement `/settings/notifications` page for configuring email digest timing.
- [ ] **Ops & Polish:**
    - [ ] Set up deployment pipeline (GitHub Actions -> Vercel/Supabase/Extension Store).
    - [ ] Add basic analytics and monitoring (e.g., Supabase observability, Vercel Analytics).
    - [ ] Address security & privacy placeholders (redaction, PII masking).
    - [ ] Prepare Chrome Web Store listing materials.

## Phase 4: v1 Launch

*Goal: Public release with optional advanced features.* (Target: Month 3)

- [ ] Finalize CWS listing.
- [ ] Implement Altbot integration/banner (if applicable).
- [ ] Address open questions (pricing, compliance).
- [ ] Marketing & announcement plan.
- [ ] (Optional) Implement opt-in SMS notifications for daily digest via Twilio (See `features.md`).
- [ ] (Optional) Implement SMS reply codes for basic actions via Twilio (See `features.md`).

---
*This checklist will be updated as the project progresses.* 