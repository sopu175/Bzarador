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
  reportSuccess: { bn: "ধন্যবাদ! আপনার দাম যোগ হয়েছে।", en: "Thank you! Your price has been added." },
  reportError: { bn: "ত্রুটি হয়েছে, আবার চেষ্টা করুন।", en: "An error occurred, please try again." },
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
  alertsPhone: { bn: "মোবাইল নম্বর", en: "Mobile Number" },
  alertsItem: { bn: "পণ্য", en: "Item" },
  alertsTarget: { bn: "লক্ষ্য দাম (টাকা)", en: "Target Price (Taka)" },
  alertsDirection: { bn: "কখন জানাবে?", en: "When to notify?" },
  alertsBelow: { bn: "এর নিচে নামলে", en: "When price drops below" },
  alertsAbove: { bn: "এর উপরে উঠলে", en: "When price rises above" },
  alertsCreate: { bn: "সতর্কতা তৈরি করুন", en: "Create Alert" },
  alertsSuccess: { bn: "সতর্কতা তৈরি হয়েছে!", en: "Alert created!" },
  alertsError: { bn: "ত্রুটি হয়েছে, আবার চেষ্টা করুন।", en: "An error occurred." },
  alertsYourAlerts: { bn: "আপনার সতর্কতা", en: "Your Alerts" },
  alertsFind: { bn: "আপনার সতর্কতা দেখুন", en: "Find your alerts" },
  alertsFindBtn: { bn: "খুঁজুন", en: "Find" },
  alertsNoAlerts: { bn: "কোনো সতর্কতা নেই", en: "No alerts found" },
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
    bn: "আর কখনো ঠকবেন না। আপনার স্থানীয় বাজারের আসল দাম জানুন।",
    en: "Never get overcharged again. Know the real prices at your local market.",
  },
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
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
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
