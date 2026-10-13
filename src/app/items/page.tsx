import Link from "next/link";
import { db } from "@/lib/db";
import { toSlug, districtNames } from "@/lib/slug";
import { QueryProvider } from "@/components/query-provider";
import { SiteHeader, SiteFooter } from "@/components/bazar/site-header-footer";
import { ItemsListClient } from "./items-client";

export const revalidate = 60;

export const metadata = {
  title: "সকল ৫৪টি পণ্যের তালিকা ও আজকের দর | বাজার দাম",
  description:
    "বাজার দাম-এ তালিকাভুক্ত সকল ৫৪টি শাকসবজি, মাছ, মাংস, চাল, ডাল ও নিত্যপণ্যের বাজার দর ও বিস্তারিত তথ্য।",
};

export default async function ItemsIndexPage() {
  const items = await db.item.findMany({
    orderBy: { category: "asc" },
  });

  return (
    <QueryProvider>
      <div className="min-h-screen flex flex-col market-bg">
        <SiteHeader />
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-6 space-y-6">
          <ItemsListClient items={items} />
        </main>
        <SiteFooter />
      </div>
    </QueryProvider>
  );
}
