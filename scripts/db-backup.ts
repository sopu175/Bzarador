import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

/**
 * Bazar-Dor Database Backup Utility
 * 1. Creates an exact binary snapshot of the SQLite database file
 * 2. Also exports a full JSON dump of all tables (Item, Market, PriceReport, PriceAlert, Feedback, PriceVote, LiveFetchLog)
 */

const prisma = new PrismaClient();

async function main() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.resolve(process.cwd(), "db/backups");

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // 1. Snapshot SQLite database file
  const dbFile = path.resolve(process.cwd(), "db/custom.db");
  const snapshotFile = path.join(backupDir, `custom-backup-${timestamp}.db`);
  const latestSnapshot = path.join(backupDir, `custom-backup-latest.db`);

  if (fs.existsSync(dbFile)) {
    fs.copyFileSync(dbFile, snapshotFile);
    fs.copyFileSync(dbFile, latestSnapshot);
  } else {
  }

  // 2. Export JSON dump of all models
  try {
    const [items, markets, priceReports, priceAlerts, feedbacks, priceVotes, liveFetchLogs] =
      await Promise.all([
        prisma.item.findMany(),
        prisma.market.findMany(),
        prisma.priceReport.findMany(),
        prisma.priceAlert.findMany(),
        prisma.feedback.findMany(),
        prisma.priceVote.findMany(),
        prisma.liveFetchLog.findMany(),
      ]);

    const backupPayload = {
      timestamp: new Date().toISOString(),
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
    };

    const jsonFile = path.join(backupDir, `backup-${timestamp}.json`);
    const latestJson = path.join(backupDir, `backup-latest.json`);

    fs.writeFileSync(jsonFile, JSON.stringify(backupPayload, null, 2), "utf-8");
    fs.writeFileSync(latestJson, JSON.stringify(backupPayload, null, 2), "utf-8");
  } catch (err) {
    console.error("[Backup] Error dumping JSON tables:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("Backup failed:", e);
  process.exit(1);
});
