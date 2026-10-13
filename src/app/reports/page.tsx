import { db } from "@/lib/db";
import { QueryProvider } from "@/components/query-provider";
import { SiteHeader, SiteFooter } from "@/components/bazar/site-header-footer";
import { ReportsListClient } from "./reports-client";

export const revalidate = 30;

export const metadata = {
  title: "লাইভ দাম রিপোর্ট ও বাজার আপডেট | বাজার দাম",
  description: "দেশজুড়ে সাধারণ ক্রেতা ও অনলাইন সোর্স থেকে আসা রিয়েল-টাইম বাজার দাম রিপোর্ট সমূহ।",
};

export default async function ReportsIndexPage() {
  const [totalReports, markets, items] = await Promise.all([
    db.priceReport.count(),
    db.market.findMany({ orderBy: { nameBn: "asc" } }),
    db.item.findMany({ orderBy: { nameBn: "asc" } }),
  ]);

  return (
    <QueryProvider>
      <div className="min-h-screen flex flex-col market-bg">
        <SiteHeader />
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6 space-y-6">
          <ReportsListClient totalCount={totalReports} markets={markets} items={items} />
        </main>
        <SiteFooter />
      </div>
    </QueryProvider>
  );
}
