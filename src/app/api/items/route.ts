import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/items - list all items, optionally filtered by category
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  const items = await db.item.findMany({
    where: category ? { category } : undefined,
    orderBy: [{ category: "asc" }, { nameEn: "asc" }],
  });

  // Group by category for convenience
  const byCategory: Record<string, typeof items> = {};
  for (const item of items) {
    if (!byCategory[item.category]) byCategory[item.category] = [];
    byCategory[item.category].push(item);
  }

  return NextResponse.json({
    items,
    byCategory,
    categories: Object.keys(byCategory).sort(),
  });
}
