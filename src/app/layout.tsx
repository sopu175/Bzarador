import type { Metadata } from "next";
import { Noto_Sans_Bengali, Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const notoBn = Noto_Sans_Bengali({
  variable: "--font-bn",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-en",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "বাজার দাম — Bangladesh Kitchen Market Prices",
  description:
    "Real-time kitchen market prices across Bangladesh. See today's vegetable, fish, meat, fruit, rice and spice prices at your local bazaar. Community-driven price reports.",
  keywords: [
    "বাজার দাম",
    "Bazar Dam",
    "Bangladesh market price",
    "kitchen market",
    "আজকের বাজার",
    "vegetable price BD",
    "fish price BD",
  ],
  authors: [{ name: "Bazar Dam Community" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "বাজার দাম — Bangladesh Kitchen Market Prices",
    description: "Know the real prices at your local market. Never get overcharged again.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        className={`${notoBn.variable} ${geist.variable} font-bn antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
