"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Store,
  PackageSearch,
  Megaphone,
  LineChart,
  BellRing,
  ShoppingBasket,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquarePlus,
} from "lucide-react";
import { QueryProvider } from "@/components/query-provider";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { LanguageToggle } from "@/components/bazar/language-toggle";
import { TodayTab } from "@/components/bazar/today-tab";
import { MarketsTab } from "@/components/bazar/markets-tab";
import { ReportTab } from "@/components/bazar/report-tab";
import { TrendsTab } from "@/components/bazar/trends-tab";
import { AlertsTab } from "@/components/bazar/alerts-tab";
import { FeedbackTab } from "@/components/bazar/feedback-tab";
import { LiveUpdatePanel } from "@/components/bazar/live-update-panel";
import { LocationBar } from "@/components/bazar/location-bar";
import { HistoricalEconomicGraph } from "@/components/bazar/historical-economic-graph";
import { SidebarCommunityPanel } from "@/components/bazar/sidebar-community-panel";
import { useT, useTr, useNum, useLang } from "@/lib/i18n";
import { useLocationStore } from "@/lib/location-store";

export default function Home() {
  return (
    <QueryProvider>
      <SonnerToaster position="top-center" richColors />
      <AppShell />
    </QueryProvider>
  );
}

function AppShell() {
  const t = useT();
  const lang = useLang((s) => s.lang);

  return (
    <div className="min-h-screen flex flex-col market-bg">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Core interactive bazar commodities & user actions */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            <Hero />
            <LocationBar />
            <LiveUpdatePanel />
            <Tabs defaultValue="today" className="w-full">
              <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full h-auto p-1 rounded-2xl gap-1 bg-secondary/50">
                <TabsTrigger value="today" className="flex flex-col gap-1 py-2 text-xs sm:flex-row sm:text-xs">
                  <PackageSearch className="h-4 w-4" />
                  <span>{t("tabToday")}</span>
                </TabsTrigger>
                <TabsTrigger value="markets" className="flex flex-col gap-1 py-2 text-xs sm:flex-row sm:text-xs">
                  <Store className="h-4 w-4" />
                  <span>{t("tabMarkets")}</span>
                </TabsTrigger>
                <TabsTrigger value="report" className="flex flex-col gap-1 py-2 text-xs sm:flex-row sm:text-xs">
                  <Megaphone className="h-4 w-4" />
                  <span>{t("tabReport")}</span>
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex flex-col gap-1 py-2 text-xs sm:flex-row sm:text-xs">
                  <LineChart className="h-4 w-4" />
                  <span>{t("tabTrends")}</span>
                </TabsTrigger>
                <TabsTrigger value="alerts" className="flex flex-col gap-1 py-2 text-xs sm:flex-row sm:text-xs">
                  <BellRing className="h-4 w-4" />
                  <span>{t("tabAlerts")}</span>
                </TabsTrigger>
                <TabsTrigger value="feedback" className="flex flex-col gap-1 py-2 text-xs sm:flex-row sm:text-xs">
                  <MessageSquarePlus className="h-4 w-4" />
                  <span>{t("tabFeedback")}</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="today" className="mt-4">
                <TodayTab />
              </TabsContent>
              <TabsContent value="markets" className="mt-4">
                <MarketsTab />
              </TabsContent>
              <TabsContent value="report" className="mt-4">
                <ReportTab />
              </TabsContent>
              <TabsContent value="trends" className="mt-4">
                <TrendsTab />
              </TabsContent>
              <TabsContent value="alerts" className="mt-4">
                <AlertsTab />
              </TabsContent>
              <TabsContent value="feedback" className="mt-4">
                <FeedbackTab />
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column: 20-Year Historical Economic Benchmark & Community Live Feed */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-5 lg:sticky lg:top-20">
            <HistoricalEconomicGraph />
            <SidebarCommunityPanel />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const t = useT();
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shrink-0 shadow-sm border border-border/50">
            <img src="/logo.svg" alt="Bazar Dam Logo" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="font-bold leading-tight truncate">{t("appName")}</div>
            <div className="text-[10px] text-muted-foreground leading-tight truncate">
              {t("tagline")}
            </div>
          </div>
        </div>
        <LanguageToggle />
      </div>
    </header>
  );
}

