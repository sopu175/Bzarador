"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Megaphone, CheckCircle2, Loader2, Send } from "lucide-react";
import { useT, useTr, useTCat, useNum } from "@/lib/i18n";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Item = {
  id: string;
  nameBn: string;
  nameEn: string;
  category: string;
  unit: string;
  emoji: string;
};
type Market = {
  id: string;
  nameBn: string;
  nameEn: string;
  district: string;
  upazila: string;
};

async function fetchItems(): Promise<{ byCategory: Record<string, Item[]>; categories: string[] }> {
  const res = await fetch("/api/items");
  if (!res.ok) throw new Error("Failed to load items");
  return res.json();
}

async function fetchMarkets(): Promise<{ byDistrict: Record<string, Market[]>; districts: string[] }> {
  const res = await fetch("/api/markets");
  if (!res.ok) throw new Error("Failed to load markets");
  return res.json();
}

export function ReportTab() {
  const t = useT();
  const tr = useTr();
  const tCat = useTCat();
  const num = useNum();
  const qc = useQueryClient();

  const { data: itemsData } = useQuery({ queryKey: ["items"], queryFn: fetchItems });
  const { data: marketsData } = useQuery({ queryKey: ["markets"], queryFn: fetchMarkets });

  const [itemId, setItemId] = useState("");
  const [marketId, setMarketId] = useState("");
  const [price, setPrice] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [reporterPhone, setReporterPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedItem = itemsData
    ? Object.values(itemsData.byCategory).flat().find((i) => i.id === itemId)
    : null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!itemId || !marketId || !price) {
      toast.error(t("reportError"));
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error(t("reportError"));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          marketId,
          price: priceNum,
          reporterName: reporterName.trim() || "Anonymous",
          reporterPhone: reporterPhone.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("submit failed");
      toast.success(t("reportSuccess"));
      // Reset
      setPrice("");
      // Invalidate affected queries so other tabs reflect new data
      qc.invalidateQueries({ queryKey: ["prices"] });
      qc.invalidateQueries({ queryKey: ["trend"] });
    } catch {
      toast.error(t("reportError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base">{t("reportTitle")}</CardTitle>
            <CardDescription className="text-xs">{t("reportSubtitle")}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Item picker */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              {t("reportItem")} <span className="text-destructive">*</span>
            </Label>
            <Select value={itemId} onValueChange={setItemId}>
              <SelectTrigger className="h-11 bg-card">
                <SelectValue placeholder={t("reportPickItem")} />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {itemsData?.categories.map((cat) => (
                  <SelectGroup key={cat}>
                    <SelectLabel className="text-primary font-semibold">
                      {tCat(cat)}
                    </SelectLabel>
                    {itemsData.byCategory[cat].map((it) => (
                      <SelectItem key={it.id} value={it.id}>
                        <span className="mr-1.5">{it.emoji}</span>
                        {tr(it.nameBn, it.nameEn)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Market picker */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              {t("reportMarket")} <span className="text-destructive">*</span>
            </Label>
            <Select value={marketId} onValueChange={setMarketId}>
              <SelectTrigger className="h-11 bg-card">
                <SelectValue placeholder={t("reportPickMarket")} />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {marketsData?.districts.map((d) => (
                  <SelectGroup key={d}>
                    <SelectLabel className="text-primary font-semibold">{d}</SelectLabel>
                    {marketsData.byDistrict[d].map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {tr(m.nameBn, m.nameEn)} · {m.upazila}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price input */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground" htmlFor="price">
              {t("reportPrice")} <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="price"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.5"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={selectedItem ? `৳ / ${selectedItem.unit}` : "৳"}
                className="h-11 bg-card pr-10 text-lg font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">
                ৳
              </span>
            </div>
            {selectedItem && price && !isNaN(parseFloat(price)) && (
              <p className="text-xs text-muted-foreground">
                {tr(selectedItem.nameBn, selectedItem.nameEn)} · {t("perUnit")} {selectedItem.unit} · {num(parseFloat(price))} ৳
              </p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground" htmlFor="name">
                {t("reportYourName")}
              </Label>
              <Input
                id="name"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="h-11 bg-card"
                maxLength={80}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground" htmlFor="phone">
                {t("reportPhone")}
              </Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="h-11 bg-card"
                maxLength={20}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting || !itemId || !marketId || !price}
            className="w-full h-11 text-base font-semibold"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("loading")}
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t("reportSubmit")}
              </>
            )}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground text-center">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
            {t("reportSubtitle")}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
