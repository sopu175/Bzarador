# বাজার দর (Bazar Dor) — Bangladesh Kitchen Market Live Price & Analytics Platform

<p align="center">
  <img src="public/logo.svg" alt="Bazar Dor Logo" width="90" height="90" />
</p>

<p align="center">
  <b>Real-Time Kitchen Market Prices, Economic Trends & Community Crowdsourcing Across Bangladesh.</b><br/>
  <b>বাংলাদেশের দৈনন্দিন কাঁচাবাজারের নির্ভরযোগ্য, স্বচ্ছ ও রিয়েল-টাইম বাজারদর প্ল্যাটফর্ম।</b><br/>
  <i>Open-source, community-driven price tracking, automated media sync, 20-year economic trends, and localized price insights.</i>
</p>

<p align="center">
  <a href="#-quick-navigation--দ্রুত-নেভিগেশন">Navigation</a> •
  <a href="#-english-documentation">English Guide</a> •
  <a href="#-বাংলা-ডকুমেন্টেশন">বাংলা নির্দেশিকা</a> •
  <a href="#-git-workflow--husky-quality-gates">Git & Husky Gates</a> •
  <a href="#-credits--author">Credits</a>
</p>

---

## 🌐 Language Selector / ভাষা নির্বাচন

- 🇬🇧 **[Read English Documentation](#-english-documentation)**
- 🇧🇩 **[বাংলা নির্দেশিকা পড়ুন](#-বাংলা-ডকুমেন্টেশন)**

---

<a name="-english-documentation"></a>

## 🇬🇧 English Documentation

### 🌟 Overview

**Bazar Dor (বাজার দর)** is an open-source, public-interest web platform designed to empower everyday consumers across Bangladesh with verified, transparent, and localized kitchen market prices.

Commodity rates (rice, lentils, soybean oil, onions, potatoes, green vegetables, fish, and beef) vary widely between districts and wholesale/retail bazaars. Bazar Dor aggregates data from leading national dailies, government agricultural marketing bodies (DAM), and community user reports.

> **Motto**: _"Shop smart with fair and transparent market rates. Know your local market's true price."_

---

### ✨ Key Features

1. **Today's Live Commodity Rates**:
   - Wholesale and retail pricing for 54+ essential items across 8 categories (Vegetables, Fish, Meat, Fruits, Spices, Rice, Lentils, Oil).
   - Real-time Top Gainers, Losers, and Unchanged metrics.
   - Dual-language instant search (Bengali & English) controlled by configurable feature flags.
   - Mobile-first, infinite-scroll, optimized responsive view.

2. **Automated Media & Official Source Sync**:
   - Sourced from Prothom Alo, The Daily Star, Dhaka Tribune, The Business Standard (TBS), Jago News 24, and the Department of Agricultural Marketing (DAM).
   - Verified publisher badges with direct links to original sources.

3. **20-Year Historical Economic Trend Analysis (2005 - 2025)**:
   - Interactive historical comparison charts for staples (Minicate Rice, Beef, Soybean Oil, Hilsa Fish, Inflation vs. Daily Labor Wage).
   - Visualizing purchasing power parity and wage-to-commodity price shifts.

4. **Price Alerts via Gmail SMTP**:
   - Set target threshold alerts for any commodity in a specific market.
   - Automatic email confirmation sent straight to the user's inbox upon registration.

5. **Community Crowdsourcing & Accuracy Voting**:
   - Consumers report real prices from their local bazaar.
   - Community voting system ("Accurate", "Overpriced", "Underpriced") to determine crowdsourced confidence scores.

6. **Dedicated SEO Directory Pages**:
   - Item Pages: `/items`, `/items/[slug]`
   - Market Directories: `/markets`, `/markets/[slug]`
   - District Portals: `/districts`, `/districts/[slug]`
   - Live Price Audit Log: `/reports`
   - Dynamic `sitemap.xml` and `robots.txt` indexing all 80+ dynamic endpoints.

---

### 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Radix UI Primitives, Lucide Icons
- **Database & ORM**: SQLite + [Prisma ORM](https://www.prisma.io/)
- **Charts**: Recharts
- **Email Delivery**: Nodemailer (Gmail SMTP / Custom SMTP)
- **Runtime**: [Bun](https://bun.sh/) (or Node.js 20+)
- **Code Quality**: ESLint Flat Config (`--max-warnings=0`), Prettier, Husky v9, Commitlint

---

### 🚀 Quick Start (English)

#### 1. Clone & Install Dependencies

```bash
git clone git@github.com:sopu175/Bzarador.git
cd Bzarador

# Install using Bun (Recommended)
bun install

# Or using npm
# npm install
```

#### 2. Environment Configuration

Copy `.env.example` to create your local `.env`:

```bash
cp .env.example .env
```

Review environment keys:

```ini
# SQLite Database
DATABASE_URL="file:./db/custom.db"

# Gmail SMTP Configuration for Price Alerts
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-char-app-password"
SMTP_FROM="বাজার দাম <your-email@gmail.com>"

# Google Analytics & Search Console (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-026YVGBS6C"
NEXT_PUBLIC_GTM_ID=""

# Feature Flags
NEXT_PUBLIC_ENABLE_ENGLISH_SEARCH="true"
```

#### 3. Database Initialization & Seeding

```bash
# Push Prisma schema to SQLite
bun run db:push

# Generate Prisma Client
bun run db:generate

# Seed initial baseline markets & reports
bun run prisma/seed.ts
```

#### 4. Run Development Server

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 💾 Database Management & Synchronization

- **Pull latest live production database from Vercel to Local**:

  ```bash
  bun run db:pull
  ```

  _(Downloads live reports and replaces local `db/custom.db` with automated safety backup)_

- **Create a manual database backup snapshot**:

  ```bash
  bun run db:backup
  ```

- **Restore database from backup**:
  ```bash
  # Restore from latest binary snapshot (.db)
  bun run db:restore

  # Restore from JSON snapshot
  bun run db:restore --from-json
  ```

---

<br/>

---

<a name="-বাংলা-ডকুমেন্টেশন"></a>

## 🇧🇩 বাংলা নির্দেশিকা (Bengali Documentation)

### 🌟 পরিচিতি

**বাজার দর (Bazar Dor)** হলো একটি উন্মুক্ত ও জনস্বার্থমূলক প্ল্যাটফর্ম যা বাংলাদেশের সাধারণ ভোক্তাদের স্থানীয় বাজারের সঠিক ও যাচাইকৃত দর জানতে সহায়তা করে।

দৈনন্দিন নিত্যপ্রয়োজনীয় পণ্য যেমন চাল, ডাল, তেল, পেঁয়াজ, আলু, শাকসবজি, মাছ ও মাংসের দাম বিভিন্ন জেলা ও বাজারে ভিন্ন হয়। বাজার দর প্ল্যাটফর্মটি জাতীয় শীর্ষস্থানীয় গণমাধ্যম, সরকারি কৃষি বিপণন অধিদপ্তর এবং স্থানীয় ভোক্তাদের সরাসরি ইনপুটের মাধ্যমে নিয়মিত হালনাগাদ হয়।

> **মূল প্রতিপাদ্য**: _"ন্যায্য ও স্বচ্ছ দামে প্রতিদিনের বাজার করুন। আপনার স্থানীয় বাজারের সঠিক ও যাচাইকৃত দর জানুন।"_

---

### ✨ মূল সুবিধাসমূহ

1. **আজকের লাইভ বাজার দর**:
   - ৫৪+ নিত্যপ্রয়োজনীয় পণ্যের পাইকারি ও খুচরা রেট।
   - দাম বৃদ্ধি (Gainers), হ্রাস (Losers) এবং অপরিবর্তিত থাকার তাৎক্ষণিক বিশ্লেষণ।
   - বাংলা ও ইংরেজি উভয় ভাষায় ফিল্টারিং ও সার্চ সুবিধা।
   - মোবাইল রেসপনসিভ ও কার্ড/টেবিল ভিউ।

2. **সংবাদ ও সরকারি ডেটা সোর্স ট্র্যাকিং**:
   - প্রথম আলো, ডেইলি স্টার, ঢাকা ট্রিবিউন, দ্য বিজনেস স্ট্যান্ডার্ড (TBS), জাগো নিউজ এবং কৃষি বিপণন অধিদপ্তরের (DAM) লাইভ রিপোর্ট সমন্বয়।
   - সোর্স ভেরিফিকেশন ব্যাজ ও সংবাদের সরাসরি লিংক।

3. **বিগত ২০ বছরের ঐতিহাসিক গতিধারা (২০০৫ - ২০২৫)**:
   - চাল, তেল, ডাল, আলু, পেঁয়াজ ও গরুর মাংসের ২০ বছরের মূল্যবৃদ্ধির তুলনামূলক গ্রাফ।
   - মূল্যস্ফীতি ও দৈনিক মজুরির সাথে ক্রয়ক্ষমতার পরিবর্তন বিশ্লেষণ।

4. **দাম সতর্কতা ও ইমেইল নোটিফিকেশন**:
   - কাঙ্ক্ষিত মূল্যে পৌঁছালে এলার্ট সেট করার সুবিধা।
   - জিমেইল এসএমটিপি (Gmail SMTP) এর মাধ্যমে কনফার্মেশন ইমেইল ডেলিভারি।

5. **কমিউনিটি রিপোর্ট ও জনমত ভোটিং**:
   - সাধারণ ভোক্তারা তাদের লোকাল বাজারের দাম সাবমিট করতে পারেন।
   - "দাম সঠিক", "বেশি", নাকি "কম" — জনমতের ভিত্তিতে নির্ভরযোগ্যতা স্কোর।

6. **পূর্ণাঙ্গ ডিরেক্টরি পেজসমূহ**:
   - পণ্যের বিস্তারিত পেজ (`/items`, `/items/[slug]`)
   - বাজারের তালিকা ও রেট (`/markets`, `/markets/[slug]`)
   - জেলাভিত্তিক বাজার দর (`/districts`, `/districts/[slug]`)
   - সকল লাইভ দাম রিপোর্ট হিস্ট্রি (`/reports`)
   - ডেটা সোর্স তালিকা (`/sources`), প্রাইভেসি পলিসি (`/privacy`), ব্যবহারের শর্তাবলী (`/terms`), ও সচরাচর জিজ্ঞাসা (`/faq`)।

---

### 🚀 দ্রুত শুরু (বাংলা)

#### ১. রিপোজিটরি ক্লোন ও ইনস্টল

```bash
git clone git@github.com:sopu175/Bzarador.git
cd Bzarador

# Bun দিয়ে প্যাকেজ ইনস্টল করুন
bun install
```

#### ২. এনভায়রনমেন্ট ফাইল তৈরি

```bash
cp .env.example .env
```

#### ৩. ডেটাবেজ সেটআপ ও সিডিং

```bash
bun run db:push
bun run db:generate
bun run prisma/seed.ts
```

#### ৪. লোকাল সার্ভার চালু

```bash
bun run dev
```

ব্রাউজারে ভিজিট করুন: [http://localhost:3000](http://localhost:3000)

---

<br/>

---

<a name="-git-workflow--husky-quality-gates"></a>

## 🛡️ Git Workflow & Husky Quality Gates (উভয় ভাষার জন্য প্রযোজ্য)

To maintain clean architecture, strict zero-warning policy, and rock-solid code quality, this project uses automatic **Husky v9 Git Hooks**:

### 1. Branching Strategy (ব্রাঞ্চিং নীতিমালা)

- **`main` (Production Branch)**:
  - 🚫 **Direct commits to `main` are strictly forbidden** by `.husky/pre-commit`.
  - All deployments on Vercel are triggered from verified releases on `main`.
- **`development` (Staging & Integration Branch)**:
  - Active day-to-day work, testing, and merging happens on `development`.
- **Feature Branches (`feat/*`, `fix/*`, `chore/*`)**:
  - Create small, focused feature branches branched from `development` and merge back into `development`.

```bash
# Switch to development for work:
git checkout development

# Create a feature branch:
git checkout -b feat/my-new-feature
```

---

### 2. Commit Message Conventions (Commitlint)

Commit messages must follow **Conventional Commits**, validated automatically via `.husky/commit-msg`:

| Prefix      | Description / বিবরণ                | Example                                                     |
| ----------- | ---------------------------------- | ----------------------------------------------------------- |
| `feat:`     | New feature / নতুন ফিচার           | `git commit -m "feat: add real-time price notification"`    |
| `fix:`      | Bug fix / বাগ সমাধান               | `git commit -m "fix: resolve date boundary calculation"`    |
| `docs:`     | Documentation update / ডকুমেন্টেশন | `git commit -m "docs: add bilingual readme"`                |
| `style:`    | Formatting / কোড স্টাইল            | `git commit -m "style: format components with prettier"`    |
| `refactor:` | Code refactoring / রিফ্যাক্টরিং    | `git commit -m "refactor: simplify price aggregation"`      |
| `chore:`    | Maintenance / ডিপেন্ডেন্সি         | `git commit -m "chore: update dependencies"`                |
| `ci:`       | Git hooks & workflows / সিআই হুক   | `git commit -m "ci: enforce strict pre-push quality gates"` |

---

### 3. Pre-Commit Quality Gate (`.husky/pre-commit`)

Executed automatically on `git commit`:

1. **Branch Protection**: Prohibits direct commits to `main`/`master`.
2. **Strict ESLint (`--max-warnings=0`)**: Enforces **0 errors and 0 warnings**.
3. **Prettier Formatting**: Auto-formats staged code files.
4. **TypeScript Compile (`tsc --noEmit`)**: Validates complete type-safety.

---

### 4. Pre-Push Quality Gate (`.husky/pre-push`)

Executed automatically on `git push`:

```
🔍 [pre-push] Verifying code quality before pushing...
  ↳ 1/3 Checking code formatting (Prettier)...
  ↳ 2/3 Checking lint rules (ESLint --max-warnings=0)...
  ↳ 3/3 Checking TypeScript types (tsc)...
✅ All code quality gates passed! Proceeding with git push.
```

---

## 📁 Project Directory Structure

```
├── db/                     # SQLite database & snapshots
│   └── backups/            # Automated snapshots & JSON exports
├── prisma/
│   ├── schema.prisma       # Prisma ORM schema
│   └── seed.ts             # Default mock and live baseline seeds
├── public/                 # Static assets (logo.svg, favicon.svg)
├── scripts/
│   ├── db-backup.ts        # Database backup script
│   ├── db-pull.ts          # Vercel-to-local DB sync script
│   └── db-restore.ts       # Database restore script
├── src/
│   ├── app/                # Next.js App Router (pages & API endpoints)
│   │   ├── api/            # API Routes (prices, alerts, reports, feedback, admin)
│   │   ├── items/          # Items directory & individual item details
│   │   ├── markets/        # Markets directory & local market details
│   │   ├── districts/      # District wise price views
│   │   ├── reports/        # Full price reports log
│   │   ├── sources/        # Data sources directory
│   │   ├── faq/            # Frequently Asked Questions
│   │   ├── privacy/        # Privacy policy
│   │   ├── terms/          # Terms & conditions
│   │   ├── robots.ts       # Dynamic SEO robots.txt
│   │   ├── sitemap.ts      # Dynamic SEO sitemap.xml
│   │   └── page.tsx        # Homepage
│   ├── components/
│   │   ├── bazar/          # Core panels, tables, and economic charts
│   │   └── ui/             # Reusable UI component library (Shadcn UI)
│   └── lib/                # Database, translations, email service & calculators
├── .env.example            # Environment variables template
├── commitlint.config.mjs   # Conventional commitlint configuration
├── eslint.config.mjs       # ESLint flat config with 0-warning enforcement
├── .prettierrc             # Prettier styling configuration
├── package.json
└── README.md
```

---

<a name="-credits--author"></a>

## 👤 Credits & Author

- **Designed & Developed by**: **Saif**
- **Email**: [sopu175@gmail.com](mailto:sopu175@gmail.com)
- **GitHub**: [@sopu175](https://github.com/sopu175)
- **Repository**: [https://github.com/sopu175/Bzarador](https://github.com/sopu175/Bzarador)
- **Live Production URL**: [https://bazar-dor-bangladesh.vercel.app](https://bazar-dor-bangladesh.vercel.app)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
Feel free to use, modify, and distribute for personal, educational, or commercial projects.
