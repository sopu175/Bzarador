import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendPriceAlertConfirmation } from "@/lib/email";

// GET /api/alerts - list alerts (filter by email or phone)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");

  const where: any = {};
  if (email) where.email = email;
  else if (phone) where.phone = phone;

  const alerts = await db.priceAlert.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    include: { item: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({ alerts });
}

const alertSchema = z
  .object({
    itemId: z.string().min(1),
    marketId: z.string().optional().nullable(),
    targetPrice: z.number().positive().max(100000),
    direction: z.enum(["below", "above"]),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().min(6).max(20).optional().or(z.literal("")),
  })
  .refine((data) => !!data.email || !!data.phone, {
    message: "Either email or phone must be provided",
    path: ["email"],
  });

// POST /api/alerts - create a new price alert and send email
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = alertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { itemId, marketId, targetPrice, direction, email, phone } = parsed.data;

  const item = await db.item.findUnique({ where: { id: itemId } });
  if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

  let marketName: string | undefined = undefined;
  if (marketId) {
    const market = await db.market.findUnique({ where: { id: marketId } });
    if (market) marketName = market.nameBn;
  }

  const alert = await db.priceAlert.create({
    data: {
      itemId,
      marketId: marketId || null,
      targetPrice,
      direction,
      email: email || null,
      phone: phone || null,
    },
    include: { item: true },
  });

  // If email was provided, send email confirmation
  let emailResult: Awaited<ReturnType<typeof sendPriceAlertConfirmation>> | null = null;
  if (email) {
    emailResult = await sendPriceAlertConfirmation({
      toEmail: email,
      itemNameBn: item.nameBn,
      itemNameEn: item.nameEn,
      itemEmoji: item.emoji,
      targetPrice,
      direction,
      currentPrice: null,
      marketName,
    });
  }

  return NextResponse.json({ alert, emailSent: emailResult?.success ?? false }, { status: 201 });
}
