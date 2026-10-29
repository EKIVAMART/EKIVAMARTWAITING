import Link from "next/link";
import { Check, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export const metadata: Metadata = {
  title: "Unsubscribed Successfully | EkivaMart",
  description:
    "You have been successfully unsubscribed from EkivaMart's waitlist. You will no longer receive email updates from us.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://faflora.com/unsubscribe" },
};

export default function UnsubscribePage() {
  return (
    <div className="ek-site">
      <SiteHeader />
      <main
        id="main-content"
        className="utility-main"
        aria-labelledby="unsubscribe-heading"
      >
        <div className="site-container utility-content">
          <span className="utility-icon" aria-hidden="true">
            <Check size={30} />
          </span>
          <h1 id="unsubscribe-heading">You’re unsubscribed.</h1>
          <p role="status">
            You have been successfully removed from our waitlist. You will no
            longer receive email updates from EkivaMart.
          </p>
          <Link href="/" className="ek-button">
            Back to home <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <p className="utility-note">
            Changed your mind? You’re always welcome to{" "}
            <Link href="/#waitlist">join us again.</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
