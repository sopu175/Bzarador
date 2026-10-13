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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://bazar-dor-bangladesh.vercel.app"),
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
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  verification: {
    google: "CCTqGOt2SWgZtmNUMO_kn8PQF4jo4C_ADxoHm8YeSpA",
  },
  openGraph: {
    title: "বাজার দাম — Bangladesh Kitchen Market Prices",
    description: "Discover real-time, verified prices at your local market with historical and community trends.",
    type: "website",
    url: "https://bazar-dor-bangladesh.vercel.app",
    siteName: "বাজার দাম",
  },
  alternates: {
    canonical: "https://bazar-dor-bangladesh.vercel.app",
  },
};

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-026YVGBS6C";
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html lang="bn" suppressHydrationWarning>
      <head>
        {/* Google Site Verification */}
        <meta
          name="google-site-verification"
          content="CCTqGOt2SWgZtmNUMO_kn8PQF4jo4C_ADxoHm8YeSpA"
        />

        {/* Google Tag Manager (GTM) */}
        {gtmId && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
        )}

        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-026YVGBS6C"
          strategy="afterInteractive"
        />
        <Script id="google-tag-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-026YVGBS6C');
          `}
        </Script>

        {/* Additional custom GA4 if provided via env */}
        {gaId && gaId !== "G-026YVGBS6C" && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics-custom" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${notoBn.variable} ${geist.variable} font-bn antialiased bg-background text-foreground`}
      >
        {/* GTM Noscript Fallback */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {children}
        <Toaster />
      </body>
    </html>
  );
}
