# Demo‑Scoring Agent (Gmail / Chrome Extension) – PRD v0.1

> **Working title:** "Squire"  
> **Author:** Tyler  
> **Last updated:** [[May 1st, 2025]]

---

## 1. Elevator Pitch
A lightweight Gmail/Chrome extension that **reads every inbound vendor or cold‑outreach email**, classifies its usefulness via LLM scoring, and sends executives a concise SMS digest with one‑tap actions (✅ respond, 🗄️ file, 🗑️ block). The extension doubles as a *growth channel*: qualified vendors are funneled to our larger agent platform **Altbot**, while spam is vaporised.

## 2. Background & Insight
* Pain surfaced during a **week of software demos** (§6 of chat). Endless calls, inbox clutter, and "AI SDR" noise waste executive cycles.  
* Inspired by *Traction*'s "free tool as marketing channel" pattern.  
* Aligns with Tyler's vision for agentic tooling (BatchFormat & Altbot stack).

## 3. Core Value Proposition
| Stakeholder | Pain | What we solve |
|-------------|------|---------------|
| **Execs / founders** | Inbox overload, demo scheduling friction | Auto‑prioritised list & SMS triage; no time wasted on low‑value vendors |
| **SDRs / Vendors** | Low reply rates | Clear feedback loop: qualified leads → demo, non‑fit → polite decline |
| **Altbot** | Need steady inflow of agent‑savvy users | Extension acts as a Trojan‑horse acquisition funnel |

## 4. Target Users
* Seed‑/Series‑A exec teams (CEO, CIO, VP Eng)  
* Solo entrepreneurs juggling multiple SaaS evals  
* *[[PLACEHOLDER: additional personas]]*

## 5. User Workflow (_Revised Happy Path_)
1. **Install** from Chrome Web Store; OAuth into Gmail.
2. Extension runs a background Gmail API watcher every ~5 min.
3. On new email → LLM classifies:
    *Spam | AI-generated | Human sales | Warm intro | Internal*
4. Messages placed into 📂 `/Exec Scout/{bucket}` labels.
5. **Agent Action:** Based on classification & rules, the extension automatically:
    *   Deletes spam/unwanted mail.
    *   Archives informational/low-priority mail.
    *   Moves mail to specific folders (future refinement).
    *   Flags mail needing a drafted response (requires user approval).
    *   (Future) Responds immediately to certain predefined triggers.
6. **Data Logging:** All classifications and actions are logged in the Supabase database.
7. **Daily Digest (e.g., 18:00 local):**
    *   A summary is generated: # processed, # actions taken, key insights.
    *   Highlights emails requiring review/approval (e.g., drafted responses).
    *   Digest is emailed to the user via SendGrid.
8. **Dashboard Review:** User can view detailed activity, manage settings, and approve drafts anytime via the `/dashboard` in the web app (`apps/web`).

## 6. Key Features (MVP - Revised)
- 🔍 **LLM-based Classification** – Prompt-engineered against vendor/email corpora.
- 📊 **Confidence Score** – 0–100 *real-human probability*. Threshold default = 70.
- 🗂️ **Auto-Label & Folder Triage** – Gmail API `users.labels` & `messages.modify`.
- ✨ **Agent Actions** – Automated Delete, Archive, Move (basic), and Draft Response flagging based on classification rules.
- 📧 **Daily Email Digest** – Via SendGrid, summarizing activity and highlighting emails needing review.
- 🖥️ **User Dashboard (`apps/web`)** – View email status, actions, analytics, manage drafts and settings.
- 🧱 **Supabase Backend** – Postgres DB for storing user data, email metadata, classifications, actions, settings, and digest stats. RLS for security.
- 🤖 **Altbot Handoff** – When score ≥ 90 & topic matches `payments|ATS|…`, forward to Altbot webhook.
- [-] ~~**SMS Digest & Reply Codes**~~ (Moved to Future Features - Optional Notification Channel via Twilio)

## 7. Classification Model
```mermaid
flowchart TD
    A[Raw Email JSON] --> B[Pre‑processing\n(strip quotes, sig, history)]
    B --> C[OpenAI o3 function‑call\n("classify_email")]
    C --> D{Label}
    D -->|spam| E[Label:Spam]
    D -->|AI| F[Label:AI\nPitch]
    D -->|human| G[Next step scoring]
    G --> H[Topic matcher + Confidence]
```
[[PLACEHOLDER: prompts, fine‑tuning plan]]

## 8. System Architecture (Lo-Fi - Revised)
*   **Chrome Extension (MV3)** – UI pop-up (minimal) + background service-worker (core logic).
*   **Supabase** – Primary Backend:
    *   Postgres Database (User data, emails, actions, settings)
    *   Auth (Handles user login via Google)
    *   Edge Functions (Potential use for digest generation, webhooks)
*   **Web Application (`apps/web`)** - Built with Next.js/React, hosted on Vercel. Provides the `/dashboard` and `/settings`.
*   **OpenAI API (o3)** – Classification + draft responses.
*   **SendGrid API** – Sending daily digest emails.
*   **Twilio API** – (Future) Optional SMS notifications for digests.
*   ~~**Firebase Cloud Functions**~~ (Replaced by Supabase)
*   ~~**Firestore**~~ (Replaced by Supabase DB)

## 9. Tech Stack Choices (Revised)
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Browser | Chrome MV3 | Broad reach; MV3 service-worker timer capabilities |
| Web Framework | Next.js/React | Standard for modern web apps, Vercel synergy |
| Backend | Supabase | Integrated Postgres DB, Auth, Edge Functions, RLS |
| NLP | OpenAI o3 | Strong reasoning, function calling |
| Email Delivery | SendGrid | Reliable API for transactional emails (digests) |
| SMS | Twilio | (Future) Industry standard for SMS notifications |
| Hosting | Vercel | Seamless Next.js deployment, integrates with Supabase |
| Monorepo | Turborepo | Efficient builds and dependency management |

## 10. Security & Privacy
* OAuth scopes limited to `gmail.readonly` + `modify`.  
* Email bodies stored ≤ 24 h, then redacted.  
* Twilio PII masked in logs.  
* [[PLACEHOLDER: GDPR / SOC‑2 considerations]]

## 11. Success Metrics (90‑day)
* ≤ 5 min median triage‑time per day (vs >30 min baseline).  
* ≥ 20 % email‑to‑demo conversion for *qualified* vendors.  
* ≥ 10 % extension → Altbot signup conversion.  

## 12. Roadmap Snapshot
1. **Spike** – Proof‑of‑concept classification & SMS loop (1 week)  
2. **Alpha** – Internal dog‑food, basic labels (2‑3 weeks)  
3. **Beta Chrome Web Store** – invite 25 execs (month 2)  
4. **v1 Launch** – Public listing + Altbot banner (month 3)  

## 13. Open Questions / Placeholders
- [[PLACEHOLDER: SMS compliance/legal disclosures]]  
- [[PLACEHOLDER: Pricing – free forever vs freemium?]]  
- [[PLACEHOLDER: AI‑vs‑Human training data source]]  
- [[PLACEHOLDER: UI wireframes]]  

---

*End of PRD v0.1 – ready for hand‑off to Coder Agent*