function Hero() {
  const t = useT();
  const tr = useTr();
  const num = useNum();
  const lang = useLang((s) => s.lang);
  const { location } = useLocationStore();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const [items, markets, prices] = await Promise.all([
        fetch("/api/items").then((r) => r.json()),
        fetch("/api/markets").then((r) => r.json()),
        fetch("/api/prices").then((r) => r.json()),
      ]);
      return {
        itemCount: items.items.length as number,
        marketCount: markets.markets.length as number,
        districtCount: markets.districts.length as number,
        reportCount: (prices.prices as any[]).reduce((s, p) => s + p.reportCount, 0),
        gainers: (prices.prices as any[]).filter((p) => p.change > 0).length,
        losers: (prices.prices as any[]).filter((p) => p.change < 0).length,
      };
    },
    staleTime: 60_000,
  });

  return (
    <section className="space-y-4">
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/8 via-card to-accent/30">
        <CardContent className="p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-2.5 py-1 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {lang === "bn" ? "লাইভ" : "LIVE"}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              {location ? (
                <>
                  <span className="text-foreground font-medium">
                    {tr(location.marketNameBn, location.marketNameEn)}
                  </span>
                  <span>·</span>
                  <span>{location.district}</span>
                </>
              ) : (
                <span>{lang === "bn" ? "১১টি বাজার · সর্বশেষ আপডেট" : "11 markets · latest updates"}</span>
              )}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            {t("appName")} <span className="text-primary">🇧🇩</span>
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-md">
            {t("heroSubtitle")}
          </p>

          {/* Stats grid — each stat tile is clickable to its dedicated page */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            <StatTile
              href="/items"
              icon={<PackageSearch className="h-3.5 w-3.5" />}
              label={t("statItems")}
              value={isLoading ? null : num(stats?.itemCount ?? 0)}
              loading={isLoading}
            />
            <StatTile
              href="/markets"
              icon={<Store className="h-3.5 w-3.5" />}
              label={t("statMarkets")}
              value={isLoading ? null : num(stats?.marketCount ?? 0)}
              loading={isLoading}
            />
            <StatTile
              href="/reports"
              icon={<Megaphone className="h-3.5 w-3.5" />}
              label={t("statReports")}
              value={isLoading ? null : num(stats?.reportCount ?? 0)}
              loading={isLoading}
            />
            <StatTile
              href="/districts"
              icon={<Users className="h-3.5 w-3.5" />}
              label={t("statDistricts")}
              value={isLoading ? null : num(stats?.districtCount ?? 0)}
              loading={isLoading}
            />
          </div>

          {/* Gainers/losers summary */}
          {!isLoading && stats && (stats.gainers > 0 || stats.losers > 0) && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 px-2 py-0.5 font-medium">
                <TrendingUp className="h-3 w-3" />
                {num(stats.gainers)} {lang === "bn" ? "বেড়েছে" : "up"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 px-2 py-0.5 font-medium">
                <TrendingDown className="h-3 w-3" />
                {num(stats.losers)} {lang === "bn" ? "কমেছে" : "down"}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function StatTile({
  href,
  icon,
  label,
  value,
  loading,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string | null;
  loading?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl bg-background/70 hover:bg-background/95 hover:border-primary/50 transition-all backdrop-blur-sm border border-border/60 p-2 text-center cursor-pointer shadow-2xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0"
    >
      <div className="flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
        {icon}
      </div>
      <div className="mt-0.5 font-bold text-base sm:text-lg leading-none tabular-nums group-hover:text-primary transition-colors">
        {loading ? <Skeleton className="h-5 w-8 mx-auto" /> : value}
      </div>
      <div className="text-[9px] text-muted-foreground group-hover:text-foreground mt-0.5 truncate transition-colors font-medium">
        {label}
      </div>
    </Link>
  );
}

function Footer() {
  const t = useT();
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-5 text-center space-y-2.5">
        {/* Trusted News Portals Links & Full Sources List */}
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground/80">{t("sourceNews")}:</span>
          <a
            href="https://www.tbsnews.net"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors hover:underline"
          >
            The Business Standard (TBS)
          </a>
          <span>·</span>
          <a
            href="https://www.dhakatribune.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors hover:underline"
          >
            Dhaka Tribune
          </a>
          <span>·</span>
          <a
            href="https://www.thedailystar.net"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors hover:underline"
          >
            The Daily Star
          </a>
          <span>·</span>
          <a
            href="https://www.prothomalo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors hover:underline"
          >
            Prothom Alo
          </a>
          <span>·</span>
          <a
            href="https://www.jagonews24.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors hover:underline"
          >
            Jago News
          </a>
          <span>·</span>
          <a
            href="https://www.dhakapost.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors hover:underline"
          >
            Dhaka Post
          </a>
          <span>·</span>
          <Link
            href="/sources"
            className="font-semibold text-primary hover:underline bg-primary/10 px-2 py-0.5 rounded-md"
          >
            সকল ১২টি উৎস দেখুন →
          </Link>
        </div>

        {/* Legal & Informational Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground pt-1">
          <Link href="/faq" className="hover:text-primary transition-colors hover:underline">
            সাধারণ জিজ্ঞাসা (FAQ)
          </Link>
          <span>·</span>
          <Link href="/sources" className="hover:text-primary transition-colors hover:underline">
            উৎস ও সংগ্রহ পদ্ধতি (Sources)
          </Link>
          <span>·</span>
          <Link href="/privacy" className="hover:text-primary transition-colors hover:underline">
            গোপনীয়তা নীতি (Privacy)
          </Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-primary transition-colors hover:underline">
            শর্তাবলী (Terms)
          </Link>
          <span>·</span>
          <Link href="/reports" className="hover:text-primary transition-colors hover:underline">
            দাম রিপোর্ট তালিকা
          </Link>
        </div>

        {/* Developer Attribution with mailto */}
        <div className="pt-2 border-t border-border/40 flex items-center justify-center gap-2 text-xs">
          <a
            href="mailto:sopu175@gmail.com"
            className="font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            {t("developedBy")} (sopu175@gmail.com)
          </a>
        </div>
      </div>
    </footer>
  );
}
