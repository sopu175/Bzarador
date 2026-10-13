import Link from "next/link";
import { ArrowLeft, Scale, AlertTriangle, CheckCircle2 } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/bazar/site-header-footer";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "শর্তাবলী (Terms & Conditions) | বাজার দাম",
  description: "বাজার দাম অ্যাপ্লিকেশন ব্যবহারের নীতিমালা ও সাধারণ শর্তাবলী।",
};

export default function TermsPage() {
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
            <Scale className="h-3.5 w-3.5" />
            <span>ব্যবহারের নীতিমালা</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            শর্তাবলী ও ডিসক্লেইমার (Terms of Use)
          </h1>
          <p className="text-xs text-muted-foreground">সর্বশেষ পরিমার্জন: অক্টোবর ২০২৬</p>
        </div>

        <Card className="border-border/60">
          <CardContent className="p-6 text-sm text-foreground/80 space-y-5 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">১. তথ্যের উদ্দেশ্য ও প্রকৃতি</h2>
              <p>
                <strong>বাজার দাম</strong> একটি ওপেন সোর্স ও কমিউনিটি চালিত সহায়ক প্ল্যাটফর্ম।
                এখানে প্রদর্শিত শাকসবজি, মাছ, মাংস ও নিত্যপণ্যের দাম বিভিন্ন বাজার ও সংবাদ মাধ্যম
                থেকে সংগৃহীত আনুমানিক ও গড় দর। বাজার, দোকান বা পণ্যের গুণমানভেদে বাস্তব দর কিছুটা
                কম-বেশি হতে পারে।
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">
                ২. কোনো আইনি বা সরকারি বাধ্যবাধকতা নেই
              </h2>
              <p>
                এই অ্যাপের তথ্য কোনো আইনি দর নির্ধারণী সরকারি আদেশ নয়। এটি ক্রেতাদের সচেতনতা
                বৃদ্ধির জন্য সাধারণ ধারণামূলক রেফারেন্স হিসেবে প্রস্তুত করা হয়েছে। কোনো আর্থিক
                লেনদেন বা পাইকারি চুক্তি করার পূর্বে স্থানীয় বাজারে সরাসরি যাচাই করার পরামর্শ
                দেওয়া হয়।
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">৩. দায়িত্বশীল তথ্য প্রদান</h2>
              <p>
                আপনি যখন নতুন কোনো দাম রিপোর্ট করবেন, তখন যথাসম্ভব সঠিক তথ্য প্রদান করুন।
                ইচ্ছাকৃতভাবে বিভ্রান্তিকর বা অবাস্তব দাম দিলে সিস্টেমের স্বয়ংক্রিয় ফিল্টারিং তা
                বাতিল করবে।
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-foreground">
                ৪. মেধা সম্পত্তি ও উন্মুক্ত কোড
              </h2>
              <p>
                এই প্ল্যাটফর্মটি ওপেন-কমিউনিটি ধারণার অংশ। তথ্যের কপিরাইট এবং সংবাদের মেধা স্বত্ব
                সংশ্লিষ্ট সংবাদমাধ্যম ও প্রকাশকদের।
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}
