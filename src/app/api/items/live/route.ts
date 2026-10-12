import { NextResponse } from "next/server";
import { refreshLivePriceForItem } from "@/lib/live-prices";

// POST /api/items/live?itemId=xxx → fetch a live price for one item
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId");
  if (!itemId) {
    return NextResponse.json({ ok: false, error: "itemId query param required" }, { status: 400 });
  }
  try {
    const result = await refreshLivePriceForItem(itemId);
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    const msg = (e as Error).message;
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
