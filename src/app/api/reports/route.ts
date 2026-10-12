import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/reports?page=1&limit=30&marketId=xxx&itemId=xxx
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(10, parseInt(searchParams.get("limit") || "30", 10)));
  const marketId = searchParams.get("marketId") || undefined;
  const itemId = searchParams.get("itemId") || undefined;
  const source = searchParams.get("source"); // 'live' | 'user' | undefined

  const where: any = {};
  if (marketId) where.marketId = marketId;
  if (itemId) where.itemId = itemId;
  if (source === "live") where.sourceName = { not: null };
  else if (source === "user") where.sourceName = null;

  const [total, reports] = await Promise.all([
    db.priceReport.count({ where }),
    db.priceReport.findMany({
      where,
      include: {
        item: true,
        market: true,
      },
      orderBy: { reportedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    reports,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
