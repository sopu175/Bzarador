import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, FileText } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/bazar/site-header-footer";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "গোপনীয়তা নীতি (Privacy Policy) | বাজার দাম",
  description: "বাজার দাম অ্যাপ্লিকেশনের ব্যবহারকারীদের তথ্যের সুরক্ষা ও গোপনীয়তা নীতি।",
};

export default function PrivacyPage() {
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
            <Shield className="h-3.5 w-3.5" />
            <span>স্বচ্ছতা ও নিরাপত্তা</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            গোপনীয়তা নীতি (Privacy Policy)
          </h1>
          <p className="text-xs text-muted-foreground">
            সর্বশেষ পরিমার্জন: অক্টোবর ২০২৬ · ব্যক্তিগত নন-কমার্শিয়াল ওপেন প্রজেক্ট
          </p>
        </div>

        <Card className="border-border/60">
          <CardContent className="p-6 text-sm text-foreground/80 space-y-5 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">১. সাধারণ পরিচিতি</h2>
              <p>
                <strong>বাজার দাম</strong> একটি নন-কমার্শিয়াল, কমিউনিটি দ্বারা পরিচালিত ব্যক্তিগত
                প্রকল্প। আমাদের লক্ষ্য বাংলাদেশের যেকোনো সাধারণ নাগরিককে বাজারের সঠিক ও স্বচ্ছ দর
                সম্পর্কে ধারণা দেওয়া। আমরা ব্যবহারকারীর কোনো অনাবশ্যক ব্যক্তিগত তথ্য সংগ্রহ বা
                বাণিজ্যিক উদ্দেশ্যে বিক্রি করি না।
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">
                ২. আমরা কী ধরনের তথ্য সংগ্রহ করি?
              </h2>
              <ul className="list-disc list-inside space-y-1.5 text-muted-foreground">
                <li>
                  <strong>দামের রিপোর্ট:</strong> আপনি যখন কোনো পণ্যের দাম জানান, তখন ঐ পণ্যের নাম,
                  বাজার, দাম ও ঐচ্ছিক রিপোর্টারের নাম সংরক্ষিত হয়।
                </li>
                <li>
                  <strong>মূল্য সতর্কতা (Price Alert):</strong> সতর্কতা সক্রিয় করার জন্য আপনার
                  দেওয়া মোবাইল নম্বর শুধুমাত্র ঐ পণ্যের টার্গেট দর মিলে গেলে নোটিফিকেশন পাঠানোর
                  উদ্দেশ্যে সংরক্ষিত থাকে।
                </li>
                <li>
                  <strong>মতামত ও পর্যালোচনা:</strong> আপনার জমা দেওয়া রেটিং ও মন্তব্য আমাদের
                  ডাটাবেজে সংরক্ষিত হয়।
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">৩. তথ্যের ব্যবহার ও সুরক্ষা</h2>
              <p>
                আমরা কোনো তৃতীয় পক্ষের বিজ্ঞাপন নেটওয়ার্কের সাথে আপনার মোবাইল নম্বর বা নাম শেয়ার
                করি না। সমস্ত পাবলিক ভিউতে ফোন নম্বর আংশিক গোপন (যেমন: 017***567) করে রাখা হয় যাতে
                কারও ব্যক্তিগত পরিচয় উন্মুক্ত না হয়।
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">৪. যোগাযোগ</h2>
              <p>
                আপনার তথ্যের সুরক্ষা বা নীতি সংক্রান্ত যেকোনো প্রশ্ন থাকলে সরাসরি যোগাযোগ করতে
                পারেন:{" "}
                <a href="mailto:sopu175@gmail.com" className="text-primary underline">
                  sopu175@gmail.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
