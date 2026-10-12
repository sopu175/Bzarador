// Helper functions to generate clean URL slugs for Items, Markets, Districts, and Tabs

export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Known district translations
export const districtNames: Record<string, { bn: string; en: string }> = {
  dhaka: { bn: "ঢাকা", en: "Dhaka" },
  chattogram: { bn: "চট্টগ্রাম", en: "Chattogram" },
  sylhet: { bn: "সিলেট", en: "Sylhet" },
  rajshahi: { bn: "রাজশাহী", en: "Rajshahi" },
  khulna: { bn: "খুলনা", en: "Khulna" },
  barishal: { bn: "বরিশাল", en: "Barishal" },
  gazipur: { bn: "গাজীপুর", en: "Gazipur" },
  cumilla: { bn: "কুমিল্লা", en: "Cumilla" },
};
