import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Metadata } from 'next';

// SEO: Set metadata for the page
export const metadata: Metadata = {
  title: 'Unsubscribed Successfully | Faflora',
  description: 'You have been successfully unsubscribed from Faflora\'s waitlist. You will no longer receive email updates from us.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://faflora.com/unsubscribe',
  },
};

export default function UnsubscribePage() {
  return (
    <main 
      className="min-h-screen bg-gradient-to-br from-brand-50 to-white flex items-center justify-center px-4 py-8"
      role="main"
      aria-labelledby="unsubscribe-heading"
    >
      <div className="max-w-md w-full">
        <div 
          className="bg-white rounded-3xl shadow-xl border border-brand-100 p-8 md:p-12 text-center"
          role="article"
          aria-label="Unsubscribe confirmation"
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/fa_logo_brand.png"
              alt="Faflora logo"
              width={140}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </div>

          {/* Success Icon with ARIA label */}
          <div 
            className="flex justify-center mb-6"
            aria-label="Success indicator"
          >
            <div 
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
              aria-hidden="true"
            >
              <CheckCircle 
                className="w-10 h-10 text-green-600" 
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Heading with proper hierarchy */}
          <h1 
            id="unsubscribe-heading"
            className="text-2xl md:text-3xl font-bold text-brand-800 mb-3"
            tabIndex={-1}
          >
            Unsubscribed Successfully
          </h1>

          {/* Message with ARIA live region for screen readers */}
          <p 
            className="text-brand-700 text-base leading-relaxed mb-8"
            role="status"
            aria-live="polite"
          >
            You have been successfully removed from our waitlist. You will no longer receive emails from us.
          </p>

          {/* Back to Home Button with full accessibility */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-full font-bold text-sm w-full transition-all duration-200 shadow-md shadow-brand-600/20 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 focus:ring-offset-white active:scale-95"
            aria-label="Return to Faflora home page"
          >
            <span>Back to Home</span>
            <span aria-hidden="true">→</span>
          </Link>

          {/* Support contact for users who need help */}
          <div className="mt-6 text-center">
            <p className="text-xs text-brand-500">
              If you didn't mean to unsubscribe,{' '}
              <Link 
                href="/#waitlist" 
                className="text-brand-600 hover:text-brand-700 underline focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 rounded"
                aria-label="Return to waitlist page to sign up again"
              >
                join our waitlist again
              </Link>
            </p>
          </div>
        </div>

        {/* Footer with proper semantics */}
        <footer 
          className="text-center text-xs text-brand-500 mt-8"
          role="contentinfo"
        >
          <p>
            © {new Date().getFullYear()} Faflora. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}