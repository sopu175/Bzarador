import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { toSlug, districtNames } from "@/lib/slug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bazar-dor-bangladesh.vercel.app";
  const now = new Date();

  // Static high-priority pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/items`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/markets`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/districts`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/reports`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/sources`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Dynamic Item detail pages
  const items = await db.item.findMany({
    select: { nameEn: true, createdAt: true },
  });
  const itemRoutes: MetadataRoute.Sitemap = items.map((it) => ({
    url: `${baseUrl}/items/${toSlug(it.nameEn)}`,
    lastModified: now,
    changeFrequency: "hourly",
    priority: 0.85,
  }));

  // Dynamic Market detail pages
  const markets = await db.market.findMany({
    select: { nameEn: true, createdAt: true },
  });
  const marketRoutes: MetadataRoute.Sitemap = markets.map((m) => ({
    url: `${baseUrl}/markets/${toSlug(m.nameEn)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.75,
  }));

  // Dynamic District pages
  const districtRoutes: MetadataRoute.Sitemap = Object.keys(districtNames).map((slug) => ({
    url: `${baseUrl}/districts/${slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [...staticRoutes, ...itemRoutes, ...marketRoutes, ...districtRoutes];
}
