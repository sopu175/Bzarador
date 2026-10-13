import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/db-export?secret=...
// Exports full database payload in JSON format (can be imported into local SQLite)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const authHeader = request.headers.get("authorization");

  const expectedSecret =
    process.env.SYNC_SECRET || process.env.CRON_SECRET || "bazar-dor-sync-2026";

  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const provided = secret || bearerToken;

  if (provided !== expectedSecret) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or missing sync secret" },
      { status: 401 }
    );
  }

  try {
    const [items, markets, priceReports, priceAlerts, feedbacks, priceVotes, liveFetchLogs] =
      await Promise.all([
        db.item.findMany(),
        db.market.findMany(),
        db.priceReport.findMany({ orderBy: { reportedAt: "desc" } }),
        db.priceAlert.findMany(),
        db.feedback.findMany(),
        db.priceVote.findMany(),
        db.liveFetchLog.findMany({ orderBy: { startedAt: "desc" }, take: 100 }),
      ]);

    return NextResponse.json({
      exportedAt: new Date().toISOString(),
      counts: {
        items: items.length,
        markets: markets.length,
        priceReports: priceReports.length,
        priceAlerts: priceAlerts.length,
        feedbacks: feedbacks.length,
        priceVotes: priceVotes.length,
        liveFetchLogs: liveFetchLogs.length,
      },
      data: {
        items,
        markets,
        priceReports,
        priceAlerts,
        feedbacks,
        priceVotes,
        liveFetchLogs,
      },
    });
  } catch (error) {
    const msg = (error as Error).message;
    return NextResponse.json({ error: "Export failed", details: msg }, { status: 500 });
  }
}
