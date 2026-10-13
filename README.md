# বাজার দর (Bazar Dor) — Bangladesh Kitchen Market Live Price & Analytics Platform

<p align="center">
  <img src="public/logo.svg" alt="বাজার দর লোগো" width="90" height="90" />
</p>

<p align="center">
  <b>বাংলাদেশের দৈনন্দিন কাঁচাবাজারের নির্ভরযোগ্য, স্বচ্ছ ও রিয়েল-টাইম বাজারদর প্ল্যাটফর্ম।</b><br/>
  <i>Open-source, community-driven price tracking, automated newspaper sync, 20-year economic trends, and localized price insights.</i>
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#environment-variables">Environment Variables</a> •
  <a href="#database-management">Database & Backups</a> •
  <a href="#data-architecture">Architecture</a> •
  <a href="#credits--license">Credits & License</a>
</p>

---

## 🌟 Overview

**বাজার দর (Bazar Dor)** হলো একটি উন্মুক্ত ও জনস্বার্থমূলক প্ল্যাটফর্ম যা বাংলাদেশের সাধারণ ভোক্তাদের স্থানীয় বাজারের সঠিক ও যাচাইকৃত দর জানতে সহায়তা করে। 

দৈনন্দিন নিত্যপ্রয়োজনীয় পণ্য যেমন চাল, ডাল, তেল, পেঁয়াজ, আলু, শাকসবজি, মাছ ও মাংসের দাম বিভিন্ন জেলা ও বাজারে ভিন্ন হয়। বাজার দর প্ল্যাটফর্মটি জাতীয় শীর্ষস্থানীয় গণমাধ্যম, সরকারি কৃষি বিপণন অধিদপ্তর এবং স্থানীয় ভোক্তাদের সরাসরি ইনপুটের মাধ্যমে তৈরি হয়।

> **মূল প্রতিপাদ্য**: *"ন্যায্য ও স্বচ্ছ দামে প্রতিদিনের বাজার করুন। আপনার স্থানীয় বাজারের সঠিক ও যাচাইকৃত দর জানুন।"*

---

## ✨ Key Features

