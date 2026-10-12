import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const feedbackSchema = z.object({
  name: z.string().max(80).optional().default("Anonymous"),
  email: z.string().email().optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5),
  category: z.enum(["general", "price_accuracy", "feature_request", "bug"]).default("general"),
  comment: z.string().min(3).max(1000),
});

export async function GET() {
  const feedbacks = await db.feedback.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ feedbacks });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = feedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, rating, category, comment } = parsed.data;
    const feedback = await db.feedback.create({
      data: {
        name: name?.trim() || "Anonymous",
        email: email?.trim() || null,
        rating,
        category,
        comment,
      },
    });

    return NextResponse.json({ ok: true, feedback }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
