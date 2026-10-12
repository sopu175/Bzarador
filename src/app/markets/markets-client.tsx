"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Store, MapPin, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toSlug, districtNames } from "@/lib/slug";
import { useT, useTr, useNum, useLang } from "@/lib/i18n";

export function MarketsListClient({ markets }: { markets: any[] }) {
  const t = useT();
  const tr = useTr();
  const num = useNum();
  const lang = useLang((s) => s.lang);

  const [search, setSearch] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");

  const districts = useMemo(() => {
    const list = Array.from(new Set(markets.map((m) => m.district)));
    return ["all", ...list];
  }, [markets]);

  const filtered = useMemo(() => {
    return markets.filter((m) => {
      const matchDistrict = selectedDistrict === "all" || m.district === selectedDistrict;
      const q = search.trim().toLowerCase();
      const matchQuery =
        !q ||
        m.nameEn.toLowerCase().includes(q) ||
        m.nameBn.includes(q) ||
        m.district.toLowerCase().includes(q) ||
        m.upazila.toLowerCase().includes(q);
      return matchDistrict && matchQuery;
    });
  }, [markets, selectedDistrict, search]);

  return (
    <div className="space-y-4">
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
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              <span>{lang === "bn" ? "সকল বাজার" : "All Markets"} ({num(markets.length)})</span>
            </CardTitle>
            <Badge variant="secondary">{num(filtered.length)} {t("statMarkets")}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {lang === "bn"
              ? "যেকোনো বাজারে ক্লিক করে তার একক পেজ ও পণ্যভিত্তিক বর্তমান দর দেখুন"
              : "Click any market to explore its dedicated page and live commodity rates"}
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "bn" ? "বাজার বা জেলার নাম খুঁজুন (যেমন কারওয়ান বাজার, মিরপুর)..." : "Search market or district..."}
              className="pl-9 h-10 bg-background"
            />
          </div>

          {/* District filter pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {districts.map((dist) => {
              const dMeta = districtNames[dist.toLowerCase()];
              const label =
                dist === "all"
                  ? lang === "bn"
                    ? "সকল জেলা"
                    : "All Districts"
                  : dMeta
                  ? tr(dMeta.bn, dMeta.en)
                  : dist;
              return (
                <button
                  key={dist}
                  onClick={() => setSelectedDistrict(dist)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors cursor-pointer ${
                    selectedDistrict === dist
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Markets list */}
          <div className="divide-y divide-border/60 rounded-xl border border-border/60 bg-card overflow-hidden mt-3">
            {filtered.map((m) => {
              const slug = toSlug(m.nameEn);
              return (
                <Link
                  key={m.id}
                  href={`/markets/${slug}`}
                  className="flex items-center justify-between p-3.5 hover:bg-secondary/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary group-hover:scale-105 transition-transform">
                      <Store className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                        {tr(m.nameBn, m.nameEn)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-muted-foreground/70" />
                        <span>{m.upazila}, {m.district}</span>
                        <span>·</span>
                        <span>{num(m._count?.reports ?? 0)} {t("statReports")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-primary font-medium hidden sm:inline group-hover:underline">
                      {lang === "bn" ? "বাজারের দর দেখুন" : "View Market"}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
