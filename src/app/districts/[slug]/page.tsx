import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { toSlug, districtNames } from "@/lib/slug";
import { QueryProvider } from "@/components/query-provider";
import { SiteHeader, SiteFooter } from "@/components/bazar/site-header-footer";
import { DistrictDetailClient } from "./district-client";

export const revalidate = 60;

export async function generateStaticParams() {
  const markets = await db.market.findMany({ select: { district: true } });
  const uniqueDistricts = Array.from(new Set(markets.map((m) => toSlug(m.district))));
  return uniqueDistricts.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const dMeta = districtNames[slug.toLowerCase()];
  const title = dMeta
    ? `${dMeta.bn} (${dMeta.en}) জেলার বাজার দর | বাজার দাম`
    : `${slug} জেলার বাজার দর | বাজার দাম`;
  return {
    title,
    description: `${dMeta ? dMeta.bn : slug} জেলার কাঁচাবাজারের আজকের দাম ও বাজার তালিকা।`,
  };
}

export default async function DistrictPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const allMarkets = await db.market.findMany({
    include: {
      _count: {
        select: { reports: true },
      },
    },
  });

  const matchingMarkets = allMarkets.filter((m) => toSlug(m.district) === slug);
  if (matchingMarkets.length === 0) notFound();

  const districtRaw = matchingMarkets[0].district;
  const dMeta = districtNames[slug.toLowerCase()] || { bn: districtRaw, en: districtRaw };

  return (
    <QueryProvider>
      <div className="min-h-screen flex flex-col market-bg">
        <SiteHeader />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 space-y-6">
          <DistrictDetailClient
            districtSlug={slug}
            districtNameBn={dMeta.bn}
            districtNameEn={dMeta.en}
            markets={matchingMarkets}
          />
        </main>
        <SiteFooter />
      </div>
    </QueryProvider>
  );
}
