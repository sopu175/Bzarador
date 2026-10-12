"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, TrendingUp, TrendingDown, PackageOpen, Radio } from "lucide-react";
import { useT, useTr, useTUnit, useTCat, useNum, useLang } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ChangeBadge } from "./change-badge";
import { cn } from "@/lib/utils";

type PriceRow = {
  item: {
    id: string;
    nameBn: string;
    nameEn: string;
    category: string;
    unit: string;
    emoji: string;
  };
  avgToday: number | null;
  avgYesterday: number | null;
  change: number;
  changePct: number;
  reportCount: number;
  liveSource: string | null;
  liveSourceUrl: string | null;
  liveAt: string | null;
};

async function fetchPrices(): Promise<{ prices: PriceRow[] }> {
  const res = await fetch("/api/prices");
  if (!res.ok) throw new Error("Failed to load prices");
  return res.json();
}

export function TodayTab() {
  const t = useT();
  const tr = useTr();
  const tUnit = useTUnit();
  const tCat = useTCat();
  const num = useNum();
  const lang = useLang((s) => s.lang);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");
  const [liveOnly, setLiveOnly] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["prices", "all"],
    queryFn: fetchPrices,
  });

  const prices = data?.prices ?? [];

  // Categories present in data
  const categories = useMemo(() => {
    const set = new Set(prices.map((p) => p.item.category));
    return ["all", ...Array.from(set).sort()];
  }, [prices]);

  const filtered = useMemo(() => {
    let list = prices;
    if (activeCat !== "all") list = list.filter((p) => p.item.category === activeCat);
    if (liveOnly) list = list.filter((p) => !!p.liveSource);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.item.nameBn.includes(q) ||
          p.item.nameEn.toLowerCase().includes(q)
      );
    }
    // Live prices first
    list = [...list].sort((a, b) => {
      if (!!a.liveSource !== !!b.liveSource) return a.liveSource ? -1 : 1;
      return 0;
    });
    return list;
  }, [prices, activeCat, liveOnly, search]);

  const liveCount = prices.filter((p) => p.liveSource).length;

  const gainers = useMemo(
    () =>
      [...prices]
        .filter((p) => p.change > 0)
        .sort((a, b) => b.changePct - a.changePct)
        .slice(0, 6),
    [prices]
  );
  const losers = useMemo(
    () =>
      [...prices]
        .filter((p) => p.change < 0)
        .sort((a, b) => a.changePct - b.changePct)
        .slice(0, 6),
    [prices]
  );

  return (
    <div className="space-y-5">
      {/* Search + category filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchItem")}
            className="pl-9 h-11 bg-card"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 thin-scroll -mx-1 px-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors",
                activeCat === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground/70 border-border hover:bg-secondary"
              )}
            >
              {c === "all" ? t("allMarkets") : tCat(c)}
            </button>
          ))}
          {liveCount > 0 && (
            <button
              onClick={() => setLiveOnly((v) => !v)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors inline-flex items-center gap-1.5",
                liveOnly
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground/70 border-border hover:bg-secondary"
              )}
            >
              <Radio className="h-3.5 w-3.5" />
              {t("liveBadge")} {num(liveCount)}
            </button>
          )}
        </div>
      </div>

      {/* Top movers */}
      {(isLoading || gainers.length > 0 || losers.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          <MoversCard
            title={t("topGainers")}
            icon={<TrendingUp className="h-4 w-4 text-red-500" />}
            accent="red"
            rows={gainers}
            loading={isLoading}
          />
          <MoversCard
            title={t("topLosers")}
            icon={<TrendingDown className="h-4 w-4 text-green-600" />}
            accent="green"
            rows={losers}
            loading={isLoading}
          />
        </div>
      )}

      {/* Full price list */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base">{t("todayTitle")}</CardTitle>
            <Badge variant="secondary" className="font-normal">
              {num(filtered.length)} {t("reportCount")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isError ? (
            <div className="p-6 text-center text-sm text-destructive">
              {t("noResults")}
            </div>
          ) : isLoading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center">
              <PackageOpen className="mx-auto h-10 w-10 text-muted-foreground/60" />
              <p className="mt-3 text-sm text-muted-foreground">{t("noResults")}</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[640px]">
              <div className="divide-y divide-border">
                {filtered.map((p) => (
                  <PriceRowCard key={p.item.id} row={p} />
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function PriceRowCard({ row }: { row: PriceRow }) {
  const t = useT();
  const tr = useTr();
  const tUnit = useTUnit();
  const num = useNum();
  const tCat = useTCat();
  const lang = useLang((s) => s.lang);
  return (
    <div className="flex items-center gap-3 p-3.5 hover:bg-secondary/50 transition-colors">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl">
        {row.item.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold truncate">
            {tr(row.item.nameBn, row.item.nameEn)}
          </span>
          {row.liveSource && (
            <a
              href={row.liveSourceUrl ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              title={row.liveSourceUrl ?? row.liveSource}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-semibold hover:bg-primary/20 transition-colors"
            >
              <Radio className="h-2.5 w-2.5" />
              {t("liveBadge")}
            </a>
          )}
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 hidden sm:inline-flex">
            {tCat(row.item.category)}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground mt-0.5 truncate">
          {row.liveSource ? (
            <span className="inline-flex items-center gap-1">
              {t("liveFrom")} {row.liveSource}
              {row.liveAt && (
                <>
                  {" · "}
                  {formatTime(row.liveAt, lang)}
                </>
              )}
            </span>
          ) : (
            <span>{t("perUnit")} {tUnit(row.item.unit)}</span>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-lg leading-none">
          {row.avgToday != null ? (
            <>
              {num(row.avgToday)}
              <span className="text-sm font-semibold text-muted-foreground ml-0.5">৳</span>
            </>
          ) : (
            "—"
          )}
        </div>
        <div className="mt-1.5 flex items-center justify-end gap-2">
          <ChangeBadge change={row.change} changePct={row.changePct} showAbs />
        </div>
      </div>
    </div>
  );
}

function MoversCard({
  title,
  icon,
  accent,
  rows,
  loading,
}: {
  title: string;
  icon: React.ReactNode;
  accent: "red" | "green";
  rows: PriceRow[];
  loading: boolean;
}) {
  const tr = useTr();
  const num = useNum();
  const tUnit = useTUnit();
  const t = useT();
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        {loading ? (
          <div className="space-y-1.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-md" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            {accent === "red" ? t("noGainers") : t("noLosers")}
          </div>
        ) : (
          <div className="space-y-0.5">
            {rows.map((r) => (
              <div
                key={r.item.id}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-secondary/60 transition-colors"
              >
                <span className="text-lg">{r.item.emoji}</span>
                <span className="flex-1 min-w-0 truncate text-sm font-medium">
                  {tr(r.item.nameBn, r.item.nameEn)}
                </span>
                <ChangeBadge change={r.change} changePct={r.changePct} />
                <span className="text-sm font-semibold tabular-nums w-16 text-right">
                  {r.avgToday != null ? `${num(r.avgToday)}৳` : "—"}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatTime(iso: string, lang: "bn" | "en") {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString(lang === "bn" ? "bn-BD" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
