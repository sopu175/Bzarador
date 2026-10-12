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