1. **আজকের লাইভ বাজার দর (Today's Live Prices)**:
   - ৫৪+ নিত্যপ্রয়োজনীয় পণ্যের পাইকারি ও খুচরা রেট।
   - দাম বাড়ার (Gainers), কমার (Losers) এবং অপরিবর্তিত থাকার লাইভ পরিসংখ্যান।
   - বাংলা ও ইংরেজি দুই ভাষাতেই তাৎক্ষণিক সার্চ (Feature flag দিয়ে নিয়ন্ত্রিত)।
   - Infinite scroll ও পারফরম্যান্স অপ্টিমাইজড ভিউ।

2. **লাইভ সংবাদ ও উৎস ট্র্যাকিং (Media & Official Sources Sync)**:
   - প্রথম আলো, ডেইলি স্টার, ঢাকা ট্রিবিউন, দ্য বিজনেস স্ট্যান্ডার্ড (TBS), জাগো নিউজ, বিডিনিউজ২৪ এবং কৃষি বিপণন অধিদপ্তরের (DAM) লাইভ রিপোর্ট সমন্বয়।
   - উৎস-ভিত্তিক ভেরিফায়েড ব্যাজ ও খবরের সরাসরি সোর্স লিংক।

3. **বিগত ২০ বছরের ঐতিহাসিক গতিধারা (২০০৫ - ২০২৫)**:
   - চাল, তেল, ডাল, আলু, পেঁয়াজ, গরুর মাংসের ২০ বছরের মূল্যবৃদ্ধির তুলনামূলক গ্রাফ।
   - বার্ষিক মূল্যস্ফীতি (Inflation) এবং সর্বনিম্ন/সর্বোচ্চ দামের ইন্টারঅ্যাক্টিভ ভিজ্যুয়ালাইজেশন।

4. **দাম সতর্কতা ও ইমেইল নোটিফিকেশন (Price Alerts via Gmail SMTP)**:
   - পণ্য ও কাঙ্ক্ষিত টার্গেট মূল্যের ওপর অ্যালার্ট সেট করার সুবিধা।
   - অ্যালার্ট রেজিস্ট্রেশনের সাথে সাথে ব্যবহারকারীর ইনবক্সে স্বয়ংক্রিয় কনফার্মেশন ইমেইল পাঠানো।

5. **কমিউনিটি রিপোর্ট ও যাচাই ভোটিং (Community Accuracy Voting)**:
   - সাধারণ ক্রেতারা তাদের স্থানীয় বাজারের বাস্তব দাম সাবমিট করতে পারেন।
   - দাম কি "সঠিক", নাকি "বেশি", নাকি "কম" — জনমতের ভিত্তিতে ক্রাউডসোর্সড নির্ভরযোগ্যতা স্কোর।

6. **পূর্ণাঙ্গ ডিরেক্টরি পেজসমূহ (SEO & Micro-pages)**:
   - পণ্যের বিস্তারিত পেজ (`/items`, `/items/[slug]`)
   - বাজারের তালিকা ও রেট (`/markets`, `/markets/[slug]`)
   - জেলাভিত্তিক বাজার দর (`/districts`, `/districts/[slug]`)
   - সকল লাইভ দাম রিপোর্ট হিস্ট্রি (`/reports`)
   - ডেটা সোর্স তালিকা (`/sources`), প্রাইভেসি পলিসি (`/privacy`), ব্যবহারের শর্তাবলী (`/terms`), ও সচরাচর জিজ্ঞাসা (`/faq`)।

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, PostCSS, Radix UI Primitives, Lucide Icons
- **Database & ORM**: SQLite + [Prisma ORM](https://www.prisma.io/)
- **Charts & Visualization**: Recharts
- **Email Service**: Nodemailer (Gmail SMTP / Custom SMTP)
- **Runtime & Package Manager**: [Bun](https://bun.sh/) (or Node.js 20+)
- **Analytics & Tracking**: Google Analytics (GA4) & Google Tag Manager (GTM)

---

## 🚀 Quick Start

### ১. ক্লোন ও ডিপেন্ডেন্সি ইনস্টল

```bash
git clone git@github.com:sopu175/Bzarador.git
cd Bzarador

# Bun ব্যবহার করে ইনস্টল করুন (সুপার ফাস্ট)
bun install

# অথবা npm ব্যবহার করতে পারেন
# npm install
```

### ২. এনভায়রনমেন্ট কনফিগারেশন

প্রজেক্টের মূল ডিরেক্টরিতে `.env.example` থেকে একটি `.env` ফাইল তৈরি করুন:

```bash
cp .env.example .env
```

প্রয়োজনে `.env` ফাইলের মানসমূহ এডিট করুন:
```ini
# SQLite Database
DATABASE_URL="file:./db/custom.db"

# Gmail SMTP (দাম সতর্কতার কনফার্মেশন ইমেইল পাঠানোর জন্য)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-char-app-password"
SMTP_FROM="বাজার দাম <your-email@gmail.com>"

# Google Analytics & Tag Manager (ঐচ্ছিক)
NEXT_PUBLIC_GA_MEASUREMENT_ID=""
NEXT_PUBLIC_GTM_ID=""

# ফিচার ফ্ল্যাগ
NEXT_PUBLIC_ENABLE_ENGLISH_SEARCH="true"
```

### ৩. ডেটাবেজ ইনিশিয়ালাইজ ও সিডিং

```bash
# স্কিমা সিঙ্ক করুন
bun run db:push

# Prisma Client জেনারেট করুন
bun run db:generate

# প্রাথমিক বাজার ও পণ্যের ডেটাবেজ সিড করুন
bun run prisma/seed.ts
```

### ৪. ডেভেলপমেন্ট সার্ভার চালু করুন

```bash
bun run dev
```

ব্রাউজারে ওপেন করুন: [http://localhost:3000](http://localhost:3000)

---

## 💾 Database Management & Backups

প্রজেক্টটিতে সহজে ডেটা স্ন্যাপশট ও রিস্টোর করার জন্য বিল্ট-ইন স্ক্রিপ্ট রয়েছে:

### ডেটা ব্যাকআপ নেওয়া:
```bash
bun run db:backup
```
- এটি `db/backups/` ফোল্ডারে SQLite ফাইলের বাইনারি কপি (`.db`) সংরক্ষণ করে।
- একইসাথে সমস্ত টেবিলের একটি পোর্টেবল JSON ডাম্প (`backup-latest.json`) তৈরি করে।

### ডেটা রিস্টোর করা:
```bash
# সর্বশেষ বাইনারি ব্যাকআপ থেকে রিস্টোর করতে:
bun run db:restore

# অথবা JSON ব্যাকআপ থেকে রিস্টোর করতে:
bun run db:restore --from-json

# নির্দিষ্ট কোনো ব্যাকআপ ফাইল উল্লেখ করতে:
bun run db:restore custom-backup-2026-10-12T11-12-25-032Z.db
```

### Vercel থেকে সর্বশেষ লাইভ ডেটাবেজ লোকাল মেশিনে আনা (Sync from Vercel):
Vercel প্রডাকশনে থাকা সকল নতুন প্রাইস রিপোর্ট, লাইভ আপডেট ও ফিডব্যাক লোকাল ডেটাবেজে সরাসরি সিঙ্ক করতে চালান:
```bash
bun run db:pull
```
*(স্বয়ংক্রিয়ভাবে Vercel থেকে ডেটা ফেচ করে লোকাল `db/custom.db` আপডেট করবে এবং পূর্বের লোকাল ডেটার ব্যাকআপ রাখবে)*

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
│   ├── db-backup.ts        # Automated DB backup script
│   └── db-restore.ts       # Database restore script
├── src/
│   ├── app/                # Next.js App Router (pages & API endpoints)
│   │   ├── api/            # API Routes (prices, alerts, reports, feedback, votes)
│   │   ├── items/          # Items directory & individual item details
│   │   ├── markets/        # Markets directory & local market details
│   │   ├── districts/      # District wise price view
│   │   ├── reports/        # Full price reports log
│   │   ├── sources/        # Data sources directory
│   │   ├── faq/            # Frequently Asked Questions
│   │   ├── privacy/        # Privacy policy
│   │   ├── terms/          # Terms & conditions
│   │   └── page.tsx        # Homepage
│   ├── components/
│   │   ├── bazar/          # Core application UI panels and charts
│   │   └── ui/             # Reusable UI component library (Shadcn UI)
│   └── lib/                # Utilities, translations, email service & mock data
├── .env.example            # Environment variables template
├── package.json
└── README.md
```

---

## 🤝 How to Contribute

ওপেন সোর্স কমিউনিটির অংশগ্রহণ আন্তরিকভাবে স্বাগত জানাই!

1. রিপোজিটরিটি **Fork** করুন।
2. নতুন ফিচার বা বাগ ফিক্সের জন্য নতুন ব্রাঞ্চ তৈরি করুন:
   ```bash
   git checkout -b feature/awesome-feature
   ```
3. পরিবর্তন কমিট করুন:
   ```bash
   git commit -m "Add new feature for local bazaar tracking"
   ```
4. ব্রাঞ্চ পুশ করুন:
   ```bash
   git push origin feature/awesome-feature
   ```
5. গিটহাবে একটি **Pull Request** তৈরি করুন।

---

## 👤 Credits & Author

- **Designed & Developed by**: **Saif**
- **Email**: [sopu175@gmail.com](mailto:sopu175@gmail.com)
- **GitHub**: [@sopu175](https://github.com/sopu175)
- **Repository**: [https://github.com/sopu175/Bzarador](https://github.com/sopu175/Bzarador)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
Feel free to use, modify, and distribute for personal, educational, or commercial projects.
