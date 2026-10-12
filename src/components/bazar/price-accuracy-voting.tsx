"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ThumbsUp, ThumbsDown, CheckCircle2, TrendingUp, TrendingDown, Users } from "lucide-react";
import { useT, useTr, useNum, useLang } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type VoteStats = {
  accurate: number;
  high: number;
  cheap: number;
  total: number;
};

async function fetchVotes(itemId: string): Promise<VoteStats> {
  const res = await fetch(`/api/votes?itemId=${itemId}`);
  if (!res.ok) throw new Error("Failed to load votes");
  return res.json();
}

export function PriceAccuracyVoting({
  itemId,
  itemNameBn,
  itemNameEn,
}: {
  itemId: string;
  itemNameBn: string;
  itemNameEn: string;
}) {
  const t = useT();
  const tr = useTr();
  const num = useNum();
  const lang = useLang((s) => s.lang);
  const qc = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [voted, setVoted] = useState<string | null>(null);

  const { data: stats } = useQuery({
    queryKey: ["votes", itemId],
    queryFn: () => fetchVotes(itemId),
    staleTime: 30_000,
  });

  async function handleVote(voteType: "accurate" | "high" | "cheap") {
    if (voted) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, voteType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setVoted(voteType);
      toast.success(t("voteSuccess"));
      qc.invalidateQueries({ queryKey: ["votes", itemId] });
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  const accurateCount = stats?.accurate ?? 0;
  const highCount = stats?.high ?? 0;
  const cheapCount = stats?.cheap ?? 0;
  const total = stats?.total ?? 0;

  const accuratePct = total > 0 ? Math.round((accurateCount / total) * 100) : 0;

  return (
    <Card className="border-border/60 bg-gradient-to-br from-card via-card to-secondary/30">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              {t("priceAccuracy")}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lang === "bn"
                ? `আজকের ${itemNameBn} এর দাম কি বাস্তবসম্মত মনে হচ্ছে? আপনার ভোট দিন:`
                : `Does today's price for ${itemNameEn} feel accurate? Cast your vote:`}
            </p>
          </div>
          {total > 0 && (
            <div className="text-right">
              <span className="text-xs font-semibold text-primary">
                {num(accuratePct)}% {lang === "bn" ? "সঠিক বলেছে" : "accurate"}
              </span>
              <span className="text-[10px] text-muted-foreground block">
                ({num(total)} {lang === "bn" ? "টি ভোট" : "votes"})
              </span>
            </div>
          )}
        </div>

        {/* Voting action buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={voted === "accurate" ? "default" : "outline"}
            size="sm"
            disabled={submitting || !!voted}
            onClick={() => handleVote("accurate")}
            className="h-10 text-xs flex flex-col sm:flex-row items-center gap-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
            <span>{t("voteAccurate")}</span>
            <span className="text-[10px] font-bold opacity-80 tabular-nums">({num(accurateCount)})</span>
          </Button>

          <Button
            variant={voted === "high" ? "default" : "outline"}
            size="sm"
            disabled={submitting || !!voted}
            onClick={() => handleVote("high")}
            className="h-10 text-xs flex flex-col sm:flex-row items-center gap-1.5"
          >
            <TrendingUp className="h-3.5 w-3.5 text-red-500" />
            <span>{t("voteHigh")}</span>
            <span className="text-[10px] font-bold opacity-80 tabular-nums">({num(highCount)})</span>
          </Button>

          <Button
            variant={voted === "cheap" ? "default" : "outline"}
            size="sm"
            disabled={submitting || !!voted}
            onClick={() => handleVote("cheap")}
            className="h-10 text-xs flex flex-col sm:flex-row items-center gap-1.5"
          >
            <TrendingDown className="h-3.5 w-3.5 text-emerald-600" />
            <span>{t("voteCheap")}</span>
            <span className="text-[10px] font-bold opacity-80 tabular-nums">({num(cheapCount)})</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
