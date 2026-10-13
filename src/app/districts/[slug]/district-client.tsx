"use client";

import Link from "next/link";
import { ArrowLeft, Users, Store, MapPin, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toSlug } from "@/lib/slug";
import { useT, useTr, useNum, useLang } from "@/lib/i18n";

export function DistrictDetailClient({
  districtSlug,
  districtNameBn,
  districtNameEn,
  markets,
}: {
  districtSlug: string;
  districtNameBn: string;
  districtNameEn: string;
  markets: any[];
}) {
  const t = useT();
  const tr = useTr();
  const num = useNum();
  const lang = useLang((s) => s.lang);

  const totalReports = markets.reduce((acc, m) => acc + (m._count?.reports ?? 0), 0);

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

      {/* District Header Card */}
      <Card className="overflow-hidden border-border/60">
        <div className="p-5 bg-gradient-to-br from-primary/10 via-card to-secondary/30 border-b border-border/50">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary shadow-sm border border-border/60">
                <Users className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold truncate">
                  {tr(districtNameBn, districtNameEn)} {lang === "bn" ? "জেলা" : "District"}
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  {lang === "bn"
                    ? `${districtNameBn} জেলার আওতাধীন সক্রিয় বাজার ও বাজার দর`
                    : `Active kitchen markets and commodity rates in ${districtNameEn}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Numbers */}
        <div className="grid grid-cols-2 gap-2 p-4 bg-card text-center border-b border-border/40">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">
              {t("statMarkets")}
            </div>
            <div className="text-lg font-bold text-primary">{num(markets.length)}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-secondary">
            <div className="text-[10px] text-muted-foreground uppercase font-semibold">
              {t("statReports")}
            </div>
            <div className="text-lg font-bold text-foreground">{num(totalReports)}</div>
          </div>
        </div>
      </Card>

      {/* Markets in District */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Store className="h-4 w-4 text-primary" />
              <span>
                {lang === "bn"
                  ? `${districtNameBn} জেলার বাজার সমূহ`
                  : `Markets in ${districtNameEn}`}
              </span>
            </CardTitle>
            <Badge variant="secondary">{num(markets.length)}</Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y divide-border/60">
            {markets.map((m) => {
              const marketSlug = toSlug(m.nameEn);
              return (
                <Link
                  key={m.id}
                  href={`/markets/${marketSlug}`}
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
                        <span>{m.upazila}</span>
                        <span>·</span>
                        <span>
                          {num(m._count?.reports ?? 0)} {t("statReports")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-primary font-medium hidden sm:inline group-hover:underline">
                      {lang === "bn" ? "বাজার দর দেখুন" : "View Prices"}
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
