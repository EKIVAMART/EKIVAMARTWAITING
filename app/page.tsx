"use client";

import { useState, useEffect, useRef } from "react";
import { usePageMotion } from "@/hooks/use-page-motion";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Store,
  ShoppingBag,
  Search,
  MapPin,
  Wallet,
  Package,
  TrendingUp,
  Plus,
  ShieldCheck,
  CreditCard,
  Clock3,
} from "lucide-react";
import { CalendarCountdown } from "@/components/calendar-countdown";
import { WaitlistSignup } from "@/components/waitlist-signup";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import MarketplacePreview from "@/components/marketplace-preview";
import { waitlistApi } from "@/lib/api";

// Preserve the existing fallback and launch configuration integration.
const FALLBACK_LAUNCH_DATE = new Date(2026, 6, 6, 8, 0, 0);

const steps = {
  shopper: [
    {
      icon: Search,
      details: [
        "Everyday essentials and unexpected finds",
        "Fashion, beauty, groceries and home",
      ],
      title: "Find something you love.",
      description:
        "Explore fashion, beauty, home essentials and more from local businesses across Nigeria. Discover something for your everyday, your next occasion or your space.",
    },
    {
      icon: MapPin,
      details: [
        "Discover businesses in your community",
        "Get to know the people behind your finds",
      ],
      title: "Get to know the seller.",
      description:
        "Discover vendors near you or further afield, and find the right products for your everyday. Put a name and a story to the businesses you choose to support.",
    },
    {
      icon: Wallet,
      details: ["Flexible payment choices", "Pay on delivery where available"],
      title: "Shop your way.",
      description:
        "Choose the payment option that works for you, including pay on delivery where available. Check the product details and available options before making your choice.",
    },
  ],
  vendor: [
    {
      icon: Store,
      details: [
        "A profile that introduces your business",
        "A place for your brand and your story",
      ],
      title: "Make yourself at home.",
      description:
        "Create your vendor profile, get verified and give your business a place to shine. Help new customers understand who you are and what makes your products worth discovering.",
    },
    {
      icon: Package,
      details: [
        "Show what makes each product special",
        "Clear photos, descriptions and pricing",
      ],
      title: "Put your products out there.",
      description:
        "List what you sell and connect with people looking for products just like yours. Bring your catalogue to life with useful details that help customers choose with confidence.",
    },
    {
      icon: TrendingUp,
      details: [
        "Connect with shoppers across Nigeria",
        "Learn from your sales as you grow",
      ],
      title: "Grow beyond your neighbourhood.",
      description:
        "Reach more customers and use sales insights to keep building your business. Give people beyond your usual circle a chance to discover what you do best.",
    },
  ],
};

const questions = [
  {
    question: "What is EkivaMart?",
    answer:
      "EkivaMart is an upcoming Nigerian marketplace connecting shoppers with local vendors across fashion, beauty, home, food and more. We’re creating one place to discover great products and the people behind them.",
  },
  {
    question: "Who can join the waitlist?",
    answer:
      "Everyone looking to shop or sell on EkivaMart. Select Customer if you want to discover products, or Vendor if you want to bring your business to the marketplace.",
  },
  {
    question: "What happens after I sign up?",
    answer:
      "You’ll receive launch updates at the email address you provide, so you can be among the first to explore EkivaMart when it opens. You can unsubscribe from those updates anytime.",
  },
  {
    question: "Can I join as a vendor before launch?",
    answer:
      "Yes. Choose Vendor when joining the waitlist to register your interest. We’ll keep you informed about the launch and getting started as a seller.",
  },
];

