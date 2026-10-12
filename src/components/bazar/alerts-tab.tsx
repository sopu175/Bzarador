"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BellRing, Loader2, Search, Plus, TrendingDown, TrendingUp, Phone } from "lucide-react";
import { useT, useTr, useTCat, useNum, useLang } from "@/lib/i18n";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Item = {
  id: string;
  nameBn: string;
  nameEn: string;
  category: string;
  unit: string;
  emoji: string;
};
type AlertRow = {
  id: string;
  itemId: string;
  marketId: string | null;
  targetPrice: number;
  direction: string;
  phone: string;
  createdAt: string;
  item: Item;
};
type PriceRow = {
  item: { id: string; nameBn: string; nameEn: string; category: string; unit: string; emoji: string };
  avgToday: number | null;
  change: number;
  changePct: number;
};

async function fetchItems(): Promise<{ byCategory: Record<string, Item[]>; categories: string[] }> {
  const res = await fetch("/api/items");
  if (!res.ok) throw new Error("Failed to load items");
  return res.json();
}
async function fetchPrices(): Promise<{ prices: PriceRow[] }> {
  const res = await fetch("/api/prices");
  if (!res.ok) throw new Error("Failed to load prices");
  return res.json();
}
async function fetchAlerts(phone: string): Promise<{ alerts: AlertRow[] }> {
  const res = await fetch(`/api/alerts?phone=${encodeURIComponent(phone)}`);
  if (!res.ok) throw new Error("Failed to load alerts");
  return res.json();
}

