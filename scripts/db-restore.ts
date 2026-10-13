import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

/**
 * Bazar-Dor Database Restore Utility
 * Restores either from:
 * 1. An exact SQLite file snapshot (default: custom-backup-latest.db or argument)
 * 2. Or from a JSON backup dump if --from-json is passed
 */

const prisma = new PrismaClient();

async function main() {
  const backupDir = path.resolve(process.cwd(), "db/backups");
  const targetDb = path.resolve(process.cwd(), "db/custom.db");

  const args = process.argv.slice(2);
  const jsonFlag = args.includes("--from-json");
  const specificFileArg = args.find((a) => !a.startsWith("--"));

  if (!fs.existsSync(backupDir)) {
    console.error(`[Restore] Error: Backup directory ${backupDir} does not exist.`);
    process.exit(1);
  }

  if (jsonFlag) {
    // Restore from JSON dump
    const jsonFile = specificFileArg
      ? path.resolve(backupDir, specificFileArg)
      : path.join(backupDir, "backup-latest.json");

    if (!fs.existsSync(jsonFile)) {
      console.error(`[Restore] Error: JSON backup file not found at ${jsonFile}`);
      process.exit(1);
    }

    const raw = fs.readFileSync(jsonFile, "utf-8");
    const payload = JSON.parse(raw);
    const { data } = payload;

    // Use transaction / sequential inserts
    await prisma.$transaction([
      prisma.priceReport.deleteMany(),
      prisma.priceAlert.deleteMany(),
      prisma.priceVote.deleteMany(),
      prisma.feedback.deleteMany(),
      prisma.liveFetchLog.deleteMany(),
      prisma.item.deleteMany(),
      prisma.market.deleteMany(),
    ]);

    console.log("[Restore] Inserting restored records...");
    if (data.items?.length) await prisma.item.createMany({ data: data.items });
    if (data.markets?.length) await prisma.market.createMany({ data: data.markets });
    if (data.priceReports?.length) {
      // Map ISO date strings back to Date objects if needed
      const mapped = data.priceReports.map((r: any) => ({
        ...r,
        reportedAt: new Date(r.reportedAt),
      }));
      await prisma.priceReport.createMany({ data: mapped });
    }
    if (data.priceAlerts?.length) {
      const mapped = data.priceAlerts.map((a: any) => ({
        ...a,
        createdAt: new Date(a.createdAt),
      }));
      await prisma.priceAlert.createMany({ data: mapped });
    }
    if (data.priceVotes?.length) {
      const mapped = data.priceVotes.map((v: any) => ({
        ...v,
        createdAt: new Date(v.createdAt),
      }));
      await prisma.priceVote.createMany({ data: mapped });
    }
    if (data.feedbacks?.length) {
      const mapped = data.feedbacks.map((f: any) => ({
        ...f,
        createdAt: new Date(f.createdAt),
      }));
      await prisma.feedback.createMany({ data: mapped });
    }
    if (data.liveFetchLogs?.length) {
      const mapped = data.liveFetchLogs.map((l: any) => ({
        ...l,
        startedAt: new Date(l.startedAt),
        finishedAt: l.finishedAt ? new Date(l.finishedAt) : null,
      }));
      await prisma.liveFetchLog.createMany({ data: mapped });
    }

    console.log(`\n Database restored successfully from JSON!`);
    await prisma.$disconnect();
    return;
  }

  // Restore from SQLite binary snapshot
  const snapshotFile = specificFileArg
    ? path.resolve(backupDir, specificFileArg)
    : path.join(backupDir, "custom-backup-latest.db");

  if (!fs.existsSync(snapshotFile)) {
    console.error(`[Restore] Error: Backup file not found at ${snapshotFile}`);
    process.exit(1);
  }

  // Backup current DB before overwriting (safety rollback)
  if (fs.existsSync(targetDb)) {
    const safetyCopy = path.join(backupDir, `pre-restore-safety-${Date.now()}.db`);
    fs.copyFileSync(targetDb, safetyCopy);
    console.log(`[Restore] Safety copy of current database saved to: ${safetyCopy}`);
  }

  fs.copyFileSync(snapshotFile, targetDb);
  console.log(`[Restore] Database successfully restored from: ${snapshotFile}`);
  console.log(`[Restore] Target database: ${targetDb}`);
}

main().catch((e) => {
  console.error("[Restore] Restore failed:", e);
  process.exit(1);
});