export default function Home() {
  const pageRef = useRef<HTMLDivElement>(null);
  usePageMotion(pageRef);
  const [audience, setAudience] = useState<"shopper" | "vendor">("shopper");
  const [launchDate, setLaunchDate] = useState<Date>(FALLBACK_LAUNCH_DATE);

  useEffect(() => {
    const fetchLaunchDate = async () => {
      try {
        const config = await waitlistApi.getLaunchConfig();
        const fetchedDate = new Date(config.launchDate);
        if (!isNaN(fetchedDate.getTime())) {
          setLaunchDate(fetchedDate);
        }
      } catch (error) {
        console.error("Failed to fetch launch date:", error);
      }
    };
    fetchLaunchDate();
  }, []);

  return (
    <div className="ek-site" ref={pageRef}>
      <SiteHeader />
      <main id="main-content">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-layout site-container">
            <div className="hero-copy">
              <span className="eyebrow launch-status" data-reveal>
                A fresh way to shop is coming
              </span>
              <h1 id="hero-heading">
                <span
                  className="hero-title-line"
                  data-reveal
                  data-motion-order="1"
                >
                   Shop Fast sell quick fast delivery.
                </span>
                <span
                  className="hero-title-line"
                  data-reveal
                  data-motion-order="2"
                >
                  Closer to{" "}
                  <span className="hero-word">
                    home.
                    <svg viewBox="0 0 260 18" aria-hidden="true">
                      <path d="M3 12C63 2 155 2 255 9M24 16C89 8 180 8 237 12" />
                    </svg>
                  </span>
                </span>
              </h1>
              <p className="hero-description" data-reveal data-motion-order="3">
                Discover the things you love and the local businesses behind
                them.
                <br className="desktop-break" /> Your next favourite
                marketplace. Made for Nigeria.
              </p>
              <div
                className="hero-launch"
                role="group"
                aria-label="Launch countdown"
              >
                <p className="eyebrow">THE COUNTDOWN IS ON</p>
                <div className="launch-countdown">
                  <CalendarCountdown targetDate={launchDate} />
                </div>
              </div>
              <div className="hero-actions" data-reveal data-motion-order="4">
                <a href="#waitlist" className="ek-button">
                  Get early access <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                <a href="#how-it-works" className="text-link">
                  Meet EkivaMart <ArrowRight size={17} aria-hidden="true" />
                </a>
              </div>
              <ul
                className="hero-trust"
                aria-label="Shopping assurances"
                data-reveal
                data-motion-order="5"
              >
                <li>
                  <ShieldCheck size={17} aria-hidden="true" />
                  <span>NDPR Compliant</span>
                </li>
                <li>
                  <CreditCard size={17} aria-hidden="true" />
                  <span>Secure payment</span>
                </li>
                <li>
                  <Clock3 size={17} aria-hidden="true" />
                  <span>24/7 Support</span>
                </li>
              </ul>
            </div>
            <MarketplacePreview />
          </div>
        </section>

        <section
          id="about"
          className="about-section section-space"
          aria-labelledby="about-heading"
        >
          <div className="site-container">
            <div className="section-intro" data-reveal>
              <span className="eyebrow">LOCAL ROOTS. MORE POSSIBILITIES.</span>
              <h2 id="about-heading">
                A marketplace with
                <br />a little more{" "}
                <span className="soft-green">connection.</span>
              </h2>
              <p>
                For the everyday essentials. The unexpected finds.
                <br className="desktop-break" /> And the people turning their
                passion into a business.
              </p>
            </div>
            <div className="benefit-grid">
              {[
                {
                  image: "/images/local-shop-photo.webp",
                  title: "Discover closer to home",
                  text: "Find your next favourite vendor in your neighbourhood or across Nigeria. Great products don’t have to feel far away.",
                },
                {
                  image: "/images/seller-boutique-photo.webp",
                  title: "Small businesses. Big potential.",
                  text: "Behind every great find is a person with a story. Connect with local sellers and help their businesses grow.",
                },
                {
                  image: "/images/delivery-handover-photo.webp",
                  title: "Shop with peace of mind",
                  text: "Verified vendors, secure payments and flexible ways to pay. A more reassuring way to discover something new.",
                },
              ].map(({ image, title, text }, index) => (
                <article
                  className="benefit"
                  key={title}
                  data-reveal
                  data-motion-order={index}
                >
                  <div className="benefit-photo">
                    <Image
                      src={image}
                      fill
                      sizes="(max-width: 640px) 85vw, 30vw"
                      alt=""
                    />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="how-section section-space site-container"
          aria-labelledby="how-heading"
        >
          <div className="how-header" data-reveal>
            <div>
              <span className="eyebrow">YOUR KIND OF MARKETPLACE</span>
              <h2 id="how-heading">Good things start here.</h2>
            </div>
            <div
              className="audience-switch"
              role="group"
              aria-label="Choose your marketplace guide"
            >
              <button
                type="button"
                aria-pressed={audience === "shopper"}
                onClick={() => setAudience("shopper")}
              >
                <ShoppingBag size={16} aria-hidden="true" /> I’m shopping
              </button>
              <button
                type="button"
                aria-pressed={audience === "vendor"}
                onClick={() => setAudience("vendor")}
              >
                <Store size={16} aria-hidden="true" /> I’m selling
              </button>
            </div>
          </div>
          <div
            className="steps-grid"
            aria-live="polite"
            aria-atomic="true"
            data-reveal
          >
            {steps[audience].map((step) => (
              <article key={step.title} className="step">
                <step.icon
                  className="step-icon"
                  size={34}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <ul className="step-details">
                  {step.details.map((detail) => (
                    <li key={detail}>
                      <Check size={15} aria-hidden="true" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <a href="#waitlist" className="text-link">
            Find your place on EkivaMart{" "}
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </section>

        <section
          id="waitlist"
          className="waitlist-section site-container"
          aria-labelledby="waitlist-heading"
        >
          <div className="waitlist-panel">
            <div className="waitlist-copy" data-reveal>
              <span className="eyebrow">YOU’RE EARLY. WE LIKE THAT.</span>
              <h2 id="waitlist-heading">
                Your next great
                <br />
                find starts <span>here.</span>
              </h2>
              <p>
                Be among the first to experience EkivaMart. Join our waitlist
                for early access and launch updates.
              </p>
              <ul>
                <li>
                  <Check size={17} aria-hidden="true" /> Discover something new
                </li>
                <li>
                  <Check size={17} aria-hidden="true" /> Connect with local
                  businesses
                </li>
                <li>
                  <Check size={17} aria-hidden="true" /> Get the latest launch
                  news
                </li>
              </ul>
            </div>
            <div className="waitlist-card">
              <h3>Save your spot.</h3>
              <p className="form-intro">
                A few details, and you’re part of the journey.
              </p>
              <div className="waitlist-form">
                <WaitlistSignup />
              </div>
              <p className="form-privacy">
                <Check size={13} aria-hidden="true" /> No spam. Unsubscribe
                anytime.
              </p>
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="faq-section section-space site-container"
          aria-labelledby="faq-heading"
        >
          <div className="section-intro" data-reveal>
            <span className="eyebrow">A LITTLE MORE TO KNOW</span>
            <h2 id="faq-heading">
              Good questions.
              <br />
              Straightforward answers.
            </h2>
          </div>
          <div className="faq-list">
            {questions.map(({ question, answer }, index) => (
              <details key={question} data-reveal data-motion-order={index}>
                <summary>
                  {question}
                  <Plus size={19} aria-hidden="true" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
          <p className="faq-contact">
            Something else on your mind?{" "}
            <a
              href="https://wa.me/2349069910407"
              target="_blank"
              rel="noopener noreferrer"
            >
              Let’s chat <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
