"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "bn" | "en";

type LangState = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

export const useLang = create<LangState>()(
  persist(
    (set) => ({
      lang: "bn",
      setLang: (lang) => set({ lang }),
      toggle: () => set((s) => ({ lang: s.lang === "bn" ? "en" : "bn" })),
    }),
    { name: "bazar-lang" }
  )
);

// Bengali + English UI strings
const dict = {
  appName: { bn: "বাজার দাম", en: "Bazar Dam" },
  tagline: {
    bn: "আপনার স্থানীয় বাজারের রিয়েল-টাইম দাম",
    en: "Real-time prices at your local market",
  },
  // Tabs
  tabToday: { bn: "আজকের বাজার", en: "Today" },
  tabMarkets: { bn: "বাজার খুঁজুন", en: "Markets" },
  tabReport: { bn: "দাম জানান", en: "Report Price" },
  tabTrends: { bn: "দামের ধারা", en: "Price Trends" },
  tabAlerts: { bn: "সতর্কতা", en: "Price Alerts" },
  // Today
  todayTitle: { bn: "আজকের বাজার দাম", en: "Today's Market Prices" },
  todaySubtitle: {
    bn: "দেশজুড়ে ১১টি বাজার থেকে সংগৃহীত গড় দাম",
    en: "Average prices from 11 markets across the country",
  },
  allMarkets: { bn: "সব বাজার", en: "All Markets" },
  topGainers: { bn: "আজ বেড়েছে", en: "Top Gainers" },
  topLosers: { bn: "আজ কমেছে", en: "Top Losers" },
  noGainers: { bn: "আজ কোনো দাম বাড়েনি", en: "No prices went up today" },
  noLosers: { bn: "আজ কোনো দাম কমেনি", en: "No prices went down today" },
  searchItem: { bn: "পণ্য খুঁজুন...", en: "Search items..." },
  noResults: { bn: "কিছু পাওয়া যায়নি", en: "No results found" },
  perUnit: { bn: "প্রতি", en: "per" },
  // Markets
  marketsTitle: { bn: "বাজার ভেদে দাম", en: "Prices by Market" },
  marketsSubtitle: {
    bn: "জেলা ও বাজার নির্বাচন করুন",
    en: "Select district and market",
  },
  selectDistrict: { bn: "জেলা নির্বাচন করুন", en: "Select District" },
  selectMarket: { bn: "বাজার নির্বাচন করুন", en: "Select Market" },
  allDistricts: { bn: "সব জেলা", en: "All Districts" },
  // Report
  reportTitle: { bn: "দাম জানান", en: "Report a Price" },
  reportSubtitle: {
    bn: "আপনার বাজারের দাম শেয়ার করুন, সবাই উপকৃত হবে",
    en: "Share your market's price, everyone benefits",
  },
  reportItem: { bn: "পণ্য", en: "Item" },
  reportMarket: { bn: "বাজার", en: "Market" },
  reportPrice: { bn: "দাম (টাকা)", en: "Price (Taka)" },
  reportYourName: { bn: "আপনার নাম (ঐচ্ছিক)", en: "Your Name (optional)" },
  reportPhone: { bn: "মোবাইল নম্বর (ঐচ্ছিক)", en: "Mobile (optional)" },
  reportSubmit: { bn: "দাম জমা দিন", en: "Submit Price" },
  reportSuccess: {
    bn: "ধন্যবাদ! আপনার দাম যোগ হয়েছে।",
    en: "Thank you! Your price has been added.",
  },
  reportError: {
    bn: "ত্রুটি হয়েছে, আবার চেষ্টা করুন।",
    en: "An error occurred, please try again.",
  },
  reportPickItem: { bn: "পণ্য বাছুন", en: "Pick an item" },
  reportPickMarket: { bn: "বাজার বাছুন", en: "Pick a market" },
  // Trends
  trendsTitle: { bn: "দামের ধারা", en: "Price Trends" },
  trendsSubtitle: {
    bn: "গত ৭ দিনের গড় দাম",
    en: "7-day average price",
  },
  trendsPickItem: { bn: "পণ্য বাছুন", en: "Select Item" },
  trendsPickMarket: { bn: "বাজার বাছুন (ঐচ্ছিক)", en: "Select Market (optional)" },
  trendsAllMarkets: { bn: "সব বাজারের গড়", en: "All markets avg" },
  trendsAvg: { bn: "গড় দাম", en: "Avg Price" },
  trendsMin: { bn: "সর্বনিম্ন", en: "Min" },
  trendsMax: { bn: "সর্বোচ্চ", en: "Max" },
  trendsWeekHigh: { bn: "সপ্তাহের সর্বোচ্চ", en: "Week High" },
  trendsWeekLow: { bn: "সপ্তাহের সর্বনিম্ন", en: "Week Low" },
  // Alerts
  alertsTitle: { bn: "দাম সতর্কতা", en: "Price Alerts" },
  alertsSubtitle: {
    bn: "দাম কমলে বা বাড়লে আপনাকে জানানো হবে",
    en: "We'll notify you when price drops or rises",
  },
  alertsPhone: { bn: "ইমেইল বা মোবাইল নম্বর", en: "Email or Mobile Number" },
  alertsEmail: { bn: "ইমেইল ঠিকানা", en: "Email Address" },
  alertsItem: { bn: "পণ্য", en: "Item" },
  alertsTarget: { bn: "লক্ষ্য দাম (টাকা)", en: "Target Price (Taka)" },
  alertsDirection: { bn: "কখন জানাবে?", en: "When to notify?" },
  alertsBelow: { bn: "এর নিচে নামলে", en: "When price drops below" },
  alertsAbove: { bn: "এর উপরে উঠলে", en: "When price rises above" },
  alertsCreate: { bn: "সতর্কতা তৈরি করুন", en: "Create Alert" },
  alertsSuccess: {
    bn: "সতর্কতা তৈরি হয়েছে এবং নিশ্চিতকরণ ইমেইল পাঠানো হয়েছে!",
    en: "Alert created and confirmation email sent!",
  },
  alertsError: {
    bn: "ত্রুটি হয়েছে, অনুগ্রহ করে সঠিক ইমেইল ও তথ্য দিন।",
    en: "An error occurred. Please provide valid email and details.",
  },
  alertsYourAlerts: { bn: "আপনার সতর্কতা সমূহ", en: "Your Alerts" },
  alertsFind: {
    bn: "ইমেইল দিয়ে আপনার পূর্ববর্তী সতর্কতা খুঁজুন",
    en: "Find your alerts with email",
  },
  alertsFindBtn: { bn: "খুঁজুন", en: "Find" },
  alertsNoAlerts: { bn: "কোনো সতর্কতা পাওয়া যায়নি", en: "No alerts found" },
  alertsCurrentAvg: { bn: "বর্তমান গড় দাম", en: "Current Avg Price" },
  // Common
  taka: { bn: "৳", en: "৳" },
  loading: { bn: "লোড হচ্ছে...", en: "Loading..." },
  footerText: {
    bn: "বাজার দাম — বাংলাদেশের কমিউনিটি দ্বারা চালিত",
    en: "Bazar Dam — Community-driven for Bangladesh",
  },
  footerMadeWith: {
    bn: "❤️ দিয়ে তৈরি 🇧🇩",
    en: "Made with ❤️ in 🇧🇩",
  },
  reportCount: { bn: "টি রিপোর্ট", en: "reports" },
  sinceYesterday: { bn: "গতকাল থেকে", en: "vs yesterday" },
  // Categories
  cat_vegetable: { bn: "শাকসবজি", en: "Vegetables" },
  cat_fish: { bn: "মাছ", en: "Fish" },
  cat_meat: { bn: "মাংস", en: "Meat" },
  cat_fruit: { bn: "ফল", en: "Fruits" },
  cat_spice: { bn: "মসলা", en: "Spices" },
  cat_rice: { bn: "চাল", en: "Rice" },
  cat_lentil: { bn: "ডাল", en: "Lentils" },
  cat_oil: { bn: "তেল", en: "Oil" },
  // Units
  unit_kg: { bn: "কেজি", en: "kg" },
  unit_piece: { bn: "পিস", en: "piece" },
  unit_litre: { bn: "লিটার", en: "litre" },
  unit_dozen: { bn: "ডজন", en: "dozen" },
  // Hero stats
  statItems: { bn: "পণ্য", en: "Items" },
  statMarkets: { bn: "বাজার", en: "Markets" },
  statReports: { bn: "দাম রিপোর্ট", en: "Price Reports" },
  statDistricts: { bn: "জেলা", en: "Districts" },
  // Hero CTA
  heroCta1: { bn: "আজকের দাম দেখুন", en: "See Today's Prices" },
  heroCta2: { bn: "দাম জানান", en: "Report a Price" },
  heroSubtitle: {
    bn: "ন্যায্য ও স্বচ্ছ দামে প্রতিদিনের বাজার করুন। আপনার স্থানীয় বাজারের সঠিক ও যাচাইকৃত দর জানুন।",
    en: "Shop smart with fair and transparent prices. Discover accurate, verified rates at your local kitchen market.",
  },
  // Live update
  liveUpdate: { bn: "লাইভ দাম আপডেট", en: "Live Update" },
  liveFetchBtn: { bn: "অনলাইন থেকে আনুন", en: "Fetch Live Prices" },
  liveFetching: {
    bn: "আনা হচ্ছে... একটি মিনিট সময় লাগতে পারে",
    en: "Fetching... may take a minute",
  },
  liveSuccess: { bn: "লাইভ দাম আপডেট হয়েছে!", en: "Live prices updated!" },
  liveSuccessDesc: {
    bn: "{n} টি পণ্যের দাম অনলাইন থেকে আনা হয়েছে।",
    en: "Fetched prices for {n} items from the web.",
  },
  liveError: {
    bn: "লাইভ আপডেট ব্যর্থ হয়েছে। পরে আবার চেষ্টা করুন।",
    en: "Live update failed. Try again later.",
  },
  liveLastUpdated: { bn: "সর্বশেষ আপডেট", en: "Last updated" },
  liveSources: { bn: "উৎস", en: "Sources" },
  liveNever: { bn: "এখনও লাইভ আপডেট হয়নি", en: "Never updated live" },
  liveBadge: { bn: "লাইভ", en: "LIVE" },
  liveFrom: { bn: "উৎস:", en: "From:" },
  liveFetchItem: { bn: "এই পণ্যের লাইভ দাম আনুন", en: "Fetch live price for this item" },
  liveFetchingItem: { bn: "আনা হচ্ছে...", en: "Fetching..." },
  liveItemSuccess: { bn: "লাইভ দাম পাওয়া গেছে!", en: "Live price fetched!" },
  liveItemError: { bn: "লাইভ দাম পাওয়া যায়নি।", en: "Could not fetch live price." },
  liveReportsToday: { bn: "টি লাইভ বাজার দর এন্ট্রি আজ", en: "live price entries today" },
  liveRefresh: { bn: "আবার আপডেট করুন", en: "Refresh again" },
  // Filters & sorting
  sortLabel: { bn: "ক্রমানুসার", en: "Sort by" },
  sortPopular: { bn: "জনপ্রিয় / রিপোর্ট", en: "Most reported" },
  sortPriceAsc: { bn: "কম দাম প্রথমে", en: "Lowest price first" },
  sortPriceDesc: { bn: "বেশি দাম প্রথমে", en: "Highest price first" },
  sortChangeDesc: { bn: "বেশি বৃদ্ধি (+)", en: "Biggest price hike" },
  sortChangeAsc: { bn: "বেশি হ্রাস (-)", en: "Biggest price drop" },
  filterAll: { bn: "সব", en: "All" },
  filterGainersOnly: { bn: "আজ বেড়েছে", en: "Gainers only" },
  filterLosersOnly: { bn: "আজ কমেছে", en: "Drop only" },
  filterSteadyOnly: { bn: "অপরিবর্তিত", en: "Unchanged" },
  resetFilters: { bn: "ফিল্টার মুছুন", en: "Reset filters" },
  // Details Modal
  itemDetailsTitle: { bn: "পণ্যের বিস্তারিত তথ্য", en: "Item Price Details" },
  itemDetailsDesc: {
    bn: "১১টি বাজারের বর্তমান ও ঐতিহাসিক দামের বিশ্লেষণ",
    en: "Current & historical analysis across 11 markets",
  },
  marketBreakdown: { bn: "বাজার ভেদে আজকের দাম", en: "Today's price across markets" },
  viewTrendsForThis: { bn: "দামের পূর্ণাঙ্গ ধারা দেখুন", en: "View full trend analysis" },
  closeBtn: { bn: "বন্ধ করুন", en: "Close" },
  sourceNews: { bn: "বাজার সংবাদ ও খবর", en: "Market News Portals" },
  developedBy: { bn: "Designed & Developed by Saif", en: "Designed & Developed by Saif" },
  contactSaif: { bn: "যোগাযোগ: sopu175@gmail.com", en: "Contact: sopu175@gmail.com" },
  // Feedback Tab
  tabFeedback: { bn: "মতামত দিন", en: "Feedback" },
  feedbackTitle: { bn: "ব্যবহারকারীর মতামত ও পর্যালোচনা", en: "User Feedback & Reviews" },
  feedbackSubtitle: {
    bn: "আপনার অভিজ্ঞতা ও পরামর্শ জানান",
    en: "Share your thoughts and suggestions",
  },
  feedbackName: { bn: "আপনার নাম (ঐচ্ছিক)", en: "Your Name (optional)" },
  feedbackEmail: { bn: "ইমেইল (ঐচ্ছিক)", en: "Email (optional)" },
  feedbackCategory: { bn: "বিষয়ের ধরন", en: "Category" },
  feedbackRating: { bn: "রেটিং দিন", en: "Rating" },
  feedbackComment: {
    bn: "আপনার মন্তব্য বা পরামর্শ লিখুন...",
    en: "Write your feedback or ideas...",
  },
  feedbackSubmit: { bn: "মতামত জমা দিন", en: "Submit Feedback" },
  feedbackSuccess: {
    bn: "ধন্যবাদ! আপনার মূল্যবান মতামত গৃহীত হয়েছে।",
    en: "Thank you! Your feedback has been received.",
  },
  feedbackRecent: { bn: "সাম্প্রতিক মতামত", en: "Recent Feedback" },
  // Voting
  voteAccurate: { bn: "সঠিক দাম", en: "Accurate" },
  voteHigh: { bn: "বেশি দাম", en: "Overpriced" },
  voteCheap: { bn: "কম দাম", en: "Underpriced" },
  voteSuccess: { bn: "আপনার ভোট যুক্ত হয়েছে!", en: "Your vote has been recorded!" },
  priceAccuracy: { bn: "দামের নির্ভুলতা যাচাই", en: "Community Price Verification" },
  // Timeframes
  timeframe7d: { bn: "৭ দিন (দৈনিক)", en: "7 Days (Daily)" },
  timeframe30d: { bn: "৩০ দিন (দৈনিক)", en: "30 Days (Daily)" },
  timeframe1y: { bn: "১ বছর (মাসিক)", en: "1 Year (Monthly)" },
  // Report details drilldown
  clickToViewReports: { bn: "রিপোর্ট দেখতে ক্লিক করুন", en: "Click to view reports" },
  hideReports: { bn: "রিপোর্ট লুকান", en: "Hide reports" },
  individualReports: { bn: "পৃথক রিপোর্ট সমূহ", en: "Individual Reports" },
  noReportsFound: { bn: "কোনো রিপোর্ট পাওয়া যায়নি", en: "No reports found" },
  reportedBy: { bn: "রিপোর্টার", en: "Reporter" },
  anonymousReporter: { bn: "সাধারণ ক্রেতা / অজ্ঞাত", en: "Anonymous Buyer" },
  onlineSource: { bn: "অনলাইন উৎস", en: "Online Source" },
} as const;

