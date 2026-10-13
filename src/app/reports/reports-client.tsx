"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Megaphone,
  Radio,
  User,
  Clock,
  Store,
  ExternalLink,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useT, useTr, useTUnit, useNum, useLang } from "@/lib/i18n";
import { toSlug } from "@/lib/slug";

type ReportItem = {
  id: string;
  price: number;
  reporterName: string;
  reportedAt: string;
  sourceName: string | null;
  sourceUrl: string | null;
  item: {
    id: string;
    nameBn: string;
    nameEn: string;
    category: string;
    unit: string;
    emoji: string;
  };
  market: {
    id: string;
    nameBn: string;
    nameEn: string;
    district: string;
    upazila: string;
  };
};

export function ReportsListClient({
  totalCount,
  markets,
  items,
}: {
  totalCount: number;
  markets: any[];
  items: any[];
}) {
  const t = useT();
  const tr = useTr();
  const tUnit = useTUnit();
  const num = useNum();
  const lang = useLang((s) => s.lang);

  const [page, setPage] = useState(1);
  const [selectedMarket, setSelectedMarket] = useState("all");
  const [selectedItem, setSelectedItem] = useState("all");
  const [sourceType, setSourceType] = useState<"all" | "live" | "user">("all");

  const { data, isLoading } = useQuery({
    queryKey: ["reports-feed", page, selectedMarket, selectedItem, sourceType],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "20");
      if (selectedMarket !== "all") params.set("marketId", selectedMarket);
      if (selectedItem !== "all") params.set("itemId", selectedItem);
      if (sourceType !== "all") params.set("source", sourceType);

      const res = await fetch(`/api/reports?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load reports");
      return res.json() as Promise<{
        reports: ReportItem[];
        pagination: { total: number; page: number; totalPages: number };
      }>;
    },
    staleTime: 15_000,
  });

  const reports = data?.reports ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
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

      <Card>
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                <Megaphone className="h-4 w-4" />
              </span>
              <div>
                <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <span>{lang === "bn" ? "সকল বাজার দাম রিপোর্ট" : "All Price Reports"}</span>
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lang === "bn"
                    ? `মোট ${num(pagination?.total ?? totalCount)}টি সংগৃহীত লাইভ ও কমিউনিটি রিপোর্ট`
                    : `Total ${num(pagination?.total ?? totalCount)} live & community verified price reports`}
                </p>
              </div>
            </div>
            <Link
              href="/#report"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 shadow-2xs self-start sm:self-auto cursor-pointer"
            >
              <span>+ {lang === "bn" ? "নতুন দাম জানান" : "Report Price"}</span>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 bg-secondary/30 p-2.5 rounded-xl border border-border/50">
            {/* Market select */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase mb-1 block">
                {lang === "bn" ? "বাজার নির্বাচন" : "Filter Market"}
              </label>
              <Select
                value={selectedMarket}
                onValueChange={(v) => {
                  setSelectedMarket(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 text-xs bg-background">
                  <SelectValue placeholder={lang === "bn" ? "সব বাজার" : "All Markets"} />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  <SelectItem value="all">
                    {lang === "bn" ? "সব বাজার (১১টি)" : "All Markets (11)"}
                  </SelectItem>
                  {markets.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {tr(m.nameBn, m.nameEn)} ({m.district})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Item select */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase mb-1 block">
                {lang === "bn" ? "পণ্য নির্বাচন" : "Filter Item"}
              </label>
              <Select
                value={selectedItem}
                onValueChange={(v) => {
                  setSelectedItem(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 text-xs bg-background">
                  <SelectValue placeholder={lang === "bn" ? "সব পণ্য" : "All Items"} />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  <SelectItem value="all">
                    {lang === "bn" ? "সব পণ্য (৫৪টি)" : "All Items (54)"}
                  </SelectItem>
                  {items.map((it) => (
                    <SelectItem key={it.id} value={it.id}>
                      <span className="mr-1">{it.emoji}</span>
                      {tr(it.nameBn, it.nameEn)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Source select */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase mb-1 block">
                {lang === "bn" ? "উৎস নির্বাচন" : "Report Source"}
              </label>
              <Select
                value={sourceType}
                onValueChange={(v) => {
                  setSourceType(v as any);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 text-xs bg-background">
                  <SelectValue placeholder={lang === "bn" ? "সকল উৎস" : "All Sources"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{lang === "bn" ? "সকল উৎস" : "All Sources"}</SelectItem>
                  <SelectItem value="live">
                    {lang === "bn" ? "অনলাইন লাইভ সোর্স" : "Live Web Feeds"}
                  </SelectItem>
                  <SelectItem value="user">
                    {lang === "bn" ? "কমিউনিটি ইউজার রিপোর্ট" : "Community Reports"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reports Table List */}
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-xs">{t("loading")}</span>
            </div>
          ) : reports.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">{t("noResults")}</div>
          ) : (
            <div className="divide-y divide-border/60 rounded-xl border border-border/60 overflow-hidden bg-card">
              {reports.map((r) => {
                const itemSlug = toSlug(r.item.nameEn);
                const marketSlug = toSlug(r.market.nameEn);
                const date = new Date(r.reportedAt);
                const timeStr = date.toLocaleTimeString(lang === "bn" ? "bn-BD" : "en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const dateStr = date.toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", {
                  month: "short",
                  day: "numeric",
                });

                return (
                  <div
                    key={r.id}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Link
                        href={`/items/${itemSlug}`}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl hover:scale-105 transition-transform"
                      >
                        {r.item.emoji}
                      </Link>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/items/${itemSlug}`}
                            className="font-bold text-sm text-foreground hover:text-primary transition-colors hover:underline"
                          >
                            {tr(r.item.nameBn, r.item.nameEn)}
                          </Link>
                          <Link
                            href={`/markets/${marketSlug}`}
                            className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 bg-secondary/80 px-2 py-0.5 rounded-md"
                          >
                            <Store className="h-3 w-3 text-primary" />
                            <span>{tr(r.market.nameBn, r.market.nameEn)}</span>
                          </Link>
                        </div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {dateStr}, {timeStr}
                            </span>
                          </span>
                          <span>·</span>
                          {r.sourceName ? (
                            <span className="inline-flex items-center gap-1 text-primary font-medium">
                              <Radio className="h-2.5 w-2.5 animate-pulse" />
                              <span>{r.sourceName}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1">
                              <User className="h-2.5 w-2.5" />
                              <span>{r.reporterName}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto">
                      <div className="text-right">
                        <div className="text-base font-bold text-foreground">{num(r.price)}৳</div>
                        <div className="text-[10px] text-muted-foreground">
                          {t("perUnit")} {tUnit(r.item.unit)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-border/60 hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>{lang === "bn" ? "পূর্ববর্তী" : "Previous"}</span>
              </button>
              <span className="text-xs text-muted-foreground font-medium">
                {lang === "bn"
                  ? `পৃষ্ঠা ${num(page)} / ${num(pagination.totalPages)}`
                  : `Page ${num(page)} of ${num(pagination.totalPages)}`}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-border/60 hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <span>{lang === "bn" ? "পরবর্তী" : "Next"}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
