'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { CalendarCountdown } from '@/components/calendar-countdown';
import { WaitlistSignup } from '@/components/waitlist-signup';
import FadeInSection from '@/components/FadeInSection';
import TypingText from '@/components/TypingText';
import {
  ShoppingBag,
  TrendingUp,
  Shield,
  BarChart3,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Package,
  BadgeCheck,
  Pause,
  Play,
} from 'lucide-react';
import { FaInstagram, FaFacebookF, FaTiktok, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { waitlistApi } from '@/lib/api';

// Trust indicators displayed in the stats section
const promiseStats = [
  { value: '30+', label: 'Categories', icon: ShoppingBag },
  { value: '100%', label: 'Local Vendors', icon: TrendingUp },
  { value: '0', label: 'Hidden Fees', icon: BadgeCheck },
  { value: '24/7', label: 'Support', icon: Clock },
];

// How it works steps - each covers both buyer and seller perspectives
const howItWorksSteps = [
  {
    icon: Package,
    title: 'Browse or list',
    buyerDesc: 'Discover unique Nigerian fashion, crafts, beauty, food, and more from verified local sellers across different locations.',
    sellerDesc: 'Vendors create a profile, get verified, and upload products across multiple categories — fashion, beauty, crafts, food, and more.',
  },
  {
    icon: ShoppingBag,
    title: 'Shop or get discovered',
    buyerDesc: 'Find products from vendors in your area or anywhere in Nigeria. Every seller is vetted before they can list products.',
    sellerDesc: 'Our smart search puts your products in front of buyers actively looking for what you sell — whether locally or nationwide.',
  },
  {
    icon: Shield,
    title: 'Pay or get paid — your way',
    buyerDesc: 'Choose upfront payment or pay on delivery when your order arrives. No hidden fees, no surprises.',
    sellerDesc: 'Receive payments upfront or collect upon delivery confirmation — secure and reliable.',
  },
];

// Fallback launch date - July 6th, 2026
const FALLBACK_LAUNCH_DATE = new Date(2026, 6, 6, 8, 0, 0);

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  
  // Launch date state - fetch from API or use fallback
  const [launchDate, setLaunchDate] = useState<Date>(FALLBACK_LAUNCH_DATE);

  const slideChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Fetch launch date from API on mount
  useEffect(() => {
    const fetchLaunchDate = async () => {
      try {
        const config = await waitlistApi.getLaunchConfig();
        const fetchedDate = new Date(config.launchDate);
        if (!isNaN(fetchedDate.getTime())) {
          setLaunchDate(fetchedDate);
        }
      } catch (error) {
        // Silently fail - fallback date already set
        console.error('Failed to fetch launch date:', error);
      }
    };
    fetchLaunchDate();
  }, []);

  const slides = [
    {
      subtitle: 'Discover Authentic Nigerian Treasures',
      mainTextPrefix: 'Discover more.',
      mainTextBefore: 'Shop',
      changingWords: ['smarter', 'faster', 'easier'],
      ctaText: 'Find unique fashion, crafts, beauty & more from trusted local sellers across Nigeria',
      primaryButton: { text: 'Join Waitlist' },
      secondaryButton: { text: 'Learn More', link: '#benefits' },
      lightGradient: 'from-[#f3ecfc] to-[#e8dbf8]',
    },
    {
      subtitle: 'Grow Your Business Nationally',
      mainTextPrefix: 'Reach millions.',
      mainTextBefore: 'Sell',
      changingWords: ['effortlessly', 'profitably', 'confidently'],
      ctaText: 'Centralized payments, powerful tools, and access to millions of buyers across Nigeria',
      primaryButton: { text: 'Join Waitlist' },
      secondaryButton: { text: 'Learn More', link: '#benefits' },
      lightGradient: 'from-[#f3ecfc] to-[#e8dbf8]',
    },
  ];

  const current = slides[currentSlide];
  const totalSlides = slides.length;

  const getTotalSlideDuration = () => {
    let t = 0;
    current.changingWords.forEach((w, i) => {
      t += w.length * 105;
      if (i < current.changingWords.length - 1) t += 2000;
      t += 65 * w.length;
    });
    return (t + 2000) / 1000;
  };

  // Announce slide changes to screen readers
  const announceSlide = (index: number) => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = '';
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = `Slide ${index + 1} of ${totalSlides}: ${slides[index].subtitle}`;
        }
      }, 50);
    }
  };

  const goToNextSlide = useCallback(() => {
    if (isTransitioning || carouselPaused) return;
    setIsTransitioning(true);
    setIsTypingComplete(false);
    setProgressKey(p => p + 1);
    setTimeout(() => {
      setCurrentSlide(p => {
        const next = (p + 1) % totalSlides;
        announceSlide(next);
        return next;
      });
      setIsTransitioning(false);
    }, 100);
  }, [totalSlides, isTransitioning, carouselPaused]);

  const goToPrevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setIsTypingComplete(false);
    setProgressKey(p => p + 1);
    setTimeout(() => {
      setCurrentSlide(p => {
        const prev = (p - 1 + totalSlides) % totalSlides;
        announceSlide(prev);
        return prev;
      });
      setIsTransitioning(false);
    }, 100);
  }, [totalSlides, isTransitioning]);

  useEffect(() => {
    setProgressKey(p => p + 1);
  }, [currentSlide]);

  // Auto-advance carousel when typing completes
  useEffect(() => {
    if (isTypingComplete && isAutoPlaying && !isTransitioning && !carouselPaused) {
      if (slideChangeTimeoutRef.current) clearTimeout(slideChangeTimeoutRef.current);
      slideChangeTimeoutRef.current = setTimeout(() => goToNextSlide(), 2000);
    }
    return () => {
      if (slideChangeTimeoutRef.current) clearTimeout(slideChangeTimeoutRef.current);
    };
  }, [isTypingComplete, isAutoPlaying, goToNextSlide, isTransitioning, carouselPaused]);

  const handleManualNavigation = (cb: () => void) => {
    if (slideChangeTimeoutRef.current) clearTimeout(slideChangeTimeoutRef.current);
    if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
    setProgressKey(p => p + 1);
    cb();
    autoPlayTimeoutRef.current = setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const fadeVariants = {
    enter: { opacity: 0, scale: 0.98 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
  };

  const primaryBtn =
    'inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 ' +
    'text-white px-6 py-3 md:px-8 md:py-3.5 rounded-full font-bold text-sm md:text-base ' +
    'hover:scale-105 active:scale-95 shadow-md shadow-brand-600/20 group';

  // Respect user's motion preferences
  const floatAnimation =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? {}
      : { animate: { y: [0, -10, 0] }, transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const } };

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* Screen reader announcements for carousel */}
      <div ref={liveRegionRef} role="status" aria-live="polite" aria-atomic="true" className="sr-only" />

      {/* Sticky Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-100"
      >
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <Image
              src="/fa_logo_brand.png"
              alt="Faflora home"
              width={120}
              height={40}
              className="h-9 w-auto object-contain"
              loading="eager"
              fetchPriority="high"
            />
          </div>

          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-brand-700 hover:text-brand-900 text-sm font-medium transition-colors">
              How it works
            </a>
            <a href="#benefits" className="text-brand-700 hover:text-brand-900 text-sm font-medium transition-colors">
              Benefits
            </a>
            <a href="#waitlist" className="text-brand-700 hover:text-brand-900 text-sm font-medium transition-colors">
              Waitlist
            </a>
            <a
              href="#footer"
              onClick={(e) => {
                e.preventDefault();
                const footer = document.querySelector('footer');
                footer?.scrollIntoView({ behavior: 'smooth' });
                const socialSection = footer?.querySelector('.social-section');
                socialSection?.classList.add('ring-2', 'ring-brand-400', 'ring-offset-2', 'rounded-lg', 'transition-all', 'duration-300');
                setTimeout(() => {
                  socialSection?.classList.remove('ring-2', 'ring-brand-400', 'ring-offset-2', 'rounded-lg');
                }, 2000);
              }}
              className="text-brand-700 hover:text-brand-900 text-sm font-medium transition-colors"
            >
              Contact
            </a>
          </nav>

          <a
            href="#waitlist"
            className="hidden md:inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 shadow-md shadow-brand-600/20"
          >
            Join Waitlist <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>

          <div className="md:hidden w-10 shrink-0" aria-hidden="true" />
        </div>
      </motion.header>

      {/* Countdown + Hero Section */}
      <div className="relative bg-white">
        {/* Decorative geometric background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10" aria-hidden="true">
          <div className="absolute top-35 right-0 w-[500px] h-[500px] md:w-[620px] md:h-[620px]">
            <svg viewBox="0 0 620 620" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M540,40 L680,220 L540,400 L340,400 L200,220 L340,40 Z" fill="#9d4ae3" opacity="0.05" />
              <path d="M0 80 L620 280 M0 200 L620 400 M0 320 L620 520" stroke="#9d4ae3" strokeWidth="0.6" opacity="0.1" />
              <path d="M80 0 L260 620 M200 0 L380 620 M320 0 L500 620" stroke="#9d4ae3" strokeWidth="0.6" opacity="0.08" />
              <circle cx="480" cy="180" r="240" stroke="#9d4ae3" strokeWidth="1.2" opacity="0.12" />
              <circle cx="480" cy="180" r="190" stroke="#9d4ae3" strokeWidth="0.8" opacity="0.1" />
              <circle cx="480" cy="180" r="140" stroke="#c69ff4" strokeWidth="0.6" opacity="0.08" />
              <circle cx="480" cy="180" r="90" stroke="#e8dbf8" strokeWidth="0.5" opacity="0.06" />
              <circle cx="480" cy="180" r="44" stroke="#9d4ae3" strokeWidth="0.5" opacity="0.1" />
              <circle cx="480" cy="180" r="6" fill="#9d4ae3" opacity="0.3" />
              <circle cx="480" cy="180" r="12" fill="#9d4ae3" opacity="0.06" />
              <line x1="430" y1="180" x2="530" y2="180" stroke="#9d4ae3" strokeWidth="0.9" opacity="0.12" />
              <line x1="480" y1="130" x2="480" y2="230" stroke="#9d4ae3" strokeWidth="0.9" opacity="0.12" />
              <circle cx="310" cy="370" r="9" fill="#c69ff4" opacity="0.2" />
              <circle cx="310" cy="370" r="18" stroke="#9d4ae3" strokeWidth="1" opacity="0.1" />
              <circle cx="180" cy="120" r="5" fill="#9d4ae3" opacity="0.15" />
              <circle cx="560" cy="420" r="7" fill="#8236be" opacity="0.12" />
              <g transform="translate(210,310)">
                <rect x="-10" y="-10" width="20" height="20" rx="3" stroke="#9d4ae3" strokeWidth="0.8" opacity="0.15" />
              </g>
            </svg>
          </div>
          <div className="absolute -bottom-10 left-0 w-[280px] h-[280px]">
            <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <circle cx="20" cy="300" r="210" stroke="#9d4ae3" strokeWidth="0.8" opacity="0.1" />
              <circle cx="20" cy="300" r="260" stroke="#c69ff4" strokeWidth="0.5" opacity="0.07" />
              <rect x="130" y="120" width="40" height="40" rx="6" stroke="#9d4ae3" strokeWidth="1" opacity="0.12" transform="rotate(45 150 140)" />
            </svg>
          </div>
          <div className="absolute -top-16 -right-16 w-[360px] h-[360px] rounded-full bg-brand-600/[0.04] blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{ backgroundImage: 'radial-gradient(circle,#9d4ae3 1px,transparent 1px)', backgroundSize: '24px 24px' }}
          />
        </div>

        {/* Countdown Timer */}
        <motion.section
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 pt-7 pb-1 md:pt-10 md:pb-4"
          aria-label="Launch countdown"
        >
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 shadow-sm border border-brand-100 mb-3">
              <Sparkles className="w-3 h-3 text-brand-600" aria-hidden="true" />
              <span className="text-xs font-bold text-brand-700 tracking-wide">FAFLORA LAUNCHING SOON</span>
            </div>
            <h3 className="text-brand-800 font-semibold text-sm md:text-base mb-4">Nigeria's Premier Multi-Vendor Marketplace arrives in...</h3>
            <CalendarCountdown targetDate={launchDate} />
          </div>
        </motion.section>

        {/* Hero Carousel */}
        <section
          className="relative min-h-[82vh] md:min-h-[76vh] flex items-center overflow-hidden"
          aria-label="Hero carousel"
          aria-roledescription="carousel"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute inset-0 z-0"
              aria-hidden="true"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${current.lightGradient} opacity-15`} />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/80" />
            </motion.div>
          </AnimatePresence>

          {/* Previous Slide Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleManualNavigation(goToPrevSlide);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              handleManualNavigation(goToPrevSlide);
            }}
            className="absolute left-3 md:left-8 z-50 touch-manipulation cursor-pointer active:opacity-70"
            style={{ 
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              pointerEvents: 'auto'
            }}
            aria-label="Previous slide"
          >
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-white shadow-lg border border-brand-200 flex items-center justify-center hover:border-brand-400 hover:bg-brand-50 transition-all duration-200">
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-brand-700 pointer-events-none" aria-hidden="true" />
            </div>
          </button>

          {/* Next Slide Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleManualNavigation(goToNextSlide);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              handleManualNavigation(goToNextSlide);
            }}
            className="absolute right-3 md:right-8 z-50 touch-manipulation cursor-pointer active:opacity-70"
            style={{ 
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              pointerEvents: 'auto'
            }}
            aria-label="Next slide"
          >
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-white shadow-lg border border-brand-200 flex items-center justify-center hover:border-brand-400 hover:bg-brand-50 transition-all duration-200">
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-brand-700 pointer-events-none" aria-hidden="true" />
            </div>
          </button>

          {/* Slide Content */}
          <div
            className="relative z-20 max-w-7xl mx-auto px-8 md:px-14 lg:px-20 w-full py-10 md:py-6 pb-24 md:pb-28"
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${currentSlide + 1} of ${totalSlides}: ${current.subtitle}`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Left Column - Text Content */}
              <div className='mb-7'>
                <FadeInSection key={`badge-${currentSlide}`} type="fadeDown" delay={0.15} duration={0.5} resetKey={currentSlide}>
                  <div className="inline-flex items-center gap-2 bg-white shadow-sm border border-brand-200 text-brand-700 text-xs font-bold px-4 py-2 rounded-full mb-5">
                    <div className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-pulse" aria-hidden="true" />
                    {current.subtitle}
                  </div>
                </FadeInSection>

                <FadeInSection key={`prefix-${currentSlide}`} type="fadeDown" delay={0.3} duration={0.5} resetKey={currentSlide} className="mb-1">
                  <div className="text-brand-600 text-2xl md:text-3xl lg:text-[2.75rem] font-semibold leading-tight">
                    {current.mainTextPrefix}
                  </div>
                </FadeInSection>

                <FadeInSection key={`h1-${currentSlide}`} type="slideRight" delay={0.5} duration={0.6} resetKey={currentSlide} className="mb-5">
                  <h1 className="text-brand-800 text-[2.4rem] md:text-5xl lg:text-[4rem] font-black leading-[1.08] tracking-tight">
                    <span className="flex flex-wrap items-center gap-3">
                      <span className="pb-1">{current.mainTextBefore}</span>
                      <TypingText
                        texts={current.changingWords}
                        typingSpeed={85}
                        deleteSpeed={45}
                        delayBetween={2000}
                        className="font-black pb-1"
                        colorClass="bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent"
                        keepCursorFlashing
                        onCycleComplete={() => {
                          if (!isTypingComplete) setIsTypingComplete(true);
                        }}
                      />
                    </span>
                  </h1>
                </FadeInSection>

                <FadeInSection key={`cta-${currentSlide}`} type="fadeUp" delay={0.75} duration={0.5} resetKey={currentSlide}>
                  <p className="text-brand-700 text-base leading-relaxed max-w-md">{current.ctaText}</p>
                </FadeInSection>

                <FadeInSection key={`btns-${currentSlide}`} type="fadeUp" delay={0.95} duration={0.5} resetKey={currentSlide} className="flex flex-col sm:flex-row gap-3 mt-6">
                  <a href="#waitlist" className={primaryBtn}>
                    {current.primaryButton.text}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                  </a>
                  <a
                    href={current.secondaryButton.link}
                    className="inline-flex items-center justify-center gap-2 bg-white border border-brand-300 hover:bg-brand-100 text-brand-700 hover:text-brand-900 px-6 py-3 md:px-8 md:py-3.5 rounded-full font-semibold text-sm md:text-base hover:scale-105"
                  >
                    {current.secondaryButton.text}
                  </a>
                </FadeInSection>

                <motion.div
                  key={`trust-${currentSlide}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  className="mt-5 hidden md:flex flex-wrap gap-5"
                  aria-label="Trust indicators"
                >
                  <div className="flex items-center gap-1.5">
                    <Shield size={12} className="text-brand-600" aria-hidden="true" />
                    <span className="text-brand-700 text-xs font-semibold tracking-wide">NDPR Compliant</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield size={12} className="text-brand-600" aria-hidden="true" />
                    <span className="text-brand-700 text-xs font-semibold tracking-wide">Secure payment</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-brand-600" aria-hidden="true" />
                    <span className="text-brand-700 text-xs font-semibold tracking-wide">24/7 Support</span>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - App Preview Image */}
              <FadeInSection
                key={`card-${currentSlide}`}
                type="slideLeft"
                delay={0.7}
                duration={0.6}
                resetKey={currentSlide}
                className="flex justify-center md:mt-2"
              >
                <motion.div className="relative" aria-hidden="true" {...floatAnimation}>
                  {/* Oval shadow under the image */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] h-6 bg-black/15 rounded-[50%] blur-md" />
                  
                  <div className="w-60 md:w-[300px] rounded-b-[50px] rounded-t-[45px] shadow-xl border border-brand-100 overflow-hidden bg-white relative">
                    {/* App Preview Image */}
                    <div className="relative">
                      <Image
                        src="/app_preview.png"
                        alt="Faflora App Preview"
                        width={300}
                        height={500}
                        className="w-full h-auto object-cover"
                        priority
                        fetchPriority="high"
                      />
                    </div>
                  </div>

                  {/* "Coming July 2026" badge */}
                  <motion.div
                    className="absolute -top-3 -right-3 bg-brand-600 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg whitespace-nowrap"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Coming July 2026
                  </motion.div>
                </motion.div>
              </FadeInSection>
            </div>
          </div>

          {/* Slide Indicators & Pause Control */}
          <div className="absolute bottom-0 left-0 right-0 z-20 pb-3 md:pb-4">
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent md:bg-none pointer-events-none" aria-hidden="true" />

            <div className="relative flex flex-col items-center gap-2">
              <div role="tablist" aria-label="Slides" className="flex gap-2">
                {slides.map((slide, idx) => (
                  <button
                    key={idx}
                    role="tab"
                    aria-selected={currentSlide === idx}
                    aria-label={`Slide ${idx + 1}: ${slide.subtitle}`}
                    onClick={() => {
                      if (slideChangeTimeoutRef.current) clearTimeout(slideChangeTimeoutRef.current);
                      if (autoPlayTimeoutRef.current) clearTimeout(autoPlayTimeoutRef.current);
                      setCurrentSlide(idx);
                      announceSlide(idx);
                      setIsTypingComplete(false);
                      setProgressKey(p => p + 1);
                      autoPlayTimeoutRef.current = setTimeout(() => setIsAutoPlaying(true), 10000);
                    }}
                    className="relative cursor-pointer"
                  >
                    <div
                      className={`w-8 md:w-13 h-1.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-brand-400' : 'bg-brand-900/30 hover:bg-brand-50'
                        }`}
                    />
                    {currentSlide === idx && (
                      <motion.div
                        key={`p-${progressKey}-${idx}`}
                        className="absolute top-0 left-0 h-full rounded-full bg-brand-800"
                        initial={{ width: '0%' }}
                        animate={{ width: carouselPaused ? undefined : '100%' }}
                        transition={{ duration: getTotalSlideDuration(), ease: 'linear' }}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCarouselPaused(p => !p)}
                aria-label={carouselPaused ? 'Resume automatic slide rotation' : 'Pause automatic slide rotation'}
                className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-brand-200 shadow-sm flex items-center justify-center hover:bg-brand-50 transition-colors"
              >
                {carouselPaused ? (
                  <Play className="w-3 h-3 text-brand-700" aria-hidden="true" />
                ) : (
                  <Pause className="w-3 h-3 text-brand-700" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </section>

        <div className="h-6 bg-gradient-to-b from-white to-brand-50/60 relative z-10" aria-hidden="true" />
      </div>

      {/* Trust Indicators Section */}
      <section className="bg-gradient-to-b from-brand-50/60 to-brand-50/30 py-4 md:py-10" aria-label="Our commitments">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {promiseStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-center p-5 bg-white rounded-2xl border border-brand-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex justify-center mb-2.5">
                  <div className="w-9 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center">
                    <s.icon className="w-4 h-4 text-brand-600" aria-hidden="true" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-brand-800 mb-2">{s.value}</div>
                <div className="text-xs font-semibold text-brand-700 mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-10 bg-gradient-to-b from-brand-50/30 to-white" aria-hidden="true" />

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white md:pt-4 pb-6 md:pb-12" aria-labelledby="how-heading">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            <span className="inline-block text-xs font-bold tracking-widest text-brand-600 uppercase mb-3">Simple by design</span>
            <h2 id="how-heading" className="text-3xl md:text-4xl font-bold text-brand-800 mb-3">
              How Faflora works
            </h2>
            <p className="text-brand-700 text-base max-w-lg mx-auto mb-8">
              Whether you're shopping or selling, Faflora is built to make every step safe, simple, and rewarding.
            </p>

            {/* Audience Legend */}
            <div className="inline-flex items-center gap-5 bg-brand-50 border border-brand-100 rounded-2xl px-5 py-3 mb-10">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-600" aria-hidden="true" />
                <span className="text-xs font-bold text-brand-700">For buyers</span>
              </div>
              <div className="w-px h-4 bg-brand-200" aria-hidden="true" />
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-300 border border-brand-400" aria-hidden="true" />
                <span className="text-xs font-bold text-brand-700">For sellers</span>
              </div>
            </div>
          </motion.div>

          <div className="relative">
            {/* Desktop connecting line */}
            <div
              className="hidden md:block absolute top-10 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px bg-gradient-to-r from-brand-100 via-brand-300 to-brand-100 z-0"
              aria-hidden="true"
            />
            {/* Mobile connecting line */}
            <div
              className="md:hidden absolute left-[2rem] top-8 bottom-8 w-px bg-gradient-to-b from-brand-100 via-brand-300 to-brand-100 z-0"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-16 relative z-10">
              {howItWorksSteps.map((step, idx) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="flex md:flex-col md:items-center md:text-center items-start gap-5 md:gap-0 pb-10 md:pb-0 last:pb-0"
                >
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white border-2 border-brand-200 shadow-sm flex items-center justify-center">
                      <step.icon className="w-7 h-7 md:w-8 md:h-8 text-brand-600" aria-hidden="true" />
                    </div>
                    <span
                      className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-brand-600 text-white text-[10px] md:text-xs font-bold flex items-center justify-center shadow"
                      aria-hidden="true"
                    >
                      {idx + 1}
                    </span>
                  </div>

                  <div className="md:mt-5 flex-1 w-full">
                    <h3 className="md:h-12 lg:h-10 text-base md:text-lg font-bold text-brand-800 mb-3">{step.title}</h3>

                    <div className="flex items-start gap-2.5 md:justify-center mb-2.5">
                      <div className="mt-1.5 shrink-0 w-2.5 h-2.5 rounded-full bg-brand-600" aria-hidden="true" />
                      <p className="text-brand-700 text-sm md:h-30 lg:h-auto leading-relaxed text-left">{step.buyerDesc}</p>
                    </div>

                    <div className="flex items-start gap-2.5 md:justify-center">
                      <div className="mt-1.5 shrink-0 w-2.5 h-2.5 rounded-full bg-brand-300 border border-brand-400" aria-hidden="true" />
                      <p className="text-brand-700 text-sm leading-relaxed text-left">{step.sellerDesc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Dual CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mt-12"
          >
            <a href="#waitlist" className={primaryBtn}>
              Join as a buyer
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
            </a>
            <a
              href="#waitlist"
              className="inline-flex items-center justify-center gap-2 bg-white border border-brand-300 hover:bg-brand-100 text-brand-700 hover:text-brand-900 px-6 py-3 md:px-8 md:py-3.5 rounded-full font-bold text-sm md:text-base hover:scale-105"
            >
              Start selling
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </section>

      <div className="h-6 md:h-12 bg-gradient-to-b from-white to-brand-50/50" aria-hidden="true" />

      {/* Benefits Section */}
      <section id="benefits" className="bg-gradient-to-b from-brand-50/50 to-brand-50/20 pt-2 md:pt-4 pb-8 md:pb-12" aria-labelledby="benefits-heading">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6 md:mb-12"
          >
            <span className="inline-block text-xs font-bold tracking-widest text-brand-600 uppercase mb-3">Built for Nigeria</span>
            <h2 id="benefits-heading" className="text-3xl md:text-4xl font-bold text-brand-800 mb-3">
              Why join Faflora?
            </h2>
            <p className="text-brand-700 text-base max-w-xl mx-auto">Empowering local businesses. Authentic top quality products.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: ShoppingBag,
                title: 'For Customers',
                desc: 'Shop authentic Nigerian products from trusted local sellers across different categories and locations.',
                features: ['Secure payments', 'Find vendors near you', 'Nationwide delivery', 'Multiple product categories'],
              },
              {
                icon: TrendingUp,
                title: 'For Vendors',
                desc: 'Grow your business by reaching customers in your area and across Nigeria.',
                features: ['Sell across multiple categories', 'Location-based visibility', 'Sales analytics', 'Secure payments'],
              },
              {
                icon: Shield,
                title: 'Payment Protection',
                desc: 'Choose what works for you — upfront payment or pay when you receive your order.',
                features: ['No hidden fees', 'Pay on delivery', 'Upfront payment', 'Secure transactions'],
              },
              {
                icon: BarChart3,
                title: 'Data Insights',
                desc: 'Access analytics to understand your customers and grow your business over time.',
                features: ['Performance metrics', 'Customer insights', 'Inventory tracking', 'Sales trends'],
              },
            ].map((b, idx) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl border border-brand-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-brand-50 border border-brand-100 rounded-xl flex items-center justify-center mb-4">
                  <b.icon className="w-5 h-5 text-brand-600" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-brand-800 mb-2">{b.title}</h3>
                <p className="text-brand-700 text-sm leading-relaxed mb-4 h-16 md:h-14">
                  {b.desc}
                </p>
                <ul className="space-y-1.5">
                  {b.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-brand-700">
                      <CheckCircle className="w-3.5 h-3.5 text-brand-600 shrink-0" aria-hidden="true" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-10 bg-gradient-to-b from-brand-50/20 to-white" aria-hidden="true" />

      {/* Waitlist Section */}
      <section id="waitlist" className="bg-white md:pt-8 pb-16 md:pb-24" aria-labelledby="waitlist-heading">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-xl border border-brand-100 p-6 md:p-12 text-center">
              <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto my-2 mb-5">
                <ShoppingBag className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <h2 id="waitlist-heading" className="text-2xl md:text-3xl font-bold text-brand-800 mb-2">
                Be the first to know
              </h2>
              <p className="text-brand-700 text-sm md:text-base mb-8">
                Join the waitlist for early access, exclusive perks, and launch updates.
              </p>
              <WaitlistSignup />
              <p className="text-brand-700 text-xs mt-5 font-medium">No spam. Unsubscribe anytime.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="border-t border-brand-100 bg-brand-50/40 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 md:gap-4">
            <div className="flex justify-center md:justify-start">
              <Image src="/fa_logo_brand.png" alt="Faflora" width={110} height={36} className="h-9 w-auto object-contain" loading="eager" />
            </div>

            <div id="social-section" className="flex flex-col items-center gap-2 social-section">
              <p className="text-xs font-bold text-brand-700 tracking-wide uppercase">Follow us</p>
              <nav aria-label="Social media links">
                <div className="flex gap-3">
                  {[
                    { href: 'https://www.instagram.com/faflora_ng', Icon: FaInstagram, label: 'Faflora on Instagram' },
                    { href: 'https://x.com/Faflora_NG', Icon: FaXTwitter, label: 'Faflora on X' },
                    { href: 'https://www.facebook.com/share/1BejkDJRD7/', Icon: FaFacebookF, label: 'Faflora on Facebook' },
                    { href: 'https://www.tiktok.com/@faflora_ng?_r=1&_t=ZS-97CvHn44PK5', Icon: FaTiktok, label: 'Faflora on TikTok' },
                    { href: 'https://linkedin.com/company/faflora', Icon: FaLinkedinIn, label: 'Faflora on LinkedIn' },
                  ].map(({ href, Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-600 hover:bg-brand-700 text-white transition-all hover:scale-110 shadow-sm"
                    >
                      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </nav>
            </div>
          </div>

          <div className="mt-6 pt-4 border-brand-100">
            <p className="text-brand-800 text-xs font-medium text-center">
              © {new Date().getFullYear()} Faflora. All rights reserved. Shop smart. Shop Nigerian.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}