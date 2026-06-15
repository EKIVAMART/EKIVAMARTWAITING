import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import DraggableWhatsAppButton from "@/components/WhatsappContactButton";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://faflora.com'),
  title: 'Faflora | Nigeria\'s Premier Multi-Vendor Marketplace - Coming Soon',
  description: 'Faflora is transforming Nigerian e-commerce. Connect with local vendors, shop authentic products, and grow your business. Join the waitlist for early access.',
  keywords: 'Nigerian marketplace, e-commerce Nigeria, local vendors, shop Nigerian products, sell online Nigeria, Faflora',
  authors: [{ name: 'Faflora' }],
  openGraph: {
    title: 'Faflora - Something Amazing is Coming',
    description: "Nigeria's premier multi-vendor marketplace is launching. Join the waitlist for early access! Shop authentic local products or grow your business as a vendor.",
    url: 'https://faflora.com',
    siteName: 'Faflora',
    images: [
      {
        url: '/fa_logo_brand.png',
        width: 1200,
        height: 630,
        alt: 'Faflora Logo',
      },
    ],
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Faflora - Something Amazing is Coming',
    description: 'Nigeria\'s premier multi-vendor marketplace is launching. Join the waitlist for early access!',
    images: ['/fa_logo_brand.png'],
  },
  icons: {
    icon: '/icon.PNG',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        {/* meta tags for PWA support */}
        <meta name="theme-color" content="#9d4ae3" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Faflora" />
        <meta name="msapplication-TileColor" content="#9d4ae3" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Faflora" />
      </head>
      <body className={inter.className}>
        {children}
        <DraggableWhatsAppButton />
      </body>
    </html>
  );
}