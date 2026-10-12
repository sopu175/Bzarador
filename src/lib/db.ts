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
 * 1. In Prisma CLI (prisma/schema.prisma), relative paths like 'file:../db/custom.db' are relative to the schema directory (prisma/).
 * 2. In Next.js runtime (server components & API routes), process.cwd() is the root of the project.
 * 3. On Vercel serverless functions, SQLite files must be referenced via an absolute path so the engine doesn't look inside /var/task/prisma.
 */
function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;

  // If a remote database (Postgres, MySQL, etc.) is configured, pass as-is
  if (envUrl && !envUrl.startsWith("file:")) {
    return envUrl;
  }

  // Potential locations for custom.db
  const candidates = [
    path.resolve(process.cwd(), "db/custom.db"),
    path.resolve(process.cwd(), "../db/custom.db"),
    path.resolve(__dirname, "../../../db/custom.db"),
    path.resolve(__dirname, "../../db/custom.db"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return `file:${candidate}`;
    }
  }

  // Fallback to default relative to process.cwd()
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