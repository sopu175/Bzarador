import { useMemo, useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  TrendingUp,
  TrendingDown,
  PackageOpen,
  Radio,
  ArrowUpDown,
  SlidersHorizontal,
  RotateCcw,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useT, useTr, useTUnit, useTCat, useNum, useLang } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { ChangeBadge } from "./change-badge";
import { ItemDetailsModal } from "./item-details-modal";
import { useLocationStore } from "@/lib/location-store";
import { MapPin, ExternalLink } from "lucide-react";
import { toSlug } from "@/lib/slug";
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

async function fetchPrices(marketId?: string): Promise<{ prices: PriceRow[] }> {
  const url = marketId ? `/api/prices?marketId=${marketId}` : "/api/prices";
  const res = await fetch(url);
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

  const { location } = useLocationStore();
  const [filterByMyMarket, setFilterByMyMarket] = useState(false);

  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState<string>("all");
  const [directionFilter, setDirectionFilter] = useState<"all" | "gainers" | "losers" | "steady">(
    "all"
  );
  const [sortBy, setSortBy] = useState<
    "popular" | "price-asc" | "price-desc" | "change-desc" | "change-asc"
  >("popular");
  const [liveOnly, setLiveOnly] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const activeMarketId = filterByMyMarket && location?.marketId ? location.marketId : undefined;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["prices", activeMarketId ?? "all"],
    queryFn: () => fetchPrices(activeMarketId),
  });

  const prices = data?.prices ?? [];

  // Categories present in data
  const categories = useMemo(() => {
    const set = new Set(prices.map((p) => p.item.category));
    return ["all", ...Array.from(set).sort()];
  }, [prices]);

  // Base list filtered by Category & Search (used to feed movers cards so they stay in sync)
  const categoryFilteredPrices = useMemo(() => {
    let list = prices;
    if (activeCat !== "all") list = list.filter((p) => p.item.category === activeCat);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const allowEnSearch = process.env.NEXT_PUBLIC_ENABLE_ENGLISH_SEARCH !== "false";
      list = list.filter((p) => {
        const matchesBn =
          p.item.nameBn.toLowerCase().includes(q) || p.item.nameBn.includes(search.trim());
        const matchesEn = allowEnSearch && p.item.nameEn.toLowerCase().includes(q);
        return matchesBn || matchesEn;
      });
    }
    return list;
  }, [prices, activeCat, search]);

  // Full filtered list considering direction, liveOnly, and sorting
  const filtered = useMemo(() => {
    let list = [...categoryFilteredPrices];
    if (liveOnly) list = list.filter((p) => !!p.liveSource);

    if (directionFilter === "gainers") list = list.filter((p) => p.change > 0);
    else if (directionFilter === "losers") list = list.filter((p) => p.change < 0);
    else if (directionFilter === "steady") list = list.filter((p) => p.change === 0);

    // Apply Sorting
    list.sort((a, b) => {
      if (sortBy === "price-asc") {
        return (a.avgToday ?? 0) - (b.avgToday ?? 0);
      }
      if (sortBy === "price-desc") {
        return (b.avgToday ?? 0) - (a.avgToday ?? 0);
      }
      if (sortBy === "change-desc") {
        return b.changePct - a.changePct;
      }
      if (sortBy === "change-asc") {
        return a.changePct - b.changePct;
      }
      // default: popular (report count desc, live first)
      if (!!a.liveSource !== !!b.liveSource) return a.liveSource ? -1 : 1;
      return b.reportCount - a.reportCount;
    });

    return list;
  }, [categoryFilteredPrices, liveOnly, directionFilter, sortBy]);

  // Progressive loading / Infinite scroll on scroll
  const [visibleCount, setVisibleCount] = useState(16);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset visibleCount whenever user changes search, category, or filter without calling setState synchronously in an effect
  const filterKey = `${search}_${activeCat}_${directionFilter}_${sortBy}_${liveOnly}_${filterByMyMarket}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setVisibleCount(16);
  }

  // IntersectionObserver to auto-load more items as user scrolls down
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          setVisibleCount((prev) => {
            if (prev >= filtered.length) return prev;
            return Math.min(prev + 12, filtered.length);
          });
        }
      },
      { rootMargin: "250px" }
    );

    const el = sentinelRef.current;
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [filtered.length]);

  const visiblePrices = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = visibleCount < filtered.length;

  const liveCount = categoryFilteredPrices.filter((p) => p.liveSource).length;

  // Gainers and Losers dynamically calculated from the currently selected category/search
  const gainers = useMemo(
    () =>
      [...categoryFilteredPrices]
        .filter((p) => p.change > 0)
        .sort((a, b) => b.changePct - a.changePct)
        .slice(0, 6),
    [categoryFilteredPrices]
  );
  const losers = useMemo(
    () =>
      [...categoryFilteredPrices]
        .filter((p) => p.change < 0)
        .sort((a, b) => a.changePct - b.changePct)
        .slice(0, 6),
    [categoryFilteredPrices]
  );

  return (
    <div className="space-y-5">
      {/* Search and interactive category pills */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchItem")}
            className="pl-9 h-11 bg-card rounded-xl"
          />
        </div>

        {/* Categories scrollable pill list */}
        <div className="flex gap-2 overflow-x-auto pb-1 thin-scroll -mx-1 px-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium border transition-colors cursor-pointer",
                activeCat === c
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-foreground/75 border-border hover:bg-secondary hover:text-foreground"
              )}
            >
              {c === "all" ? t("allMarkets") : tCat(c)}
            </button>
          ))}
          {liveCount > 0 && (
            <button
              onClick={() => setLiveOnly((v) => !v)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-medium border transition-colors inline-flex items-center gap-1.5 cursor-pointer",
                liveOnly
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground/75 border-border hover:bg-secondary"
              )}
            >
              <Radio className="h-3.5 w-3.5" />
              {t("liveBadge")} {num(liveCount)}
            </button>
          )}
        </div>

        {/* Secondary filters toolbar: Price Direction filter + Sorter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1.5 border-t border-border/40">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-muted-foreground mr-1 flex items-center gap-1 shrink-0">
              <SlidersHorizontal className="h-3 w-3" />
              {lang === "bn" ? "ফিল্টার:" : "Filter:"}
            </span>
            {location && (
              <button
                onClick={() => setFilterByMyMarket(!filterByMyMarket)}
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-medium border transition-colors inline-flex items-center gap-1 cursor-pointer shrink-0",
                  filterByMyMarket
                    ? "bg-primary text-primary-foreground border-primary font-semibold shadow-2xs"
                    : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                )}
              >
                <MapPin className="h-3 w-3" />
                <span>{tr(location.marketNameBn, location.marketNameEn)}</span>
              </button>
            )}
            <button
              onClick={() => {
                setDirectionFilter("all");
                setFilterByMyMarket(false);
              }}
              className={cn(
                "rounded-lg px-2 py-1 text-xs font-medium border transition-colors cursor-pointer shrink-0",
                directionFilter === "all" && !filterByMyMarket
                  ? "bg-secondary text-foreground border-border font-semibold"
                  : "bg-transparent text-muted-foreground border-transparent hover:bg-secondary/40"
              )}
            >
              {t("filterAll")}
            </button>
            <button
              onClick={() => setDirectionFilter("gainers")}
              className={cn(
                "rounded-lg px-2 py-1 text-xs font-medium border transition-colors inline-flex items-center gap-1 cursor-pointer shrink-0",
                directionFilter === "gainers"
                  ? "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30 font-semibold"
                  : "bg-transparent text-muted-foreground border-transparent hover:bg-red-500/10"
              )}
            >
              <TrendingUp className="h-3 w-3 text-red-500" />
              {t("filterGainersOnly")}
            </button>
            <button
              onClick={() => setDirectionFilter("losers")}
              className={cn(
                "rounded-lg px-2 py-1 text-xs font-medium border transition-colors inline-flex items-center gap-1 cursor-pointer shrink-0",
                directionFilter === "losers"
                  ? "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/30 font-semibold"
                  : "bg-transparent text-muted-foreground border-transparent hover:bg-green-500/10"
              )}
            >
              <TrendingDown className="h-3 w-3 text-green-600" />
              {t("filterLosersOnly")}
            </button>
            <button
              onClick={() => setDirectionFilter("steady")}
              className={cn(
                "rounded-lg px-2 py-1 text-xs font-medium border transition-colors cursor-pointer shrink-0",
                directionFilter === "steady"
                  ? "bg-secondary text-foreground border-border font-semibold"
                  : "bg-transparent text-muted-foreground border-transparent hover:bg-secondary/40"
              )}
            >
              {t("filterSteadyOnly")}
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
              <ArrowUpDown className="h-3 w-3" />
              {t("sortLabel")}:
            </span>
            <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
              <SelectTrigger className="h-8 text-xs bg-card flex-1 sm:w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">{t("sortPopular")}</SelectItem>
                <SelectItem value="price-asc">{t("sortPriceAsc")}</SelectItem>
                <SelectItem value="price-desc">{t("sortPriceDesc")}</SelectItem>
                <SelectItem value="change-desc">{t("sortChangeDesc")}</SelectItem>
                <SelectItem value="change-asc">{t("sortChangeAsc")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Top movers (dynamically updated per active category/search filter) */}
      {(isLoading || gainers.length > 0 || losers.length > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          <MoversCard
            title={activeCat === "all" ? t("topGainers") : `${tCat(activeCat)}: ${t("topGainers")}`}
            icon={<TrendingUp className="h-4 w-4 text-red-500" />}
            accent="red"
            rows={gainers}
            loading={isLoading}
            onSelect={(id) => setSelectedItemId(id)}
          />
          <MoversCard
            title={activeCat === "all" ? t("topLosers") : `${tCat(activeCat)}: ${t("topLosers")}`}
            icon={<TrendingDown className="h-4 w-4 text-green-600" />}
            accent="green"
            rows={losers}
            loading={isLoading}
            onSelect={(id) => setSelectedItemId(id)}
          />
        </div>
      )}

      {/* Full price list */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base flex items-center gap-2">
                <span>{t("todayTitle")}</span>
                {activeCat !== "all" && (
                  <Badge variant="outline" className="text-xs font-normal">
                    {tCat(activeCat)}
                  </Badge>
                )}
              </CardTitle>
              <Badge variant="secondary" className="font-normal">
                {num(filtered.length)} {t("statItems")}
              </Badge>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground hidden md:inline">
                {lang === "bn" ? "বিস্তারিত দেখতে পণ্যে ক্লিক করুন" : "Click item for 11 markets"}
              </span>
              <Link
                href="/items"
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline bg-primary/10 hover:bg-primary/15 px-2.5 py-1 rounded-lg transition-colors"
              >
                <span>{lang === "bn" ? "সকল পণ্য পেজ" : "All Products Page"}</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isError ? (
            <div className="p-6 text-center text-sm text-destructive">{t("noResults")}</div>
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
              {(activeCat !== "all" || directionFilter !== "all" || search) && (
                <button
                  onClick={() => {
                    setActiveCat("all");
                    setDirectionFilter("all");
                    setSearch("");
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary underline cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  {t("resetFilters")}
                </button>
              )}
            </div>
          ) : (
            <div>
              <div className="divide-y divide-border">
                {visiblePrices.map((p) => (
                  <PriceRowCard
                    key={p.item.id}
                    row={p}
                    onClick={() => setSelectedItemId(p.item.id)}
                  />
                ))}
              </div>

              {/* Scroll Sentinel / Progressive loading indicator */}
              {hasMore && (
                <div
                  ref={sentinelRef}
                  className="p-4 flex flex-col items-center justify-center gap-2 border-t border-border/40 bg-secondary/20"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>
                      {lang === "bn"
                        ? `স্ক্রোল করে আরও পণ্য লোড হচ্ছে (${num(visibleCount)}/${num(filtered.length)})...`
                        : `Loading more items on scroll (${num(visibleCount)}/${num(filtered.length)})...`}
                    </span>
                  </div>
                  <button
                    onClick={() => setVisibleCount((prev) => Math.min(prev + 16, filtered.length))}
                    className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                  >
                    {lang === "bn" ? "বা ক্লিক করে একবারে আরও লোড করুন" : "Or click to load more"}
                  </button>
                </div>
              )}

              {/* All items loaded footer inside table */}
              {!hasMore && filtered.length > 16 && (
                <div className="p-3 text-center text-xs text-muted-foreground bg-secondary/10 border-t border-border/40 flex items-center justify-center gap-2">
                  <span>
                    {lang === "bn"
                      ? `সকল ${num(filtered.length)}টি পণ্য লোড হয়েছে`
                      : `All ${num(filtered.length)} items loaded`}
                  </span>
                  <span>·</span>
                  <Link href="/items" className="text-primary hover:underline font-medium">
                    {lang === "bn" ? "পূর্ণাঙ্গ পণ্য ক্যাটাগরি ভিউ" : "Full Catalog View"} →
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Clickable Modal to show 11 markets breakdown for the selected item */}
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

function PriceRowCard({ row, onClick }: { row: PriceRow; onClick: () => void }) {
  const t = useT();
  const tr = useTr();
  const tUnit = useTUnit();
  const num = useNum();
  const tCat = useTCat();
  const lang = useLang((s) => s.lang);
  const slug = toSlug(row.item.nameEn);

  return (
    <div className="flex items-center gap-3 p-3.5 hover:bg-secondary/60 transition-colors group">
      {/* Product Emoji & Direct Link to product page */}
      <Link
        href={`/items/${slug}`}
        title={`${tr(row.item.nameBn, row.item.nameEn)} ${lang === "bn" ? "পূর্ণাঙ্গ পেজ" : "Full Page"}`}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-2xl group-hover:scale-105 transition-transform hover:ring-2 hover:ring-primary/40"
      >
        {row.item.emoji}
      </Link>

      {/* Main Item info - Clicking opens the 11-market details modal */}
      <div onClick={onClick} className="min-w-0 flex-1 cursor-pointer">
        <div className="flex items-center gap-2">
          <Link
            href={`/items/${slug}`}
            onClick={(e) => e.stopPropagation()}
            className="font-semibold truncate hover:text-primary transition-colors hover:underline"
          >
            {tr(row.item.nameBn, row.item.nameEn)}
          </Link>
          {row.liveSource && (
            <a
              href={row.liveSourceUrl ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={row.liveSourceUrl ?? row.liveSource}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] font-semibold hover:bg-primary/20 transition-colors"
            >
              <Radio className="h-2.5 w-2.5" />
              {t("liveBadge")}
            </a>
          )}
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 hidden sm:inline-flex font-normal"
          >
            {tCat(row.item.category)}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground mt-0.5 truncate flex items-center gap-1.5">
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
            <span>
              {t("perUnit")} {tUnit(row.item.unit)} · ১১টি বাজার
            </span>
          )}
        </div>
      </div>

      {/* Price & Action links */}
      <div className="text-right flex items-center gap-2 shrink-0">
        <div onClick={onClick} className="cursor-pointer">
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

        {/* Direct link button to /items/[slug] */}
        <Link
          href={`/items/${slug}`}
          title={`${tr(row.item.nameBn, row.item.nameEn)} ${lang === "bn" ? "এর পূর্ণাঙ্গ পেজ দেখুন" : "View Full Page"}`}
          className="p-1.5 text-muted-foreground/60 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors ml-1"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
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
  onSelect,
}: {
  title: string;
  icon: React.ReactNode;
  accent: "red" | "green";
  rows: PriceRow[];
  loading: boolean;
  onSelect?: (itemId: string) => void;
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
                onClick={() => onSelect?.(r.item.id)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-secondary transition-colors cursor-pointer group"
              >
                <span className="text-lg group-hover:scale-110 transition-transform">
                  {r.item.emoji}
                </span>
                <span className="flex-1 min-w-0 truncate text-sm font-medium group-hover:text-primary transition-colors">
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
