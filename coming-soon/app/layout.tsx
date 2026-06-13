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
    description: 'Nigeria\'s premier multi-vendor marketplace is launching. Join the waitlist for early access!',
    url: 'https://faflora.com',
    siteName: 'Faflora',
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
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
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className={inter.className}>
        {children}
        <DraggableWhatsAppButton />
      </body>
    </html>
  );
}