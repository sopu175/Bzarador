"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Store,
  MapPin,
  ChevronDown,
  ChevronUp,
  User,
  Globe,
  Clock,
  ExternalLink,
  LineChart as LineChartIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useT, useTr, useTUnit, useTCat, useNum, useLang } from "@/lib/i18n";
import { PriceAccuracyVoting } from "@/components/bazar/price-accuracy-voting";

type TrendPoint = {
  date: string;
  avg: number;
  min: number;
  max: number;
  count: number;
};

export function ItemDetailClient({
  item,
  details,
  trends,
}: {
  item: any;
  details: any;
  trends: { "7d": TrendPoint[]; "30d": TrendPoint[]; "1y": TrendPoint[] };
}) {
  const t = useT();
  const tr = useTr();
  const tCat = useTCat();
  const tUnit = useTUnit();
  const num = useNum();
  const lang = useLang((s) => s.lang);

  const [expandedMarketId, setExpandedMarketId] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "1y">("7d");

  const markets = details?.markets ?? [];
  const validPrices = markets
    .filter((m: any) => m.avgToday != null)
    .map((m: any) => m.avgToday as number);
  const minPrice = validPrices.length ? Math.min(...validPrices) : null;
  const maxPrice = validPrices.length ? Math.max(...validPrices) : null;
  const avgPrice = validPrices.length
    ? Math.round(validPrices.reduce((a: number, b: number) => a + b, 0) / validPrices.length)
    : null;

  const currentTrend = trends[timeframe] || [];

  return (
    <div className="space-y-5">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 hover:bg-secondary px-3 py-1.5 rounded-lg border border-border/40"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{lang === "bn" ? "হোম পেজে ফিরুন" : "Back to Home"}</span>
        </Link>
      </div>

      {/* Item Hero Card */}
      <Card className="overflow-hidden border-border/60">
        <div className="p-5 bg-gradient-to-br from-primary/10 via-card to-secondary/30 border-b border-border/50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-3xl shadow-sm border border-border/60">
                {item.emoji}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold truncate">
                    {tr(item.nameBn, item.nameEn)}
                  </h1>
                  <Badge variant="outline" className="text-xs font-normal">
                    {tCat(item.category)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("perUnit")} {tUnit(item.unit)} · {t("itemDetailsDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Stats Overview */}
        {validPrices.length > 0 && (
          <div className="grid grid-cols-3 gap-2 p-4 bg-card text-center border-b border-border/40">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                {t("trendsAvg")}
              </div>
              <div className="text-lg font-bold text-primary">{num(avgPrice)}৳</div>
            </div>
            <div className="p-2.5 rounded-xl bg-green-500/10">
              <div className="text-[10px] text-green-700 dark:text-green-300 uppercase font-semibold">
                {t("trendsMin")}
              </div>
              <div className="text-lg font-bold text-green-700 dark:text-green-300">
                {num(minPrice)}৳
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-red-500/10">
              <div className="text-[10px] text-red-700 dark:text-red-300 uppercase font-semibold">
                {t("trendsMax")}
              </div>
              <div className="text-lg font-bold text-red-700 dark:text-red-300">
                {num(maxPrice)}৳
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Trend Analysis Graph */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base flex items-center gap-2">
              <LineChartIcon className="h-4 w-4 text-primary" />
              <span>{t("trendsTitle")}</span>
            </CardTitle>
            <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
              <TabsList className="h-8 p-0.5 bg-secondary">
                <TabsTrigger value="7d" className="text-xs px-2.5 py-1">
                  ৭ দিন
                </TabsTrigger>
                <TabsTrigger value="30d" className="text-xs px-2.5 py-1">
                  ৩০ দিন
                </TabsTrigger>
                <TabsTrigger value="1y" className="text-xs px-2.5 py-1">
                  ১ বছর
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="itemTrendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => d.slice(5)}
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                />
                <YAxis
                  domain={["auto", "auto"]}
                  tickFormatter={(v) => `${v}৳`}
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                />
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const pt = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-card p-2 text-xs shadow-md space-y-1">
                        <div className="font-semibold text-foreground">{pt.date}</div>
                        <div className="text-primary font-bold">{num(pt.avg)}৳ (গড়)</div>
                        <div className="text-[11px] text-muted-foreground">
                          সর্বনিম্ন: {num(pt.min)}৳ · সর্বোচ্চ: {num(pt.max)}৳
                        </div>
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="avg"
                  stroke="var(--primary)"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#itemTrendGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 11 physical bazars breakdown list with accordion drilldown */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Store className="h-4 w-4 text-primary" />
              <span>
                {t("marketBreakdown")} ({num(markets.length)})
              </span>
            </CardTitle>
            <span className="text-xs text-muted-foreground">১১টি বাজার বিশ্লেষণ</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/60">
            {markets.map((m: any) => {
              const isExpanded = expandedMarketId === m.marketId;
              const reportsList = m.reports ?? [];

              return (
                <div key={m.marketId} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => setExpandedMarketId(isExpanded ? null : m.marketId)}
                    className={`w-full text-left flex items-center justify-between p-3.5 hover:bg-secondary/40 transition-colors cursor-pointer select-none ${
                      isExpanded ? "bg-secondary/30" : ""
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm truncate flex items-center gap-1.5">
                        {tr(m.nameBn, m.nameEn)}
                        {m.isHistorical && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                            পূর্বের রিপোর্ট
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <MapPin className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                        <span>
                          {m.upazila}, {m.district}
                        </span>
                        <span>·</span>
                        <span className="font-medium text-primary inline-flex items-center gap-1 hover:underline">
                          {num(m.reportCount)} {t("reportCount")}
                          {isExpanded ? (
                            <ChevronUp className="h-3 w-3" />
                          ) : (
                            <ChevronDown className="h-3 w-3" />
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="text-right pl-3 shrink-0 flex items-center gap-3">
                      <div>
                        <div className="text-base font-bold text-foreground">
                          {m.avgToday != null ? (
                            <>
                              {num(m.avgToday)}
                              <span className="text-xs text-muted-foreground ml-0.5">৳</span>
                            </>
                          ) : (
                            "—"
                          )}
                        </div>
                        {minPrice && maxPrice && m.avgToday && (
                          <div className="text-[10px] mt-0.5">
                            {m.avgToday === minPrice ? (
                              <span className="text-green-600 font-medium">সবচেয়ে কম</span>
                            ) : m.avgToday === maxPrice ? (
                              <span className="text-red-600 font-medium">সবচেয়ে বেশি</span>
                            ) : (
                              <span className="text-muted-foreground">স্বাভাবিক</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-muted-foreground">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expandable Individual Reports List */}
                  {isExpanded && (
                    <div className="bg-secondary/20 border-t border-border/40 px-4 py-3 space-y-2">
                      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground pb-1 border-b border-border/30">
                        <span>
                          {tr(m.nameBn, m.nameEn)} — {num(reportsList.length)}{" "}
                          {t("individualReports")}
                        </span>
                        <span className="text-[11px]">প্রতি কেজি / একক মূল্য</span>
                      </div>

                      {reportsList.length === 0 ? (
                        <div className="text-center py-3 text-xs text-muted-foreground">
                          {t("noReportsFound")}
                        </div>
                      ) : (
                        <div className="space-y-1.5 pt-1">
                          {reportsList.map((r: any, idx: number) => {
                            const reportDate = new Date(r.reportedAt);
                            const formattedTime = reportDate.toLocaleTimeString(
                              lang === "bn" ? "bn-BD" : "en-US",
                              { hour: "2-digit", minute: "2-digit" }
                            );
                            const formattedDate = reportDate.toLocaleDateString(
                              lang === "bn" ? "bn-BD" : "en-US",
                              { month: "short", day: "numeric" }
                            );

                            return (
                              <div
                                key={r.id || idx}
                                className="flex items-center justify-between bg-card p-2.5 rounded-lg border border-border/50 text-xs shadow-xs"
                              >
                                <div className="min-w-0 flex-1 space-y-0.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {r.sourceName ? (
                                      <Badge
                                        variant="secondary"
                                        className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/20 gap-1 font-normal"
                                      >
                                        <Globe className="h-2.5 w-2.5" />
                                        {r.sourceName}
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant="outline"
                                        className="text-[10px] px-1.5 py-0 h-4 gap-1 text-muted-foreground font-normal"
                                      >
                                        <User className="h-2.5 w-2.5" />
                                        {r.reporterName || t("anonymousReporter")}
                                      </Badge>
                                    )}

                                    {r.sourceUrl && (
                                      <a
                                        href={r.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] text-primary hover:underline inline-flex items-center gap-0.5"
                                      >
                                        উৎস লিঙ্ক
                                        <ExternalLink className="h-2.5 w-2.5" />
                                      </a>
                                    )}
                                  </div>

                                  <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-2.5 w-2.5" />
                                    <span>
                                      {formattedDate}, {formattedTime}
                                    </span>
                                  </div>
                                </div>

                                <div className="text-right pl-3 shrink-0">
                                  <span className="font-bold text-sm text-foreground">
                                    {num(r.price)}
                                  </span>
                                  <span className="text-[11px] text-muted-foreground ml-0.5">
                                    ৳
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Community Voting */}
      <PriceAccuracyVoting itemId={item.id} itemNameBn={item.nameBn} itemNameEn={item.nameEn} />
    </div>
  );
}
