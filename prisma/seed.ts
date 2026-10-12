import { db } from "../src/lib/db";

// Realistic Bangladesh kitchen market items (Nov 2024 prices, in Taka)
const ITEMS = [
  // Vegetables (সবজি)
  { nameBn: "আলু", nameEn: "Potato", category: "vegetable", unit: "kg", emoji: "🥔", basePrice: 35 },
  { nameBn: "পেঁয়াজ", nameEn: "Onion", category: "vegetable", unit: "kg", emoji: "🧅", basePrice: 80 },
  { nameBn: "রসুন", nameEn: "Garlic", category: "vegetable", unit: "kg", emoji: "🧄", basePrice: 140 },
  { nameBn: "আদা", nameEn: "Ginger", category: "vegetable", unit: "kg", emoji: "🫚", basePrice: 180 },
  { nameBn: "টমেটো", nameEn: "Tomato", category: "vegetable", unit: "kg", emoji: "🍅", basePrice: 60 },
  { nameBn: "বেগুন", nameEn: "Eggplant", category: "vegetable", unit: "kg", emoji: "🍆", basePrice: 40 },
  { nameBn: "শুকনো মরিচ", nameEn: "Dry Chili", category: "vegetable", unit: "kg", emoji: "🌶️", basePrice: 280 },
  { nameBn: "কাঁচা মরিচ", nameEn: "Green Chili", category: "vegetable", unit: "kg", emoji: "🌶️", basePrice: 120 },
  { nameBn: "লাউ", nameEn: "Bottle Gourd", category: "vegetable", unit: "piece", emoji: "🥒", basePrice: 50 },
  { nameBn: "মিষ্টি কুমড়া", nameEn: "Pumpkin", category: "vegetable", unit: "kg", emoji: "🎃", basePrice: 35 },
  { nameBn: "পালং শাক", nameEn: "Spinach", category: "vegetable", unit: "kg", emoji: "🥬", basePrice: 30 },
  { nameBn: "কাঁচকলা", nameEn: "Green Banana", category: "vegetable", unit: "kg", emoji: "🍌", basePrice: 40 },
  { nameBn: "ফুলকপি", nameEn: "Cauliflower", category: "vegetable", unit: "piece", emoji: "🥦", basePrice: 60 },
  { nameBn: "বাঁধাকপি", nameEn: "Cabbage", category: "vegetable", unit: "piece", emoji: "🥬", basePrice: 40 },
  { nameBn: "গাজর", nameEn: "Carrot", category: "vegetable", unit: "kg", emoji: "🥕", basePrice: 70 },
  { nameBn: "ঢেঁড়শ", nameEn: "Okra", category: "vegetable", unit: "kg", emoji: "🌱", basePrice: 55 },
  { nameBn: "শিম", nameEn: "Bean", category: "vegetable", unit: "kg", emoji: "🌱", basePrice: 50 },
  { nameBn: "চিচিঙ্গা", nameEn: "Ridge Gourd", category: "vegetable", unit: "kg", emoji: "🥒", basePrice: 45 },
  { nameBn: "পুঁইশাক", nameEn: "Malabar Spinach", category: "vegetable", unit: "kg", emoji: "🥬", basePrice: 25 },
  { nameBn: "মূল", nameEn: "Radish", category: "vegetable", unit: "piece", emoji: "🟥", basePrice: 25 },

  // Fish (মাছ)
  { nameBn: "রুই মাছ", nameEn: "Rui Fish", category: "fish", unit: "kg", emoji: "🐟", basePrice: 320 },
  { nameBn: "ইলিশ মাছ", nameEn: "Hilsa Fish", category: "fish", unit: "kg", emoji: "🐟", basePrice: 1200 },
  { nameBn: "কাতলা মাছ", nameEn: "Katla Fish", category: "fish", unit: "kg", emoji: "🐟", basePrice: 350 },
  { nameBn: "পাঙাশ মাছ", nameEn: "Pangash Fish", category: "fish", unit: "kg", emoji: "🐟", basePrice: 220 },
  { nameBn: "তেলাপিয়া মাছ", nameEn: "Tilapia Fish", category: "fish", unit: "kg", emoji: "🐟", basePrice: 180 },
  { nameBn: "পাবদা মাছ", nameEn: "Pabda Fish", category: "fish", unit: "kg", emoji: "🐟", basePrice: 450 },
  { nameBn: "কৈ মাছ", nameEn: "Koi Fish", category: "fish", unit: "kg", emoji: "🐟", basePrice: 380 },
  { nameBn: "চিংড়ি মাছ", nameEn: "Shrimp", category: "fish", unit: "kg", emoji: "🦐", basePrice: 550 },
  { nameBn: "মাগুর মাছ", nameEn: "Magur Fish", category: "fish", unit: "kg", emoji: "🐟", basePrice: 480 },

  // Meat (মাংস)
  { nameBn: "গরুর মাংস", nameEn: "Beef", category: "meat", unit: "kg", emoji: "🥩", basePrice: 780 },
  { nameBn: "খাসির মাংস", nameEn: "Mutton", category: "meat", unit: "kg", emoji: "🍖", basePrice: 1450 },
  { nameBn: "মুরগির মাংস", nameEn: "Chicken", category: "meat", unit: "kg", emoji: "🍗", basePrice: 230 },
  { nameBn: "হাঁসের মাংস", nameEn: "Duck", category: "meat", unit: "kg", emoji: "🦆", basePrice: 480 },

  // Fruits (ফল)
  { nameBn: "আম", nameEn: "Mango", category: "fruit", unit: "kg", emoji: "🥭", basePrice: 180 },
  { nameBn: "কাঁঠাল", nameEn: "Jackfruit", category: "fruit", unit: "piece", emoji: "🍈", basePrice: 350 },
  { nameBn: "কলা", nameEn: "Banana", category: "fruit", unit: "dozen", emoji: "🍌", basePrice: 80 },
  { nameBn: "আপেল", nameEn: "Apple", category: "fruit", unit: "kg", emoji: "🍎", basePrice: 220 },
  { nameBn: "পেঁপে", nameEn: "Papaya", category: "fruit", unit: "kg", emoji: "🫓", basePrice: 50 },
  { nameBn: "তরমুজ", nameEn: "Watermelon", category: "fruit", unit: "piece", emoji: "🍉", basePrice: 250 },
  { nameBn: "মাল্টা", nameEn: "Orange", category: "fruit", unit: "kg", emoji: "🍊", basePrice: 200 },
  { nameBn: "লেবু", nameEn: "Lemon", category: "fruit", unit: "dozen", emoji: "🍋", basePrice: 60 },

  // Rice (চাল) & Lentils (ডাল)
  { nameBn: "মিনিকেট চাল", nameEn: "Minicate Rice", category: "rice", unit: "kg", emoji: "🍚", basePrice: 62 },
  { nameBn: "নাজিরশাইল চাল", nameEn: "Nazirshail Rice", category: "rice", unit: "kg", emoji: "🍚", basePrice: 75 },
  { nameBn: "বাসমতি চাল", nameEn: "Basmati Rice", category: "rice", unit: "kg", emoji: "🍚", basePrice: 110 },
  { nameBn: "মসুর ডাল", nameEn: "Lentils (Masur)", category: "lentil", unit: "kg", emoji: "🫘", basePrice: 110 },
  { nameBn: "মুগ ডাল", nameEn: "Mung Beans", category: "lentil", unit: "kg", emoji: "🫘", basePrice: 130 },
  { nameBn: "ছোলা", nameEn: "Chickpeas", category: "lentil", unit: "kg", emoji: "🫘", basePrice: 90 },

  // Oil & Spices (তেল ও মসলা)
  { nameBn: "সয়াবিন তেল", nameEn: "Soybean Oil", category: "oil", unit: "litre", emoji: "🫗", basePrice: 165 },
  { nameBn: "সরিষার তেল", nameEn: "Mustard Oil", category: "oil", unit: "litre", emoji: "🫗", basePrice: 280 },
  { nameBn: "হলুদ গুঁড়া", nameEn: "Turmeric Powder", category: "spice", unit: "kg", emoji: "🟡", basePrice: 320 },
  { nameBn: "জিরা", nameEn: "Cumin", category: "spice", unit: "kg", emoji: "🌱", basePrice: 580 },
  { nameBn: "ধনে", nameEn: "Coriander", category: "spice", unit: "kg", emoji: "🌱", basePrice: 240 },
  { nameBn: "লবণ", nameEn: "Salt", category: "spice", unit: "kg", emoji: "🧂", basePrice: 35 },
  { nameBn: "চিনি", nameEn: "Sugar", category: "spice", unit: "kg", emoji: "🍬", basePrice: 130 },
];

