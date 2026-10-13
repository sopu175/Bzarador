import Link from "next/link";
import {
  ArrowLeft,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Database,
  Radio,
  BellRing,
  Sparkles,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/bazar/site-header-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "সাধারণ জিজ্ঞাসা ও তথ্য (FAQ) | বাজার দাম",
  description:
    "বাজার দাম অ্যাপ্লিকেশন কিভাবে কাজ করে, কোথা থেকে তথ্য সংগ্রহ করা হয় এবং কীভাবে ব্যবহার করবেন তার বিস্তারিত প্রশ্নোত্তর।",
};

const faqs = [
  {
    q: "১. বাজার দাম অ্যাপ্লিকেশনের মূল উদ্দেশ্য কী?",
    a: "বাংলাদেশের সাধারণ ক্রেতা ও সাধারণ নাগরিকরা যাতে বাজারে গিয়ে অতিরিক্ত দামে না ঠকেন, সেজন্য প্রতিদিনের তাজা পণ্যের বাস্তব বাজার দর, জেলাভিত্তিক পার্থক্য এবং ২০ বছরের ঐতিহাসিক ট্রেন্ড এক পলকে স্বচ্ছভাবে প্রদর্শন করাই এই অ্যাপের মূল উদ্দেশ্য।",
  },
  {
    q: "২. বাজার দর তথ্যগুলো কোথা থেকে সংগ্রহ করা হয় (How We Get Data)?",
    a: "আমাদের ডাটা প্রধানত তিনটি স্তর থেকে সংগৃহীত হয়:\n• প্রথমত, শীর্ষস্থানীয় জাতীয় দৈনিক (The Business Standard, প্রথম আলো, The Daily Star, Dhaka Tribune ইত্যাদি) এবং সরকারি মনিটরিং পোর্টাল (TCB, DAM) থেকে স্বয়ংক্রিয় লাইভ স্ক্র্যাপারের মাধ্যমে।\n• দ্বিতীয়ত, দেশজুড়ে ১১টি প্রধান বাজারের স্থানীয় ক্রেতা ও বিক্রেতাদের সরাসরি দেওয়া রিয়েল-টাইম রিপোর্ট থেকে।\n• তৃতীয়ত, বাংলাদেশ ব্যাংক ও বিবিএস (BBS)-এর ঐতিহাসিক ২০ বছরের অফিশিয়াল পরিসংখ্যান থেকে।",
  },
  {
    q: "৩. প্রদর্শিত দামগুলো কি শতভাগ নিশ্চিত বা ফিক্সড?",
    a: "না, কাঁচাবাজারের প্রকৃতি অনুযায়ী সকাল ও বিকেলের দাম, পণ্যের আকার বা জাত (যেমন দেশি আলু বনাম হল্যান্ড আলু) এবং বিভিন্ন দোকানের অবস্থানভেদে কেজি প্রতি ৫-১০ টাকা পার্থক্য হতে পারে। আমাদের অ্যাপ্লিকেশনে সব রিপোর্ট বিশ্লেষণ করে একটি নির্ভরযোগ্য মধ্যম ও গড় দর দেখানো হয়।",
  },
  {
    q: "৪. আমি কিভাবে আমার এলাকার দাম জানাতে পারি?",
    a: "হোম পেজের 'দাম জানান (Report Price)' ট্যাবে যান। আপনার বাজার, পণ্যের নাম এবং আপনি যে দামে কিনেছেন তা লিখে 'রিপোর্ট জমা দিন' বাটনে ক্লিক করুন। এটি তাৎক্ষণিকভাবে ডাটাবেজে যুক্ত হয়ে গড় হিসাবের অন্তর্ভুক্ত হবে।",
  },
  {
    q: "৫. মূল্য সতর্কতা (Price Alerts) কিভাবে ব্যবহার করব?",
    a: "আপনি যদি কোনো পণ্যের দাম কমার অপেক্ষায় থাকেন (যেমন গরুর মাংস ৭৫০ টাকার নিচে নামলে বা আলু ৩৫ টাকার নিচে নামলে), 'সতর্কতা (Alerts)' ট্যাবে গিয়ে টার্গেট দর এবং আপনার মোবাইল নম্বর দিয়ে সতর্কতা তৈরি করতে পারেন। দাম ম্যাচ করলে নোটিফিকেশন পাঠানো হয়।",
  },
  {
    q: "৬. ঐতিহাসিক ২০ বছরের গ্রাফে কী কী তথ্য রয়েছে?",
    a: "২০০৫ সাল থেকে ২০২৫ সাল পর্যন্ত ২০ বছরে বাংলাদেশের প্রধান নিত্যপণ্য (চাল, মাংস, তেল, আলু, পেঁয়াজ, ইলিশ মাছ), মূল্যস্ফীতি, মাথাপিছু আয় (GDP) এবং দিনমজুরের দৈনিক আয়ের ক্রয়ক্ষমতার প্রকৃত পরিবর্তন তুলনা করা হয়েছে।",
  },
  {
    q: "৭. এটি কি কোনো সরকারি বা বাণিজ্যিক উদ্যোগ?",
    a: "না, এটি সম্পূর্ণ স্বাধীন, নন-কমার্শিয়াল এবং জনস্বার্থে তৈরি একটি উন্মুক্ত কমিউনিটি প্রকল্প।",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col market-bg">
      <SiteHeader />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 space-y-6">
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
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>সচরাচর জিজ্ঞাসা</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            সাধারণ জিজ্ঞাসা ও সাহায্য (FAQ)
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            বাজার দাম অ্যাপ্লিকেশনটি কিভাবে কাজ করে, তথ্য কিভাবে প্রক্রিয়াজাত হয় এবং ব্যবহার করার
            নিয়মাবলী।
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, i) => (
            <Card key={i} className="border-border/60 hover:border-primary/40 transition-colors">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base font-bold text-foreground">{faq.q}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {faq.a}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Links Card */}
        <div className="p-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card to-accent/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-semibold text-sm text-foreground">
              অন্যান্য তথ্যের পাতা সমূহ দেখুন
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              উৎস তালিকা, গোপনীয়তা ও ব্যবহারের শর্তাবলী
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/sources"
              className="px-3 py-1.5 rounded-lg bg-background border border-border/60 text-xs font-medium text-foreground hover:text-primary transition-colors"
            >
              উৎস তালিকা →
            </Link>
            <Link
              href="/privacy"
              className="px-3 py-1.5 rounded-lg bg-background border border-border/60 text-xs font-medium text-foreground hover:text-primary transition-colors"
            >
              প্রাইভেসি →
            </Link>
            <Link
              href="/terms"
              className="px-3 py-1.5 rounded-lg bg-background border border-border/60 text-xs font-medium text-foreground hover:text-primary transition-colors"
            >
              শর্তাবলী →
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
