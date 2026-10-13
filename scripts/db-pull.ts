import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

/**
 * Bazar-Dor: Pull Database from Vercel to Local
 * 
 * Usage:
 *   bun run db:pull
 *   bun run scripts/db-pull.ts --url https://bazar-dor-bangladesh.vercel.app --secret <your-secret>
 */

const prisma = new PrismaClient();

async function main() {
  const args = process.argv.slice(2);

  // Parse CLI args or fallback to environment variables
  const urlArgIndex = args.indexOf("--url");
  const secretArgIndex = args.indexOf("--secret");

  const remoteUrl =
    (urlArgIndex !== -1 ? args[urlArgIndex + 1] : null) ||
    process.env.REMOTE_APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://bazar-dor-bangladesh.vercel.app";

  const secret =
    (secretArgIndex !== -1 ? args[secretArgIndex + 1] : null) ||
    process.env.SYNC_SECRET ||
    process.env.CRON_SECRET ||
    "bazar-dor-sync-2026";

  const cleanUrl = remoteUrl.replace(/\/+$/, "");
  const exportEndpoint = `${cleanUrl}/api/admin/db-export?secret=${encodeURIComponent(secret)}`;

  console.log(`\n======================================================`);
  console.log(`  Bazar-Dor: Pulling database from Vercel to Local`);
  console.log(`======================================================`);
  console.log(`[Pull] Remote URL: ${cleanUrl}`);
  console.log(`[Pull] Fetching database dump from Vercel...`);

  const startTime = Date.now();
  let res: Response;
  try {
    res = await fetch(exportEndpoint, {
      headers: {
        "Accept": "application/json",
      },
    });
  } catch (err) {
    console.error(`[Pull] Failed to connect to ${cleanUrl}:`, (err as Error).message);
    process.exit(1);
  }

  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[Pull] Error from Vercel server (status ${res.status}): ${errorText}`);
    console.error(`\nPlease ensure SYNC_SECRET matches your Vercel Environment Variables or pass:`);
    console.error(`  bun run db:pull --secret <YOUR_SECRET>`);
    process.exit(1);
  }

  const payload = await res.json();
  const { data, counts, exportedAt } = payload;

  if (!data) {
    console.error(`[Pull] Invalid payload received from server.`);
    process.exit(1);
  }

  console.log(`[Pull] Downloaded successfully in ${Date.now() - startTime}ms!`);
  console.log(`[Pull] Export timestamp: ${exportedAt}`);
  console.log(`[Pull] Remote record counts:`, counts);

  // 1. Create backup of current local database before replacing
  const backupDir = path.resolve(process.cwd(), "db/backups");
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const localDb = path.resolve(process.cwd(), "db/custom.db");
  if (fs.existsSync(localDb)) {
    const backupName = `custom.pre-pull-${Date.now()}.db`;
    fs.copyFileSync(localDb, path.join(backupDir, backupName));
    console.log(`[Pull] Current local database backed up to db/backups/${backupName}`);
  }

  // Also save the downloaded JSON snapshot
  const jsonBackupFile = path.join(backupDir, `vercel-pull-latest.json`);
  fs.writeFileSync(jsonBackupFile, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`[Pull] Downloaded JSON snapshot saved to db/backups/vercel-pull-latest.json`);

  // 2. Insert records into local database
  console.log(`\n[Pull] Updating local SQLite database...`);

  // Truncate tables cleanly in order of foreign key dependencies
  await prisma.$transaction([
    prisma.priceReport.deleteMany(),
    prisma.priceAlert.deleteMany(),
    prisma.priceVote.deleteMany(),
    prisma.feedback.deleteMany(),
    prisma.liveFetchLog.deleteMany(),
    prisma.item.deleteMany(),
    prisma.market.deleteMany(),
  ]);

  if (data.items?.length) {
    const mapped = data.items.map((it: any) => ({
      ...it,
      createdAt: it.createdAt ? new Date(it.createdAt) : new Date(),
    }));
    await prisma.item.createMany({ data: mapped });
    console.log(`  ✓ Restored ${mapped.length} Items`);
  }

  if (data.markets?.length) {
    const mapped = data.markets.map((m: any) => ({
      ...m,
      createdAt: m.createdAt ? new Date(m.createdAt) : new Date(),
    }));
    await prisma.market.createMany({ data: mapped });
    console.log(`  ✓ Restored ${mapped.length} Markets`);
  }

  if (data.priceReports?.length) {
    // Insert in batches of 500 for SQLite performance
    const mapped = data.priceReports.map((r: any) => ({
      ...r,
      reportedAt: r.reportedAt ? new Date(r.reportedAt) : new Date(),
    }));
    const chunkSize = 500;
    for (let i = 0; i < mapped.length; i += chunkSize) {
      const chunk = mapped.slice(i, i + chunkSize);
      await prisma.priceReport.createMany({ data: chunk });
    }
    console.log(`  ✓ Restored ${mapped.length} Price Reports`);
  }

  if (data.priceAlerts?.length) {
    const mapped = data.priceAlerts.map((a: any) => ({
      ...a,
      createdAt: a.createdAt ? new Date(a.createdAt) : new Date(),
    }));
    await prisma.priceAlert.createMany({ data: mapped });
    console.log(`  ✓ Restored ${mapped.length} Price Alerts`);
  }

  if (data.feedbacks?.length) {
    const mapped = data.feedbacks.map((f: any) => ({
      ...f,
      createdAt: f.createdAt ? new Date(f.createdAt) : new Date(),
    }));
    await prisma.feedback.createMany({ data: mapped });
    console.log(`  ✓ Restored ${mapped.length} Feedback Messages`);
  }

  if (data.priceVotes?.length) {
    const mapped = data.priceVotes.map((v: any) => ({
      ...v,
      createdAt: v.createdAt ? new Date(v.createdAt) : new Date(),
    }));
    await prisma.priceVote.createMany({ data: mapped });
    console.log(`  ✓ Restored ${mapped.length} Price Votes`);
  }

  if (data.liveFetchLogs?.length) {
    const mapped = data.liveFetchLogs.map((l: any) => ({
      ...l,
      startedAt: l.startedAt ? new Date(l.startedAt) : new Date(),
      finishedAt: l.finishedAt ? new Date(l.finishedAt) : null,
    }));
    await prisma.liveFetchLog.createMany({ data: mapped });
    console.log(`  ✓ Restored ${mapped.length} Live Fetch Logs`);
  }

  console.log(`\n======================================================`);
  console.log(`  🎉 Local database successfully synced from Vercel!`);
  console.log(`======================================================\n`);
  process.exit(0);
}

main()
  .catch((e) => {
    console.error("[Pull] Error syncing database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
