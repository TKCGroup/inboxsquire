# Squire Feature Backlog

> Tracking feature ideas and priorities.

---

## Immediate (Phase 2 Focus)
- [ ] **Data Model:** Define and implement Supabase tables (`infra/supabase`) for users, emails, classifications, actions, settings, daily stats.
- [ ] **Auth:** Implement Gmail API OAuth flow in the extension (`apps/extension`).
- [ ] **Extension Logic:** Implement core agent actions triggered by classification: Auto-labeling (`/Exec Scout/{bucket}`), Archive, Delete, Move.
- [ ] **Extension Logic:** Implement "Draft Response" action (saves draft reference/content to Supabase).
- [ ] **Extension Logic:** Implement email pre-processing logic refinement.
- [ ] **Classification:** Refine `classify_email` function (`functions/python/classify_email`) (function calling, confidence score).
- [ ] **Web App (`apps/web`):** Set up basic Next.js app structure.
- [ ] **Web App (`apps/web`):** Build User Dashboard (`/dashboard`) to display classified emails, actions taken, and daily summary stats.
- [ ] **Web App (`apps/web`):** Build basic Settings page (`/settings`) - placeholder for notification preferences.
- [ ] **Backend/Digest:** Create logic (e.g., Supabase Edge Function) to generate daily digest data.
- [ ] **Backend/Digest:** Integrate SendGrid to email the daily digest.

## Soon (Phase 3 - Beta Focus)
- [ ] **Web App (`apps/web`):** Implement UI for reviewing, editing, and sending drafted responses from the Dashboard.
- [ ] **Web App (`apps/web`):** Implement `/settings/notifications` page for configuring email digest timing and enabling/disabling.
- [ ] **Agent Logic:** Implement "Respond Immediately" agent action (if deemed safe/reliable).
- [ ] **Integration:** Implement Altbot Handoff logic.
- [ ] **Ops:** Set up deployment pipeline (GitHub Actions -> Vercel/Supabase/Extension Store).
- [ ] **Ops:** Add basic analytics and monitoring (e.g., Supabase observability, Vercel Analytics).
- [ ] **Polish:** Refine Dashboard UI/UX based on internal feedback.
- [ ] **Security:** Address security & privacy placeholders (redaction, PII masking).
- [ ] **Release:** Prepare Chrome Web Store listing materials.

## Future (Post v1 / Enhancements)
- [ ] **Notifications:** Twilio Integration for opt-in SMS notifications for the daily digest.
- [ ] **Notifications:** Twilio Integration for SMS reply codes for quick actions (alternative to dashboard).
- [ ] **Notifications:** PDF generation for email digest attachment.
- [ ] **Features:** Advanced classification rules/user overrides.
- [ ] **Features:** UI Wireframes implementation.
- [ ] **Business:** Pricing/Freemium model implementation.
- [ ] **Compliance:** Address SMS compliance/legal requirements.
- [ ] **AI/Data:** Source dedicated AI-vs-Human training data for fine-tuning.
- [ ] **Platform:** Mobile app / PWA version. 