"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Navigation,
  Loader2,
  Store,
  ChevronRight,
  Sparkles,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocationStore, MARKET_COORDINATES } from "@/lib/location-store";
import { useT, useTr, useLang } from "@/lib/i18n";
import { toSlug } from "@/lib/slug";
import { toast } from "sonner";

export function LocationBar({ onMarketFilter }: { onMarketFilter?: (marketId: string) => void }) {
  const t = useT();
  const tr = useTr();
  const lang = useLang((s) => s.lang);

  const { location, isLoading, detectLocation, setLocation } = useLocationStore();

  useEffect(() => {
    if (!useLocationStore.getState().location) {
      detectLocation();
    }
  }, [detectLocation]);

  function handleManualSelect(marketId: string) {
    const found = MARKET_COORDINATES.find((m) => m.id === marketId);
    if (found) {
      setLocation({
        district: found.district,
        districtBn: found.districtBn,
        upazila: found.upazila,
        marketId: found.id,
        marketNameBn: found.nameBn,
        marketNameEn: found.nameEn,
        isAutoDetected: false,
      });
      if (onMarketFilter) onMarketFilter(found.id);
      toast.success(
        lang === "bn" ? `${found.nameBn} নির্বাচন করা হয়েছে` : `Selected ${found.nameEn}`
      );
    }
  }

  const marketSlug = location ? toSlug(location.marketNameEn) : "karwan-bazar";

  return (
    <div className="rounded-2xl border border-primary/25 bg-gradient-to-r from-primary/10 via-accent/20 to-primary/5 p-3 sm:p-3.5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Location indicator & closest market recommendation */}
        <div className="flex items-start sm:items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs mt-0.5 sm:mt-0">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] sm:text-xs font-semibold text-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3 text-primary shrink-0" />
                <span>{lang === "bn" ? "আপনার অবস্থান:" : "Location:"}</span>
              </span>
              {location && (
                <Badge
                  variant="secondary"
                  className="text-[9px] sm:text-[10px] py-0 px-1.5 bg-background/80 text-foreground border-border/60 font-medium"
                >
                  {location.isAutoDetected ? (
                    <span className="flex items-center gap-1 text-primary">
                      <Sparkles className="h-2 w-2" />
                      {lang === "bn" ? "অটো ডিটেক্টেড" : "Auto"}
                    </span>
                  ) : (
                    <span>{lang === "bn" ? "নির্ধারিত" : "Set"}</span>
                  )}
                </Badge>
              )}
            </div>

            <div className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5 flex-wrap leading-normal">
              {location ? (
                <>
                  <span className="font-semibold text-primary">
                    {tr(location.marketNameBn, location.marketNameEn)}
                  </span>
                  <span>({location.district})</span>
                  <span>·</span>
                  <Link
                    href={`/markets/${marketSlug}`}
                    className="text-primary hover:underline font-medium inline-flex items-center gap-0.5"
                  >
                    <span>{lang === "bn" ? "বাজার দর দেখুন" : "View Prices"}</span>
                    <ChevronRight className="h-2.5 w-2.5" />
                  </Link>
                </>
              ) : (
                <span>
                  {isLoading
                    ? lang === "bn"
                      ? "অবস্থান শনাক্ত করা হচ্ছে..."
                      : "Detecting location..."
                    : lang === "bn"
                      ? "কারওয়ান বাজার নির্ধারিত"
                      : "Defaulting to Karwan Bazar"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Location changer & Refresh GPS */}
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <Select
            value={location?.marketId ?? MARKET_COORDINATES[0].id}
            onValueChange={handleManualSelect}
          >
            <SelectTrigger className="h-8 text-xs bg-background/90 flex-1 sm:w-[165px] border-border/70">
              <SelectValue placeholder={lang === "bn" ? "অন্য বাজার বাছুন" : "Switch Market"} />
            </SelectTrigger>
            <SelectContent>
              {MARKET_COORDINATES.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {tr(m.nameBn, m.nameEn)} ({m.district})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              detectLocation().then(() => {
                toast.success(lang === "bn" ? "অবস্থান আপডেট হয়েছে!" : "Location refreshed!");
              });
            }}
            disabled={isLoading}
            className="h-8 px-2.5 bg-background/80 hover:bg-background border-border/70 gap-1 text-xs"
            title={lang === "bn" ? "পুনরায় জিপিএস অবস্থান যাচাই" : "Refresh GPS"}
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">GPS</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
