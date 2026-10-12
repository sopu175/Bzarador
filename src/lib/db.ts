import { PrismaClient } from "@prisma/client";
import path from "node:path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Ensure SQLite database URL works seamlessly across local dev and Vercel serverless functions
function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL;
  if (!envUrl || envUrl.includes("Users/saif-dc")) {
    const absoluteDbPath = path.resolve(process.cwd(), "db/custom.db");
    return `file:${absoluteDbPath}`;
  }
  if (envUrl.startsWith("file:./") || envUrl.startsWith("file:../")) {
    const rel = envUrl.replace("file:", "");
    const absoluteDbPath = path.resolve(process.cwd(), rel);
    return `file:${absoluteDbPath}`;
  }
  return envUrl;
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;