import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/markets - list all markets, optionally filtered by district
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const district = searchParams.get("district");

  const markets = await db.market.findMany({
    where: district ? { district } : undefined,
    orderBy: [{ district: "asc" }, { nameEn: "asc" }],
  });

  // Group by district
  const byDistrict: Record<string, typeof markets> = {};
  for (const m of markets) {
    if (!byDistrict[m.district]) byDistrict[m.district] = [];
    byDistrict[m.district].push(m);
  }

  return NextResponse.json({
    markets,
    byDistrict,
    districts: Object.keys(byDistrict).sort(),
  });
}