// Real Bangladesh kitchen markets across major districts
const MARKETS = [
  { nameBn: "কারওয়ান বাজার", nameEn: "Karwan Bazar", district: "Dhaka", upazila: "Dhaka South", priceFactor: 1.0 },
  { nameBn: "মিরপুর ১ নং বাজার", nameEn: "Mirpur Bazar", district: "Dhaka", upazila: "Mirpur", priceFactor: 1.05 },
  { nameBn: "মোহাম্মদপুর বাজার", nameEn: "Mohammadpur Bazar", district: "Dhaka", upazila: "Mohammadpur", priceFactor: 1.08 },
  { nameBn: "গুলশান বাজার", nameEn: "Gulshan Bazar", district: "Dhaka", upazila: "Gulshan", priceFactor: 1.2 },
  { nameBn: "জয়দেবপুর বাজার", nameEn: "Jaydevpur Bazar", district: "Gazipur", upazila: "Gazipur Sadar", priceFactor: 0.95 },
  { nameBn: "চট্টগ্রাম কদম মোবারক বাজার", nameEn: "Chattogram Kadam Mubarak", district: "Chattogram", upazila: "Chattogram Sadar", priceFactor: 1.02 },
  { nameBn: "কুমিল্লা নতুন বাজার", nameEn: "Comilla New Market", district: "Cumilla", upazila: "Cumilla Sadar", priceFactor: 0.9 },
  { nameBn: "সিলেট জিন্দাবাজার", nameEn: "Sylhet Zindabazar", district: "Sylhet", upazila: "Sylhet Sadar", priceFactor: 1.1 },
  { nameBn: "রাজশাহী সাহেব বাজার", nameEn: "Rajshahi Saheb Bazar", district: "Rajshahi", upazila: "Rajshahi Sadar", priceFactor: 0.92 },
  { nameBn: "খুলনা নিউ মার্কেট", nameEn: "Khulna New Market", district: "Khulna", upazila: "Khulna Sadar", priceFactor: 0.98 },
  { nameBn: "বরিশাল বাজার", nameEn: "Barishal Bazar", district: "Barishal", upazila: "Barishal Sadar", priceFactor: 0.94 },
];

