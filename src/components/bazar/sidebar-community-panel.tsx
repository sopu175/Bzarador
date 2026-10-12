"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  BellRing,
  TrendingDown,
  TrendingUp,
  MessageSquarePlus,
  Star,
  Plus,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useT, useTr, useNum, useLang } from "@/lib/i18n";
import { toSlug } from "@/lib/slug";

export function SidebarCommunityPanel() {
  const t = useT();
  const tr = useTr();
  const num = useNum();
  const lang = useLang((s) => s.lang);

  const [activeSubTab, setActiveSubTab] = useState<"alerts" | "feedback">("alerts");

  // Fetch recent active price alerts
  const { data: alertsData } = useQuery({
    queryKey: ["alerts", "sidebar"],
    queryFn: async () => {
      const res = await fetch("/api/alerts");
      if (!res.ok) return { alerts: [] };
      return res.json() as Promise<{ alerts: any[] }>;
    },
    staleTime: 30_000,
  });

  // Fetch recent user reviews/feedback
  const { data: feedbackData } = useQuery({
    queryKey: ["feedback", "sidebar"],
    queryFn: async () => {
      const res = await fetch("/api/feedback");
      if (!res.ok) return { feedbacks: [] };
      return res.json() as Promise<{ feedbacks: any[] }>;
    },
    staleTime: 30_000,
  });

  const alerts = (alertsData?.alerts ?? []).slice(0, 6);
  const feedbacks = (feedbackData?.feedbacks ?? []).slice(0, 5);

  return (
    <Card className="border-primary/20 shadow-xs overflow-hidden">
      <CardHeader className="p-3.5 pb-2 bg-gradient-to-r from-secondary/50 via-card to-background border-b border-border/50">
        <div className="flex items-center justify-between gap-2">
          <Tabs value={activeSubTab} onValueChange={(v) => setActiveSubTab(v as any)} className="w-full">
            <TabsList className="h-8 bg-secondary/80 p-0.5 w-full grid grid-cols-2">
              <TabsTrigger value="alerts" className="text-xs px-2 py-1 flex items-center gap-1.5">
                <BellRing className="h-3 w-3 text-amber-500" />
                <span>{lang === "bn" ? "সক্রিয় সতর্কতা" : "Active Alerts"}</span>
                {alerts.length > 0 && (
                  <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">
                    {num(alerts.length)}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="feedback" className="text-xs px-2 py-1 flex items-center gap-1.5">
                <MessageSquarePlus className="h-3 w-3 text-primary" />
                <span>{lang === "bn" ? "ইউজার রিভিউ" : "User Reviews"}</span>
                {feedbacks.length > 0 && (
                  <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4">
                    {num(feedbacks.length)}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="p-3 space-y-3">
        {activeSubTab === "alerts" && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-green-600" />
                {lang === "bn"
                  ? "দাম পরিবর্তন হলে ক্রেতারা স্বয়ংক্রিয় বার্তা পান"
                  : "Buyers get notified when target prices hit"}
              </span>
              <a
                href="#alerts"
                className="text-primary hover:underline text-[11px] font-semibold inline-flex items-center gap-0.5"
              >
                <span>+ {lang === "bn" ? "নতুন এলার্ট" : "Set Alert"}</span>
              </a>
            </div>

            {alerts.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                {lang === "bn" ? "কোনো সক্রিয় সতর্কতা পাওয়া যায়নি" : "No active alerts found"}
              </div>
            ) : (
              <div className="divide-y divide-border/50 rounded-xl border border-border/50 overflow-hidden bg-card/60 text-xs">
                {alerts.map((al) => {
                  const slug = toSlug(al.item?.nameEn || "item");
                  let contactDisplay = "ক্রেতা";
                  let isEmail = false;
                  if (al.email) {
                    isEmail = true;
                    const parts = al.email.split("@");
                    contactDisplay = parts[0].slice(0, 2) + "***@" + (parts[1] || "mail.com");
                  } else if (al.phone) {
                    contactDisplay = al.phone.slice(0, 3) + "***" + al.phone.slice(-3);
                  }

                  return (
                    <div
                      key={al.id}
                      className="p-2.5 flex items-center justify-between gap-2 hover:bg-secondary/40 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Link
                          href={`/items/${slug}`}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-base hover:scale-105 transition-transform"
                        >
                          {al.item?.emoji || "📦"}
                        </Link>
                        <div className="min-w-0">
                          <Link
                            href={`/items/${slug}`}
                            className="font-semibold text-xs text-foreground hover:text-primary transition-colors truncate block"
                          >
                            {tr(al.item?.nameBn, al.item?.nameEn)}
                          </Link>
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <span className="flex items-center gap-0.5">
                              {isEmail ? <Mail className="h-2.5 w-2.5" /> : <Phone className="h-2.5 w-2.5" />}
                              <span>{contactDisplay}</span>
                            </span>
                            <span>·</span>
                            <span className="text-[10px]">
                              {al.direction === "below" ? (
                                <span className="text-green-600 inline-flex items-center gap-0.5 font-medium">
                                  <TrendingDown className="h-2.5 w-2.5" />
                                  {lang === "bn" ? "দাম কমলে" : "Below"}
                                </span>
                              ) : (
                                <span className="text-red-500 inline-flex items-center gap-0.5 font-medium">
                                  <TrendingUp className="h-2.5 w-2.5" />
                                  {lang === "bn" ? "দাম বাড়লে" : "Above"}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <div className="font-bold text-xs text-foreground">
                          {num(al.targetPrice)}৳
                        </div>
                        <div className="text-[9px] text-muted-foreground">
                          {lang === "bn" ? "টার্গেট দর" : "Target"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeSubTab === "feedback" && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] text-muted-foreground">
                {lang === "bn" ? "কমিউনিটি ইউজারদের বাস্তব মতামত" : "Real feedback from community users"}
              </span>
              <a
                href="#feedback"
                className="text-primary hover:underline text-[11px] font-semibold inline-flex items-center gap-0.5"
              >
                <span>+ {lang === "bn" ? "মতামত দিন" : "Write Review"}</span>
              </a>
            </div>

            {feedbacks.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                {lang === "bn" ? "এখনও কোনো মতামত আসেনি" : "No feedback yet"}
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {feedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-2.5 rounded-xl border border-border/60 bg-card/60 hover:bg-secondary/30 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                          {fb.name ? fb.name.charAt(0) : "U"}
                        </span>
                        <span className="font-semibold text-xs truncate text-foreground">
                          {fb.name || (lang === "bn" ? "বেনামী ক্রেতা" : "Anonymous")}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-2.5 w-2.5 ${
                              i < fb.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                      &quot;{fb.comment}&quot;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
