import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import ContactLink from "@/components/contact-link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div className="site-container header-inner">
        <Link href="/" className="brand-link" aria-label="EkivaMart home">
          <Image
            src="/brand/ekivamart-logo.svg"
            width={120}
            height={68}
            alt="EkivaMart"
            priority
          />
        </Link>
        <nav aria-label="Main navigation" className="main-nav">
          <Link href="/#about">Why EkivaMart</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#faq">FAQs</Link>
          <ContactLink />
        </nav>
        <Link href="/#waitlist" className="ek-button ek-button-small">
          Join the waitlist <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer" id="footer">
      <div className="site-container footer-main">
        <div>
          <Link href="/" aria-label="EkivaMart home" className="brand-link">
            <Image
              src="/brand/ekivamart-logo.svg"
              width={120}
              height={68}
              alt="EkivaMart"
            />
          </Link>
          <p>Good finds. Local connections.</p>
        </div>
        <div className="footer-social">
          <p>Stay in the loop.</p>
          <nav aria-label="Social media links">
            {[
              {
                href: "https://www.instagram.com/faflora_ng",
                Icon: FaInstagram,
                name: "Instagram",
              },
              { href: "https://x.com/Faflora_NG", Icon: FaXTwitter, name: "X" },
              {
                href: "https://www.facebook.com/share/1BejkDJRD7/",
                Icon: FaFacebookF,
                name: "Facebook",
              },
              {
                href: "https://www.tiktok.com/@faflora_ng?_r=1&_t=ZS-97CvHn44PK5",
                Icon: FaTiktok,
                name: "TikTok",
              },
              {
                href: "https://linkedin.com/company/faflora",
                Icon: FaLinkedinIn,
                name: "LinkedIn",
              },
            ].map(({ href, Icon, name }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${name}`}
              >
                <Icon size={17} aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>
      </div>
      <div className="site-container footer-bottom">
        <p>© {new Date().getFullYear()} EkivaMart. All rights reserved.</p>
        <span>
          Made for the way Nigeria shops. <span aria-hidden="true">🇳🇬</span>
        </span>
      </div>
    </footer>
  );
}
