"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { History, TrendingUp, Landmark, BadgePercent, Coins, DollarSign, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { historical20YearsData, EconomicYearData } from "@/lib/historical-data";
import { useT, useTr, useNum, useLang } from "@/lib/i18n";

type MetricCategory = "commodities" | "macro" | "ratio";

export function HistoricalEconomicGraph() {
  const t = useT();
  const tr = useTr();
  const num = useNum();
  const lang = useLang((s) => s.lang);

  const [category, setCategory] = useState<MetricCategory>("commodities");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showDataTable, setShowDataTable] = useState(false);

  // Key calculation insights (2005 vs 2025 Benchmark)
  const d2005 = historical20YearsData[0];
  const d2025 = historical20YearsData[historical20YearsData.length - 1];

  const riceMultiplier = Number((d2025.riceMinicate / d2005.riceMinicate).toFixed(1));
  const beefMultiplier = Number((d2025.beef / d2005.beef).toFixed(1));
  const oilMultiplier = Number((d2025.soybeanOil / d2005.soybeanOil).toFixed(1));
  const hilsaMultiplier = Number((d2025.hilsaFish / d2005.hilsaFish).toFixed(1));
  const wageMultiplier = Number((d2025.dailyLaborWage / d2005.dailyLaborWage).toFixed(1));
  const gdpMultiplier = Number((d2025.gdpPerCapitaUSD / d2005.gdpPerCapitaUSD).toFixed(1));

  return (
    <Card className="overflow-hidden border-primary/30 shadow-sm transition-all w-full">
      <CardHeader className="p-3.5 sm:p-4 bg-gradient-to-r from-primary/10 via-secondary/40 to-background border-b border-border/50 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs mt-0.5">
              <History className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm sm:text-base font-bold leading-snug break-words">
                {lang === "bn"
                  ? "বিগত ২০ বছরের বাজার দর ও অর্থনৈতিক গতিধারা"
                  : "20-Year Historical Trends"}
              </CardTitle>
              <CardDescription className="text-[11px] sm:text-xs mt-1 leading-normal text-muted-foreground break-words">
                {lang === "bn"
                  ? "২০০৫ - ২০২৫ (উৎস: BBS, TCB ও বাংলাদেশ ব্যাংক)"
                  : "2005 - 2025 (Sources: BBS, TCB & Bangladesh Bank)"}
              </CardDescription>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-xs text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-lg border border-border/60 hover:bg-secondary/60 transition-colors shrink-0 cursor-pointer whitespace-nowrap self-start"
          >
            {isCollapsed
              ? lang === "bn"
                ? "গ্রাফ দেখুন ▼"
                : "Expand ▼"
              : lang === "bn"
                ? "সংক্ষেপ করুন ▲"
                : "Collapse ▲"}
          </button>
        </div>

        {!isCollapsed && (
          <div className="pt-1 border-t border-border/40 overflow-x-auto scrollbar-none">
            <Tabs value={category} onValueChange={(v) => setCategory(v as MetricCategory)}>
              <TabsList className="h-8 bg-secondary/80 p-0.5 w-full grid grid-cols-3">
                <TabsTrigger value="commodities" className="text-xs px-2 py-1 truncate">
                  {lang === "bn" ? "নিত্যপণ্য" : "Staples"}
                </TabsTrigger>
                <TabsTrigger value="macro" className="text-xs px-2 py-1 truncate">
                  {lang === "bn" ? "মূল্যস্ফীতি ও আয়" : "Inflation"}
                </TabsTrigger>
                <TabsTrigger value="ratio" className="text-xs px-2 py-1 truncate">
                  {lang === "bn" ? "ক্রয়ক্ষমতা" : "Purchasing"}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </CardHeader>

      {!isCollapsed && (
        <CardContent className="p-3.5 sm:p-4 space-y-3.5">
          {/* 6 Multiplier Highlights (2005 vs 2025 Benchmark) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="rounded-xl border border-border/60 bg-card p-2 sm:p-2.5 text-center">
              <div className="text-[10px] text-muted-foreground font-semibold flex items-center justify-center gap-1 truncate">
                <Coins className="h-3 w-3 text-primary shrink-0" />
                <span>{lang === "bn" ? "মিনিকেট চাল" : "Rice"}</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                {num(d2005.riceMinicate)}৳{" "}
                <span className="text-[10px] text-muted-foreground">→</span>{" "}
                {num(d2025.riceMinicate)}৳
              </div>
              <div className="text-[10px] text-red-600 font-semibold">
                +{num(riceMultiplier)}x {lang === "bn" ? "বৃদ্ধি" : "up"}
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-2 sm:p-2.5 text-center">
              <div className="text-[10px] text-muted-foreground font-semibold flex items-center justify-center gap-1 truncate">
                <TrendingUp className="h-3 w-3 text-red-600 shrink-0" />
                <span>{lang === "bn" ? "গরুর মাংস" : "Beef"}</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                {num(d2005.beef)}৳ <span className="text-[10px] text-muted-foreground">→</span>{" "}
                {num(d2025.beef)}৳
              </div>
              <div className="text-[10px] text-red-600 font-semibold">
                +{num(beefMultiplier)}x {lang === "bn" ? "বৃদ্ধি" : "up"}
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-2 sm:p-2.5 text-center">
              <div className="text-[10px] text-muted-foreground font-semibold flex items-center justify-center gap-1 truncate">
                <BadgePercent className="h-3 w-3 text-amber-600 shrink-0" />
                <span>{lang === "bn" ? "সয়াবিন তেল" : "Soybean Oil"}</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                {num(d2005.soybeanOil)}৳{" "}
                <span className="text-[10px] text-muted-foreground">→</span> {num(d2025.soybeanOil)}
                ৳
              </div>
              <div className="text-[10px] text-red-600 font-semibold">
                +{num(oilMultiplier)}x {lang === "bn" ? "বৃদ্ধি" : "up"}
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-2 sm:p-2.5 text-center">
              <div className="text-[10px] text-muted-foreground font-semibold flex items-center justify-center gap-1 truncate">
                <Coins className="h-3 w-3 text-sky-600 shrink-0" />
                <span>{lang === "bn" ? "ইলিশ মাছ (১ কেজি)" : "Hilsa (1kg)"}</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                {num(d2005.hilsaFish)}৳ <span className="text-[10px] text-muted-foreground">→</span>{" "}
                {num(d2025.hilsaFish)}৳
              </div>
              <div className="text-[10px] text-red-600 font-semibold">
                +{num(hilsaMultiplier)}x {lang === "bn" ? "বৃদ্ধি" : "up"}
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-2 sm:p-2.5 text-center">
              <div className="text-[10px] text-muted-foreground font-semibold flex items-center justify-center gap-1 truncate">
                <DollarSign className="h-3 w-3 text-green-600 shrink-0" />
                <span>{lang === "bn" ? "মাথাপিছু আয়" : "GDP/Capita"}</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                ${d2005.gdpPerCapitaUSD}{" "}
                <span className="text-[10px] text-muted-foreground">→</span> $
                {d2025.gdpPerCapitaUSD}
              </div>
              <div className="text-[10px] text-green-600 font-semibold">
                +{num(gdpMultiplier)}x {lang === "bn" ? "প্রবৃদ্ধি" : "growth"}
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-card p-2 sm:p-2.5 text-center">
              <div className="text-[10px] text-muted-foreground font-semibold flex items-center justify-center gap-1 truncate">
                <Landmark className="h-3 w-3 text-blue-600 shrink-0" />
                <span>{lang === "bn" ? "দৈনিক মজুরি" : "Daily Wage"}</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-foreground mt-0.5">
                {num(d2005.dailyLaborWage)}৳{" "}
                <span className="text-[10px] text-muted-foreground">→</span>{" "}
                {num(d2025.dailyLaborWage)}৳
              </div>
              <div className="text-[10px] text-primary font-semibold">
                +{num(wageMultiplier)}x {lang === "bn" ? "বৃদ্ধি" : "up"}
              </div>
            </div>
          </div>

          {/* Dynamic Charts per Category with responsive height */}
          <div className="h-56 sm:h-64 w-full pt-1">
            {category === "commodities" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={historical20YearsData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={10} />
                  <YAxis
                    tickFormatter={(v) => `${v}৳`}
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                  />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="rounded-xl border bg-card/95 backdrop-blur-md p-2.5 text-xs shadow-lg space-y-1">
                          <div className="font-bold border-b pb-1 text-xs">
                            {label} সালের গড় দর
                          </div>
                          {payload.map((entry, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-3 text-[11px]"
                            >
                              <span style={{ color: entry.color }} className="font-medium">
                                {entry.name}:
                              </span>
                              <span className="font-bold">{num(entry.value as number)}৳</span>
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />
                  <Line
                    type="monotone"
                    dataKey="riceMinicate"
                    name={lang === "bn" ? "চাল" : "Rice"}
                    stroke="#16a34a"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="soybeanOil"
                    name={lang === "bn" ? "তেল" : "Oil"}
                    stroke="#eab308"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="onion"
                    name={lang === "bn" ? "পেঁয়াজ" : "Onion"}
                    stroke="#ec4899"
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="potato"
                    name={lang === "bn" ? "আলু" : "Potato"}
                    stroke="#8b5cf6"
                    strokeWidth={1.5}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="beef"
                    name={lang === "bn" ? "মাংস" : "Beef"}
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="hilsaFish"
                    name={lang === "bn" ? "ইলিশ" : "Hilsa"}
                    stroke="#0284c7"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            {category === "macro" && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={historical20YearsData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={10} />
                  <YAxis
                    yAxisId="left"
                    tickFormatter={(v) => `${v}%`}
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(v) => `${v}৳`}
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                  />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload as EconomicYearData;
                      return (
                        <div className="rounded-xl border bg-card/95 backdrop-blur-md p-3 text-xs shadow-lg space-y-1">
                          <div className="font-bold border-b pb-1 text-sm">
                            {label} সালের অর্থনৈতিক সূচক
                          </div>
                          <div className="text-red-600 font-medium">
                            মূল্যস্ফীতি: {num(d.inflationRate)}%
                          </div>
                          <div className="text-primary font-medium">
                            দৈনিক মজুরি: {num(d.dailyLaborWage)}৳
                          </div>
                          <div className="text-blue-600 font-medium">
                            মাথাপিছু আয়: ${d.gdpPerCapitaUSD}
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="inflationRate"
                    name={lang === "bn" ? "মূল্যস্ফীতি (%)" : "Inflation (%)"}
                    stroke="#dc2626"
                    strokeWidth={2.5}
                    dot
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="dailyLaborWage"
                    name={lang === "bn" ? "দৈনিক শ্রমিক মজুরি (৳)" : "Daily Wage (৳)"}
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            {category === "ratio" && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={historical20YearsData.map((d) => ({
                    year: d.year,
                    // How many kg of rice 1 day of labor wage could buy:
                    riceKgPerDayWage: Math.round((d.dailyLaborWage / d.riceMinicate) * 10) / 10,
                    // How many kg of beef 1 day of labor wage could buy:
                    beefKgPerDayWage: Math.round((d.dailyLaborWage / d.beef) * 100) / 100,
                  }))}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="riceRatioGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} fontSize={10} />
                  <YAxis
                    tickFormatter={(v) => `${v} কেজি`}
                    tickLine={false}
                    axisLine={false}
                    fontSize={10}
                  />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (!active || !payload?.length) return null;
                      const pt = payload[0].payload;
                      return (
                        <div className="rounded-xl border bg-card/95 backdrop-blur-md p-3 text-xs shadow-lg space-y-1">
                          <div className="font-bold border-b pb-1 text-sm">
                            {label} সালের ১ দিনের মজুরির ক্রয়ক্ষমতা
                          </div>
                          <div className="text-green-600 font-bold">
                            চাল ক্রয় সক্ষমতা: {num(pt.riceKgPerDayWage)} কেজি
                          </div>
                          <div className="text-red-600 font-medium">
                            মাংস ক্রয় সক্ষমতা: {num(pt.beefKgPerDayWage)} কেজি
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />
                  <Area
                    type="monotone"
                    dataKey="riceKgPerDayWage"
                    name={
                      lang === "bn"
                        ? "১ দিনের মজুরিতে চাল ক্রয়ের ক্ষমতা (কেজি)"
                        : "Kg of Rice per 1 Day Wage"
                    }
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#riceRatioGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Toggleable Full 20-Year Historical Data Table */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowDataTable(!showDataTable)}
              className="w-full text-xs font-semibold py-1.5 px-3 rounded-lg border border-border/60 hover:bg-secondary/60 flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <span>
                {lang === "bn"
                  ? showDataTable
                    ? "▲ ২০ বছরের বার্ষিক পরিসংখ্যান টেবিল বন্ধ করুন"
                    : "▼ ২০ বছরের পূর্ণাঙ্গ বার্ষিক ডেটা টেবিল দেখুন"
                  : showDataTable
                    ? "▲ Hide 20-Year Annual Data Table"
                    : "▼ View Full 20-Year Annual Data Table"}
              </span>
              <Badge variant="outline" className="text-[10px]">
                {historical20YearsData.length} {lang === "bn" ? "বছর" : "Years"}
              </Badge>
            </button>

            {showDataTable && (
              <div className="mt-2 rounded-xl border border-border/60 overflow-hidden bg-card text-xs">
                <div className="overflow-x-auto max-h-60 thin-scroll">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-secondary/80 sticky top-0 text-[10px] font-semibold text-muted-foreground uppercase border-b border-border/60">
                      <tr>
                        <th className="p-2">{lang === "bn" ? "সাল" : "Year"}</th>
                        <th className="p-2">{lang === "bn" ? "চাল (কেজি)" : "Rice"}</th>
                        <th className="p-2">{lang === "bn" ? "মাংস (কেজি)" : "Beef"}</th>
                        <th className="p-2">{lang === "bn" ? "তেল (লি.)" : "Oil"}</th>
                        <th className="p-2">{lang === "bn" ? "মজুরি" : "Wage"}</th>
                        <th className="p-2">{lang === "bn" ? "মাথাপিছু আয়" : "GDP"}</th>
                        <th className="p-2">{lang === "bn" ? "মূল্যস্ফীতি" : "Inflation"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 text-[11px]">
                      {historical20YearsData.map((row) => (
                        <tr key={row.year} className="hover:bg-secondary/40 transition-colors">
                          <td className="p-2 font-bold">{row.year}</td>
                          <td className="p-2">{num(row.riceMinicate)}৳</td>
                          <td className="p-2">{num(row.beef)}৳</td>
                          <td className="p-2">{num(row.soybeanOil)}৳</td>
                          <td className="p-2 font-medium text-primary">
                            {num(row.dailyLaborWage)}৳
                          </td>
                          <td className="p-2">${row.gdpPerCapitaUSD}</td>
                          <td className="p-2 font-semibold text-red-600">
                            {num(row.inflationRate)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-muted-foreground bg-secondary/40 p-2.5 rounded-xl flex items-start gap-2 border border-border/40 leading-relaxed">
            <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <span>
              {lang === "bn"
                ? "২০০৫ সালে ১ দিনের সাধারণ কৃষি বা দিনমজুরের গড় আয় (১১০৳) দিয়ে ৫ কেজি চাল কেনা যেত; ২০২৫ সালে ৮৫০৳ দিনমজুরিতে তা প্রায় ১০.৬ কেজিতে উন্নীত হয়েছে। তবে ইলিশ ও গরুর মাংসের মতো প্রোটিনের মূল্যবৃদ্ধি সাধারণ আয়ের চেয়েও দ্রুততর হয়েছে (উৎস: BBS, TCB, ও বাংলাদেশ ব্যাংক বার্ষিক অর্থনৈতিক প্রতিবেদন)।"
                : "In 2005, 1 day of unskilled labor wage (110 BDT) bought ~5 kg of rice; in 2025 at 850 BDT it buys ~10.6 kg. However, protein costs (beef & hilsa) outpaced real income growth (Sources: BBS, TCB & Bangladesh Bank)."}
            </span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
