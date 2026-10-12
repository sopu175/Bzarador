"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, PackageSearch, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toSlug } from "@/lib/slug";
import { useT, useTr, useTUnit, useTCat, useNum, useLang } from "@/lib/i18n";

export function ItemsListClient({ items }: { items: any[] }) {
  const t = useT();
  const tr = useTr();
  const tCat = useTCat();
  const tUnit = useTUnit();
  const num = useNum();
  const lang = useLang((s) => s.lang);

  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((it) => it.category)));
    return ["all", ...cats];
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      const allowEnSearch = process.env.NEXT_PUBLIC_ENABLE_ENGLISH_SEARCH !== "false";
      const matchCat = selectedCat === "all" || it.category === selectedCat;
      const q = search.trim().toLowerCase();
      const matchBn = it.nameBn.includes(search.trim()) || it.nameBn.toLowerCase().includes(q);
      const matchEn = allowEnSearch && it.nameEn.toLowerCase().includes(q);
      const matchQuery = !q || matchBn || matchEn;
      return matchCat && matchQuery;
    });
  }, [items, selectedCat, search]);

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
              <PackageSearch className="h-5 w-5 text-primary" />
              <span>{lang === "bn" ? "সকল পণ্য" : "All Items"} ({num(items.length)})</span>
            </CardTitle>
            <Badge variant="secondary">{num(filtered.length)} {t("statItems")}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {lang === "bn"
              ? "যেকোনো পণ্যে ক্লিক করে সরাসরি তার একক পেজ, ১১টি বাজারের দাম ও ট্রেন্ড দেখুন"
              : "Click any item to view its individual page with 11-market prices and trend charts"}
          </p>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === "bn" ? "পণ্যের নাম খুঁজুন (যেমন আলু, পেঁয়াজ, রুই মাছ)..." : "Search item (e.g. Potato, Onion, Beef)..."}
              className="pl-9 h-10 bg-background"
            />
          </div>

          {/* Category filter pills */}
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

          {/* Items list */}
          <div className="divide-y divide-border/60 rounded-xl border border-border/60 bg-card overflow-hidden mt-3">
            {filtered.map((it) => {
              const slug = toSlug(it.nameEn);
              return (
                <Link
                  key={it.id}
                  href={`/items/${slug}`}
                  className="flex items-center justify-between p-3.5 hover:bg-secondary/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-2xl group-hover:scale-105 transition-transform">
                      {it.emoji}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm truncate group-hover:text-primary transition-colors flex items-center gap-1.5">
                        <span>{tr(it.nameBn, it.nameEn)}</span>
                        <Badge variant="outline" className="text-[10px] font-normal py-0">
                          {tCat(it.category)}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {t("perUnit")} {tUnit(it.unit)} · /items/{slug}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-primary font-medium hidden sm:inline group-hover:underline">
                      {lang === "bn" ? "বিস্তারিত দেখুন" : "View Details"}
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
