"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MessageSquarePlus,
  Star,
  Send,
  Loader2,
  Sparkles,
  User,
  MessageCircle,
} from "lucide-react";
import { useT, useTr, useNum, useLang } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type FeedbackItem = {
  id: string;
  name: string | null;
  rating: number;
  category: string;
  comment: string;
  createdAt: string;
};

async function fetchFeedbacks(): Promise<{ feedbacks: FeedbackItem[] }> {
  const res = await fetch("/api/feedback");
  if (!res.ok) throw new Error("Failed to load feedback");
  return res.json();
}

export function FeedbackTab() {
  const t = useT();
  const num = useNum();
  const lang = useLang((s) => s.lang);
  const qc = useQueryClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState<string>("general");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["feedback"],
    queryFn: fetchFeedbacks,
  });

  const feedbacks = data?.feedbacks ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error(
        lang === "bn" ? "অনুগ্রহ করে আপনার মন্তব্য লিখুন।" : "Please enter your comment."
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          rating,
          category,
          comment: comment.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");

      toast.success(t("feedbackSuccess"));
      setComment("");
      setName("");
      setEmail("");
      setRating(5);
      qc.invalidateQueries({ queryKey: ["feedback"] });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  const categoryLabels: Record<string, { bn: string; en: string }> = {
    general: { bn: "সাধারণ মতামত", en: "General" },
    price_accuracy: { bn: "দামের নির্ভুলতা", en: "Price Accuracy" },
    feature_request: { bn: "নতুন ফিচারের আবেদন", en: "Feature Request" },
    bug: { bn: "সমস্যা বা বাগ রিপোর্ট", en: "Bug Report" },
  };

  return (
    <div className="space-y-5">
      {/* Feedback Submission Form */}
      <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-accent/10 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5 text-primary" />
            {t("feedbackTitle")}
          </CardTitle>
          <CardDescription className="text-xs">{t("feedbackSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {t("feedbackName")}
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === "bn" ? "যেমন: সাকিব আহমেদ" : "e.g. Sakib Ahmed"}
                  className="h-10 bg-card rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {t("feedbackEmail")}
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="h-10 bg-card rounded-xl"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {t("feedbackCategory")}
                </label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-10 bg-card rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">{categoryLabels.general[lang]}</SelectItem>
                    <SelectItem value="price_accuracy">
                      {categoryLabels.price_accuracy[lang]}
                    </SelectItem>
                    <SelectItem value="feature_request">
                      {categoryLabels.feature_request[lang]}
                    </SelectItem>
                    <SelectItem value="bug">{categoryLabels.bug[lang]}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  {t("feedbackRating")}
                </label>
                <div className="flex items-center gap-1.5 h-10 px-3 rounded-xl border border-border/80 bg-card">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={cn(
                          "h-5 w-5",
                          star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/30"
                        )}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-muted-foreground ml-auto">
                    {num(rating)} / {num(5)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                {lang === "bn" ? "মন্তব্য *" : "Comment *"}
              </label>
              <Textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t("feedbackComment")}
                className="min-h-[90px] bg-card rounded-xl resize-y"
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full sm:w-auto h-10 gap-2">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{lang === "bn" ? "জমা দেওয়া হচ্ছে..." : "Submitting..."}</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>{t("feedbackSubmit")}</span>
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Feedback Feed */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-primary" />
              {t("feedbackRecent")}
            </CardTitle>
            <Badge variant="secondary">{num(feedbacks.length)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-4 space-y-3">
              <div className="h-16 bg-muted/40 animate-pulse rounded-xl" />
              <div className="h-16 bg-muted/40 animate-pulse rounded-xl" />
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              {lang === "bn"
                ? "এখনও কোনো মতামত জমা পড়েনি। প্রথম মতামতটি আপনিই দিন!"
                : "No feedback submitted yet. Be the first to share!"}
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 space-y-1.5 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {(fb.name || "A").slice(0, 1).toUpperCase()}
                      </div>
                      <span className="font-semibold text-sm">
                        {fb.name || (lang === "bn" ? "বেনামী ব্যবহারকারী" : "Anonymous")}
                      </span>
                      <Badge variant="outline" className="text-[10px] font-normal py-0">
                        {categoryLabels[fb.category]?.[lang] ?? fb.category}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={cn(
                            "h-3 w-3",
                            s <= fb.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-foreground/90 pl-9 whitespace-pre-wrap leading-relaxed">
                    {fb.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
