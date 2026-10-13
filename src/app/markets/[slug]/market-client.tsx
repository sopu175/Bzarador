"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Store,
  MapPin,
  Search,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toSlug } from "@/lib/slug";
import { useT, useTr, useTUnit, useTCat, useNum, useLang } from "@/lib/i18n";
import { ChangeBadge } from "@/components/bazar/change-badge";
import { ItemDetailsModal } from "@/components/bazar/item-details-modal";

export function MarketDetailClient({ market, prices }: { market: any; prices: any[] }) {
  const t = useT();
  const tr = useTr();
  const tCat = useTCat();
  const tUnit = useTUnit();
  const num = useNum();
  const lang = useLang((s) => s.lang);

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(prices.map((p) => p.item.category)));
    return ["all", ...cats];
  }, [prices]);

  const filtered = useMemo(() => {
    return prices.filter((p) => {
      const matchCat = selectedCat === "all" || p.item.category === selectedCat;
      const q = search.trim().toLowerCase();
      const matchQuery = !q || p.item.nameEn.toLowerCase().includes(q) || p.item.nameBn.includes(q);
      return matchCat && matchQuery;
    });
  }, [prices, selectedCat, search]);

  const totalReports = useMemo(() => {
    return prices.reduce((acc, p) => acc + (p.reportCount || 0), 0);
  }, [prices]);

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 hover:bg-secondary px-3 py-1.5 rounded-lg border border-border/40"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{lang === "bn" ? "হোম পেজে ফিরুন" : "Back to Home"}</span>
        </Link>
      </div>

      {/* Market Header Card */}
      <Card className="overflow-hidden border-border/60">
        <div className="p-5 bg-gradient-to-br from-primary/10 via-card to-secondary/30 border-b border-border/50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary shadow-sm border border-border/60">
                <Store className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold truncate">
                  {tr(market.nameBn, market.nameEn)}
                </h1>
                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>
                    {market.upazila}, {market.district}
                  </span>
                  <span>·</span>
                  <Link
                    href={`/districts/${toSlug(market.district)}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {market.district} জেলা
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 p-4 bg-card text-center border-b border-border/40">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">
              {lang === "bn" ? "তালিকাভুক্ত পণ্য" : "Listed Items"}
            </div>
            <div className="text-lg font-bold text-primary">{num(prices.length)}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-secondary">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">
              {t("statReports")}
            </div>
            <div className="text-lg font-bold text-foreground">{num(totalReports)}</div>
          </div>
        </div>
      </Card>

      {/* Market Price List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base flex items-center gap-2">
              <span>{lang === "bn" ? "আজকের পণ্যের দর" : "Today's Item Prices"}</span>
            </CardTitle>
            <Badge variant="secondary">
              {num(filtered.length)} {t("statItems")}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                lang === "bn" ? "এই বাজারের পণ্য খুঁজুন..." : "Search items in this market..."
              }
              className="pl-9 h-10 bg-background"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                  selectedCat === cat
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === "all" ? (lang === "bn" ? "সকল ধরন" : "All Categories") : tCat(cat)}
              </button>
            ))}
          </div>

          {/* Items in this market */}
          <div className="divide-y divide-border/60 rounded-xl border border-border/60 bg-card overflow-hidden mt-3">
            {filtered.map((p) => {
              const itemSlug = toSlug(p.item.nameEn);
              return (
                <div
                  key={p.item.id}
                  className="flex items-center justify-between p-3.5 hover:bg-secondary/50 transition-colors group"
                >
                  <div
                    onClick={() => setSelectedItemId(p.item.id)}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl group-hover:scale-105 transition-transform">
                      {p.item.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors flex items-center gap-1.5">
                        <span>{tr(p.item.nameBn, p.item.nameEn)}</span>
                        <Badge variant="outline" className="text-[10px] font-normal py-0">
                          {tCat(p.item.category)}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {t("perUnit")} {tUnit(p.item.unit)} · {num(p.reportCount)}{" "}
                        {t("reportCount")}
                      </div>
                    </div>
                  </div>

                  <div className="text-right pl-3 shrink-0 flex items-center gap-3">
                    <div>
                      <div className="font-bold text-base leading-none">
                        {p.avgToday != null ? `${num(p.avgToday)}৳` : "—"}
                      </div>
                      <div className="mt-1">
                        <ChangeBadge change={p.change} changePct={p.changePct} showAbs />
                      </div>
                    </div>
                    <Link
                      href={`/items/${itemSlug}`}
                      className="text-xs text-primary font-medium hover:underline p-1"
                      title="পণ্যের একক পেজ দেখুন"
                    >
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <ItemDetailsModal
        itemId={selectedItemId}
        open={!!selectedItemId}
        onOpenChange={(open) => {
          if (!open) setSelectedItemId(null);
        }}
      />
    </div>
  );
}
