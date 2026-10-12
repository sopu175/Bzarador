import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { toSlug, districtNames } from "@/lib/slug";
import { getItemMarketDetails, getPriceTrend } from "@/lib/prices";
import { QueryProvider } from "@/components/query-provider";
import { SiteHeader, SiteFooter } from "@/components/bazar/site-header-footer";
import { ItemDetailClient } from "./item-client";

export const revalidate = 60;

export async function generateStaticParams() {
  const items = await db.item.findMany({ select: { nameEn: true } });
  return items.map((it) => ({ slug: toSlug(it.nameEn) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const items = await db.item.findMany();
  const item = items.find((it) => toSlug(it.nameEn) === slug);
  if (!item) return { title: "পণ্য পাওয়া যায়নি | বাজার দাম" };
  return {
    title: `${item.nameBn} (${item.nameEn}) - আজকের বাজার দর ও ১১টি বাজারের বিশ্লেষণ`,
    description: `${item.nameBn}-এর আজকের খুচরা ও পাইকারি বাজার দর, সর্বনিম্ন ও সর্বোচ্চ দাম এবং ৭ দিন/৩০ দিনের ট্রেন্ড গ্রাফ।`,
  };
}

export default async function ItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const items = await db.item.findMany();
  const item = items.find((it) => toSlug(it.nameEn) === slug);
  if (!item) notFound();

  const details = await getItemMarketDetails(item.id);
  const trend7d = await getPriceTrend(item.id, undefined, "7d");
  const trend30d = await getPriceTrend(item.id, undefined, "30d");
  const trend1y = await getPriceTrend(item.id, undefined, "1y");

  return (
    <QueryProvider>
      <div className="min-h-screen flex flex-col market-bg">
        <SiteHeader />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 space-y-6">
          <ItemDetailClient
            item={item}
            details={details}
            trends={{ "7d": trend7d, "30d": trend30d, "1y": trend1y }}
          />
        </main>
        <SiteFooter />
      </div>
    </QueryProvider>
  );
}
