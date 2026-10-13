import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const voteSchema = z.object({
  itemId: z.string().min(1),
  voteType: z.enum(["accurate", "high", "cheap"]),
});

// GET /api/votes?itemId=xxx -> return counts for accurate, high, cheap
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId");

  if (itemId) {
    const [accurate, high, cheap] = await Promise.all([
      db.priceVote.count({ where: { itemId, voteType: "accurate" } }),
      db.priceVote.count({ where: { itemId, voteType: "high" } }),
      db.priceVote.count({ where: { itemId, voteType: "cheap" } }),
    ]);
    return NextResponse.json({ accurate, high, cheap, total: accurate + high + cheap });
  }

  // Global vote summary across items
  const votes = await db.priceVote.groupBy({
    by: ["itemId", "voteType"],
    _count: { voteType: true },
  });

  return NextResponse.json({ votes });
}

// POST /api/votes -> submit an accuracy vote for an item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = voteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid vote payload" }, { status: 400 });
    }

    const { itemId, voteType } = parsed.data;
    const item = await db.item.findUnique({ where: { id: itemId } });
    if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    const vote = await db.priceVote.create({
      data: {
        itemId,
        voteType,
      },
    });

    // Return updated totals
    const [accurate, high, cheap] = await Promise.all([
      db.priceVote.count({ where: { itemId, voteType: "accurate" } }),
      db.priceVote.count({ where: { itemId, voteType: "high" } }),
      db.priceVote.count({ where: { itemId, voteType: "cheap" } }),
    ]);

    return NextResponse.json({
      ok: true,
      vote,
      stats: { accurate, high, cheap, total: accurate + high + cheap },
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to record vote" }, { status: 500 });
  }
}
