import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import "./ekivamart.css";
import DraggableWhatsAppButton from "@/components/WhatsappContactButton";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://faflora.com"),
  title: "EkivaMart | Nigeria's Premier Multi-Vendor Marketplace - Coming Soon",
  description:
    "EkivaMart is transforming Nigerian e-commerce. Connect with local vendors, shop authentic products, and grow your business. Join the waitlist for early access.",
  keywords:
    "Nigerian marketplace, e-commerce Nigeria, local vendors, shop Nigerian products, sell online Nigeria, EkivaMart",
  authors: [{ name: "EkivaMart" }],
  openGraph: {
    title: "EkivaMart - Something Amazing is Coming",
    description:
      "Nigeria's premier multi-vendor marketplace is launching. Join the waitlist for early access! Shop authentic local products or grow your business as a vendor.",
    url: "https://faflora.com",
    siteName: "EkivaMart",
    images: [
      {
        url: "/brand/ekivamart-social.png",
        width: 792,
        height: 612,
        alt: "EkivaMart Logo",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "EkivaMart - Something Amazing is Coming",
    description:
      "Nigeria's premier multi-vendor marketplace is launching. Join the waitlist for early access!",
    images: ["/brand/ekivamart-social.png"],
  },
  icons: {
    icon: "/brand/ekivamart-mark.svg",
    apple: "/brand/ekivamart-apple.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <head>
        {/* meta tags for PWA support */}
        <meta name="theme-color" content="#228b22" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="EkivaMart" />
        <meta name="msapplication-TileColor" content="#228b22" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="EkivaMart" />
      </head>
      <body className={dmSans.className}>
        {children}
        <DraggableWhatsAppButton />
      </body>
    </html>
  );
}
