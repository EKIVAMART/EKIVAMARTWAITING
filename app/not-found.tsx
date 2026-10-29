import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

export default function NotFound() {
  return (
    <div className="ek-site">
      <SiteHeader />
      <main id="main-content" className="utility-main">
        <div className="site-container utility-content">
          <div className="utility-code" aria-hidden="true">
            404
          </div>
          <h1>
            A little off the
            <br />
            beaten path.
          </h1>
          <p>
            This page couldn’t be found. There’s still plenty to look forward to
            at EkivaMart.
          </p>
          <Link href="/" className="ek-button">
            Back to home <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <p className="utility-note">
            Want to be part of what’s next?{" "}
            <Link href="/#waitlist">Join the waitlist.</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
