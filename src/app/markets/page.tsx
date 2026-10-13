import Link from "next/link";
import { db } from "@/lib/db";
import { toSlug, districtNames } from "@/lib/slug";
import { QueryProvider } from "@/components/query-provider";
import { SiteHeader, SiteFooter } from "@/components/bazar/site-header-footer";
import { MarketsListClient } from "./markets-client";

export const revalidate = 60;

export const metadata = {
  title: "সকল ১১টি কাঁচাবাজারের তালিকা ও জেলাভিত্তিক দর | বাজার দাম",
  description:
    "ঢাকা, চট্টগ্রাম, সিলেট, রাজশাহী, বরিশাল সহ সকল ১১টি সক্রিয় কাঁচাবাজারের তালিকা ও বর্তমান বাজার দর।",
};

export default async function MarketsIndexPage() {
  const markets = await db.market.findMany({
    include: {
      _count: {
        select: { reports: true },
      },
    },
    orderBy: { district: "asc" },
  });

  return (
    <QueryProvider>
      <div className="min-h-screen flex flex-col market-bg">
        <SiteHeader />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 space-y-6">
          <MarketsListClient markets={markets} />
        </main>
        <SiteFooter />
      </div>
    </QueryProvider>
  );
}
