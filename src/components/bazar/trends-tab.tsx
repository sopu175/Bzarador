"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { Activity, TrendingUp, TrendingDown, ArrowUpDown, Globe, Loader2 } from "lucide-react";
import { useT, useTr, useTCat, useNum, useLang, useTUnit } from "@/lib/i18n";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceAccuracyVoting } from "./price-accuracy-voting";
import { HistoricalEconomicGraph } from "./historical-economic-graph";

type Item = {
  id: string;
  nameBn: string;
  nameEn: string;
  category: string;
  unit: string;
  emoji: string;
};
type Market = {
  id: string;
  nameBn: string;
  nameEn: string;
  district: string;
  upazila: string;
};
type Day = { date: string; avg: number; min: number; max: number; count: number };

async function fetchItems(): Promise<{ byCategory: Record<string, Item[]>; categories: string[] }> {
  const res = await fetch("/api/items");
  if (!res.ok) throw new Error("Failed to load items");
  return res.json();
}
async function fetchMarkets(): Promise<{ markets: Market[] }> {
  const res = await fetch("/api/markets");
  if (!res.ok) throw new Error("Failed to load markets");
  return res.json();
}
async function fetchTrend(itemId: string, marketId?: string, timeframe: string = "7d"): Promise<{ item: Item | null; days: Day[] }> {
  const url = `/api/prices?trend=1&itemId=${itemId}&timeframe=${timeframe}${marketId ? `&marketId=${marketId}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load trend");
  return res.json();
}

