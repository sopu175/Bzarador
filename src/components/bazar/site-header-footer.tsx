"use client";

import Link from "next/link";
import { LanguageToggle } from "@/components/bazar/language-toggle";
import { useT } from "@/lib/i18n";

export function SiteHeader() {
  const t = useT();
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 min-w-0 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shrink-0 shadow-sm border border-border/50 group-hover:scale-105 transition-transform">
            <img src="/logo.svg" alt="Bazar Dam Logo" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0">
            <div className="font-bold leading-tight truncate group-hover:text-primary transition-colors">
              {t("appName")}
            </div>
            <div className="text-[10px] text-muted-foreground leading-tight truncate">
              {t("tagline")}
            </div>
          </div>
        </Link>
        <LanguageToggle />
      </div>
    </header>
  );
}

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="mt-auto border-t border-border/60 bg-card/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-5 text-center space-y-2.5">
        {/* Trusted News Portals Links & Full List */}
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground/80">{t("sourceNews")}:</span>
          <a
            href="https://www.tbsnews.net"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors hover:underline"
          >
            The Business Standard (TBS)
          </a>
          <span>·</span>
          <a
            href="https://www.dhakatribune.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors hover:underline"
          >
            Dhaka Tribune
          </a>
          <span>·</span>
          <a
            href="https://www.thedailystar.net"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors hover:underline"
          >
            The Daily Star
          </a>
          <span>·</span>
          <a
            href="https://www.prothomalo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors hover:underline"
          >
            Prothom Alo
          </a>
          <span>·</span>
          <a
            href="https://www.jagonews24.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors hover:underline"
          >
            Jago News
          </a>
          <span>·</span>
          <a
            href="https://www.dhakapost.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors hover:underline"
          >
            Dhaka Post
          </a>
          <span>·</span>
          <Link
            href="/sources"
            className="font-semibold text-primary hover:underline bg-primary/10 px-2 py-0.5 rounded-md"
          >
            সকল ১২টি উৎস দেখুন →
          </Link>
        </div>

        {/* Legal & Informational Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground pt-1">
          <Link href="/faq" className="hover:text-primary transition-colors hover:underline">
            সাধারণ জিজ্ঞাসা (FAQ)
          </Link>
          <span>·</span>
          <Link href="/sources" className="hover:text-primary transition-colors hover:underline">
            উৎস ও সংগ্রহ পদ্ধতি (Sources)
          </Link>
          <span>·</span>
          <Link href="/privacy" className="hover:text-primary transition-colors hover:underline">
            গোপনীয়তা নীতি (Privacy)
          </Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-primary transition-colors hover:underline">
            শর্তাবলী (Terms)
          </Link>
          <span>·</span>
          <Link href="/reports" className="hover:text-primary transition-colors hover:underline">
            দাম রিপোর্ট তালিকা
          </Link>
        </div>

        {/* Developer Attribution with mailto */}
        <div className="pt-2 border-t border-border/40 flex items-center justify-center gap-2 text-xs">
          <a
            href="mailto:sopu175@gmail.com"
            className="font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            {t("developedBy")} (sopu175@gmail.com)
          </a>
        </div>
      </div>
    </footer>
  );
}
