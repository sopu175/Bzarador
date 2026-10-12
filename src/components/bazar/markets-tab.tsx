"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Store, ChevronRight } from "lucide-react";
import { useT, useTr, useTUnit, useNum } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChangeBadge } from "./change-badge";
import { Badge } from "@/components/ui/badge";

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
};

type Market = {
  id: string;
  nameBn: string;
  nameEn: string;
  district: string;
  upazila: string;
};

async function fetchMarkets(): Promise<{ markets: Market[]; byDistrict: Record<string, Market[]>; districts: string[] }> {
  const res = await fetch("/api/markets");
  if (!res.ok) throw new Error("Failed to load markets");
  return res.json();
}

async function fetchMarketPrices(marketId: string): Promise<{ prices: PriceRow[] }> {
  const res = await fetch(`/api/prices?marketId=${marketId}`);
  if (!res.ok) throw new Error("Failed to load market prices");
  return res.json();
}

export function MarketsTab() {
  const t = useT();
  const tr = useTr();
  const tUnit = useTUnit();
  const num = useNum();

  const { data: marketsData, isLoading: marketsLoading } = useQuery({
    queryKey: ["markets"],
    queryFn: fetchMarkets,
  });

  const districts = marketsData?.districts ?? [];
  const [district, setDistrict] = useState<string>("all");
  const [marketId, setMarketId] = useState<string>("");

  const availableMarkets = useMemo(() => {
    if (!marketsData) return [];
    return district === "all"
      ? marketsData.markets
      : marketsData.byDistrict[district] ?? [];
  }, [marketsData, district]);

  // Derive the effective marketId: fall back to first available if current is invalid
  const effectiveMarketId =
    marketId && availableMarkets.some((m) => m.id === marketId)
      ? marketId
      : availableMarkets[0]?.id ?? "";

  const { data: pricesData, isLoading: pricesLoading } = useQuery({
    queryKey: ["prices", effectiveMarketId],
    queryFn: () => fetchMarketPrices(effectiveMarketId),
    enabled: !!effectiveMarketId,
  });

  const prices = pricesData?.prices ?? [];
  const currentMarket = marketsData?.markets.find((m) => m.id === effectiveMarketId);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {t("selectDistrict")}
              </label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="h-11 bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allDistricts")}</SelectItem>
                  {districts.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Store className="h-3.5 w-3.5" />
                {t("selectMarket")}
              </label>
              <Select value={effectiveMarketId} onValueChange={setMarketId}>
                <SelectTrigger className="h-11 bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableMarkets.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {tr(m.nameBn, m.nameEn)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentMarket && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">
            {tr(currentMarket.nameBn, currentMarket.nameEn)}
          </span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>{currentMarket.upazila}</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span>{currentMarket.district}</span>
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base">
              {currentMarket ? tr(currentMarket.nameBn, currentMarket.nameEn) : t("marketsTitle")}
            </CardTitle>
            <Badge variant="secondary">{num(prices.length)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {pricesLoading || marketsLoading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : prices.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              {t("noResults")}
            </div>
          ) : (
            <ScrollArea className="max-h-[640px]">
              <div className="divide-y divide-border">
                {prices.map((p) => (
                  <div
                    key={p.item.id}
                    className="flex items-center gap-3 p-3.5 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-xl">
                      {p.item.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">
                        {tr(p.item.nameBn, p.item.nameEn)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t("perUnit")} {tUnit(p.item.unit)} · {num(p.reportCount)} {t("reportCount")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg leading-none">
                        {p.avgToday != null ? `${num(p.avgToday)}৳` : "—"}
                      </div>
                      <div className="mt-1.5">
                        <ChangeBadge change={p.change} changePct={p.changePct} showAbs />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
