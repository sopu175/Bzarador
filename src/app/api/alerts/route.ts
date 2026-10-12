import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

// GET /api/alerts - list alerts (optionally filter by phone)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");

  const alerts = await db.priceAlert.findMany({
    where: phone ? { phone } : undefined,
    include: { item: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ alerts });
}

const alertSchema = z.object({
  itemId: z.string().min(1),
  marketId: z.string().optional().nullable(),
  targetPrice: z.number().positive().max(100000),
  direction: z.enum(["below", "above"]),
  phone: z.string().min(6).max(20),
});

// POST /api/alerts - create a new price alert
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = alertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { itemId, marketId, targetPrice, direction, phone } = parsed.data;

  const item = await db.item.findUnique({ where: { id: itemId } });
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  const alert = await db.priceAlert.create({
    data: {
      itemId,
      marketId: marketId || null,
      targetPrice,
      direction,
      phone,
    },
    include: { item: true },
  });

  return NextResponse.json({ alert }, { status: 201 });
}
