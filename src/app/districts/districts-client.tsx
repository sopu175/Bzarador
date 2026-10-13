"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Store, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useT, useTr, useNum, useLang } from "@/lib/i18n";

export function DistrictsListClient({ districts }: { districts: any[] }) {
  const t = useT();
  const tr = useTr();
  const num = useNum();
  const lang = useLang((s) => s.lang);

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return districts;
    return districts.filter(
      (d) =>
        d.nameEn.toLowerCase().includes(q) ||
        d.nameBn.includes(q) ||
        d.district.toLowerCase().includes(q)
    );
  }, [districts, search]);

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
              <Users className="h-5 w-5 text-primary" />
              <span>
                {lang === "bn" ? "সকল জেলা" : "All Districts"} ({num(districts.length)})
              </span>
            </CardTitle>
            <Badge variant="secondary">
              {num(filtered.length)} {t("statDistricts")}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {lang === "bn"
              ? "যেকোনো জেলায় ক্লিক করে তার আওতাধীন সকল বাজার ও মূল্য তালিকা দেখুন"
              : "Click any district to view its markets and local price breakdown"}
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                lang === "bn"
                  ? "জেলার নাম খুঁজুন (যেমন ঢাকা, বরিশাল, চট্টগ্রাম)..."
                  : "Search district name..."
              }
              className="pl-9 h-10 bg-background"
            />
          </div>

          <div className="divide-y divide-border/60 rounded-xl border border-border/60 bg-card overflow-hidden mt-3">
            {filtered.map((d) => (
              <Link
                key={d.slug}
                href={`/districts/${d.slug}`}
                className="flex items-center justify-between p-3.5 hover:bg-secondary/50 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary group-hover:scale-105 transition-transform">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                      {tr(d.nameBn, d.nameEn)} {lang === "bn" ? "জেলা" : "District"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                      <Store className="h-3 w-3 text-muted-foreground/70" />
                      <span>
                        {num(d.marketCount)} {t("statMarkets")}
                      </span>
                      <span>·</span>
                      <span>
                        {num(d.reportCount)} {t("statReports")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-primary font-medium hidden sm:inline group-hover:underline">
                    {lang === "bn" ? "বাজারসমূহ দেখুন" : "View Markets"}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
