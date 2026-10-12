import { db } from "@/lib/db";

// Get latest price for each item at a market (or across all markets)
// Returns Map-like structure: itemId -> { price, change, changePct, reportCount }
export async function getLatestPrices(marketId?: string) {
  const since7Days = new Date();
  since7Days.setDate(since7Days.getDate() - 7);

  const where = marketId
    ? { marketId, reportedAt: { gte: since7Days } }
    : { reportedAt: { gte: since7Days } };

  const reports = await db.priceReport.findMany({
    where,
    include: { item: true, market: true },
    orderBy: { reportedAt: "desc" },
  });

  // Group by itemId
  const byItem = new Map<string, {
    item: typeof reports[number]["item"];
    todayReports: typeof reports;
    yesterdayReports: typeof reports;
    weekReports: typeof reports;
  }>();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  for (const r of reports) {
    const entry = byItem.get(r.itemId) ?? {
      item: r.item,
      todayReports: [],
      yesterdayReports: [],
      weekReports: [],
    };
    entry.weekReports.push(r);
    if (r.reportedAt >= todayStart) entry.todayReports.push(r);
    else if (r.reportedAt >= yesterdayStart) entry.yesterdayReports.push(r);
    byItem.set(r.itemId, entry);
  }

  const result: Array<{
    item: { id: string; nameBn: string; nameEn: string; category: string; unit: string; emoji: string };
    avgToday: number | null;
    avgYesterday: number | null;
    change: number;
    changePct: number;
    reportCount: number;
  }> = [];

  for (const [, entry] of byItem) {
    const avgToday = entry.todayReports.length
      ? entry.todayReports.reduce((s, r) => s + r.price, 0) / entry.todayReports.length
      : null;
    const avgYesterday = entry.yesterdayReports.length
      ? entry.yesterdayReports.reduce((s, r) => s + r.price, 0) / entry.yesterdayReports.length
      : null;

    const change = avgToday != null && avgYesterday != null ? avgToday - avgYesterday : 0;
    const changePct = avgToday != null && avgYesterday != null && avgYesterday > 0
      ? (change / avgYesterday) * 100
      : 0;

    result.push({
      item: entry.item,
      avgToday: avgToday != null ? Math.round(avgToday) : null,
      avgYesterday: avgYesterday != null ? Math.round(avgYesterday) : null,
      change: Math.round(change),
      changePct: Math.round(changePct * 10) / 10,
      reportCount: entry.todayReports.length,
    });
  }

  // Sort by report count desc (most active first)
  result.sort((a, b) => b.reportCount - a.reportCount);
  return result;
}

// Get 7-day daily average price for an item at a market (or all markets)
export async function getPriceTrend(itemId: string, marketId?: string) {
  const since7Days = new Date();
  since7Days.setHours(0, 0, 0, 0);
  since7Days.setDate(since7Days.getDate() - 6); // 7 days including today

  const where: { itemId: string; reportedAt: { gte: Date }; marketId?: string } = {
    itemId,
    reportedAt: { gte: since7Days },
  };
  if (marketId) where.marketId = marketId;

  const reports = await db.priceReport.findMany({
    where,
    include: { market: true },
    orderBy: { reportedAt: "asc" },
  });

  // Group by day (YYYY-MM-DD)
  const byDay = new Map<string, { prices: number[]; markets: Set<string> }>();
  for (const r of reports) {
    const dayKey = r.reportedAt.toISOString().slice(0, 10);
    const entry = byDay.get(dayKey) ?? { prices: [], markets: new Set() };
    entry.prices.push(r.price);
    entry.markets.add(r.market.nameBn);
    byDay.set(dayKey, entry);
  }

  const days: Array<{ date: string; avg: number; min: number; max: number; count: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const entry = byDay.get(key);
    if (entry) {
      const avg = entry.prices.reduce((s, p) => s + p, 0) / entry.prices.length;
      days.push({
        date: key,
        avg: Math.round(avg),
        min: Math.min(...entry.prices),
        max: Math.max(...entry.prices),
        count: entry.prices.length,
      });
    } else {
      days.push({ date: key, avg: 0, min: 0, max: 0, count: 0 });
    }
  }
  return days;
}