export function TrendsTab() {
  const t = useT();
  const tr = useTr();
  const tCat = useTCat();
  const tUnit = useTUnit();
  const num = useNum();
  const lang = useLang((s) => s.lang);
  const qc = useQueryClient();

  const { data: itemsData } = useQuery({ queryKey: ["items"], queryFn: fetchItems });
  const { data: marketsData } = useQuery({ queryKey: ["markets-flat"], queryFn: fetchMarkets });

  const [itemId, setItemId] = useState("");
  const [marketId, setMarketId] = useState<string>("all");
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "1y">("7d");
  const [fetchingItem, setFetchingItem] = useState(false);

  async function onFetchItemLive() {
    if (!effectiveItemId) return;
    setFetchingItem(true);
    try {
      const res = await fetch(`/api/items/live?itemId=${effectiveItemId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "failed");
      toast.success(t("liveItemSuccess"), {
        description: `${tr(item?.nameBn ?? "", item?.nameEn ?? "")}: ${num(data.price)}৳ · ${data.sourceName}`,
      });
      qc.invalidateQueries({ queryKey: ["trend"] });
      qc.invalidateQueries({ queryKey: ["prices"] });
      qc.invalidateQueries({ queryKey: ["live-status"] });
    } catch (e) {
      toast.error(t("liveItemError"), { description: (e as Error).message });
    } finally {
      setFetchingItem(false);
    }
  }

  // Derive a default item id from the first available category
  const firstItemId =
    itemsData && itemsData.categories.length > 0
      ? itemsData.byCategory[itemsData.categories[0]]?.[0]?.id ?? ""
      : "";
  const effectiveItemId = itemId || firstItemId;

  const { data: trendData, isLoading: trendLoading } = useQuery({
    queryKey: ["trend", effectiveItemId, marketId, timeframe],
    queryFn: () => fetchTrend(effectiveItemId, marketId === "all" ? undefined : marketId, timeframe),
    enabled: !!effectiveItemId,
  });

  const item = trendData?.item ?? null;
  const days = trendData?.days ?? [];
  const validDays = days.filter((d) => d.avg > 0);
  const weekHigh = validDays.length ? Math.max(...validDays.map((d) => d.max)) : 0;
  const weekLow = validDays.length ? Math.min(...validDays.map((d) => d.min)) : 0;
  const todayAvg = days[days.length - 1]?.avg ?? 0;
  const weekAgoAvg = days[0]?.avg ?? 0;
  const weekChangePct = weekAgoAvg > 0 ? Math.round(((todayAvg - weekAgoAvg) / weekAgoAvg) * 1000) / 10 : 0;

  // Build chart data with localized day/month labels
  const chartData = days.map((d) => {
    let dayName = d.date;
    if (timeframe === "1y") {
      const [y, m] = d.date.split("-");
      const dt = new Date(parseInt(y), parseInt(m) - 1, 1);
      dayName = dt.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { month: "short" });
    } else {
      const dt = new Date(d.date);
      dayName = dt.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { weekday: "short" });
    }
    return {
      date: d.date,
      day: dayName,
      avg: d.avg,
      min: d.min,
      max: d.max,
    };
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" />
                {t("trendsPickItem")}
              </label>
              <Select value={effectiveItemId} onValueChange={setItemId}>
                <SelectTrigger className="h-11 bg-card">
                  <SelectValue placeholder={t("trendsPickItem")} />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {itemsData?.categories.map((cat) => (
                    <SelectGroup key={cat}>
                      <SelectLabel className="text-primary font-semibold">{tCat(cat)}</SelectLabel>
                      {itemsData.byCategory[cat].map((it) => (
                        <SelectItem key={it.id} value={it.id}>
                          <span className="mr-1.5">{it.emoji}</span>
                          {tr(it.nameBn, it.nameEn)}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5" />
                {t("trendsPickMarket")}
              </label>
              <Select value={marketId} onValueChange={setMarketId}>
                <SelectTrigger className="h-11 bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  <SelectItem value="all">{t("trendsAllMarkets")}</SelectItem>
                  {marketsData?.markets.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {tr(m.nameBn, m.nameEn)} · {m.district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Timeframe comparison selector */}
          <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground font-medium">
              {lang === "bn" ? "সময়কাল বিশ্লেষণ:" : "Comparison Timeframe:"}
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant={timeframe === "7d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe("7d")}
                className="h-8 text-xs px-3"
              >
                {t("timeframe7d")}
              </Button>
              <Button
                variant={timeframe === "30d" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe("30d")}
                className="h-8 text-xs px-3"
              >
                {t("timeframe30d")}
              </Button>
              <Button
                variant={timeframe === "1y" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe("1y")}
                className="h-8 text-xs px-3"
              >
                {t("timeframe1y")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {item && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{item.emoji}</span>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg flex items-center gap-2 truncate">
                  {tr(item.nameBn, item.nameEn)}
                </CardTitle>
                <CardDescription className="text-xs">
                  {tCat(item.category)} · {t("perUnit")} {tUnit(item.unit)}
                </CardDescription>
              </div>
              <Button
                onClick={onFetchItemLive}
                disabled={fetchingItem}
                variant="outline"
                size="sm"
                className="shrink-0 gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
              >
                {fetchingItem ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Globe className="h-3.5 w-3.5" />
                )}
                <span className="hidden sm:inline">{t("liveFetchItem")}</span>
                <span className="sm:hidden">{t("liveBadge")}</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Summary stats & Ratio analysis */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <StatBox
                label={t("trendsAvg")}
                value={todayAvg ? `${num(todayAvg)}৳` : "—"}
                accent="primary"
              />
              <StatBox
                label={t("trendsWeekHigh")}
                value={weekHigh ? `${num(weekHigh)}৳` : "—"}
                icon={<TrendingUp className="h-3.5 w-3.5 text-red-500" />}
              />
              <StatBox
                label={t("trendsWeekLow")}
                value={weekLow ? `${num(weekLow)}৳` : "—"}
                icon={<TrendingDown className="h-3.5 w-3.5 text-green-600" />}
              />
              <StatBox
                label={lang === "bn" ? "দামের অনুপাত / তারতম্য" : "Price Spread Ratio"}
                value={weekLow > 0 ? `${num(Math.round(((weekHigh - weekLow) / weekLow) * 100))}%` : "—"}
                subtext={weekHigh && weekLow ? `±${num(weekHigh - weekLow)}৳ ব্যবধান` : undefined}
                icon={<Activity className="h-3.5 w-3.5 text-amber-500" />}
              />
            </div>

            {/* Chart */}
            <div className="h-64 w-full">
              {trendLoading ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : validDays.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                  {t("noResults")}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                    <defs>
                      <linearGradient id="priceArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      width={48}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                      tickFormatter={(v: number) => num(v)}
                    />
                    <RTooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "0.5rem",
                        fontSize: "12px",
                      }}
                      labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                      formatter={(value: number, name: string) => {
                        const labels: Record<string, string> = { avg: t("trendsAvg"), min: t("trendsMin"), max: t("trendsMax") };
                        return [`${num(value)} ৳`, labels[name] ?? name];
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="avg"
                      stroke="var(--chart-1)"
                      strokeWidth={2.5}
                      fill="url(#priceArea)"
                      dot={{ r: 3, fill: "var(--chart-1)" }}
                      activeDot={{ r: 5 }}
                    />
                    <Line type="monotone" dataKey="max" stroke="var(--chart-3)" strokeWidth={1} strokeDasharray="4 4" dot={false} />
                    <Line type="monotone" dataKey="min" stroke="var(--chart-2)" strokeWidth={1} strokeDasharray="4 4" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Week change */}
            {weekChangePct !== 0 && (
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-muted-foreground">{t("sinceYesterday")} (7d):</span>
                <Badge
                  variant="secondary"
                  className={
                    weekChangePct > 0
                      ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                      : "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300"
                  }
                >
                  {weekChangePct > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {weekChangePct > 0 ? "+" : ""}
                  {num(weekChangePct)}%
                </Badge>
              </div>
            )}

            {/* Community Voting */}
            <PriceAccuracyVoting
              itemId={item.id}
              itemNameBn={item.nameBn}
              itemNameEn={item.nameEn}
            />
          </CardContent>
        </Card>
      )}

      {/* 20-Year Historical Economic & Commodity Benchmark */}
      <HistoricalEconomicGraph />
    </div>
  );
}

function StatBox({
  label,
  value,
  subtext,
  icon,
  accent,
}: {
  label: string;
  value: string;
  subtext?: string;
  icon?: React.ReactNode;
  accent?: "primary";
}) {
  return (
    <div
      className={
        "rounded-xl p-3 text-center flex flex-col justify-center " +
        (accent === "primary"
          ? "bg-primary/10 text-primary"
          : "bg-secondary text-foreground")
      }
    >
      <div className="text-[10px] font-medium uppercase tracking-wide opacity-70 flex items-center justify-center gap-1">
        {icon}
        {label}
      </div>
      <div className="mt-0.5 font-bold text-base">{value}</div>
      {subtext && <div className="text-[9px] opacity-75 mt-0.5">{subtext}</div>}
    </div>
  );
}
