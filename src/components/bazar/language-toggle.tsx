"use client";

import { Languages } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function LanguageToggle() {
  const lang = useLang((s) => s.lang);
  const toggle = useLang((s) => s.toggle);
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={toggle}
            className="gap-1.5 h-9 font-semibold"
            aria-label="Toggle language"
          >
            <Languages className="h-4 w-4" />
            <span>{lang === "bn" ? "EN" : "বাং"}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>{lang === "bn" ? "Switch to English" : "বাংলায় দেখুন"}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
