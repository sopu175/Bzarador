"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  BellRing,
  Loader2,
  Search,
  Plus,
  TrendingDown,
  TrendingUp,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";
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
  item: {
    id: string;
    nameBn: string;
    nameEn: string;
    category: string;
    unit: string;
    emoji: string;
  };
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
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [findEmail, setFindEmail] = useState("");
  const [searchedEmail, setSearchedEmail] = useState("");

  const {
    data: myAlertsData,
    isLoading: myAlertsLoading,
    isFetching: myAlertsFetching,
  } = useQuery({
    queryKey: ["alerts", searchedEmail],
    queryFn: async () => {
      const res = await fetch(`/api/alerts?email=${encodeURIComponent(searchedEmail)}`);
      if (!res.ok) throw new Error("Failed to load alerts");
      return res.json() as Promise<{ alerts: AlertRow[] }>;
    },
    enabled: !!searchedEmail,
  });

  const myAlerts = myAlertsData?.alerts ?? [];
  const pricesMap = new Map((pricesData?.prices ?? []).map((p) => [p.item.id, p]));
  const selectedItem = itemsData
    ? Object.values(itemsData.byCategory)
        .flat()
        .find((i) => i.id === itemId)
    : null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!itemId || !targetPrice || !email.trim()) {
      toast.error(t("alertsError"));
      return;
    }
    const target = parseFloat(targetPrice);
    if (isNaN(target) || target <= 0 || !email.includes("@")) {
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
          email: email.trim().toLowerCase(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "submit failed");

      toast.success(t("alertsSuccess"), {
        description:
          lang === "bn"
            ? `${email} ঠিকানায় নিশ্চিতকরণ বার্তা পাঠানো হয়েছে।`
            : `Confirmation email sent to ${email}.`,
      });
      setTargetPrice("");
      // If user is searching their own email, refresh
      if (searchedEmail.toLowerCase() === email.trim().toLowerCase()) {
        qc.invalidateQueries({ queryKey: ["alerts", searchedEmail] });
      }
    } catch {
      toast.error(t("alertsError"));
    } finally {
      setSubmitting(false);
    }
  }

  function onFind() {
    const p = findEmail.trim().toLowerCase();
    if (!p || !p.includes("@")) {
      toast.error(
        lang === "bn"
          ? "অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা দিন।"
          : "Please enter a valid email address."
      );
      return;
    }
    setSearchedEmail(p);
  }

  return (
    <div className="space-y-4">
      {/* How it works guidance card */}
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-accent/10 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
            <BellRing className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {lang === "bn" ? "বাজার দর সতর্কতা কিভাবে কাজ করে?" : "How Market Price Alerts Work"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {lang === "bn"
                ? "আপনার কাঙ্ক্ষিত পণ্য এবং লক্ষ্য মূল্য সেট করুন (যেমন: আলু ৩৫ টাকার নিচে নামলে বা পেঁয়াজ ৭০ টাকার উপরে উঠলে)। দেশের যেকোনো বাজারে দাম নির্ধারিত মাত্রায় পৌঁছালে আপনাকে সতর্কবার্তা পাঠানো হবে।"
                : "Select an item and set your desired target threshold (e.g. notify when Potato drops below 35 BDT). You will be notified when real market prices match your preference."}
            </p>
          </div>
        </div>
      </div>

      {/* Create alert form */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Plus className="h-4 w-4" />
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

            {/* Email */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground" htmlFor="email">
                {lang === "bn"
                  ? "আপনার ইমেইল ঠিকানা (যেখানে নোটিফিকেশন যাবে)"
                  : "Your Email Address"}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="h-11 bg-card pl-9"
                  required
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                {lang === "bn"
                  ? "সতর্কতা সেট করার সাথে সাথে একটি নিশ্চিতকরণ ইমেইল পাঠানো হবে।"
                  : "A confirmation email will be dispatched immediately."}
              </p>
            </div>

            <Button
              type="submit"
              disabled={submitting || !itemId || !targetPrice || !email}
              className="w-full h-11 text-base font-semibold cursor-pointer"
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
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                inputMode="email"
                value={findEmail}
                onChange={(e) => setFindEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="h-11 bg-card pl-9"
              />
            </div>
            <Button
              type="button"
              onClick={onFind}
              className="h-11 cursor-pointer"
              disabled={!findEmail.trim()}
            >
              <Search className="h-4 w-4" />
              <span className="sm:hidden">{t("alertsFindBtn")}</span>
              <span className="hidden sm:inline">{t("alertsFindBtn")}</span>
            </Button>
          </div>

          {!searchedEmail ? (
            <div className="py-6 text-center text-xs text-muted-foreground">{t("alertsFind")}</div>
          ) : myAlertsLoading || myAlertsFetching ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : myAlerts.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground">
              {t("alertsNoAlerts")}
            </div>
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
                      (triggered ? "border-primary bg-primary/5" : "border-border bg-card")
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
                        {a.direction === "below" ? t("alertsBelow") : t("alertsAbove")}{" "}
                        {num(a.targetPrice)}৳
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
