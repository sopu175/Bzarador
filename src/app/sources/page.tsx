import Link from "next/link";
import { ArrowLeft, Globe, Newspaper, Landmark, CheckCircle2, ShieldCheck, ExternalLink } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/bazar/site-header-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "উৎস ও ডেটা সংগ্রহ পদ্ধতি | বাজার দাম",
  description: "বাজার দাম অ্যাপ্লিকেশনে ব্যবহৃত সরকারি, জাতীয় দৈনিক ও লাইভ ডাটা সোর্সের বিস্তারিত তালিকা।",
};

const sources = [
  {
    category: "সরকারি ও প্রাতিষ্ঠানিক মনিটরিং",
    items: [
      {
        name: "কৃষি বিপণন অধিদপ্তর (DAM)",
        url: "http://www.dam.gov.bd",
        description: "কৃষি মন্ত্রণালয়ের অধীনস্থ দেশের ৬৪ জেলার দৈনিক পাইকারি ও খুচরা বাজার মনিটরিং ডাটা।",
        frequency: "দৈনিক আপডেট",
        type: "সরকারি",
      },
      {
        name: "ট্রেডিং কর্পোরেশন অব বাংলাদেশ (TCB)",
        url: "https://www.tcb.gov.bd",
        description: "বাণিজ্য মন্ত্রণালয়ের আওতাধীন নিত্যপ্রয়োজনীয় খাদ্যপণ্যের ন্যায্যমূল্য ও খুচরা বাজার দর তালিকা।",
        frequency: "দৈনিক আপডেট",
        type: "সরকারি",
      },
      {
        name: "বাংলাদেশ পরিসংখ্যান ব্যুরো (BBS)",
        url: "http://www.bbs.gov.bd",
        description: "জাতীয় ভোক্তা মূল্যসূচক (CPI), ঐতিহাসিক মূল্যস্ফীতি ও গড় পারিবারিক ব্যয় জরিপ।",
        frequency: "মাসিক/বার্ষিক",
        type: "পরিসংখ্যান",
      },
      {
        name: "বাংলাদেশ ব্যাংক (Bangladesh Bank)",
        url: "https://www.bb.org.bd",
        description: "মুদ্রাস্ফীতি, ডলার বিনিময় হার ও সামষ্টিক অর্থনৈতিক গতিধারা ও মজুরি সূচক।",
        frequency: "মাসিক/ত্রৈমাসিক",
        type: "অর্থনৈতিক",
      },
    ],
  },
  {
    category: "জাতীয় শীর্ষস্থানীয় সংবাদ মাধ্যম (Daily News Feeds)",
    items: [
      {
        name: "The Business Standard (TBS)",
        url: "https://www.tbsnews.net",
        description: "ব্যবসায় ও অর্থনীতি ভিত্তিক জাতীয় দৈনিকের বাজার দর অনুসন্ধান ও বিশেষ প্রতিবেদন।",
        frequency: "দৈনিক লাইভ",
        type: "সংবাদ",
      },
      {
        name: "Prothom Alo (প্রথম আলো)",
        url: "https://www.prothomalo.com",
        description: "কারওয়ান বাজার, চট্টগ্রাম, রাজশাহীসহ সারা দেশের সরেজমিন বাজার প্রতিবেদন।",
        frequency: "দৈনিক লাইভ",
        type: "সংবাদ",
      },
      {
        name: "The Daily Star",
        url: "https://www.thedailystar.net",
        description: "ইংরেজি জাতীয় দৈনিকের কমোডিটি প্রাইস ইনডেক্স ও কিচেন মার্কেট ফিচার।",
        frequency: "দৈনিক লাইভ",
        type: "সংবাদ",
      },
      {
        name: "Dhaka Tribune",
        url: "https://www.dhakatribune.com",
        description: "রাজধানীর বিভিন্ন বাজার এবং বিভাগীয় শহরের নিত্যপণ্যের সরবরাহ ও দাম সংক্রান্ত রিপোর্ট।",
        frequency: "দৈনিক লাইভ",
        type: "সংবাদ",
      },
      {
        name: "Jago News 24 (জাগো নিউজ)",
        url: "https://www.jagonews24.com",
        description: "ভোরবেলার পাইকারি বাজার ও স্থানীয় বাজারের তাৎক্ষণিক দাম মনিটরিং।",
        frequency: "দৈনিক লাইভ",
        type: "সংবাদ",
      },
      {
        name: "Dhaka Post (ঢাকা পোস্ট)",
        url: "https://www.dhakapost.com",
        description: "শাকসবজি, ব্রয়লার মুরগি, ডিম, পেঁয়াজ ও মাছের খুচরা বাজার দর সম্পর্কিত সংবাদ।",
        frequency: "দৈনিক লাইভ",
        type: "সংবাদ",
      },
      {
        name: "Daily Ittefaq (দৈনিক ইত্তেফাক)",
        url: "https://www.ittefaq.com.bd",
        description: "ঐতিহ্যবাহী জাতীয় দৈনিকের দ্রব্যমূল্য পরিস্থিতি ও মাঠ পর্যায়ের বিশ্লেষণ।",
        frequency: "দৈনিক",
        type: "সংবাদ",
      },
      {
        name: "bdnews24.com",
        url: "https://bangla.bdnews24.com",
        description: "প্রথম অনলাইন সংবাদ মাধ্যমের দ্রব্যমূল্য পর্যবেক্ষণ ও নিয়মিত প্রতিবেদন।",
        frequency: "নিয়মিত",
        type: "সংবাদ",
      },
    ],
  },
];

