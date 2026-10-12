"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, Globe, Loader2, Clock, Radio } from "lucide-react";
import { useT, useLang, useNum } from "@/lib/i18n";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type LiveStatus = {
  lastRefresh: {
    id: string;
    startedAt: string;
    finishedAt: string | null;
    status: string;
    itemsFetched: number;
    sourcesUsed: string;
    error: string | null;
  } | null;
  todayLiveReports: number;
};

async function fetchStatus(): Promise<LiveStatus> {
  const res = await fetch("/api/prices/live");
  if (!res.ok) throw new Error("failed");
  return res.json();
}

export function LiveUpdatePanel() {
  const t = useT();
  const num = useNum();
  const lang = useLang((s) => s.lang);
  const qc = useQueryClient();
  const [fetching, setFetching] = useState(false);

  const { data: status } = useQuery({
    queryKey: ["live-status"],
    queryFn: fetchStatus,
    staleTime: 30_000,
  });

  async function onFetch() {
    setFetching(true);
    try {
      const res = await fetch("/api/prices/live", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "failed");
      }
      toast.success(t("liveSuccess"), {
        description: t("liveSuccessDesc").replace("{n}", String(data.itemsFetched)),
      });
      // Invalidate all price queries so new live prices show up
      qc.invalidateQueries({ queryKey: ["prices"] });
      qc.invalidateQueries({ queryKey: ["trend"] });
      qc.invalidateQueries({ queryKey: ["live-status"] });
      qc.invalidateQueries({ queryKey: ["stats"] });
    } catch (e) {
      toast.error(t("liveError"), { description: (e as Error).message });
    } finally {
      setFetching(false);
    }
  }

  const last = status?.lastRefresh;
  const sources = last?.sourcesUsed ? last.sourcesUsed.split(", ").filter(Boolean) : [];

  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/8 via-card to-accent/20 p-3.5 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs mt-0.5">
            <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-sm sm:text-base flex items-center gap-1.5 flex-wrap">
              <span>{t("liveUpdate")}</span>
              <Badge variant="outline" className="text-[10px] py-0 gap-1 border-primary/40 text-primary">
                <Radio className="h-2 w-2" />
                {t("liveBadge")}
              </Badge>
            </div>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-normal">
              {lang === "bn"
                ? "অনলাইন থেকে আজকের বাস্তব বাজার দাম সংগ্রহ করুন"
                : "Pull today's real market prices from the web"}
            </p>
          </div>
        </div>
        <Button onClick={onFetch} disabled={fetching} className="w-full sm:w-auto shrink-0 h-8 sm:h-9 text-xs sm:text-sm shadow-xs">
          {fetching ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>{t("liveFetching")}</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{last ? t("liveRefresh") : t("liveFetchBtn")}</span>
            </>
          )}
        </Button>
      </div>

      {/* Status row */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-muted-foreground pt-2.5 border-t border-border/40">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] sm:text-xs">
          {last ? (
            <>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{t("liveLastUpdated")}:</span>
                <span className="font-medium text-foreground">
                  {formatTime(last.finishedAt ?? last.startedAt, lang)}
                </span>
              </span>
              {last.itemsFetched > 0 && (
                <span>
                  <span className="font-semibold text-primary">{last.itemsFetched}</span>{" "}
                  {t("reportCount")}
                </span>
              )}
              {sources.length > 0 && (
                <span className="inline-flex items-center gap-1.5 flex-wrap">
                  <span>{t("liveSources")}:</span>
                  {sources.map((s) => {
                    let href = "https://www.google.com/search?q=" + encodeURIComponent(s + " বাজার দর বাংলাদেশ");
                    const sLower = s.toLowerCase();
                    if (sLower.includes("tbs") || sLower.includes("business standard")) href = "https://www.tbsnews.net";
                    else if (sLower.includes("dhaka tribune")) href = "https://www.dhakatribune.com";
                    else if (sLower.includes("daily star")) href = "https://www.thedailystar.net";
                    else if (sLower.includes("prothom alo")) href = "https://www.prothomalo.com";
                    else if (sLower.includes("ittefaq")) href = "https://www.ittefaq.com.bd";
                    else if (sLower.includes("jago news")) href = "https://www.jagonews24.com";
                    else if (sLower.includes("dhaka post")) href = "https://www.dhakapost.com";
                    else if (sLower.includes("dam") || sLower.includes("কৃষি বিপণন")) href = "http://www.dam.gov.bd";

                    return (
                      <a
                        key={s}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:opacity-80 transition-opacity"
                      >
                        <Badge variant="secondary" className="text-[10px] py-0 cursor-pointer hover:bg-primary/15 hover:text-primary">
                          {s} ↗
                        </Badge>
                      </a>
                    );
                  })}
                </span>
              )}
              {last.status === "error" && (
                <span className="text-destructive">⚠ {last.error?.slice(0, 60)}</span>
              )}
            </>
          ) : (
            <span>{t("liveNever")}</span>
          )}
        </div>

        {status && status.todayLiveReports > 0 && (
          <span
            className="inline-flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20 text-[11px] sm:text-xs self-start sm:self-auto shrink-0"
            title={
              lang === "bn"
                ? "দেশজুড়ে ১১টি বাজারে ৫৪টি পণ্যের জন্য আজ মোট সংগৃহীত লাইভ দামের রিপোর্ট সংখ্যা"
                : "Total live price entries collected today across 11 markets for all 54 items"
            }
          >
            <Radio className="h-2.5 w-2.5 text-primary animate-pulse" />
            <span className="font-semibold text-primary">{num(status.todayLiveReports)}</span>{" "}
            <span>{t("liveReportsToday")}</span>
          </span>
        )}
      </div>
    </div>
  );
}

function formatTime(iso: string, lang: "bn" | "en") {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  };
  const s = d.toLocaleString(lang === "bn" ? "bn-BD" : "en-GB", opts);
  return s;
}