export function AlertsTab() {
  const t = useT();
  const tr = useTr();
  const tCat = useTCat();
  const num = useNum();
  const lang = useLang((s) => s.lang);
  const qc = useQueryClient();

  const { data: itemsData } = useQuery({ queryKey: ["items"], queryFn: fetchItems });
  const { data: pricesData } = useQuery({ queryKey: ["prices", "all"], queryFn: fetchPrices });

  const [itemId, setItemId] = useState("");
  const [direction, setDirection] = useState<"below" | "above">("below");
  const [targetPrice, setTargetPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [findPhone, setFindPhone] = useState("");
  const [searchedPhone, setSearchedPhone] = useState("");

  const { data: myAlertsData, isLoading: myAlertsLoading, isFetching: myAlertsFetching } = useQuery({
    queryKey: ["alerts", searchedPhone],
    queryFn: () => fetchAlerts(searchedPhone),
    enabled: !!searchedPhone,
  });

  const myAlerts = myAlertsData?.alerts ?? [];
  const pricesMap = new Map((pricesData?.prices ?? []).map((p) => [p.item.id, p]));
  const selectedItem = itemsData
    ? Object.values(itemsData.byCategory).flat().find((i) => i.id === itemId)
    : null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!itemId || !targetPrice || !phone) {
      toast.error(t("alertsError"));
      return;
    }
    const target = parseFloat(targetPrice);
    if (isNaN(target) || target <= 0 || phone.length < 6) {
      toast.error(t("alertsError"));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          targetPrice: target,
          direction,
          phone,
        }),
      });
      if (!res.ok) throw new Error("submit failed");
      toast.success(t("alertsSuccess"));
      setTargetPrice("");
      // If the same phone was searched, refresh
      if (searchedPhone === phone) {
        qc.invalidateQueries({ queryKey: ["alerts", phone] });
      }
    } catch {
      toast.error(t("alertsError"));
    } finally {
      setSubmitting(false);
    }
  }

  function onFind() {
    const p = findPhone.trim();
    if (p.length < 6) {
      toast.error(t("alertsError"));
      return;
    }
    setSearchedPhone(p);
  }

  return (
    <div className="space-y-4">
      {/* Create alert form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">{t("alertsTitle")}</CardTitle>
              <CardDescription className="text-xs">{t("alertsSubtitle")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Item */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {t("alertsItem")} <span className="text-destructive">*</span>
              </Label>
              <Select value={itemId} onValueChange={setItemId}>
                <SelectTrigger className="h-11 bg-card">
                  <SelectValue placeholder={t("reportPickItem")} />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {itemsData?.categories.map((cat) => (
                    <SelectGroup key={cat}>
                      <SelectLabel className="text-primary font-semibold">{tCat(cat)}</SelectLabel>
                      {itemsData.byCategory[cat].map((it) => {
                        const p = pricesMap.get(it.id);
                        return (
                          <SelectItem key={it.id} value={it.id}>
                            <span className="mr-1.5">{it.emoji}</span>
                            {tr(it.nameBn, it.nameEn)}
                            {p?.avgToday != null && (
                              <span className="ml-1.5 text-xs text-muted-foreground">
                                ({num(p.avgToday)}৳)
                              </span>
                            )}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              {selectedItem && pricesMap.get(selectedItem.id)?.avgToday != null && (
                <p className="text-xs text-muted-foreground">
                  {t("alertsCurrentAvg")}:{" "}
                  <span className="font-semibold text-foreground">
                    {num(pricesMap.get(selectedItem.id)!.avgToday!)}৳
                  </span>
                </p>
              )}
            </div>

            {/* Direction */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                {t("alertsDirection")}
              </Label>
              <RadioGroup
                value={direction}
                onValueChange={(v) => setDirection(v as "below" | "above")}
                className="grid grid-cols-2 gap-2"
              >
                <label
                  htmlFor="dir-below"
                  className={
                    "flex items-center gap-2 rounded-xl border p-3 cursor-pointer transition-colors " +
                    (direction === "below"
                      ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                      : "border-border hover:bg-secondary")
                  }
                >
                  <RadioGroupItem id="dir-below" value="below" className="sr-only" />
                  <TrendingDown className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">{t("alertsBelow")}</span>
                </label>
                <label
                  htmlFor="dir-above"
                  className={
                    "flex items-center gap-2 rounded-xl border p-3 cursor-pointer transition-colors " +
                    (direction === "above"
                      ? "border-red-500 bg-red-50 dark:bg-red-950/30"
                      : "border-border hover:bg-secondary")
                  }
                >
                  <RadioGroupItem id="dir-above" value="above" className="sr-only" />
                  <TrendingUp className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">{t("alertsAbove")}</span>
                </label>
              </RadioGroup>
            </div>

            {/* Target price */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground" htmlFor="target">
                {t("alertsTarget")} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="target"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.5"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="৳"
                  className="h-11 bg-card pr-10 text-lg font-semibold"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">
                  ৳
                </span>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground" htmlFor="phone">
                {t("alertsPhone")} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="h-11 bg-card pl-9"
                  maxLength={20}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting || !itemId || !targetPrice || !phone}
              className="w-full h-11 text-base font-semibold"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("loading")}
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  {t("alertsCreate")}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Find your alerts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            {t("alertsYourAlerts")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="tel"
                inputMode="tel"
                value={findPhone}
                onChange={(e) => setFindPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="h-11 bg-card pl-9"
                maxLength={20}
              />
            </div>
            <Button type="button" onClick={onFind} className="h-11" disabled={!findPhone.trim()}>
              <Search className="h-4 w-4" />
              <span className="sm:hidden">{t("alertsFindBtn")}</span>
              <span className="hidden sm:inline">{t("alertsFindBtn")}</span>
            </Button>
          </div>

          {!searchedPhone ? (
            <div className="py-6 text-center text-xs text-muted-foreground">{t("alertsFind")}</div>
          ) : myAlertsLoading || myAlertsFetching ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : myAlerts.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">{t("alertsNoAlerts")}</div>
          ) : (
            <div className="space-y-2">
              {myAlerts.map((a) => {
                const current = pricesMap.get(a.itemId)?.avgToday ?? null;
                const triggered =
                  current != null &&
                  ((a.direction === "below" && current <= a.targetPrice) ||
                    (a.direction === "above" && current >= a.targetPrice));
                return (
                  <div
                    key={a.id}
                    className={
                      "flex items-center gap-3 rounded-xl border p-3 " +
                      (triggered
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card")
                    }
                  >
                    <span className="text-2xl">{a.item.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate text-sm">
                        {tr(a.item.nameBn, a.item.nameEn)}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        {a.direction === "below" ? (
                          <TrendingDown className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingUp className="h-3 w-3 text-red-500" />
                        )}
                        {a.direction === "below" ? t("alertsBelow") : t("alertsAbove")} {num(a.targetPrice)}৳
                        {current != null && (
                          <>
                            <span className="mx-1">·</span>
                            {t("alertsCurrentAvg")}: {num(current)}৳
                          </>
                        )}
                      </div>
                    </div>
                    {triggered && (
                      <Badge className="bg-primary text-primary-foreground text-[10px] gap-1">
                        <BellRing className="h-3 w-3" />
                        {lang === "bn" ? "সক্রিয়" : "Active"}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

