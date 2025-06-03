### `PRD.md`

#### 1. Product Vision

FanFeed.ai will be **the personalized sports hub** that surfaces all relevant news, live data, and AI insights for every U S. fan—then unlocks premium “add-on” modules (AI Handicapper, Fantasy AI Coach, etc.) to deepen engagement and monetize power users.

#### 2. Target Users

* **Core:** Casual & avid U S. sports fans (NFL + MLB at launch).
* **Early partners:** Influencers, affiliate tipsters, athletes who can seed content & audiences.
* **Future upsell cohorts:** Sports bettors, fantasy players, super-fans.

#### 3. Phase Roadmap

| Phase                         | Goal                                                    | Key Features                                                                                                                                                                                              | Success KPIs                                                    |
| ----------------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **1 – Fan Feed MVP**          | Launch summer ‘25 (post-Spring Training, pre-NFL OTAs). | • Team/player follow<br>• Unified feed: scores, news, video, injuries, weather, live odds<br>• Smart push/-web notifications<br>• Team chat / comment threads<br>• Partner landing & referral code system | DAU/MAU > 25%<br>Avg. session > 3 min<br>100 affiliate sign-ups |
| **2 – AI Handicapper Add-on** | Q4 ‘25                                                  | • Game prediction model (spread/ML)<br>• Crowd-picks overlay<br>• Bet-slip export to sportsbooks<br>• \$/user upsell                                                                                      | % paid add-on > 5%<br>Prediction CTR > 20%                      |
| **3 – Fantasy AI Coach**      | 2026 season                                             | • OAuth to ESPN/Yahoo<br>• Start/sit + trade analyzer<br>• Draft kit generator                                                                                                                            | Attach rate > 4% of Phase-1 base                                |

#### 4. MVP Functional Scope (Phase 1)

* **Auth & Profiles:** Email/OAuth (Supabase). Follow teams/players.
* **Data ingestion:**

  * Live scores & schedules – TheSportsDB (free) + community fallback.
  * Odds – TheOddsAPI (free tier).
  * News – NewsAPI + scraped RSS.
  * Weather – OpenWeather free plan.
* **Feed Engine:** Edge function hydrates user feed (fan objects + data mash-up).
* **Notifications:** Edge CRON checks followed entities; triggers web-push / PWA push.
* **Community:** Per-team chat, emoji reactions, upvote sorting.
* **Landing & Growth:** Public homepage with hype video, CTA blocks for creators, athletes, affiliates; wait-list + unique referral links (Supabase row for each partner).
* **Analytics:** PostHog for product; Supabase for basic event counts.

#### 5. Non-Goals (Phase 1)

* Real-money transactions, bankroll tracking, fantasy API sync, non-US sports.

---

### `frontend-checklist.md`

* **Global**

  * Next.js 15 App Router, TypeScript, Tailwind.
  * PWA manifest & service-worker (offline feed cache).
  * Dark/light theme switch.
* **Landing Page**

  * Hero section + looping hype video background (muted autoplay).
  * Three CTA buttons: **“Join Wait-list”**, **“Creators & Affiliates”**, **“Athletes”**.
  * Section cards explaining: Personalized Feed → AI Add-ons → Community.
  * Email capture form → Supabase `early_access` table (stores ref code query param).
  * Sticky nav with logo + “Sign In”.
* **Auth & Onboarding**

  * Magic-link or Google/Apple sign-in.
  * 2-step follow wizard: pick league(s) → pick teams → optional players.
  * Push-notification permission prompt (deferred / ask after first session).
* **Main App Shell**

  * Left sidebar: Teams followed (icons, unread pills).
  * Central feed (infinite scroll, “live” pill for in-progress games).
  * Right rail: odds widget + trending topics + invite banner.
* **Feed Item Components**

  * Game card (score, start time, watch link).
  * News article (headline, source, relative time).
  * Injury alert chip (status, projected impact).
  * Weather badge overlay if game < 48 h away & weather impactful.
  * Odds block: spread / ML / O/U lines.
* **Chat / Comments**

  * Per-team room (rendered via server components, hydration for realtime).
  * Realtime updates via Supabase realtime channel.
* **Responsive**

  * Mobile-first (bottom tab bar), tablet, desktop.
* **Performance & SEO**

  * Lazy-load images, `next/image`.
  * Preload critical fonts.
  * Sitemap for public landing pages.

---

### `backend-checklist.md`

* **Infrastructure**

  * Supabase (Postgres + Auth + Realtime).
  * Vercel edge functions (feed builder, cron jobs).
  * PostHog Cloud for analytics.
* **DB Schema**

  * `users` (id, auth\_id, handle, created\_at).
  * `follows` (user\_id, entity\_type \[team|player], entity\_id).
  * `feed_items` (id, entity\_id, type \[game|news|injury|odds], json\_payload, ts).
  * `notifications` (user\_id, feed\_item\_id, sent\_at, opened\_at).
  * `teams`, `players` (static refs ingested from TheSportsDB).
  * `affiliate_codes` (code, owner\_name, clicks, signups).
* **External APIs Jobs**

  * **scoresJob** – every 30 s for live games.
  * **scheduleJob** – daily pull next 7 days; prebuild game feed items.
  * **oddsJob** – every 10 min when games within 48 h.
  * **newsJob** – RSS/NewsAPI every 15 min; dedupe by GUID.
  * **weatherJob** – every 6 h for games within 3 days.
* **Feed Builder Function**

  * On request or up to 30 s cache per user.
  * SQL: `SELECT * FROM feed_items WHERE entity_id IN (user follows)… ORDER BY ts DESC LIMIT 50;`
* **Realtime / Chat**

  * Supabase Realtime on `messages` table (team\_id, user\_id, body, ts).
* **Notifications Service**

  * Edge CRON each minute; for each new feed item flagged “alert” join with subscribers → push (WebPush + APNs via OneSignal).
* **Security & Rate Limits**

  * Row-level security on every table (Supabase policies).
  * Edge middleware throttles unauth’d API calls (500 req/day per IP).
* **Observability**

  * Vercel Analytics, PostHog dashboards.
  * Supabase logs streamed to Logflare.

---

**Next step:** review these docs, confirm or tweak scope/stack, then we can flesh out detailed tickets or code scaffolding.
