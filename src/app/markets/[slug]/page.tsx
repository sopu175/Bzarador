import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { toSlug, districtNames } from "@/lib/slug";
import { getLatestPrices } from "@/lib/prices";
import { QueryProvider } from "@/components/query-provider";
import { SiteHeader, SiteFooter } from "@/components/bazar/site-header-footer";
import { MarketDetailClient } from "./market-client";

export const revalidate = 60;

export async function generateStaticParams() {
  const markets = await db.market.findMany({ select: { nameEn: true } });
  return markets.map((m) => ({ slug: toSlug(m.nameEn) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const markets = await db.market.findMany();
  const market = markets.find((m) => toSlug(m.nameEn) === slug);
  if (!market) return { title: "বাজার পাওয়া যায়নি | বাজার দাম" };
  return {
    title: `${market.nameBn} (${market.nameEn}) - আজকের বাজার দর ও পণ্যের তালিকা`,
    description: `${market.nameBn}, ${market.district}-এর আজকের কাঁচাবাজারের তাজা দর ও পণ্যের মূল্য তালিকা।`,
  };
}

export default async function MarketPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const markets = await db.market.findMany();
  const market = markets.find((m) => toSlug(m.nameEn) === slug);
  if (!market) notFound();

  const prices = await getLatestPrices(market.id);

  return (
    <QueryProvider>
      <div className="min-h-screen flex flex-col market-bg">
        <SiteHeader />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 space-y-6">
          <MarketDetailClient market={market} prices={prices} />
        </main>
        <SiteFooter />
      </div>
    </QueryProvider>
  );
}
