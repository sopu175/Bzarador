---
Task ID: all
Agent: main
Task: Build বাজার দাম (Bazar Dam) — a Bangladesh kitchen market price tracker as a full Next.js app

Work Log:
- Designed Prisma schema: Item, Market, PriceReport, PriceAlert (pushed to SQLite)
- Created seed script (prisma/seed.ts) with 54 realistic BD items across 8 categories (vegetable, fish, meat, fruit, spice, rice, lentil, oil), 11 markets across 8 districts, and 5,872 price reports spanning 7 days
- Built 4 API routes:
  - /api/items (list + filter by category)
  - /api/markets (list + filter by district)
  - /api/prices (GET latest avg prices with day-over-day change; GET 7-day trend; POST new report with zod validation)
  - /api/alerts (GET by phone; POST with zod validation)
- Built i18n module (src/lib/i18n.ts): zustand store with localStorage persistence, full BN/EN dictionary, Bengali digit conversion, category/unit translation hooks
- Updated layout.tsx to load Noto Sans Bengali + Geist fonts
- Rewrote globals.css with market-themed palette: forest green primary, warm amber accent, earthy background (no blue/indigo)
- Built 5 tab components in src/components/bazar/:
  - today-tab.tsx: search + category filter + top gainers/losers + full price list with change badges
  - markets-tab.tsx: district → market selector with breadcrumb + per-market price list
  - report-tab.tsx: grouped item/market pickers + price input + submit (POST + toast + query invalidation)
  - trends-tab.tsx: 7-day area chart (recharts) with Bengali day labels + avg/week-high/week-low stats
  - alerts-tab.tsx: create alert form (item, direction radio, target, phone) + find-your-alerts section with "active" trigger badge
- Built main page.tsx: QueryProvider + Sonner toaster, sticky header with language toggle, hero with live stats, 5-tab navigation, sticky footer (mt-auto on flex-col min-h-screen)
- Fixed two lint errors (set-state-in-effect) by deriving effective marketId/itemId during render instead of useEffect
- Fixed runtime ReferenceError (missing `t` in PriceRowCard) found via Agent Browser
- Fixed untranslated unit in trends tab ("প্রতি kg" → "প্রতি কেজি")

Stage Summary:
- App fully functional, all 5 tabs verified end-to-end with Agent Browser:
  - Today: renders 54 items with Bengali digits, change badges, top movers
  - Markets: district/market selectors work, breadcrumb + price list render
  - Report: submitted a price (POST 201) → success toast "ধন্যবাদ! আপনার দাম যোগ হয়েছে।"
  - Trends: 7-day area chart with Bengali weekday names, avg/high/low stats, week-change %
  - Alerts: created alert (POST 201) → found it via phone search with current-avg comparison
  - Language toggle BN ↔ EN works live; Bengali digits convert correctly
- Responsive: tested at 390×844 (mobile) and 1280×900 (desktop)
- Sticky footer verified: 0.5px gap to document bottom (rounding), pushed down naturally by long content
- Lint clean (eslint . → no errors), no runtime errors in dev log
- Artifacts: prisma/schema.prisma, prisma/seed.ts, src/lib/{db,prices,i18n}.ts, src/app/api/{items,markets,prices,alerts}/route.ts, src/components/bazar/{language-toggle,change-badge,today,markets,report,trends,alerts}-tab.tsx, src/components/query-provider.tsx, src/app/{layout,page,globals.css}

---
Task ID: live-1
Agent: main
Task: Add live online daily price fetching for individual products (web_search + page_reader + LLM extraction pipeline)

Work Log:
- Extended Prisma schema: added `sourceName` + `sourceUrl` optional fields to PriceReport, added new `LiveFetchLog` model (tracks each refresh run: startedAt/finishedAt/status/itemsFetched/sourcesUsed/error). Pushed to DB + regenerated client.
- Built `src/lib/live-prices.ts` (server-only module):
  - `refreshLivePrices()`: runs 5 targeted web_search queries (BN+EN, last 7 days), collects snippets from all hits, page_reads top 3 accessible (non-Cloudflare) pages, feeds combined corpus + our 54-item catalog to the LLM with a strict JSON-extraction prompt, matches extracted prices to Item table by name (exact + fuzzy + English fallback), picks market by mentioned name, persists as PriceReports tagged with sourceName/sourceUrl. Gracefully handles 429 rate limits and page_reader failures (falls back to snippets-only).
  - `refreshLivePriceForItem(itemId)`: single-item variant — searches `আজকের {item} দাম`, extracts one price, persists.
- Built API routes:
  - `GET /api/prices/live` → last refresh log + count of today's live reports
  - `POST /api/prices/live` → triggers full refreshLivePrices()
  - `POST /api/items/live?itemId=xxx` → triggers single-item fetch
- Updated `getLatestPrices()` in prices.ts to also return `liveSource`, `liveSourceUrl`, `liveAt` per item.
- Built `src/components/bazar/live-update-panel.tsx`: gradient panel with Globe icon, LIVE badge, "Fetch Live Prices / Refresh again" button, last-updated timestamp, sources list (badges), today's live count. Triggers POST + invalidates all price/trend queries on success.
- Updated Today tab: added `liveOnly` filter, "LIVE {n}" filter chip button, LIVE badge on each live-sourced price row (links to source URL), source name + fetch time shown in subtitle, live prices sorted to top.
- Updated Trends tab: added per-item "Fetch live price for this item" button (Globe icon) in the item card header — triggers POST /api/items/live, shows toast with extracted price + source, invalidates trend query so chart updates immediately.
- Added 18 new i18n strings (liveUpdate, liveFetchBtn, liveSuccess, liveBadge, liveFrom, liveFetchItem, etc.) in both BN and EN.

Stage Summary:
- Live pipeline verified end-to-end via Agent Browser:
  - Initial test run (script): fetched 7 live prices from 5 sources (Dhaka Tribune, Mt News 24, Vinnabarta, The Financial Express, TBS News). Prices realistic: ইলিশ 2400৳, গরুর মাংস 775৳, পেঁয়াজ 110৳, গাজর 110৳.
  - Per-item fetch (Trends tab, ইলিশ): returned 1274৳ from "Fresh Today" source in ~25s, toast "লাইভ দাম পাওয়া গেছে! ইলিশ মাছ: ১২৭৪৳ · Fresh Today", chart week-high updated to 2400৳.
  - Global refresh button: fetched 19 more prices from 7 sources (added Prothom Alo, New Age, Fresh Plaza, BSS News) in ~21s. Total live reports today: 27 across 17 unique items.
- UI shows: LIVE panel with timestamp + sources + count, LIVE filter chip, per-price LIVE badges with source attribution + time, live prices sorted to top of list.
- Resilient: 429 rate-limit errors from page_reader are caught and logged; pipeline falls back to search snippets (which always contain price data) so it never fully fails.
- Lint clean, no runtime errors in dev log (only expected 429 warnings from upstream page_reader).