export type DictKey = keyof typeof dict;

export function useT() {
  const lang = useLang((s) => s.lang);
  return (key: DictKey) => dict[key][lang];
}

// Helper for translating data fields (item names, market names, category, unit)
export function useTr() {
  const lang = useLang((s) => s.lang);
  return (bn: string, en: string) => (lang === "bn" ? bn : en);
}

export function useTUnit() {
  const lang = useLang((s) => s.lang);
  return (unit: string) => {
    const key = `unit_${unit}` as DictKey;
    return (dict[key]?.[lang] as string) ?? unit;
  };
}

export function useTCat() {
  const lang = useLang((s) => s.lang);
  return (cat: string) => {
    const key = `cat_${cat}` as DictKey;
    return (dict[key]?.[lang] as string) ?? cat;
  };
}

// Convert English digits to Bengali digits
export function toBnDigits(n: number | string, lang: Lang): string {
  if (lang !== "bn") return String(n);
  const map: Record<string, string> = {
    "0": "০",
    "1": "১",
    "2": "২",
    "3": "৩",
    "4": "৪",
    "5": "৫",
    "6": "৬",
    "7": "৭",
    "8": "৮",
    "9": "৯",
  };
  return String(n).replace(/[0-9]/g, (d) => map[d] ?? d);
}

// Hook that returns a number formatter in the current language
export function useNum() {
  const lang = useLang((s) => s.lang);
  return (n: number | null | undefined) => {
    if (n == null) return "—";
    return toBnDigits(n, lang);
  };
}
