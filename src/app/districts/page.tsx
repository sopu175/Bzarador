import Link from "next/link";
import { db } from "@/lib/db";
import { toSlug, districtNames } from "@/lib/slug";
import { QueryProvider } from "@/components/query-provider";
import { SiteHeader, SiteFooter } from "@/components/bazar/site-header-footer";
import { DistrictsListClient } from "./districts-client";

export const revalidate = 60;

export const metadata = {
  title: "সকল ৮টি জেলার তালিকা ও বাজার সমূহ | বাজার দাম",
  description:
    "ঢাকা, চট্টগ্রাম, সিলেট, রাজশাহী, বরিশাল, খুলনা, কুমিল্লা, গাজীপুর জেলাভিত্তিক বাজার ও নিত্যপণ্যের দাম।",
};

export default async function DistrictsIndexPage() {
  const markets = await db.market.findMany({
    include: {
      _count: {
        select: { reports: true },
      },
    },
  });

  // Group by district
  const districtMap = new Map<string, { district: string; markets: typeof markets }>();
  for (const m of markets) {
    const entry = districtMap.get(m.district) ?? { district: m.district, markets: [] };
    entry.markets.push(m);
    districtMap.set(m.district, entry);
  }

  const districtList = Array.from(districtMap.values()).map((d) => {
    const slug = toSlug(d.district);
    const dMeta = districtNames[slug.toLowerCase()] || { bn: d.district, en: d.district };
    const totalReports = d.markets.reduce((acc, m) => acc + (m._count?.reports ?? 0), 0);
    return {
      district: d.district,
      slug,
      nameBn: dMeta.bn,
      nameEn: dMeta.en,
      marketCount: d.markets.length,
      reportCount: totalReports,
    };
  });

  return (
    <QueryProvider>
      <div className="min-h-screen flex flex-col market-bg">
        <SiteHeader />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 space-y-6">
          <DistrictsListClient districts={districtList} />
        </main>
        <SiteFooter />
      </div>
    </QueryProvider>
  );
}
