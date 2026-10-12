"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useNum } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ChangeBadge({
  change,
  changePct,
  className,
  showAbs = false,
}: {
  change: number;
  changePct: number;
  className?: string;
  showAbs?: boolean;
}) {
  const num = useNum();

  if (change === 0) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground",
          className
        )}
      >
        <Minus className="h-3 w-3" />
        {showAbs ? num(0) : "—"}
      </span>
    );
  }

  const up = change > 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        up
          ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
          : "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300",
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {showAbs ? (
        <>
          {up ? "+" : ""}
          {num(change)} ৳
        </>
      ) : (
        <>
          {up ? "+" : ""}
          {num(changePct)}%
        </>
      )}
    </span>
  );
}