const REPORTER_NAMES = [
  "রহিম মিয়া", "করিম উদ্দিন", "সালমা বেগম", "নাসির আহমেদ", "ফাতেমা খাতুন",
  "জাহাঙ্গীর আলম", "রফিকুল ইসলাম", "শাহানা পারভীন", "মোঃ আবুল", "মিনা আক্তার",
  "Anonymous", "Anonymous", "Anonymous",
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

async function main() {
  console.log("🧹 Clearing existing data...");
  await db.priceAlert.deleteMany();
  await db.priceReport.deleteMany();
  await db.item.deleteMany();
  await db.market.deleteMany();

  console.log("🌱 Seeding items...");
  const items = await Promise.all(
    ITEMS.map(({ basePrice, ...item }) => db.item.create({ data: item }))
  );
  console.log(`  ✓ Created ${items.length} items`);

  console.log("🏪 Seeding markets...");
  const markets = await Promise.all(
    MARKETS.map(({ priceFactor, ...m }) =>
      db.market.create({ data: m })
    )
  );
  console.log(`  ✓ Created ${markets.length} markets`);

  console.log("💰 Seeding 7-day price reports...");
  const now = new Date();
  let reportCount = 0;
  let seedCounter = 1;

  for (let itemIdx = 0; itemIdx < items.length; itemIdx++) {
    const item = items[itemIdx];
    const itemData = ITEMS[itemIdx];
    for (let marketIdx = 0; marketIdx < markets.length; marketIdx++) {
      const market = markets[marketIdx];
      const marketData = MARKETS[marketIdx];
      const basePrice = itemData.basePrice * marketData.priceFactor;

      // Generate 7 days of reports, 1-2 reports per day
      for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
        const reportDate = new Date(now);
        reportDate.setDate(now.getDate() - dayOffset);
        reportDate.setHours(7 + Math.floor(seededRandom(seedCounter) * 12), Math.floor(seededRandom(seedCounter + 1) * 60), 0, 0);

        // Random price fluctuation: ±8% daily + slight upward trend
        const trend = (6 - dayOffset) * 0.005; // slight upward trend over the week
        const fluctuation = (seededRandom(seedCounter + 2) - 0.5) * 0.16;
        const price = Math.round(basePrice * (1 + trend + fluctuation));

        const reportsPerDay = seededRandom(seedCounter + 3) > 0.6 ? 2 : 1;
        for (let r = 0; r < reportsPerDay; r++) {
          const reporterIdx = Math.floor(seededRandom(seedCounter + 4 + r) * REPORTER_NAMES.length);
          const slightVariation = (seededRandom(seedCounter + 5 + r) - 0.5) * 0.05;
          await db.priceReport.create({
            data: {
              itemId: item.id,
              marketId: market.id,
              price: Math.round(price * (1 + slightVariation)),
              reporterName: REPORTER_NAMES[reporterIdx],
              reportedAt: reportDate,
            },
          });
          reportCount++;
          seedCounter++;
        }
        seedCounter++;
      }
    }
  }
  console.log(`  ✓ Created ${reportCount} price reports`);

  console.log("\n🎉 Seed complete!");
  console.log(`   - ${items.length} items across ${[...new Set(ITEMS.map(i => i.category))].length} categories`);
  console.log(`   - ${markets.length} markets across ${[...new Set(MARKETS.map(m => m.district))].length} districts`);
  console.log(`   - ${reportCount} price reports (7 days of history)`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
