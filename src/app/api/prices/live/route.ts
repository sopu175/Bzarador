import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { refreshLivePrices } from "@/lib/live-prices";
import { getBangladeshDateBoundaries } from "@/lib/prices";

// GET /api/prices/live → return last refresh status + recent live reports
export async function GET() {
  const lastLog = await db.liveFetchLog.findFirst({
    orderBy: { startedAt: "desc" },
  });

  const { todayStart } = getBangladeshDateBoundaries();
  const todayLiveCount = await db.priceReport.count({
    where: { sourceName: { not: null }, reportedAt: { gte: todayStart } },
  });

  return NextResponse.json({
    lastRefresh: lastLog
      ? {
          id: lastLog.id,
          startedAt: lastLog.startedAt,
          finishedAt: lastLog.finishedAt,
          status: lastLog.status,
          itemsFetched: lastLog.itemsFetched,
          sourcesUsed: lastLog.sourcesUsed,
          error: lastLog.error,
        }
      : null,
    todayLiveReports: todayLiveCount,
  });
}

// POST /api/prices/live → trigger a full live-price refresh
export async function POST() {
  try {
    const result = await refreshLivePrices();
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
