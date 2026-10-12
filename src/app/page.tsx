"use client";

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
import { LiveUpdatePanel } from "@/components/bazar/live-update-panel";
import { useT, useNum, useLang } from "@/lib/i18n";

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
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-5 space-y-5">
        <Hero />
        <LiveUpdatePanel />
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid grid-cols-5 w-full h-auto p-1 rounded-2xl">
            <TabsTrigger value="today" className="flex flex-col gap-1 py-2 text-xs sm:flex-row sm:text-sm">
              <PackageSearch className="h-4 w-4" />
              <span>{t("tabToday")}</span>
            </TabsTrigger>
            <TabsTrigger value="markets" className="flex flex-col gap-1 py-2 text-xs sm:flex-row sm:text-sm">
              <Store className="h-4 w-4" />
              <span>{t("tabMarkets")}</span>
            </TabsTrigger>
            <TabsTrigger value="report" className="flex flex-col gap-1 py-2 text-xs sm:flex-row sm:text-sm">
              <Megaphone className="h-4 w-4" />
              <span>{t("tabReport")}</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex flex-col gap-1 py-2 text-xs sm:flex-row sm:text-sm">
              <LineChart className="h-4 w-4" />
              <span>{t("tabTrends")}</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex flex-col gap-1 py-2 text-xs sm:flex-row sm:text-sm">
              <BellRing className="h-4 w-4" />
              <span>{t("tabAlerts")}</span>
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
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  const t = useT();
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shrink-0">
            <ShoppingBasket className="h-5 w-5" />
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
  const num = useNum();
  const lang = useLang((s) => s.lang);

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
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-2.5 py-1 text-xs font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {lang === "bn" ? "লাইভ" : "LIVE"}
            </span>
            <span className="text-xs text-muted-foreground">
              {lang === "bn" ? "১১টি বাজার · সর্বশেষ আপডেট" : "11 markets · latest updates"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
            {t("appName")} <span className="text-primary">🇧🇩</span>
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-md">
            {t("heroSubtitle")}
          </p>

          {/* Stats grid */}
          <div className="mt-4 grid grid-cols-4 gap-2">
            <StatTile
              icon={<PackageSearch className="h-3.5 w-3.5" />}
              label={t("statItems")}
              value={isLoading ? null : num(stats?.itemCount ?? 0)}
              loading={isLoading}
            />
            <StatTile
              icon={<Store className="h-3.5 w-3.5" />}
              label={t("statMarkets")}
              value={isLoading ? null : num(stats?.marketCount ?? 0)}
              loading={isLoading}
            />
            <StatTile
              icon={<Megaphone className="h-3.5 w-3.5" />}
              label={t("statReports")}
              value={isLoading ? null : num(stats?.reportCount ?? 0)}
              loading={isLoading}
            />
            <StatTile
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
  icon,
  label,
  value,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  loading?: boolean;
}) {
  return (
    <div className="rounded-xl bg-background/70 backdrop-blur-sm border border-border/60 p-2 text-center">
      <div className="flex items-center justify-center text-muted-foreground">{icon}</div>
      <div className="mt-0.5 font-bold text-base sm:text-lg leading-none tabular-nums">
        {loading ? <Skeleton className="h-5 w-8 mx-auto" /> : value}
      </div>
      <div className="text-[9px] text-muted-foreground mt-0.5 truncate">{label}</div>
    </div>
  );
}

function Footer() {
  const t = useT();
  const lang = useLang((s) => s.lang);
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/60 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 py-4 text-center">
        <p className="text-xs text-muted-foreground">{t("footerText")}</p>
        <p className="text-[10px] text-muted-foreground/70 mt-1">{t("footerMadeWith")}</p>
      </div>
    </footer>
  );
}
