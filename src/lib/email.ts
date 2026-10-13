import nodemailer from "nodemailer";

// Create reusable transporter (uses SMTP if provided in .env, otherwise creates a test Ethereal transporter or JSON fallback)
let cachedTransporter: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (cachedTransporter) return cachedTransporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return cachedTransporter;
  }

  // Create Ethereal test account if no SMTP provided so real emails can be previewed/sent
  try {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return cachedTransporter;
  } catch {
    // Fallback JSON transport
    cachedTransporter = nodemailer.createTransport({
      jsonTransport: true,
    } as any);
    return cachedTransporter;
  }
}

type AlertEmailParams = {
  toEmail: string;
  itemNameBn: string;
  itemNameEn: string;
  itemEmoji: string;
  targetPrice: number;
  direction: "below" | "above";
  currentPrice: number | null;
  marketName?: string;
};

export async function sendPriceAlertConfirmation(params: AlertEmailParams) {
  const {
    toEmail,
    itemNameBn,
    itemNameEn,
    itemEmoji,
    targetPrice,
    direction,
    currentPrice,
    marketName,
  } = params;
  const transporter = await getTransporter();

  const directionTextBn =
    direction === "below"
      ? `${targetPrice}৳ বা তার নিচে নামলে`
      : `${targetPrice}৳ বা তার উপরে উঠলে`;
  const directionTextEn =
    direction === "below"
      ? `drops below or reaches ${targetPrice} BDT`
      : `rises above or reaches ${targetPrice} BDT`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .card { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .header { background: linear-gradient(135deg, #16a34a, #15803d); padding: 28px 24px; color: #ffffff; text-align: center; }
          .body { padding: 28px 24px; }
          .badge { display: inline-block; background: #ecfdf5; color: #047857; font-weight: 600; font-size: 13px; padding: 4px 12px; border-radius: 9999px; border: 1px solid #a7f3d0; margin-bottom: 12px; }
          .price-box { background: #f1f5f9; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center; border: 1px solid #cbd5e1; }
          .btn { display: inline-block; background: #16a34a; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: bold; font-size: 14px; margin-top: 16px; }
          .footer { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">বাজার দাম — মূল্য সতর্কতা 🔔</h1>
            <p style="margin: 6px 0 0 0; opacity: 0.9; font-size: 14px;">Market Price Alert Activated</p>
          </div>
          <div class="body">
            <div style="text-align: center;">
              <span class="badge">সফলভাবে সক্রিয় হয়েছে</span>
              <h2 style="margin: 8px 0; font-size: 20px;">
                ${itemEmoji} ${itemNameBn} (${itemNameEn})
              </h2>
            </div>

            <p style="font-size: 14px; line-height: 1.6; margin-top: 16px;">
              আপনার ইমেইলে <strong>${itemNameBn}</strong>-এর জন্য মূল্য সতর্কতা নিশ্চিত করা হলো। দেশের বাজারে পণ্যটির দাম <strong>${directionTextBn}</strong> আপনাকে তাৎক্ষণিকভাবে ইমেইলে অবহিত করা হবে।
            </p>

            <div class="price-box">
              <div style="font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">টার্গেট অ্যালার্ট মূল্য (Target Price)</div>
              <div style="font-size: 28px; font-weight: 800; color: #16a34a; margin: 4px 0;">
                ${targetPrice} ৳
              </div>
              ${currentPrice != null ? `<div style="font-size: 13px; color: #475569;">আজকের গড় বাজার দর: <strong>${currentPrice} ৳</strong></div>` : ""}
              ${marketName ? `<div style="font-size: 12px; color: #64748b; margin-top: 4px;">বাজার: ${marketName}</div>` : ""}
            </div>

            <div style="text-align: center;">
              <a href="http://localhost:3000/alerts" class="btn">লাইভ বাজার দর দেখুন</a>
            </div>
          </div>
          <div class="footer">
            বাজার দাম — বাংলাদেশের কমিউনিটি দ্বারা চালিত প্ল্যাটফর্ম<br />
            যোগাযোগ: sopu175@gmail.com
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"বাজার দাম (Bazar Dam)" <alerts@bazardam.bd>`,
      to: toEmail,
      subject: `🔔 সতর্কতা সক্রিয়: ${itemEmoji} ${itemNameBn} এর বাজার দর আপডেট`,
      text: `আপনার মূল্য সতর্কতা সফলভাবে সেট করা হয়েছে। ${itemNameBn} এর দর ${directionTextBn} আপনাকে জানানো হবে। টার্গেট দর: ${targetPrice}৳।`,
      html: htmlContent,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || null,
    };
  } catch (error) {
    console.error("Failed to send price alert email:", error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
}
