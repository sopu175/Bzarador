import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Store,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  User,
  Globe,
  Clock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useT, useTr, useTUnit, useTCat, useNum, useLang } from "@/lib/i18n";
import { toSlug } from "@/lib/slug";
import { PriceAccuracyVoting } from "./price-accuracy-voting";

type SingleReport = {
  id: string;
  price: number;
  reporterName: string;
  reportedAt: string;
  sourceName?: string | null;
  sourceUrl?: string | null;
};

type MarketBreakdown = {
  marketId: string;
  nameBn: string;
  nameEn: string;
  district: string;
  upazila: string;
  avgToday: number | null;
  isHistorical: boolean;
  reportCount: number;
  latestReportAt: string | null;
  reports?: SingleReport[];
};

type ItemDetailsResponse = {
  item: {
    id: string;
    nameBn: string;
    nameEn: string;
    category: string;
    unit: string;
    emoji: string;
  };
  markets: MarketBreakdown[];
};

async function fetchItemDetails(itemId: string): Promise<ItemDetailsResponse> {
  const res = await fetch(`/api/prices?details=1&itemId=${itemId}`);
  if (!res.ok) throw new Error("Failed to load item details");
  return res.json();
}

export function ItemDetailsModal({
  itemId,
  open,
  onOpenChange,
}: {
  itemId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useT();
  const tr = useTr();
  const tCat = useTCat();
  const tUnit = useTUnit();
  const num = useNum();
  const lang = useLang((s) => s.lang);

  const [expandedMarketId, setExpandedMarketId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["item-details", itemId],
    queryFn: () => fetchItemDetails(itemId!),
    enabled: !!itemId && open,
  });

  const item = data?.item;
  const markets = data?.markets ?? [];

  const validPrices = markets.filter((m) => m.avgToday != null).map((m) => m.avgToday as number);
  const minPrice = validPrices.length ? Math.min(...validPrices) : null;
  const maxPrice = validPrices.length ? Math.max(...validPrices) : null;
  const avgPrice = validPrices.length
    ? Math.round(validPrices.reduce((a, b) => a + b, 0) / validPrices.length)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-5 pb-3 border-b border-border/50 bg-secondary/30">
          {isLoading || !item ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3.5 w-24" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl shadow-sm border border-border/60">
                  {item.emoji}
                </div>
                <div className="min-w-0">
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    {tr(item.nameBn, item.nameEn)}
                    <Badge variant="outline" className="text-xs font-normal">
                      {tCat(item.category)}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    {t("perUnit")} {tUnit(item.unit)} · {t("itemDetailsDesc")}
                  </DialogDescription>
                </div>
              </div>

              <Link
                href={`/items/${toSlug(item.nameEn)}`}
                className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-foreground bg-primary/10 hover:bg-primary px-3 py-1.5 rounded-xl transition-all shadow-2xs hover:shadow-sm"
                title={`${tr(item.nameBn, item.nameEn)} ${lang === "bn" ? "এর পূর্ণাঙ্গ পেজে যান" : "Go to full page"}`}
              >
                <span>{lang === "bn" ? "পূর্ণাঙ্গ পেজ" : "Full Page"}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </DialogHeader>

        {/* High-level market ratio summary */}
        {validPrices.length > 0 && (
          <div className="grid grid-cols-3 gap-2 px-5 py-3 bg-card border-b border-border/40 text-center">
            <div className="p-2 rounded-xl bg-primary/10">
              <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                {t("trendsAvg")}
              </div>
              <div className="text-base font-bold text-primary">{num(avgPrice)}৳</div>
            </div>
            <div className="p-2 rounded-xl bg-green-500/10">
              <div className="text-[10px] text-green-700 dark:text-green-300 uppercase font-semibold">
                {t("trendsMin")}
              </div>
              <div className="text-base font-bold text-green-700 dark:text-green-300">
                {num(minPrice)}৳
              </div>
            </div>
            <div className="p-2 rounded-xl bg-red-500/10">
              <div className="text-[10px] text-red-700 dark:text-red-300 uppercase font-semibold">
                {t("trendsMax")}
              </div>
              <div className="text-base font-bold text-red-700 dark:text-red-300">
                {num(maxPrice)}৳
              </div>
            </div>
          </div>
        )}

        {/* 11 physical bazars breakdown list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Store className="h-4 w-4 text-primary" />
              {t("marketBreakdown")} ({num(markets.length)})
            </h4>
            <span className="text-xs text-muted-foreground">বাজারভিত্তিক রিপোর্ট সমূহ</span>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-border/60 rounded-xl border border-border/60 bg-card overflow-hidden">
              {markets.map((m) => {
                const isExpanded = expandedMarketId === m.marketId;
                const reportsList = m.reports ?? [];
                const marketSlug = toSlug(m.nameEn);

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
                        <div className="font-semibold text-sm truncate flex items-center gap-2">
                          <span className="hover:text-primary transition-colors">
                            {tr(m.nameBn, m.nameEn)}
                          </span>
                          <Link
                            href={`/markets/${marketSlug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] text-primary hover:underline px-1.5 py-0.5 rounded bg-primary/10 font-normal inline-flex items-center gap-0.5"
                            title="বাজারের একক পেজ দেখুন"
                          >
                            <span>বাজার পেজ</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </Link>
                          {m.isHistorical && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                              পূর্বের রিপোর্ট
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <MapPin className="h-3 w-3 text-muted-foreground/70 shrink-0" />
                          <Link
                            href={`/districts/${toSlug(m.district)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-foreground hover:underline"
                          >
                            {m.upazila}, {m.district}
                          </Link>
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
                            {reportsList.map((r, idx) => {
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
          )}

          {item && (
            <div className="pt-2">
              <PriceAccuracyVoting
                itemId={item.id}
                itemNameBn={item.nameBn}
                itemNameEn={item.nameEn}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