export default function SourcesPage() {
  return (
    <div className="min-h-screen flex flex-col market-bg">
      <SiteHeader />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 hover:bg-secondary px-3 py-1.5 rounded-lg border border-border/40"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>হোম পেজে ফিরুন</span>
          </Link>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            <Globe className="h-3.5 w-3.5" />
            <span>১২+ টি নির্ভরযোগ্য উৎস</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            উৎস ও ডেটা সংগ্রহ পদ্ধতি (Sources & Methodology)
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            বাজার দাম একটি সম্পূর্ণ উন্মুক্ত ও স্বচ্ছ কমিউনিটি অ্যাপ্লিকেশন। এখানে প্রদর্শিত সমস্ত দাম ও তথ্য কোথা থেকে আসে এবং কিভাবে প্রস্তুত হয় তার পূর্ণ বিবরণ নিচে দেওয়া হলো।
          </p>
        </div>

        {/* Methodology card */}
        <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-accent/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>ডেটা একত্রিতকরণ ও যাচাই পদ্ধতি (How We Aggregate Data)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs sm:text-sm text-muted-foreground space-y-3 leading-relaxed">
            <p>
              ১. <strong>স্বয়ংক্রিয় লাইভ সংগ্রাহক (Live Scraper):</strong> প্রতিদিন সকালবেলা শীর্ষস্থানীয় জাতীয় সংবাদ মাধ্যম ও সরকারি পোর্টাল থেকে পণ্যের বাজার দর সম্পর্কিত প্রতিবেদন থেকে দামের তথ্য সংগ্রহ করা হয়।
            </p>
            <p>
              ২. <strong>কমিউনিটি রিপোর্ট (Crowdsourced Pricing):</strong> স্থানীয় বাজারের ক্রেতা ও বিক্রেতারা সরাসরি বাজারে গিয়ে যে দামে পণ্য ক্রয়-বিক্রয় করেছেন তা অ্যাপে জমা দেন।
            </p>
            <p>
              ৩. <strong>আউটলায়ার ফিল্টারিং ও গড় মান:</strong> অস্বাভাবিক বা ভুল এন্ট্রি বাদ দিয়ে প্রতিটি বাজারের জন্য সুষম গড় দাম (Average Price) এবং গতকালের সাথে শতকরা পরিবর্তন হিসাব করা হয়।
            </p>
          </CardContent>
        </Card>

        {/* Source Categories */}
        <div className="space-y-6">
          {sources.map((group) => (
            <div key={group.category} className="space-y-3">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Landmark className="h-4 w-4 text-primary" />
                <span>{group.category}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {group.items.map((src) => (
                  <div
                    key={src.name}
                    className="p-3.5 rounded-xl border border-border/60 bg-card hover:bg-secondary/40 transition-colors space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-sm text-foreground">
                        {src.name}
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {src.frequency}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-normal">
                      {src.description}
                    </p>
                    <div className="pt-1">
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline font-medium inline-flex items-center gap-1"
                      >
                        <span>ওয়েবসাইট দেখুন</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
