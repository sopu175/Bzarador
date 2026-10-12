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
    const sizeMb = (fs.statSync(snapshotFile).size / (1024 * 1024)).toFixed(2);
    console.log(`[Backup] SQLite database file copied: ${snapshotFile} (${sizeMb} MB)`);
    console.log(`[Backup] Latest pointer updated: ${latestSnapshot}`);
  } else {
    console.warn(`[Backup] Warning: db/custom.db not found at ${dbFile}`);
  }

  // 2. Export JSON dump of all models
  console.log("[Backup] Exporting data tables to JSON...");
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

    console.log(`[Backup] JSON data dump saved: ${jsonFile}`);
    console.log(`[Backup] JSON latest pointer: ${latestJson}`);
    console.log("\nSummary of backed up records:");
    console.table(backupPayload.counts);
    console.log(`\n Database backup completed successfully!`);
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
