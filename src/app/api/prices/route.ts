import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getLatestPrices, getPriceTrend } from "@/lib/prices";

// GET /api/prices
//   ?marketId=xxx          -> latest prices at one market
//   ?trend=1&itemId=xxx    -> 7-day trend for an item (optionally at a market)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const marketId = searchParams.get("marketId") || undefined;
  const trend = searchParams.get("trend");
  const itemId = searchParams.get("itemId") || undefined;

  if (trend === "1" && itemId) {
    const days = await getPriceTrend(itemId, marketId || undefined);
    const item = await db.item.findUnique({ where: { id: itemId } });
    return NextResponse.json({ item, days });
  }

  const prices = await getLatestPrices(marketId || undefined);
  return NextResponse.json({ prices });
}

const reportSchema = z.object({
  itemId: z.string().min(1),
  marketId: z.string().min(1),
  price: z.number().positive().max(100000),
  reporterName: z.string().min(1).max(80).optional().default("Anonymous"),
  reporterPhone: z.string().max(20).optional().nullable(),
});

// POST /api/prices - submit a new price report
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = reportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { itemId, marketId, price, reporterName, reporterPhone } = parsed.data;

  // Verify item & market exist
  const [item, market] = await Promise.all([
    db.item.findUnique({ where: { id: itemId } }),
    db.market.findUnique({ where: { id: marketId } }),
  ]);
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
  if (!market) return NextResponse.json({ error: "Market not found" }, { status: 404 });

  const report = await db.priceReport.create({
    data: {
      itemId,
      marketId,
      price,
      reporterName,
      reporterPhone: reporterPhone ?? null,
    },
    include: { item: true, market: true },
  });

  return NextResponse.json({ report }, { status: 201 });
}
