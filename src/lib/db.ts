import { PrismaClient } from "@prisma/client";
import path from "node:path";
import fs from "node:fs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Universal SQLite Path Resolver for Next.js, Prisma, Local Machine, and Vercel Serverless
 *
 * Why this is needed:
 * 1. On Vercel Serverless functions (/var/task), the deployment filesystem is strictly READ-ONLY.
 *    Any SQLite write query (like INSERT, UPDATE, `prisma.liveFetchLog.create()`) fails with:
 *    "attempt to write a readonly database".
 * 2. In serverless runtime environments (detected by process.env.VERCEL), writable disk operations
 *    are only permitted in `/tmp`.
 * 3. Therefore, on Vercel, we copy the packaged initial `custom.db` into `/tmp/custom.db` if not already
 *    present, and point SQLite to `/tmp/custom.db`. This allows seamless reads AND writes!
 */
function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;

  // If a remote database (Postgres, Supabase, PlanetScale, etc.) is configured, pass as-is
  if (envUrl && !envUrl.startsWith("file:")) {
    return envUrl;
  }

  // Detect Vercel or AWS Lambda serverless environment
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (isServerless) {
    const tmpDbPath = path.join("/tmp", "custom.db");
    
    // Locate packaged read-only db file
    const sourceCandidates = [
      path.resolve(process.cwd(), "db/custom.db"),
      path.resolve(process.cwd(), "../db/custom.db"),
      path.resolve(__dirname, "../../../db/custom.db"),
      path.resolve(__dirname, "../../db/custom.db"),
    ];

    let foundSource: string | null = null;
    for (const src of sourceCandidates) {
      if (fs.existsSync(src)) {
        foundSource = src;
        break;
      }
    }

    // If tmp copy doesn't exist or is 0 bytes, copy from source
    try {
      if (foundSource && (!fs.existsSync(tmpDbPath) || fs.statSync(tmpDbPath).size === 0)) {
        fs.copyFileSync(foundSource, tmpDbPath);
        // Ensure read+write permissions
        fs.chmodSync(tmpDbPath, 0o666);
      }
      if (fs.existsSync(tmpDbPath)) {
        return `file:${tmpDbPath}`;
      }
    } catch (err) {
      console.warn("Could not copy sqlite database to /tmp:", err);
    }
  }

  // Local development / build step:
  const localCandidates = [
    path.resolve(process.cwd(), "db/custom.db"),
    path.resolve(process.cwd(), "../db/custom.db"),
    path.resolve(__dirname, "../../../db/custom.db"),
    path.resolve(__dirname, "../../db/custom.db"),
  ];

  for (const candidate of localCandidates) {
    if (fs.existsSync(candidate)) {
      return `file:${candidate}`;
    }
  }

  const fallback = path.resolve(process.cwd(), "db/custom.db");
  return `file:${fallback}`;
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: resolveDatabaseUrl(),
      },
    },
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;